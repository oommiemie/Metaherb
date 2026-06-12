import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState } from "./usePersistentState";

export type UserRole = "user" | "owner" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  shopName?: string;
  /** True when the owner has gone through the Supplier registration flow.
   * Unlocks B2B-only sections of the owner dashboard (e.g. quotations). */
  isSupplier?: boolean;
  /** True when the owner has gone through the Trial Brand registration flow.
   * Unlocks Trial Products sections of the owner dashboard. */
  isTrialBrand?: boolean;
}

/** Admin-facing display role — admin UI says "ลูกค้า" instead of "user". */
export type DisplayRole = "customer" | "owner" | "admin";
export type RegistryStatus = "active" | "banned" | "pending";

/** A user record persisted in the registry. Stores everything admin needs to
 * display + manage users (including the password so login() can authenticate
 * against newly-registered accounts, not just the seeded mocks). */
export interface RegistryUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  /** Plain-text password — fine for a localStorage-backed simulator. */
  password: string;
  /** Display role used by the admin UI ("user" auth role → "customer"). */
  role: DisplayRole;
  /** Display name; defaults to username if the registrant didn't supply one. */
  name: string;
  status: RegistryStatus;
  avatar?: string;
  shopName?: string;
  isSupplier?: boolean;
  isTrialBrand?: boolean;
}

interface AuthContextType {
  user: User | null;
  users: RegistryUser[];
  login: (email: string, password: string) => boolean;
  register: (data: { username: string; password: string; email: string; phone: string; role: UserRole; name?: string }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  /** Toggle the current user's supplier flag (called after successful
   * supplier registration). */
  setSupplierStatus: (isSupplier: boolean) => void;
  /** Toggle the current user's trial-brand flag (called after successful
   * trial-brand registration). */
  setTrialBrandStatus: (isTrialBrand: boolean) => void;

  // Admin-facing mutations
  updateUserRole: (id: string, role: DisplayRole) => void;
  updateUserStatus: (id: string, status: RegistryStatus) => void;
  removeUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const toAuthRole = (r: DisplayRole): UserRole => (r === "customer" ? "user" : r);
const toDisplayRole = (r: UserRole): DisplayRole => (r === "user" ? "customer" : r);

/** Seed registry — login mocks plus the rows admin's Users page used to hard-code. */
const INITIAL_USERS: RegistryUser[] = [
  { id: "u1",   username: "user01",         email: "user@test.com",             phone: "090-000-0001", password: "12345678", role: "customer", name: "user01",                 status: "active" },
  { id: "o1",   username: "metaherb_store", email: "owner@test.com",            phone: "090-000-0002", password: "12345678", role: "owner",    name: "METAHERB Store",         status: "active", shopName: "METAHERB Store", isSupplier: true },
  { id: "a1",   username: "admin01",        email: "admin@test.com",            phone: "090-000-0003", password: "12345678", role: "admin",    name: "admin01",                status: "active" },
  { id: "u-1",  username: "admin0001",      email: "test0001@gmail.com",        phone: "",             password: "12345678", role: "admin",    name: "Admin TestKUB",          status: "active" },
  { id: "u-2",  username: "customertest",   email: "customer@test.com",         phone: "",             password: "12345678", role: "customer", name: "customer test",          status: "active" },
  { id: "u-3",  username: "metaherb",       email: "metaherb.herb@gmail.com",   phone: "",             password: "12345678", role: "owner",    name: "metaherb store",         status: "active", shopName: "METAHERB Store" },
  { id: "u-4",  username: "registest",      email: "registertest@test.com",     phone: "",             password: "12345678", role: "customer", name: "ทดสอบ ลงทะเบียน",         status: "active" },
  { id: "u-5",  username: "bmsdevging",     email: "ging.buppa@gmail.com",      phone: "",             password: "12345678", role: "customer", name: "บุปผา ทดสอบ",            status: "active" },
  { id: "u-6",  username: "BMStester",      email: "d0879876440@gmail.com",     phone: "",             password: "12345678", role: "admin",    name: "ชาลิสา ทดสอบ12",         status: "active" },
  { id: "u-7",  username: "0pom33pom0",     email: "pom33120pom@gmail.com",     phone: "",             password: "12345678", role: "customer", name: "พอม พอม",                status: "active" },
  { id: "u-8",  username: "AomTantarat",    email: "tanyarat.160344@gmail.com", phone: "",             password: "12345678", role: "customer", name: "อัญญารัตน์ คำบุญเรือง", status: "active" },
  { id: "u-9",  username: "pakjira5245",    email: "namepjk2002@gmail.com",     phone: "",             password: "12345678", role: "customer", name: "ภัคจิรา ชัยฮะ",           status: "active" },
  { id: "u-10", username: "Adthapon.u",     email: "adthapon.u@gmail.com",      phone: "",             password: "12345678", role: "customer", name: "อรรถพล อุทัยเรือง",      status: "active" },
  { id: "u-11", username: "torlarp99",      email: "torlarp999@hotmail.co.th",  phone: "",             password: "12345678", role: "customer", name: "ต่อลาภ นาคทอง",           status: "active" },
  // ===== Seed owners — show variety of trial-brand / herbal-market application statuses on the admin queue pages =====
  { id: "o2", username: "organicthai",      email: "wichai@organicthai.co.th",  phone: "053-789-4500", password: "12345678", role: "owner",    name: "วิชัย เทพประสิทธิ์",     status: "active", shopName: "ชาเขียวออร์แกนิคไทย",   isSupplier: true,  isTrialBrand: true  },
  { id: "o3", username: "doithaihoney",     email: "doithonghoney@gmail.com",    phone: "081-234-5678", password: "12345678", role: "owner",    name: "ภาคภูมิ ใจดี",            status: "active", shopName: "น้ำผึ้งดอยไทย",         isSupplier: false, isTrialBrand: true  },
  { id: "o4", username: "arunlab",          email: "arunlab.cosmetic@gmail.com", phone: "089-145-6789", password: "12345678", role: "owner",    name: "วิภาวี เกษมสุข",          status: "active", shopName: "เครื่องสำอางสมุนไพรอรุณ", isSupplier: false, isTrialBrand: false },
  { id: "o5", username: "lungjoy",          email: "panadda.lungjoy@gmail.com",  phone: "065-555-1234", password: "12345678", role: "owner",    name: "ปนัดดา ใจกล้า",          status: "pending", shopName: "ร้านสมุนไพรลุงจ้อย",     isSupplier: false, isTrialBrand: false },
  { id: "o6", username: "teahousebkk",      email: "hello@teahouse.bkk",         phone: "02-126-7788", password: "12345678", role: "owner",    name: "ธารา วงศ์ทอง",          status: "pending", shopName: "Tea House Bangkok",       isSupplier: false, isTrialBrand: false },
  { id: "o7", username: "lungsomsak",       email: "lungsomsak.herb@hotmail.com",phone: "086-998-7777", password: "12345678", role: "owner",    name: "สมศักดิ์ ตำราดี",        status: "active", shopName: "ร้านยาโบราณป๋าสมศักดิ์",  isSupplier: false, isTrialBrand: false },
];

const toUser = (r: RegistryUser): User => ({
  id: r.id,
  username: r.username,
  email: r.email,
  phone: r.phone,
  role: toAuthRole(r.role),
  avatar: r.avatar,
  shopName: r.shopName,
  isSupplier: r.isSupplier,
  isTrialBrand: r.isTrialBrand,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = usePersistentState<User | null>("metaherb:auth", null);
  // Bumped key on 2026-06-12 when 6 seed owners (o2-o7) were added so existing
  // localStorage sessions actually see the new seeds instead of stale data.
  const [users, setUsers] = usePersistentState<RegistryUser[]>("metaherb:users:v2", INITIAL_USERS);

  const login = useCallback((email: string, password: string) => {
    const found = users.find((u) =>
      (u.email === email || u.username === email) && u.password === password && u.status !== "banned"
    );
    if (!found) return false;
    setUser(toUser(found));
    return true;
  }, [users, setUser]);

  const register: AuthContextType["register"] = useCallback((data) => {
    // Reject duplicates so admin's users list doesn't accumulate copies.
    if (users.some((u) => u.email === data.email || u.username === data.username)) return false;
    const reg: RegistryUser = {
      id: `u${Date.now()}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: toDisplayRole(data.role),
      name: data.name?.trim() || data.username,
      status: "active",
    };
    setUsers((prev) => [reg, ...prev]);
    setUser(toUser(reg));
    return true;
  }, [users, setUsers, setUser]);

  const logout = useCallback(() => setUser(null), [setUser]);

  const switchRole = useCallback((role: UserRole) => {
    if (!user) return;
    const targetDisplay = toDisplayRole(role);
    const mock = users.find((u) => u.role === targetDisplay);
    if (mock) {
      setUser({ ...toUser(mock), avatar: user.avatar ?? mock.avatar });
    } else {
      setUser({ ...user, role });
    }
  }, [user, users, setUser]);

  const updateUserRole = useCallback((id: string, role: DisplayRole) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }, [setUsers]);

  const updateUserStatus = useCallback((id: string, status: RegistryStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }, [setUsers]);

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, [setUsers]);

  const setSupplierStatus = useCallback((isSupplier: boolean) => {
    if (!user) return;
    setUser({ ...user, isSupplier });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isSupplier } : u)));
  }, [user, setUser, setUsers]);

  const setTrialBrandStatus = useCallback((isTrialBrand: boolean) => {
    if (!user) return;
    setUser({ ...user, isTrialBrand });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isTrialBrand } : u)));
  }, [user, setUser, setUsers]);

  const value = useMemo<AuthContextType>(() => ({
    user, users,
    login, register, logout, switchRole, setSupplierStatus, setTrialBrandStatus,
    isAuthenticated: !!user,
    updateUserRole, updateUserStatus, removeUser,
  }), [user, users, login, register, logout, switchRole, setSupplierStatus, setTrialBrandStatus, updateUserRole, updateUserStatus, removeUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
