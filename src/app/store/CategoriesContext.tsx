import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState } from "./usePersistentState";

export interface Category {
  id: string;
  name: string;
  description: string;
  iconKey: string;          // e.g. "leaf", "utensils-crossed" — see categoryIcons.ts
  iconImage?: string;       // optional uploaded image (data URL); takes precedence
  color: string;            // hex
  active: boolean;          // shown on customer site
}

// Mirrors HomePage's original 9-icon row + extras pulled from product seeds.
const SEED_CATEGORIES: Category[] = [
  { id: "สมุนไพร",    name: "สมุนไพร",    description: "สมุนไพรไทยและสากล",                 iconKey: "leaf",             color: "#319754", active: true },
  { id: "อาหาร",      name: "อาหาร",      description: "อาหารและของกินจากธรรมชาติ",         iconKey: "utensils-crossed", color: "#319754", active: true },
  { id: "ยา",         name: "ยา",         description: "ยาสมุนไพรและผลิตภัณฑ์ดูแลสุขภาพ",   iconKey: "pill",             color: "#319754", active: true },
  { id: "เครื่องหอม",  name: "เครื่องหอม",  description: "เครื่องหอมและอโรม่า",                iconKey: "sparkles",         color: "#319754", active: true },
  { id: "ความสวย",    name: "ความสวย",    description: "ผลิตภัณฑ์ดูแลผิวและความงาม",        iconKey: "flower-2",         color: "#319754", active: true },
  { id: "ชุดของขวัญ",  name: "ชุดของขวัญ",  description: "ของขวัญและชุดมอบให้คนสำคัญ",        iconKey: "gift",             color: "#319754", active: true },
  { id: "ชาสมุนไพร",   name: "ชาสมุนไพร",   description: "ชาสมุนไพรเพื่อสุขภาพ",                iconKey: "coffee",           color: "#319754", active: true },
  { id: "อาหารเสริม",  name: "อาหารเสริม",  description: "วิตามินและอาหารเสริม",               iconKey: "flask",            color: "#319754", active: true },
  { id: "น้ำมันสกัด",   name: "น้ำมันสกัด",   description: "น้ำมันสกัดธรรมชาติ",                  iconKey: "droplets",         color: "#319754", active: true },
];

interface CategoriesContextType {
  categories: Category[];
  /** Categories actually shown on the customer site (active === true), in current order. */
  activeCategories: Category[];
  addCategory: (c: Omit<Category, "id"> & { id?: string }) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  reorder: (sourceId: string, targetId: string) => void;
  toggleActive: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = usePersistentState<Category[]>("metaherb:categories", SEED_CATEGORIES);

  const activeCategories = useMemo(() => categories.filter((c) => c.active), [categories]);

  const addCategory: CategoriesContextType["addCategory"] = useCallback((c) => {
    const id = c.id ?? (c.name.trim() || `cat_${Date.now()}`);
    const next: Category = { ...(c as Category), id };
    setCategories((prev) => prev.some((x) => x.id === id) ? prev : [...prev, next]);
    return next;
  }, [setCategories]);

  const updateCategory = useCallback((id: string, patch: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }, [setCategories]);

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, [setCategories]);

  const reorder = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setCategories((prev) => {
      const srcIdx = prev.findIndex((c) => c.id === sourceId);
      const tgtIdx = prev.findIndex((c) => c.id === targetId);
      if (srcIdx < 0 || tgtIdx < 0) return prev;
      const next = prev.slice();
      const [moved] = next.splice(srcIdx, 1);
      next.splice(tgtIdx, 0, moved);
      return next;
    });
  }, [setCategories]);

  const toggleActive = useCallback((id: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  }, [setCategories]);

  const value = useMemo(() => ({ categories, activeCategories, addCategory, updateCategory, removeCategory, reorder, toggleActive }),
    [categories, activeCategories, addCategory, updateCategory, removeCategory, reorder, toggleActive]);
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used within CategoriesProvider");
  return ctx;
}
