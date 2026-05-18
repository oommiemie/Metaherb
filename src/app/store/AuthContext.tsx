import { createContext, useContext, type ReactNode } from "react";
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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: { username: string; password: string; email: string; phone: string; role: UserRole }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: (User & { password: string })[] = [
  { id: "u1", username: "user01", email: "user@test.com", phone: "090-000-0001", role: "user", password: "12345678" },
  { id: "o1", username: "metaherb_store", email: "owner@test.com", phone: "090-000-0002", role: "owner", password: "12345678", shopName: "METAHERB Store" },
  { id: "a1", username: "admin01", email: "admin@test.com", phone: "090-000-0003", role: "admin", password: "12345678" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = usePersistentState<User | null>("metaherb:auth", null);

  const login = (email: string, password: string) => {
    const found = mockUsers.find((u) => (u.email === email || u.username === email) && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const register = (data: { username: string; password: string; email: string; phone: string; role: UserRole }) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  const switchRole = (role: UserRole) => {
    if (!user) return;
    // If switching to a known mock account for that role, swap to it (so role-specific data loads).
    // Otherwise, just patch the role on the current user.
    const mock = mockUsers.find((u) => u.role === role);
    if (mock) {
      const { password: _, ...userData } = mock;
      setUser({ ...userData, avatar: user.avatar });
    } else {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
