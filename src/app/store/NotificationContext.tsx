import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { usePersistentState } from "./usePersistentState";

export type NotificationAudience = "customer" | "owner" | "admin" | "all";

export interface Notification {
  id: string;
  type: "order" | "promo" | "system" | "chat" | "complaint" | "review";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  /** Which role this notification is for. Defaults to "customer". */
  audience?: NotificationAudience;
  /** Optional shop scoping — owner notifications only fire for the matching shop. */
  shopName?: string;
}

interface NotificationContextType {
  /** Notifications filtered to the current user's role. */
  notifications: Notification[];
  /** Unread count for the current user's role. */
  unreadCount: number;
  /** All notifications in the system (admin / debugging). */
  allNotifications: Notification[];
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  /** Adds a notification. Defaults audience to "customer" if unspecified. */
  addNotification: (n: Omit<Notification, "id" | "read">) => void;
  /** Adds a notification targeted at the owner of a specific shop. */
  notifyOwner: (shopName: string, n: Omit<Notification, "id" | "read" | "audience" | "shopName">) => void;
  /** Adds a notification targeted at all admins. */
  notifyAdmin: (n: Omit<Notification, "id" | "read" | "audience">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "order",  title: "คำสั่งซื้อจัดส่งแล้ว",         message: "คำสั่งซื้อ ORD-20260218-03573 ถูกจัดส่งแล้ว หมายเลขพัสดุ TH123456789", time: "5 นาทีที่แล้ว", read: false, link: "/orders",  audience: "customer" },
  { id: "n2", type: "promo",  title: "🔥 Flash Sale เริ่มแล้ว!",      message: "ลดสูงสุด 70% สินค้าสมุนไพรคุณภาพ วันนี้เท่านั้น!",                    time: "1 ชม. ที่แล้ว",   read: false, link: "/products", audience: "all" },
  { id: "n3", type: "promo",  title: "คูปองส่วนลดพิเศษ",                message: "คุณได้รับคูปองลด 100 บาท ใช้ได้ถึง 31 มี.ค. 2569",                    time: "3 ชม. ที่แล้ว",   read: false, link: "/coupons",  audience: "customer" },
  { id: "n4", type: "order",  title: "ยืนยันการชำระเงินสำเร็จ",        message: "คำสั่งซื้อ ORD-20260218-03572 ชำระเงินสำเร็จ กำลังจัดเตรียมสินค้า",      time: "6 ชม. ที่แล้ว",   read: true,  link: "/orders",  audience: "customer" },
  { id: "n5", type: "chat",   title: "ข้อความจาก METAHERB Store",     message: "สินค้าจัดเตรียมเรียบร้อยแล้วค่ะ จะจัดส่งภายในวันนี้",                  time: "1 วันที่แล้ว",     read: true,                       audience: "customer" },
  { id: "n6", type: "system", title: "ยินดีต้อนรับสู่ MetaHerb!",       message: "ขอบคุณที่สมัครสมาชิก รับส่วนลด 50 บาทสำหรับการสั่งซื้อครั้งแรก",         time: "2 วันที่แล้ว",     read: true,                       audience: "customer" },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allNotifications, setAllNotifications] = usePersistentState<Notification[]>("metaherb:notifications", SEED_NOTIFICATIONS);

  const role = user?.role ?? "customer";
  const shopName = user?.shopName;

  // Audience filter: each user only sees notifications targeted at their role
  // (or "all"). Owner notifications are further scoped by shopName when set.
  const notifications = useMemo(() => allNotifications.filter((n) => {
    const audience = n.audience ?? "customer";
    if (audience === "all") return true;
    if (audience === "owner") {
      if (role !== "owner") return false;
      if (n.shopName && shopName && n.shopName !== shopName) return false;
      return true;
    }
    return audience === role;
  }), [allNotifications, role, shopName]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setAllNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, [setAllNotifications]);

  const markAllRead = useCallback(() => {
    // Only mark the ones the current user can see — leave others alone.
    const visibleIds = new Set(notifications.map((n) => n.id));
    setAllNotifications((prev) => prev.map((n) => visibleIds.has(n.id) ? { ...n, read: true } : n));
  }, [notifications, setAllNotifications]);

  const addNotification = useCallback((n: Omit<Notification, "id" | "read">) => {
    const newNotif: Notification = {
      ...n,
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      time: n.time ?? "เมื่อสักครู่",
      audience: n.audience ?? "customer",
    };
    setAllNotifications((prev) => [newNotif, ...prev]);
  }, [setAllNotifications]);

  const notifyOwner = useCallback((shop: string, n: Omit<Notification, "id" | "read" | "audience" | "shopName">) => {
    addNotification({ ...n, audience: "owner", shopName: shop });
  }, [addNotification]);

  const notifyAdmin = useCallback((n: Omit<Notification, "id" | "read" | "audience">) => {
    addNotification({ ...n, audience: "admin" });
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, allNotifications, markAsRead, markAllRead, addNotification, notifyOwner, notifyAdmin }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
