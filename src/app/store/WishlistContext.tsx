import { createContext, useContext, useState, type ReactNode } from "react";

interface WishlistContextType {
  wishlist: Set<string>;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set(["1", "3", "5"]));

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
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
