import { createContext, useContext, useState, type ReactNode } from "react";

export interface Notification {
  id: string;
  type: "order" | "promo" | "system" | "chat";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "read">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const mockNotifications: Notification[] = [
  { id: "n1", type: "order", title: "คำสั่งซื้อจัดส่งแล้ว", message: "คำสั่งซื้อ ORD-20260218-03573 ถูกจัดส่งแล้ว หมายเลขพัสดุ TH123456789", time: "5 นาทีที่แล้ว", read: false, link: "/orders" },
  { id: "n2", type: "promo", title: "🔥 Flash Sale เริ่มแล้ว!", message: "ลดสูงสุด 70% สินค้าสมุนไพรคุณภาพ วันนี้เท่านั้น!", time: "1 ชม. ที่แล้ว", read: false, link: "/products" },
  { id: "n3", type: "promo", title: "คูปองส่วนลดพิเศษ", message: "คุณได้รับคูปองลด 100 บาท ใช้ได้ถึง 31 มี.ค. 2569", time: "3 ชม. ที่แล้ว", read: false, link: "/coupons" },
  { id: "n4", type: "order", title: "ยืนยันการชำระเงินสำเร็จ", message: "คำสั่งซื้อ ORD-20260218-03572 ชำระเงินสำเร็จ กำลังจัดเตรียมสินค้า", time: "6 ชม. ที่แล้ว", read: true, link: "/orders" },
  { id: "n5", type: "chat", title: "ข้อความจาก METAHERB Store", message: "สินค้าจัดเตรียมเรียบร้อยแล้วค่ะ จะจัดส่งภายในวันนี้", time: "1 วันที่แล้ว", read: true },
  { id: "n6", type: "system", title: "ยินดีต้อนรับสู่ MetaHerb!", message: "ขอบคุณที่สมัครสมาชิก รับส่วนลด 50 บาทสำหรับการสั่งซื้อครั้งแรก", time: "2 วันที่แล้ว", read: true },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const addNotification = (n: Omit<Notification, "id" | "read">) => {
    setNotifications((prev) => [{ ...n, id: `n${Date.now()}`, read: false }, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
