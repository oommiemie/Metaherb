import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { products as INITIAL_PRODUCTS, categories as INITIAL_CATEGORIES, type Product } from "../data/products";
import { usePersistentState } from "./usePersistentState";

interface ProductsContextType {
  products: Product[];
  categories: string[];

  // Product CRUD
  getProduct: (id: string) => Product | undefined;
  addProduct: (p: Omit<Product, "id"> & { id?: string }) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  // Stock / status helpers
  adjustStock: (id: string, delta: number) => void;
  setStock: (id: string, stock: number) => void;

  // Review CRUD (per product)
  addReview: (productId: string, review: Product["reviews"][number]) => void;

  // Category CRUD
  addCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  removeCategory: (name: string) => void;

  // Filtering helpers (memoized)
  byShop: (shopName: string) => Product[];
  byCategory: (category: string) => Product[];

  resetToDefaults: () => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = usePersistentState<Product[]>("metaherb:products", INITIAL_PRODUCTS);
  const [categories, setCategories] = usePersistentState<string[]>("metaherb:categories", INITIAL_CATEGORIES);

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const addProduct: ProductsContextType["addProduct"] = useCallback((p) => {
    const id = p.id ?? `prod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const next: Product = { ...(p as Product), id };
    setProducts((prev) => [next, ...prev]);
    return next;
  }, [setProducts]);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  }, [setProducts]);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, [setProducts]);

  const adjustStock = useCallback((id: string, delta: number) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, (p.stock ?? 0) + delta) } : p));
  }, [setProducts]);

  const setStock = useCallback((id: string, stock: number) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, stock) } : p));
  }, [setProducts]);

  const addReview = useCallback((productId: string, review: Product["reviews"][number]) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== productId) return p;
      const reviews = [review, ...(p.reviews ?? [])];
      // Recompute average rating
      const avg = reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length;
      return { ...p, reviews, rating: Math.round(avg * 10) / 10 };
    }));
  }, [setProducts]);

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) => prev.includes(trimmed) ? prev : [...prev, trimmed]);
  }, [setCategories]);

  const renameCategory = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setCategories((prev) => prev.map((c) => c === oldName ? trimmed : c));
    setProducts((prev) => prev.map((p) => p.category === oldName ? { ...p, category: trimmed } : p));
  }, [setCategories, setProducts]);

  const removeCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
    // Products keep their (now-orphaned) category string — let admins decide what to do.
  }, [setCategories]);

  const byShop = useCallback((shopName: string) => products.filter((p) => p.shopName === shopName), [products]);
  const byCategory = useCallback((category: string) => products.filter((p) => p.category === category), [products]);

  const resetToDefaults = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
  }, [setProducts, setCategories]);

  const value = useMemo<ProductsContextType>(() => ({
    products, categories,
    getProduct, addProduct, updateProduct, removeProduct,
    adjustStock, setStock,
    addReview,
    addCategory, renameCategory, removeCategory,
    byShop, byCategory,
    resetToDefaults,
  }), [products, categories, getProduct, addProduct, updateProduct, removeProduct, adjustStock, setStock, addReview, addCategory, renameCategory, removeCategory, byShop, byCategory, resetToDefaults]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
