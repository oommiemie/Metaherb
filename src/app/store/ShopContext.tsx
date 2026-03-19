import { createContext, useContext, useState, type ReactNode } from "react";
import { shops as initialShops, type Shop, type ShopReview } from "../data/shops";
import { useNotifications } from "./NotificationContext";

interface ShopContextType {
  shops: Shop[];
  followedShops: string[];
  followShop: (shopId: string) => void;
  unfollowShop: (shopId: string) => void;
  isFollowing: (shopId: string) => boolean;
  addShopReview: (shopId: string, review: Omit<ShopReview, "id" | "helpful" | "reported" | "hidden">) => void;
  toggleHideReview: (shopId: string, reviewId: string) => void;
  deleteReview: (shopId: string, reviewId: string) => void;
  getShop: (shopId: string) => Shop | undefined;
  updateShopProfile: (shopId: string, data: Partial<Pick<Shop, "name" | "description" | "avatar" | "banner">>) => void;
}

const ShopContext = createContext<ShopContextType | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shopList, setShopList] = useState<Shop[]>(initialShops);
  const [followedShops, setFollowedShops] = useState<string[]>([]);
  const notif = useNotifications();

  const followShop = (shopId: string) => {
    if (followedShops.includes(shopId)) return;
    const shop = shopList.find((s) => s.id === shopId);
    if (shop) {
      setFollowedShops((prev) => [...prev, shopId]);
      setShopList((sl) =>
        sl.map((s) => (s.id === shopId ? { ...s, followers: s.followers + 1 } : s))
      );
      notif.addNotification({
        type: "system",
        title: `ติดตามร้าน ${shop.name} แล้ว`,
        message: "คุณจะได้รับแจ้งเตือนเมื่อร้านมีสินค้าใหม่หรือโปรโมชั่น",
        time: "เมื่อสักครู่",
      });
    }
  };

  const unfollowShop = (shopId: string) => {
    setFollowedShops((prev) => prev.filter((id) => id !== shopId));
    setShopList((sl) =>
      sl.map((s) => (s.id === shopId ? { ...s, followers: Math.max(0, s.followers - 1) } : s))
    );
  };

  const isFollowing = (shopId: string) => followedShops.includes(shopId);

  const addShopReview = (shopId: string, review: Omit<ShopReview, "id" | "helpful" | "reported" | "hidden">) => {
    const newReview: ShopReview = {
      ...review,
      id: `sr${Date.now()}`,
      helpful: 0,
      reported: false,
      hidden: false,
    };
    setShopList((prev) =>
      prev.map((s) => {
        if (s.id !== shopId) return s;
        const newReviews = [newReview, ...s.reviews];
        const avgRating = newReviews.filter((r) => !r.hidden).reduce((sum, r) => sum + r.rating, 0) / newReviews.filter((r) => !r.hidden).length;
        return { ...s, reviews: newReviews, rating: Math.round(avgRating * 10) / 10, totalReviews: s.totalReviews + 1 };
      })
    );
  };

  const toggleHideReview = (shopId: string, reviewId: string) => {
    setShopList((prev) =>
      prev.map((s) =>
        s.id === shopId
          ? { ...s, reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, hidden: !r.hidden } : r)) }
          : s
      )
    );
  };

  const deleteReview = (shopId: string, reviewId: string) => {
    setShopList((prev) =>
      prev.map((s) =>
        s.id === shopId
          ? { ...s, reviews: s.reviews.filter((r) => r.id !== reviewId), totalReviews: Math.max(0, s.totalReviews - 1) }
          : s
      )
    );
  };

  const getShop = (shopId: string) => shopList.find((s) => s.id === shopId);

  const updateShopProfile = (shopId: string, data: Partial<Pick<Shop, "name" | "description" | "avatar" | "banner">>) => {
    setShopList((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, ...data } : s))
    );
  };

  return (
    <ShopContext.Provider
      value={{ shops: shopList, followedShops, followShop, unfollowShop, isFollowing, addShopReview, toggleHideReview, deleteReview, getShop, updateShopProfile }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    return {
      shops: initialShops,
      followedShops: [],
      followShop: () => {},
      unfollowShop: () => {},
      isFollowing: () => false,
      addShopReview: () => {},
      toggleHideReview: () => {},
      deleteReview: () => {},
      getShop: (id: string) => initialShops.find((s) => s.id === id),
      updateShopProfile: () => {},
    } as ShopContextType;
  }
  return ctx;
}