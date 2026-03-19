import { useState, useRef, useEffect } from "react";
import { useChat } from "../store/ChatContext";
import { useAuth } from "../store/AuthContext";
import { X, Send, Image, Smile, Minus, MessageCircle, ChevronLeft, Headset, Package } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

/* ========== USER CHAT (chat with shops) ========== */
function UserChat() {
  const { chatRooms, activeChatShop, closeChat, sendMessage, totalUnread, openChat } = useChat();
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [showList, setShowList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const room = chatRooms.find((r) => r.shopId === activeChatShop);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.messages.length]);

  const handleSend = () => {
    if (!input.trim() || !activeChatShop) return;
    sendMessage(activeChatShop, input);
    setInput("");
  };

  const handleOpenShopChat = (shopId: string) => {
    openChat(shopId);
    setShowList(false);
  };

  const handleBackToList = () => {
    closeChat();
    setShowList(true);
  };

  // Floating chat bubble
  if (!activeChatShop && !showList) {
    return (
      <button
        onClick={() => setShowList(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#319754] text-white rounded-full size-14 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#267a43] transition-all hover:scale-110"
      >
        <MessageCircle className="size-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ff383c] text-white text-[10px] size-5 rounded-full flex items-center justify-center">
            {totalUnread}
          </span>
        )}
      </button>
    );
  }

  // Shop list view
  if (showList && !activeChatShop) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        <div className="bg-[#319754] text-white px-4 py-3 flex items-center justify-between shrink-0">
          <p className={`${font} text-[15px]`} style={{ fontWeight: 600 }}>แชทกับร้านค้า</p>
          <button onClick={() => setShowList(false)} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatRooms.map((r) => (
            <button
              key={r.shopId}
              onClick={() => handleOpenShopChat(r.shopId)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 text-left"
            >
              <div className="size-10 rounded-full bg-[#319754]/10 flex items-center justify-center text-[18px] shrink-0">
                {r.shopAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`${font} text-[13px] text-gray-900 truncate`} style={{ fontWeight: 500 }}>{r.shopName}</p>
                  {r.lastTime && <span className={`${font} text-[10px] text-gray-400 shrink-0 ml-2`}>{r.lastTime}</span>}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`${font} text-[12px] text-gray-500 truncate`}>{r.lastMessage || "เริ่มสนทนา..."}</p>
                  {r.unread > 0 && (
                    <span className="bg-[#ff383c] text-white text-[10px] size-5 rounded-full flex items-center justify-center shrink-0 ml-2">
                      {r.unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={`size-1.5 rounded-full ${r.online ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className={`${font} text-[10px] ${r.online ? "text-green-600" : "text-gray-400"}`}>
                    {r.online ? "ออนไลน์" : "ออฟไลน์"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 z-40 bg-[#319754] text-white rounded-full size-14 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#267a43]"
      >
        <MessageCircle className="size-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      <div className="bg-[#319754] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={handleBackToList} className="cursor-pointer hover:bg-white/10 rounded p-1 -ml-1">
            <ChevronLeft className="size-5" />
          </button>
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-[14px]">{room?.shopAvatar || "🌿"}</div>
          <div>
            <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{room?.shopName || "Chat"}</p>
            <div className="flex items-center gap-1">
              <div className={`size-2 rounded-full ${room?.online ? "bg-green-300" : "bg-gray-300"}`} />
              <span className={`${font} text-[10px] opacity-80`}>{room?.online ? "ออนไลน์" : "ออฟไลน์"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(true)} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <Minus className="size-4" />
          </button>
          <button onClick={() => { closeChat(); setShowList(false); }} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto shrink-0">
        {["สอบถามสินค้า", "สถานะคำสั่งซื้อ", "ขอใบเสร็จ", "แจ้งปัญหา"].map((q) => (
          <button
            key={q}
            onClick={() => { sendMessage(activeChatShop!, q); }}
            className={`px-3 py-1 rounded-full border border-[#319754] text-[#319754] text-[11px] ${font} cursor-pointer hover:bg-[#319754]/5 whitespace-nowrap shrink-0`}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
        {room?.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="size-10 mb-2 opacity-30" />
            <p className={`${font} text-[13px]`}>เริ่มสนทนากับ {room.shopName}</p>
          </div>
        )}
        {room?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] ${msg.sender === "user" ? "order-1" : ""}`}>
              <div
                className={`px-3 py-2 rounded-2xl text-[13px] ${font} ${
                  msg.sender === "user"
                    ? "bg-[#319754] text-white rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.text}
              </div>
              <p className={`${font} text-[10px] text-gray-400 mt-0.5 ${msg.sender === "user" ? "text-right" : ""}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 py-2 border-t border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button className="cursor-pointer text-gray-400 hover:text-gray-600"><Image className="size-5" /></button>
          <button className="cursor-pointer text-gray-400 hover:text-gray-600"><Smile className="size-5" /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="พิมพ์ข้อความ..."
            className={`flex-1 bg-gray-100 rounded-full px-4 py-2 text-[13px] ${font} outline-none`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`size-8 rounded-full flex items-center justify-center cursor-pointer ${
              input.trim() ? "bg-[#319754] text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== OWNER CHAT (respond to customers) ========== */
function OwnerChat() {
  const { customerChatRooms, activeCustomerChat, openCustomerChat, closeCustomerChat, sendCustomerMessage, totalCustomerUnread } = useChat();
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [showList, setShowList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const room = customerChatRooms.find((r) => r.customerId === activeCustomerChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.messages.length]);

  const handleSend = () => {
    if (!input.trim() || !activeCustomerChat) return;
    sendCustomerMessage(activeCustomerChat, input);
    setInput("");
  };

  const handleOpenCustomerChat = (customerId: string) => {
    openCustomerChat(customerId);
    setShowList(false);
  };

  const handleBackToList = () => {
    closeCustomerChat();
    setShowList(true);
  };

  // Floating chat bubble — owner style
  if (!activeCustomerChat && !showList) {
    return (
      <button
        onClick={() => setShowList(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#319754] text-white rounded-full size-14 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#267a43] transition-all hover:scale-110"
      >
        <Headset className="size-6" />
        {totalCustomerUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ff383c] text-white text-[10px] size-5 rounded-full flex items-center justify-center">
            {totalCustomerUnread}
          </span>
        )}
      </button>
    );
  }

  // Customer list view
  if (showList && !activeCustomerChat) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        <div className="bg-[#319754] text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Headset className="size-4" />
            <p className={`${font} text-[15px]`} style={{ fontWeight: 600 }}>แชทกับลูกค้า</p>
            {totalCustomerUnread > 0 && (
              <span className={`${font} text-[10px] bg-white/20 px-2 py-0.5 rounded-full`}>{totalCustomerUnread} ใหม่</span>
            )}
          </div>
          <button onClick={() => setShowList(false)} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {customerChatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <Headset className="size-12 mb-3 opacity-30" />
              <p className={`${font} text-[13px]`}>ยังไม่มีข้อความจากลูกค้า</p>
            </div>
          ) : (
            customerChatRooms.map((r) => (
              <button
                key={r.customerId}
                onClick={() => handleOpenCustomerChat(r.customerId)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 text-left ${r.unread > 0 ? "bg-[#319754]/5" : ""}`}
              >
                <div className="size-10 rounded-full bg-[#319754]/10 flex items-center justify-center text-[18px] shrink-0">
                  {r.customerAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className={`${font} text-[13px] text-gray-900 truncate`} style={{ fontWeight: r.unread > 0 ? 600 : 500 }}>{r.customerName}</p>
                      {r.orderRef && (
                        <span className={`${font} text-[9px] text-[#319754] bg-[#319754]/10 px-1.5 py-0.5 rounded shrink-0`}>
                          {r.orderRef}
                        </span>
                      )}
                    </div>
                    {r.lastTime && <span className={`${font} text-[10px] text-gray-400 shrink-0 ml-2`}>{r.lastTime}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`${font} text-[12px] text-gray-500 truncate`}>{r.lastMessage || "เริ่มสนทนา..."}</p>
                    {r.unread > 0 && (
                      <span className="bg-[#ff383c] text-white text-[10px] size-5 rounded-full flex items-center justify-center shrink-0 ml-2">
                        {r.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className={`size-1.5 rounded-full ${r.online ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className={`${font} text-[10px] ${r.online ? "text-green-600" : "text-gray-400"}`}>
                      {r.online ? "ออนไลน์" : "ออฟไลน์"}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 z-40 bg-[#319754] text-white rounded-full size-14 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#267a43]"
      >
        <Headset className="size-6" />
        {totalCustomerUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ff383c] text-white text-[10px] size-5 rounded-full flex items-center justify-center">
            {totalCustomerUnread}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-[#319754] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={handleBackToList} className="cursor-pointer hover:bg-white/10 rounded p-1 -ml-1">
            <ChevronLeft className="size-5" />
          </button>
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-[14px]">{room?.customerAvatar || "👤"}</div>
          <div>
            <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{room?.customerName || "ลูกค้า"}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={`size-2 rounded-full ${room?.online ? "bg-green-300" : "bg-gray-300"}`} />
                <span className={`${font} text-[10px] opacity-80`}>{room?.online ? "ออนไลน์" : "ออฟไลน์"}</span>
              </div>
              {room?.orderRef && (
                <span className={`${font} text-[9px] bg-white/20 px-1.5 py-0.5 rounded`}>{room.orderRef}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(true)} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <Minus className="size-4" />
          </button>
          <button onClick={() => { closeCustomerChat(); setShowList(false); }} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Owner quick replies */}
      <div className="px-3 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto shrink-0">
        {["ขอบคุณค่ะ 🙏", "จัดส่งแล้วค่ะ", "มีสินค้าพร้อมส่ง", "ส่งเลขพัสดุให้นะคะ", "กำลังตรวจสอบค่ะ"].map((q) => (
          <button
            key={q}
            onClick={() => { sendCustomerMessage(activeCustomerChat!, q); }}
            className={`px-3 py-1 rounded-full border border-[#319754] text-[#319754] text-[11px] ${font} cursor-pointer hover:bg-[#319754]/5 whitespace-nowrap shrink-0`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages — flipped perspective: "user" = customer, "shop" = owner (me) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
        {room?.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Headset className="size-10 mb-2 opacity-30" />
            <p className={`${font} text-[13px]`}>ยังไม่มีข้อความจาก {room.customerName}</p>
          </div>
        )}
        {room?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "shop" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%]`}>
              {msg.sender === "user" && (
                <p className={`${font} text-[10px] text-gray-400 mb-0.5`}>{room.customerName}</p>
              )}
              <div
                className={`px-3 py-2 rounded-2xl text-[13px] ${font} ${
                  msg.sender === "shop"
                    ? "bg-[#319754] text-white rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.text}
              </div>
              <p className={`${font} text-[10px] text-gray-400 mt-0.5 ${msg.sender === "shop" ? "text-right" : ""}`}>
                {msg.time} {msg.sender === "shop" && "• คุณ"}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button className="cursor-pointer text-gray-400 hover:text-gray-600"><Image className="size-5" /></button>
          <button className="cursor-pointer text-gray-400 hover:text-gray-600"><Smile className="size-5" /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="ตอบกลับลูกค้า..."
            className={`flex-1 bg-gray-100 rounded-full px-4 py-2 text-[13px] ${font} outline-none`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`size-8 rounded-full flex items-center justify-center cursor-pointer ${
              input.trim() ? "bg-[#319754] text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== MAIN EXPORT — routes by role ========== */
export function ChatModal() {
  const { user } = useAuth();

  if (user?.role === "owner") return <OwnerChat />;
  if (user?.role === "admin") return null; // Admin ไม่มีแชท
  return <UserChat />;
}