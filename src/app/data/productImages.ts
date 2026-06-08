// Single source of truth for product card images.
// Loads every file in src/assets/product-images/ at build time via Vite's
// import.meta.glob (eager) so we get a stable, sorted array without having
// to hand-import 40+ files.

const modules = import.meta.glob<{ default: string }>(
  "../../assets/product-images/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP}",
  { eager: true },
);

// Sorted file paths → URLs. Filenames are product-01.png, product-02.jpg, …
// so index 0 maps to product 1, index 1 to product 2, etc.
export const productImages: string[] = Object.keys(modules)
  .sort()
  .map((k) => modules[k].default);

/**
 * Image for a product. Tries `parseInt(id) - 1` first so id "1" → product-01.*,
 * id "2" → product-02.*, etc. Falls back to a stable hash for non-numeric ids.
 */
export function getProductImage(idOrIndex: string | number): string {
  if (!productImages.length) return "";
  if (typeof idOrIndex === "number") return productImages[idOrIndex % productImages.length];
  const n = parseInt(idOrIndex, 10);
  if (!Number.isNaN(n) && n >= 1 && n <= productImages.length) return productImages[n - 1];
  let h = 0;
  for (let i = 0; i < idOrIndex.length; i++) h = (h * 31 + idOrIndex.charCodeAt(i)) | 0;
  return productImages[Math.abs(h) % productImages.length];
}
