import { useRef, useEffect } from "react";
import { useNotifications } from "../store/NotificationContext";
import { useNavigate } from "react-router";
import { Package, Megaphone, Monitor, MessageCircle, Check, Bell } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const typeIcons = {
  order: Package,
  promo: Megaphone,
  system: Monitor,
  chat: MessageCircle,
};

const typeColors = {
  order: "bg-blue-50 text-blue-500",
  promo: "bg-orange-50 text-orange-500",
  system: "bg-purple-50 text-purple-500",
  chat: "bg-green-50 text-green-500",
};

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-[2px_4px_24px_0px_rgba(0,0,0,0.12)] w-[380px] max-w-[calc(100vw-32px)] z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-[#319754]" />
          <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>การแจ้งเตือน</span>
          {unreadCount > 0 && (
            <span className="bg-[#ff383c] text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className={`${font} text-[12px] text-[#319754] cursor-pointer hover:underline flex items-center gap-1`}>
            <Check className="size-3" /> อ่านทั้งหมด
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="size-10 text-gray-200 mx-auto" />
            <p className={`${font} text-[13px] text-gray-400 mt-2`}>ไม่มีการแจ้งเตือน</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = typeIcons[n.type];
            return (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.link) { navigate(n.link); onClose(); }
                }}
                className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                  !n.read ? "bg-[#319754]/5" : ""
                }`}
              >
                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`${font} text-[13px] ${!n.read ? "text-black" : "text-gray-700"}`} style={{ fontWeight: !n.read ? 500 : 400 }}>
                      {n.title}
                    </p>
                    {!n.read && <div className="size-2 rounded-full bg-[#319754] shrink-0 mt-1.5" />}
                  </div>
                  <p className={`${font} text-[12px] text-gray-500 mt-0.5 line-clamp-2`}>{n.message}</p>
                  <p className={`${font} text-[11px] text-gray-400 mt-1`}>{n.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-gray-100 px-4 py-2.5 text-center">
        <button onClick={() => { navigate("/notifications"); onClose(); }}
          className={`${font} text-[13px] text-[#319754] cursor-pointer hover:underline`}>
          ดูการแจ้งเตือนทั้งหมด
        </button>
      </div>
    </div>
  );
}
