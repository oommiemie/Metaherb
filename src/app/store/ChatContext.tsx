import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface ChatMessage {
  id: string;
  sender: "user" | "shop";
  text: string;
  time: string;
  image?: string;
}

export interface ChatRoom {
  shopId: string;
  shopName: string;
  shopAvatar: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

/* === Owner-side: customer chat rooms === */
export interface CustomerChatRoom {
  customerId: string;
  customerName: string;
  customerAvatar: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  orderRef?: string;
}

interface ChatContextType {
  chatRooms: ChatRoom[];
  activeChatShop: string | null;
  openChat: (shopId: string) => void;
  closeChat: () => void;
  sendMessage: (shopId: string, text: string) => void;
  totalUnread: number;
  /* Owner-side */
  customerChatRooms: CustomerChatRoom[];
  activeCustomerChat: string | null;
  openCustomerChat: (customerId: string) => void;
  closeCustomerChat: () => void;
  sendCustomerMessage: (customerId: string, text: string) => void;
  totalCustomerUnread: number;
}

const ChatContext = createContext<ChatContextType | null>(null);

/* ─── User-side mock data ─── */
const mockChatRooms: ChatRoom[] = [
  {
    shopId: "metaherb",
    shopName: "METAHERB Store",
    shopAvatar: "🌿",
    messages: [
      { id: "m1", sender: "shop", text: "สวัสดีค่ะ ยินดีให้บริการ 🌿", time: "10:00" },
      { id: "m2", sender: "user", text: "สอบถามเรื่องชาออร์แกนิกครับ", time: "10:01" },
      { id: "m3", sender: "shop", text: "ชาออร์แกนิกของเราเป็นชาสมุนไพร 100% จากดอยเชียงใหม่ค่ะ ปลูกแบบไม่ใช้สารเคมี มี 5 รสชาติให้เลือก", time: "10:02" },
      { id: "m4", sender: "user", text: "มีรสชาติไหนบ้างครับ?", time: "10:03" },
      { id: "m5", sender: "shop", text: "มี ดอกคำฝอย, ตะไคร้, ขิง, มะตูม, และใบเตยค่ะ แนะนำรสตะไคร้นะคะ ขายดีที่สุดเลย 😊", time: "10:04" },
    ],
    lastMessage: "แนะนำรสตะไคร้นะคะ ขายดีที่สุดเลย 😊",
    lastTime: "10:04",
    unread: 1,
    online: true,
  },
  {
    shopId: "bansuan",
    shopName: "สมุนไพรบ้านสวน",
    shopAvatar: "🏡",
    messages: [
      { id: "b1", sender: "shop", text: "สวัสดีค่ะ ร้านสมุนไพรบ้านสวนยินดีต้อนรับค่ะ 🌻", time: "09:30" },
      { id: "b2", sender: "user", text: "มีน้ำมันหอมระเหยไหมครับ?", time: "09:31" },
      { id: "b3", sender: "shop", text: "มีค่ะ ทั้งตะไคร้หอม ลาเวนเดอร์ และยูคาลิปตัสค่ะ กำลังลดราคา 20% ด้วยนะคะ 🎉", time: "09:32" },
    ],
    lastMessage: "กำลังลดราคา 20% ด้วยนะคะ 🎉",
    lastTime: "09:32",
    unread: 2,
    online: true,
  },
  {
    shopId: "pahmok",
    shopName: "ร้านป่าหมอก",
    shopAvatar: "🌫️",
    messages: [
      { id: "p1", sender: "shop", text: "สวัสดีค่ะ ร้านป่าหมอก สมุนไพรจากธรรมชาติค่ะ 🍃", time: "08:15" },
    ],
    lastMessage: "สวัสดีค่ะ ร้านป่าหมอก สมุนไพรจากธรรมชาติค่ะ 🍃",
    lastTime: "08:15",
    unread: 0,
    online: false,
  },
  {
    shopId: "organicthai",
    shopName: "Organic Thai Farm",
    shopAvatar: "🌾",
    messages: [
      { id: "o1", sender: "shop", text: "Welcome! Organic Thai Farm ยินดีให้บริการค่ะ 🌾", time: "14:00" },
      { id: "o2", sender: "user", text: "สินค้าส่งจากไหนครับ?", time: "14:05" },
      { id: "o3", sender: "shop", text: "ส่งจากเชียงรายค่ะ ส่งฟรีทั่วประเทศเมื่อสั่งครบ 500 บาทค่ะ 📦", time: "14:06" },
    ],
    lastMessage: "ส่งฟรีทั่วประเทศเมื่อสั่งครบ 500 บาทค่ะ 📦",
    lastTime: "14:06",
    unread: 1,
    online: true,
  },
  {
    shopId: "thammachat",
    shopName: "ธรรมชาติพรีเมียม",
    shopAvatar: "💎",
    messages: [],
    lastMessage: "",
    lastTime: "",
    unread: 0,
    online: true,
  },
];

/* ─── Owner-side mock data: customer conversations ─── */
const mockCustomerChatRooms: CustomerChatRoom[] = [
  {
    customerId: "c1",
    customerName: "คุณสมชาย",
    customerAvatar: "👤",
    orderRef: "#ORD-20260318-001",
    messages: [
      { id: "c1m1", sender: "user", text: "สวัสดีครับ สั่งชาสมุนไพรไปแล้ว อยากทราบว่าจัดส่งเมื่อไหร่ครับ?", time: "09:15" },
      { id: "c1m2", sender: "shop", text: "สวัสดีค่ะ กำลังเตรียมจัดส่งภายในวันนี้ค่ะ 📦", time: "09:16" },
      { id: "c1m3", sender: "user", text: "ขอบคุณครับ แล้วมีเลขพัสดุส่งมาให้ด้วยนะครับ", time: "09:17" },
      { id: "c1m4", sender: "user", text: "อีกเรื่อง ถ้าสั่งเพิ่มอีก 2 กล่อง ส่งพร้อมกันได้ไหมครับ?", time: "09:20" },
    ],
    lastMessage: "ถ้าสั่งเพิ่มอีก 2 กล่อง ส่งพร้อมกันได้ไหมครับ?",
    lastTime: "09:20",
    unread: 2,
    online: true,
  },
  {
    customerId: "c2",
    customerName: "คุณนภา",
    customerAvatar: "👩",
    orderRef: "#ORD-20260317-015",
    messages: [
      { id: "c2m1", sender: "user", text: "สินค้าที่สั่งไปยังไม่ได้รับเลยค่ะ 5 วันแล้ว", time: "11:00" },
      { id: "c2m2", sender: "shop", text: "ขออภัยด้วยค่ะ รอเช็คให้สักครู่นะคะ 🙏", time: "11:01" },
      { id: "c2m3", sender: "shop", text: "เช็คแล้วค่ะ พัสดุอยู่ที่ศูนย์กระจายสินค้า คาดว่าจะได้รับภายใน 1-2 วันค่ะ", time: "11:05" },
      { id: "c2m4", sender: "user", text: "ถ้าไม่ได้รับภายใน 2 วัน จะขอคืนเงินนะคะ", time: "11:06" },
    ],
    lastMessage: "ถ้าไม่ได้รับภายใน 2 วัน จะขอคืนเงินนะคะ",
    lastTime: "11:06",
    unread: 1,
    online: true,
  },
  {
    customerId: "c3",
    customerName: "คุณวิภา",
    customerAvatar: "👩‍🦰",
    messages: [
      { id: "c3m1", sender: "user", text: "ครีมสมุนไพรตัวไหนเหมาะกับผิวแพ้ง่ายคะ?", time: "14:30" },
      { id: "c3m2", sender: "shop", text: "แนะนำ ครีมอโลเวร่า สูตรอ่อนโยน ไม่มีน้ำหอม เหมาะกับผิวแพ้ง่ายค่ะ 🌿", time: "14:32" },
      { id: "c3m3", sender: "user", text: "ราคาเท่าไหร่คะ มีโปรโมชั่นไหม?", time: "14:33" },
    ],
    lastMessage: "ราคาเท่าไหร่คะ มีโปรโมชั่นไหม?",
    lastTime: "14:33",
    unread: 1,
    online: false,
  },
  {
    customerId: "c4",
    customerName: "คุณธนพล",
    customerAvatar: "🧑",
    orderRef: "#ORD-20260316-042",
    messages: [
      { id: "c4m1", sender: "user", text: "ได้รับสินค้าแล้วครับ สภาพดีมาก ขอบคุณครับ 👍", time: "16:00" },
      { id: "c4m2", sender: "shop", text: "ขอบคุณมากค่ะ หากชอบรบกวนรีวิวให้ด้วยนะคะ 😊", time: "16:01" },
    ],
    lastMessage: "ขอบคุณมากค่ะ หากชอบรบกวนรีวิวให้ด้วยนะคะ 😊",
    lastTime: "16:01",
    unread: 0,
    online: false,
  },
  {
    customerId: "c5",
    customerName: "คุณปิยะ",
    customerAvatar: "🧔",
    messages: [
      { id: "c5m1", sender: "user", text: "สวัสดีครับ อยากสั่งซื้อแบบ wholesale ได้ไหมครับ?", time: "08:45" },
    ],
    lastMessage: "อยากสั่งซื้อแบบ wholesale ได้ไหมครับ?",
    lastTime: "08:45",
    unread: 1,
    online: true,
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(mockChatRooms);
  const [activeChatShop, setActiveChatShop] = useState<string | null>(null);

  /* Owner-side state */
  const [customerChatRooms, setCustomerChatRooms] = useState<CustomerChatRoom[]>(mockCustomerChatRooms);
  const [activeCustomerChat, setActiveCustomerChat] = useState<string | null>(null);

  /* ─── User-side functions ─── */
  const openChat = (shopId: string) => {
    setActiveChatShop(shopId);
    setChatRooms((prev) =>
      prev.map((r) => (r.shopId === shopId ? { ...r, unread: 0 } : r))
    );
  };

  const closeChat = () => setActiveChatShop(null);

  const sendMessage = (shopId: string, text: string) => {
    const time = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { id: `m${Date.now()}`, sender: "user", text, time };

    setChatRooms((prev) =>
      prev.map((r) => {
        if (r.shopId !== shopId) return r;
        const updated = { ...r, messages: [...r.messages, userMsg], lastMessage: text, lastTime: time };
        setTimeout(() => {
          const replies = [
            "ขอบคุณค่ะ รอสักครู่นะคะ 😊",
            "สินค้ามีพร้อมจัดส่งเลยค่ะ",
            "สามารถสั่งซื้อได้เลยค่ะ ส่งฟรี!",
            "หากมีข้อสงสัยเพิ่มเติม ทักมาได้ตลอดนะคะ",
            "ของพร้อมส่งค่ะ สั่งวันนี้ ส่งวันนี้เลย 🚚",
          ];
          const reply: ChatMessage = {
            id: `m${Date.now() + 1}`,
            sender: "shop",
            text: replies[Math.floor(Math.random() * replies.length)],
            time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
          };
          setChatRooms((p) =>
            p.map((room) =>
              room.shopId === shopId
                ? { ...room, messages: [...room.messages, reply], lastMessage: reply.text, lastTime: reply.time }
                : room
            )
          );
        }, 1500);
        return updated;
      })
    );
  };

  /* ─── Owner-side functions ─── */
  const openCustomerChat = (customerId: string) => {
    setActiveCustomerChat(customerId);
    setCustomerChatRooms((prev) =>
      prev.map((r) => (r.customerId === customerId ? { ...r, unread: 0 } : r))
    );
  };

  const closeCustomerChat = () => setActiveCustomerChat(null);

  const sendCustomerMessage = (customerId: string, text: string) => {
    const time = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    const shopMsg: ChatMessage = { id: `sm${Date.now()}`, sender: "shop", text, time };

    setCustomerChatRooms((prev) =>
      prev.map((r) => {
        if (r.customerId !== customerId) return r;
        const updated = { ...r, messages: [...r.messages, shopMsg], lastMessage: text, lastTime: time };
        // Auto-reply from customer after 2s
        setTimeout(() => {
          const replies = [
            "ขอบคุณครับ/ค่ะ 🙏",
            "โอเคค่ะ รอนะคะ",
            "ได้เลยครับ ขอบคุณมากครับ",
            "เข้าใจแล้วค่ะ ขอบคุณที่ตอบเร็วค่ะ",
            "สนใจสั่งเพิ่มครับ ส่งลิงก์สินค้ามาได้ไหมครับ?",
            "ดีเลยค่ะ จะรอนะคะ 😊",
          ];
          const reply: ChatMessage = {
            id: `cm${Date.now() + 1}`,
            sender: "user",
            text: replies[Math.floor(Math.random() * replies.length)],
            time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
          };
          setCustomerChatRooms((p) =>
            p.map((room) =>
              room.customerId === customerId
                ? { ...room, messages: [...room.messages, reply], lastMessage: reply.text, lastTime: reply.time }
                : room
            )
          );
        }, 2000);
        return updated;
      })
    );
  };

  const totalUnread = chatRooms.reduce((s, r) => s + r.unread, 0);
  const totalCustomerUnread = customerChatRooms.reduce((s, r) => s + r.unread, 0);

  return (
    <ChatContext.Provider value={{
      chatRooms, activeChatShop, openChat, closeChat, sendMessage, totalUnread,
      customerChatRooms, activeCustomerChat, openCustomerChat, closeCustomerChat, sendCustomerMessage, totalCustomerUnread,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    return {
      chatRooms: [],
      activeChatShop: null,
      openChat: () => {},
      closeChat: () => {},
      sendMessage: () => {},
      totalUnread: 0,
      customerChatRooms: [],
      activeCustomerChat: null,
      openCustomerChat: () => {},
      closeCustomerChat: () => {},
      sendCustomerMessage: () => {},
      totalCustomerUnread: 0,
    } as ChatContextType;
  }
  return ctx;
}
