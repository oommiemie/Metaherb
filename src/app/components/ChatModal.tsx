import { useState, useRef, useEffect } from "react";
import { useChat } from "../store/ChatContext";
import { X, Send, Image, Smile, Minus, MessageCircle } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function ChatModal() {
  const { chatRooms, activeChatShop, closeChat, sendMessage, totalUnread, openChat } = useChat();
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
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

  // Floating chat bubble
  if (!activeChatShop) {
    return (
      <button
        onClick={() => openChat("metaherb")}
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
      {/* Header */}
      <div className="bg-[#319754] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-[12px]">🌿</div>
          <div>
            <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{room?.shopName || "Chat"}</p>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-green-300" />
              <span className={`${font} text-[10px] opacity-80`}>{room?.online ? "ออนไลน์" : "ออฟไลน์"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(true)} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <Minus className="size-4" />
          </button>
          <button onClick={closeChat} className="cursor-pointer hover:bg-white/10 rounded p-1">
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Quick actions */}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
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

      {/* Input */}
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
