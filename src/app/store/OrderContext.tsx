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
      { productId: "1", name: "ชาสมุนไพรดีท็อกซ์", image: "https://images.unsplash.com/photo-1576092759770-14d9e692eb45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjBkZXRveCUyMHRlYSUyMGJhZ3N8ZW58MXx8fHwxNzczOTcwMzMzfDA&ixlib=rb-4.1.0&q=80&w=400", price: 259, option: "แพ็ค 30 ซอง", quantity: 2, inStock: true },
      { productId: "2", name: "น้ำมันมะพร้าวสกัดเย็น", image: "https://images.unsplash.com/photo-1662058595162-10e024b1a907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwcHJlc3NlZCUyMGNvY29udXQlMjBvaWwlMjBib3R0לGLE8&ixlib=rb-4.1.0&q=80&w=400", price: 189, option: "ขนาด 500ml", quantity: 1, inStock: true },
      { productId: "3", name: "ขมิ้นชันแคปซูล", image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHN1cHBsZW1lbnQlMjBjYXBzdWxlc3xlbnwxfHx8fDE3NzM5NzAzMzN8MA&ixlib=rb-4.1.0&q=80&w=400", price: 149, option: "60 แคปซูล", quantity: 1, inStock: true },
    ],
    total: 856,
    status: "pending_payment",
    date: "18 ก.พ. 2569 - 15:00 น.",
    shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    paymentMethod: "พร้อมเพย์ PromptPay",
    shopName: "METAHERB Store",
  },
  {
    id: "ORD-20260218-03572",
    items: [
      { productId: "4", name: "กาแฟดริปสมุนไพร", image: "https://images.unsplash.com/photo-1631149206144-4549c0468787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjBkcmlwJTIwY29mZmVlJTIwb3JnYW5pY3xlbnwxfHx8fDE3NzM5NzAzMzR8MA&ixlib=rb-4.1.0&q=80&w=400", price: 250, option: "แพ็ค 10 ซอง", quantity: 2, inStock: true },
      { productId: "5", name: "ชาเขียวมัทฉะ", image: "https://images.unsplash.com/photo-1708573106044-2bbefb3d9fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBncmVlbiUyMHRlYSUyMHBvd2RlcnxlbnwxfHx8fDE3NzM4NTM3NTJ8MA&ixlib=rb-4.1.0&q=80&w=400", price: 320, option: "กระป๋อง 200g", quantity: 1, inStock: true },
    ],
    total: 820,
    status: "pending_verify",
    date: "18 ก.พ. 2569 - 13:30 น.",
    shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    paymentMethod: "พร้อมเพย์ PromptPay",
    shopName: "METAHERB Store",
  },
  {
    id: "ORD-20260217-04821",
    items: [
      { productId: "6", name: "น้ำผึ้งป่าแท้ 100%", image: "https://images.unsplash.com/photo-1691480208637-6ed63aac6694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXclMjB3aWxkJTIwaG9uZXklMjBqYXJ8ZW58MXx8fHwxNzczOTcwMzM1fDA&ixlib=rb-4.1.0&q=80&w=400", price: 459, option: "ขวด 750ml", quantity: 1, inStock: true },
      { productId: "7", name: "ผงโกโก้ออร์แกนิก", image: "https://images.unsplash.com/photo-1676870799186-7d55b7bfa84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29jb2ElMjBwb3dkZXJ8ZW58MXx8fHwxNzczOTcwMzM1fDA&ixlib=rb-4.1.0&q=80&w=400", price: 199, option: "ถุง 250g", quantity: 2, inStock: true },
    ],
    total: 857,
    status: "preparing",
    date: "17 ก.พ. 2569 - 09:15 น.",
    shippingAddress: "99/5 หมู่บ้านเมืองทอง ถ.แจ้งวัฒนะ ปากเกร็ด นนทบุรี 11120",
    paymentMethod: "บัญชีธนาคาร",
    shopName: "ร้านป่าหมอก",
  },
  {
    id: "ORD-20260216-05133",
    items: [
      { productId: "8", name: "น้ำมันงาดำสกัดเย็น", image: "https://images.unsplash.com/photo-1474979266404-7d1296e76fa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", price: 289, option: "ขวด 250ml", quantity: 1, inStock: true },
    ],
    total: 289,
    status: "shipped",
    date: "16 ก.พ. 2569 - 10:00 น.",
    shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33",
    paymentMethod: "บัญชีธนาคาร",
    shopName: "Organic Thai Farm",
    trackingNumber: "TH123456789",
  },
  {
    id: "ORD-20260215-06244",
    items: [
      { productId: "9", name: "แชมพูสมุนไพรอัญชัน", image: "https://images.unsplash.com/photo-1721680378230-78104b762f36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjBidXR0ZXJmbHklMjBwZWElMjBzaGFtcG9vfGVufDF8fHx8MTc3Mzk3MDMzNnww&ixlib=rb-4.1.0&q=80&w=400", price: 179, option: "ขวด 300ml", quantity: 1, inStock: true },
      { productId: "10", name: "สบู่สมุนไพรขมิ้น", image: "https://images.unsplash.com/photo-1604565750665-3501b2c00194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMGhlcmJhbCUyMHNvYXAlMjBiYXJ8ZW58MXx8fHwxNzczOTcwMzM2fDA&ixlib=rb-4.1.0&q=80&w=400", price: 89, option: "ก้อน 100g", quantity: 3, inStock: true },
    ],
    total: 446,
    status: "delivered",
    date: "15 ก.พ. 2569 - 14:20 น.",
    shippingAddress: "45/12 ซอยลาดพร้าว 71 แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230",
    paymentMethod: "พร้อมเพย์ PromptPay",
    shopName: "ธรรมชาติพรีเมียม",
    trackingNumber: "TH987654321",
  },
  {
    id: "ORD-20260210-07355",
    items: [
      { productId: "11", name: "ชาดอกไม้รวม", image: "https://images.unsplash.com/photo-1720082301739-5d250b4a5551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZsb3dlciUyMGhlcmJhbCUyMHRlYXxlbnwxfHx8fDE3NzM5NzAzNDF8MA&ixlib=rb-4.1.0&q=80&w=400", price: 220, option: "กล่อง 20 ซอง", quantity: 1, inStock: true },
      { productId: "12", name: "น้ำตาลมะพร้าว", image: "https://images.unsplash.com/photo-1772064901439-15c233a18665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwc3VnYXIlMjBicm93biUyMG9yZ2FuaWN8ZW58MXx8fHwxNzczOTcwMzQxfDA&ixlib=rb-4.1.0&q=80&w=400", price: 120, option: "ถุง 500g", quantity: 2, inStock: true },
    ],
    total: 460,
    status: "completed",
    date: "10 ก.พ. 2569 - 11:45 น.",
    shippingAddress: "88/3 ถ.รัชดาภิเษก ดินแดง กรุงเทพฯ 10400",
    paymentMethod: "บัญชีธนาคาร",
    shopName: "METAHERB Store",
    trackingNumber: "TH555666777",
    review: { rating: 5, comment: "สินค้าดี ส่งเร็ว แพ็คเกจสวย" },
  },
  {
    id: "ORD-20260208-08466",
    items: [
      { productId: "13", name: "วิตามินซีจากธรรมชาติ", image: "https://images.unsplash.com/photo-1648139347040-857f024f8da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwdml0YW1pbiUyMEMlMjBzdXBwbGVtZW50fGVufDF8fHx8MTc3Mzk3MDMzN3ww&ixlib=rb-4.1.0&q=80&w=400", price: 350, option: "60 เม็ด", quantity: 1, inStock: true },
    ],
    total: 350,
    status: "cancelled",
    date: "8 ก.พ. 2569 - 16:30 น.",
    shippingAddress: "12/7 ซอยอารีย์ แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400",
    paymentMethod: "พร้อมเพย์ PromptPay",
    shopName: "สมุนไพรบ้านสวน",
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