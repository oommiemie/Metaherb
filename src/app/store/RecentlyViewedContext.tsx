import { createContext, useContext, useState, type ReactNode } from "react";

interface RecentlyViewedContextType {
  recentIds: string[];
  addRecent: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentIds, setRecentIds] = useState<string[]>(["2", "5", "8"]);

  const addRecent = (productId: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 20);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentIds, addRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
