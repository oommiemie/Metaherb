import { createContext, useContext, useState, type ReactNode } from "react";

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

interface ChatContextType {
  chatRooms: ChatRoom[];
  activeChatShop: string | null;
  openChat: (shopId: string) => void;
  closeChat: () => void;
  sendMessage: (shopId: string, text: string) => void;
  totalUnread: number;
}

const ChatContext = createContext<ChatContextType | null>(null);

const mockChatRooms: ChatRoom[] = [
  {
    shopId: "metaherb",
    shopName: "METAHERB Store",
    shopAvatar: "",
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
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(mockChatRooms);
  const [activeChatShop, setActiveChatShop] = useState<string | null>(null);

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
        // Auto-reply after 1.5s
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

  const totalUnread = chatRooms.reduce((s, r) => s + r.unread, 0);

  return (
    <ChatContext.Provider value={{ chatRooms, activeChatShop, openChat, closeChat, sendMessage, totalUnread }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
