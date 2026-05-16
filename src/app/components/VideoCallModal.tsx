import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../store/LanguageContext";
import { Phone, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Minimize2, PhoneOff } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

interface VideoCallModalProps {
  open: boolean;
  shopName: string;
  shopAvatar?: string;
  userAvatar?: string;
  online?: boolean;
  onClose: () => void;
}

/**
 * Simulated video call UI (demo — no real WebRTC).
 * Flow: ringing (3s) → connected → counts call duration → user ends call.
 */
export function VideoCallModal({ open, shopName, shopAvatar, userAvatar, online = true, onClose }: VideoCallModalProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"ringing" | "connected" | "ended">("ringing");
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const ringTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when opened, start ringing → connect after ~3s
  useEffect(() => {
    if (!open) return;
    setStatus("ringing");
    setDuration(0);
    setMuted(false);
    setVideoOff(false);
    setSpeakerOn(true);
    ringTimer.current = setTimeout(() => setStatus("connected"), 2800);
    return () => {
      if (ringTimer.current) clearTimeout(ringTimer.current);
    };
  }, [open]);

  // Tick duration once connected
  useEffect(() => {
    if (status !== "connected") return;
    tickTimer.current = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => {
      if (tickTimer.current) clearInterval(tickTimer.current);
    };
  }, [status]);

  if (!open) return null;

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (tickTimer.current) clearInterval(tickTimer.current);
    if (ringTimer.current) clearTimeout(ringTimer.current);
    setStatus("ended");
    setTimeout(onClose, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-[420px] h-full sm:h-[680px] sm:max-h-[90vh] bg-gradient-to-br from-[#0d2a17] via-[#0a1f12] to-black sm:rounded-[28px] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] flex flex-col">
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 size-[280px] rounded-full bg-[#319754]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-[320px] rounded-full bg-[#46c474]/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-5 pt-5 text-white">
          <div>
            <p className={`${font} text-[11px] uppercase tracking-[0.18em] text-white/55`} style={{ fontWeight: 600 }}>
              {status === "ringing"
                ? t("vc_status_ringing")
                : status === "connected"
                  ? t("vc_status_connected")
                  : t("vc_status_ended")}
            </p>
            <p className={`${font} text-[18px] mt-1 leading-none`} style={{ fontWeight: 600 }}>{shopName}</p>
            {status === "connected" && (
              <p className={`${font} text-[14px] text-[#46c474] mt-1.5 tabular-nums`} style={{ fontWeight: 500 }}>{fmtTime(duration)}</p>
            )}
          </div>
          <button onClick={onClose}
            className="size-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label={t("vc_minimize")}>
            <Minimize2 className="size-4" strokeWidth={2.2} />
          </button>
        </div>

        {/* Center — remote video / avatar */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          {/* Shop "video" placeholder (gradient with avatar) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`relative inline-flex items-center justify-center transition-all duration-700 ${
                status === "ringing" ? "scale-100" : "scale-110"
              }`}>
                {/* Pulse rings (ringing only) */}
                {status === "ringing" && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-[#46c474]/30 animate-ping" />
                    <span className="absolute inset-[-8px] rounded-full bg-[#46c474]/20 animate-pulse" />
                  </>
                )}
                <div className="relative size-[140px] sm:size-[160px] rounded-full overflow-hidden ring-4 ring-white/20 shadow-[0_18px_40px_-8px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#46c474]/40 to-[#319754]/60 flex items-center justify-center">
                  {shopAvatar ? (
                    <img src={shopAvatar} alt={shopName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[64px]" aria-hidden>🌿</span>
                  )}
                </div>
              </div>
              <p className={`${font} text-white text-[20px] mt-5`} style={{ fontWeight: 600 }}>{shopName}</p>
              {online && status !== "ended" && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#46c474]/15 border border-[#46c474]/30">
                  <span className="size-1.5 rounded-full bg-[#46c474] shadow-[0_0_6px_rgba(70,196,116,0.8)]" />
                  <span className={`${font} text-[11px] text-[#46c474]`} style={{ fontWeight: 500 }}>{t("chat_online")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Self video (PIP, bottom-right) */}
          {status === "connected" && !videoOff && (
            <div className="absolute bottom-4 right-4 w-[100px] h-[140px] sm:w-[120px] sm:h-[160px] rounded-2xl overflow-hidden ring-2 ring-white/25 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
              {userAvatar ? (
                <img src={userAvatar} alt="You" className="w-full h-full object-cover" />
              ) : (
                <div className="size-[44px] rounded-full bg-gradient-to-br from-[#46c474] to-[#319754] flex items-center justify-center text-white text-[20px]" style={{ fontWeight: 700 }}>
                  ฉัน
                </div>
              )}
              <span className={`${font} absolute bottom-1.5 left-1.5 text-[10px] text-white/90 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md`}>
                {t("vc_you")}
              </span>
            </div>
          )}

          {/* Video off overlay (own camera) */}
          {status === "connected" && videoOff && (
            <div className="absolute bottom-4 right-4 w-[100px] h-[140px] sm:w-[120px] sm:h-[160px] rounded-2xl bg-gray-800 flex flex-col items-center justify-center gap-2 ring-2 ring-white/25">
              <VideoOff className="size-6 text-white/70" />
              <span className={`${font} text-[10px] text-white/70`}>{t("vc_camera_off")}</span>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="relative px-5 pb-6 pt-2">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Mute */}
            <button onClick={() => setMuted((m) => !m)}
              disabled={status !== "connected"}
              className={`group/btn size-[54px] rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 ${
                muted
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label={muted ? t("vc_unmute") : t("vc_mute")}>
              {muted ? <MicOff className="size-5" strokeWidth={2.2} /> : <Mic className="size-5" strokeWidth={2.2} />}
            </button>

            {/* Video toggle */}
            <button onClick={() => setVideoOff((v) => !v)}
              disabled={status !== "connected"}
              className={`group/btn size-[54px] rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 ${
                videoOff
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label={videoOff ? t("vc_camera_on") : t("vc_camera_off")}>
              {videoOff ? <VideoOff className="size-5" strokeWidth={2.2} /> : <Video className="size-5" strokeWidth={2.2} />}
            </button>

            {/* Speaker */}
            <button onClick={() => setSpeakerOn((s) => !s)}
              disabled={status !== "connected"}
              className={`group/btn size-[54px] rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 ${
                !speakerOn
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label={speakerOn ? t("vc_speaker_off") : t("vc_speaker_on")}>
              {speakerOn ? <Volume2 className="size-5" strokeWidth={2.2} /> : <VolumeX className="size-5" strokeWidth={2.2} />}
            </button>

            {/* End call */}
            <button onClick={handleEndCall}
              className="size-[60px] rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ef4444] hover:from-[#ff8a8a] hover:to-[#ff5050] text-white flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(239,68,68,0.5)] hover:shadow-[0_12px_32px_-4px_rgba(239,68,68,0.7)] hover:-translate-y-[1px] active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={t("vc_end")}>
              {status === "ringing" ? <PhoneOff className="size-6" strokeWidth={2.4} /> : <Phone className="size-6 rotate-[135deg]" strokeWidth={2.4} />}
            </button>
          </div>
          <p className={`${font} text-center text-[11px] text-white/45 mt-3`}>
            {status === "ringing" ? t("vc_hint_ringing") : status === "connected" ? t("vc_hint_connected") : t("vc_hint_ended")}
          </p>
        </div>
      </div>
    </div>
  );
}
