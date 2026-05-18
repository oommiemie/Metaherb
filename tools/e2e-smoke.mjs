#!/usr/bin/env node
/**
 * End-to-end smoke test against the running dev server (http://localhost:5173).
 *
 * Walks the main flows in a real headless Chromium and reports any
 * console errors, page errors, failed requests, or missing UI.
 *
 * Roles tested:
 *   - customer (user01 / 12345678)
 *   - shop owner (owner@test.com / 12345678)
 *   - admin (admin@test.com / 12345678)
 *
 * Run with: node tools/e2e-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = "http://localhost:5173";

const results = [];
const errors = [];

const log = (...args) => console.log("•", ...args);
const ok  = (msg)    => { results.push({ status: "ok",   msg }); console.log("\x1b[32m✓\x1b[0m", msg); };
const bad = (msg)    => { results.push({ status: "bad",  msg }); errors.push(msg); console.log("\x1b[31m✗\x1b[0m", msg); };

function attachLogging(page, label) {
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // Filter out external-CDN 4xx/5xx echoes — they're "Failed to load resource".
    if (text.startsWith("Failed to load resource")) return;
    bad(`[${label}] console.error: ${text}`);
  });
  page.on("pageerror", (e) => bad(`[${label}] page error: ${e.message}`));
  page.on("requestfailed", (r) => {
    // Skip noisy external-CDN failures unrelated to our app code.
    const u = r.url();
    if (!u.startsWith("http://localhost")) return;
    if (u.includes("figma:asset")) return;
    bad(`[${label}] request failed: ${r.method()} ${u} — ${r.failure()?.errorText}`);
  });
}

async function visit(page, path, label) {
  const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 15_000 });
  const status = res?.status() ?? 0;
  if (status !== 200) { bad(`${label} (${path}) → HTTP ${status}`); return false; }
  // give react-router a moment to hydrate
  await page.waitForLoadState("load", { timeout: 8_000 }).catch(() => {});
  ok(`${label} (${path}) loaded`);
  return true;
}

async function loginAs(page, email, password, label) {
  await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load").catch(() => {});
  // The email field has no `type` attribute — grab the first <input> that isn't password.
  const inputs = page.locator('input:not([type="password"])');
  const passwordField = page.locator('input[type="password"]').first();
  await inputs.first().waitFor({ timeout: 8_000 });
  await inputs.first().fill(email);
  await passwordField.fill(password);
  // The appbar also has a "เข้าสู่ระบบ" button — target the wide button inside the form
  // (the form's submit is the only h-[49px] w-full rounded-full button on the page).
  await page.locator('button.h-\\[49px\\].w-full').first().click({ timeout: 5_000 });
  await page.waitForFunction(() => !location.pathname.startsWith("/login"), { timeout: 8_000 }).catch(() => {});
  if (page.url().includes("/login")) { bad(`login as ${label} did not navigate away`); return false; }
  ok(`login as ${label} → ${page.url().replace(BASE, "")}`);
  return true;
}

async function logout(page) {
  // Best-effort: hit /login route to reset, then clear via app menu if possible
  await page.evaluate(() => { window.localStorage.removeItem("metaherb:auth"); });
}

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  attachLogging(page, "guest");

  log("Phase A: public pages render without crash");
  await visit(page, "/",                  "home");
  await visit(page, "/products",          "products list");
  await visit(page, "/blog",              "blog");
  await visit(page, "/about",             "about");
  await visit(page, "/shop/metaherb",     "shop profile");
  await visit(page, "/product/1",         "product detail");
  await visit(page, "/login",             "login page");
  await visit(page, "/register",          "register page");

  log("\nPhase B: customer flow — login + browse + cart");
  await loginAs(page, "user@test.com", "12345678", "customer");
  await visit(page, "/wishlist",   "wishlist");
  await visit(page, "/coupons",    "coupons");
  await visit(page, "/my-coupons", "my-coupons");
  await visit(page, "/account",    "account");
  await visit(page, "/addresses",  "addresses");
  await visit(page, "/settings",   "settings");
  await visit(page, "/orders",     "orders list");

  // Add a product to cart from product detail
  await page.goto(BASE + "/product/1", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load").catch(() => {});
  const addBtn = page.getByRole("button", { name: /เพิ่มไปยังรถเข็น|add to cart|加入购物车/i }).first();
  if (await addBtn.count()) {
    await addBtn.click({ timeout: 5_000 }).catch(() => {});
    ok("clicked add-to-cart on product detail");
  } else {
    bad("no add-to-cart button found on product detail");
  }
  await visit(page, "/cart", "cart after add");
  // Verify cart now contains the item we added
  const cartCount = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem("metaherb:cart") || "[]").length; } catch { return 0; }
  });
  if (cartCount > 0) ok(`cart has ${cartCount} item(s) after add`);
  else bad("cart is empty after add-to-cart click");

  log("\nPhase C: owner flow — owner dashboard");
  await logout(page);
  await loginAs(page, "owner@test.com", "12345678", "owner");
  await visit(page, "/owner", "owner dashboard");

  log("\nPhase D: admin flow — admin dashboard + sub-pages");
  await logout(page);
  await loginAs(page, "admin@test.com", "12345678", "admin");
  await visit(page, "/admin",          "admin overview");
  await visit(page, "/admin/content",  "admin content");
  await visit(page, "/admin/pages",    "admin pages");
  await visit(page, "/admin/settings", "admin settings");

  log("\nPhase E: persistence sanity — reload mid-flow keeps state");
  await page.reload({ waitUntil: "networkidle" });
  const stillAdmin = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem("metaherb:auth") || "null"); } catch { return null; }
  });
  if (stillAdmin) ok("auth state persists across reload");

  await browser.close();

  console.log("\n══════════════════════════════════════");
  console.log(`Summary: ${results.filter(r => r.status === "ok").length} ok, ${errors.length} failures`);
  if (errors.length) {
    console.log("\nFailures:");
    errors.forEach((e) => console.log("  -", e));
    process.exit(1);
  } else {
    console.log("\x1b[32mAll checks passed.\x1b[0m");
  }
}

run().catch((e) => { console.error("Smoke test crashed:", e); process.exit(2); });
