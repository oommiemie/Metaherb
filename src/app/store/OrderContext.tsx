import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem } from "./CartContext";

export type OrderStatus = "pending_payment" | "pending_verify" | "preparing" | "shipped" | "delivered" | "completed" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
  paymentMethod: string;
  shopName: string;
  trackingNumber?: string;
  review?: { rating: number; comment: string };
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date">) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addReview: (id: string, rating: number, comment: string) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

const mockOrders: Order[] = [
  {
    id: "ORD-20260218-03571",
    items: [
      { productId: "1", name: "ชาออร์แกนิก", image: "", price: 199, option: "ตัวเลือก 1", quantity: 1, inStock: true },
      { productId: "2", name: "ชาออร์แกนิก", image: "", price: 199, option: "ตัวเลือก 1", quantity: 1, inStock: true },
      { productId: "3", name: "ชาออร์แกนิก", image: "", price: 199, option: "ตัวเลือก 1", quantity: 1, inStock: true },
    ],
    total: 597,
    status: "pending_payment",
    date: "18 ก.พ. 2569 - 15:00 น.",
    shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    paymentMethod: "พร้อมเพย์ PromptPay",
    shopName: "METAHERB Store",
  },
  {
    id: "ORD-20260218-03572",
    items: [
      { productId: "4", name: "กาแฟดริป", image: "", price: 250, option: "ตัวเลือก 1", quantity: 2, inStock: true },
    ],
    total: 500,
    status: "pending_verify",
    date: "18 ก.พ. 2569 - 15:00 น.",
    shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    paymentMethod: "พร้อมเพย์ PromptPay",
    shopName: "METAHERB Store",
  },
  {
    id: "ORD-20260218-03573",
    items: [
      { productId: "5", name: "น้ำผึ้งธรรมชาติ", image: "", price: 159, option: "ตัวเลือก 1", quantity: 1, inStock: true },
    ],
    total: 159,
    status: "shipped",
    date: "17 ก.พ. 2569 - 10:00 น.",
    shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33",
    paymentMethod: "บัญชีธนาคาร",
    shopName: "METAHERB Store",
    trackingNumber: "TH123456789",
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const addOrder = (order: Omit<Order, "id" | "date">) => {
    const id = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;
    const newOrder: Order = { ...order, id, date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) + " - " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น." };
    setOrders((prev) => [newOrder, ...prev]);
    return id;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  const addReview = (id: string, rating: number, comment: string) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, review: { rating, comment } } : o)));

  return <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, addReview }}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
