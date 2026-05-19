import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState } from "./usePersistentState";

export interface SiteInfo {
  // General
  siteNameTh: string;
  siteNameEn: string;
  tagline: string;
  description: string;
  // Branding
  logoUrl: string;
  faviconUrl: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  // General settings
  defaultLang: "th" | "en";
  timezone: string;
  currency: "THB" | "USD" | "EUR";
  // Contact
  contactEmail: string;
  contactPhone: string;
  // Address
  addressLine: string;
  // Social
  facebook: string;
  line: string;
  instagram: string;
  youtube: string;
}

export const DEFAULT_SITE_INFO: SiteInfo = {
  siteNameTh: "เมต้าเฮิร์บ",
  siteNameEn: "MetaHerb",
  tagline: "ผู้นำสมุนไพรไทยคุณภาพ",
  description: "เราเป็นผู้นำด้านสมุนไพรคุณภาพ เพื่อสุขภาพที่ยั่งยืน คัดสรรผลิตภัณฑ์จากเกษตรกรท้องถิ่นกว่า 200 ราย",
  logoUrl: "",
  faviconUrl: "",
  metaTitle: "MetaHerb — สมุนไพรไทยคุณภาพ",
  metaDescription: "เลือกซื้อสมุนไพรไทยคุณภาพจาก MetaHerb ผ่านการรับรองมาตรฐาน อย. และ ISO 22000",
  metaKeywords: "สมุนไพร, ชาสมุนไพร, ผลิตภัณฑ์ธรรมชาติ, MetaHerb",
  ogImage: "",
  defaultLang: "th",
  timezone: "Asia/Bangkok",
  currency: "THB",
  contactEmail: "support@metaherb.co.th",
  contactPhone: "02-123-4567",
  addressLine: "123 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
  facebook: "https://facebook.com/metaherb",
  line: "@metaherb",
  instagram: "https://instagram.com/metaherb",
  youtube: "https://youtube.com/@metaherb",
};

interface SiteInfoContextType {
  info: SiteInfo;
  update: (patch: Partial<SiteInfo>) => void;
  reset: () => void;
}

const SiteInfoContext = createContext<SiteInfoContextType | null>(null);

export function SiteInfoProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = usePersistentState<SiteInfo>("metaherb:siteInfo", DEFAULT_SITE_INFO);

  const update = useCallback((patch: Partial<SiteInfo>) => {
    setInfo((prev) => ({ ...prev, ...patch }));
  }, [setInfo]);

  const reset = useCallback(() => setInfo(DEFAULT_SITE_INFO), [setInfo]);

  const value = useMemo(() => ({ info, update, reset }), [info, update, reset]);
  return <SiteInfoContext.Provider value={value}>{children}</SiteInfoContext.Provider>;
}

export function useSiteInfo() {
  const ctx = useContext(SiteInfoContext);
  if (!ctx) throw new Error("useSiteInfo must be used within SiteInfoProvider");
  return ctx;
}
