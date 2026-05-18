import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState } from "./usePersistentState";

interface WishlistContextType {
  wishlist: Set<string>;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  // Persisted as array — Sets don't survive JSON.stringify cleanly.
  const [ids, setIds] = usePersistentState<string[]>("metaherb:wishlist", ["1", "3", "5"]);
  const wishlist = useMemo(() => new Set(ids), [ids]);

  const toggleWishlist = (productId: string) => {
    setIds((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  };

  const isWishlisted = (productId: string) => wishlist.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, wishlistCount: wishlist.size }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
