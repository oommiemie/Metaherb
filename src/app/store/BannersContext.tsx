import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { usePersistentState } from "./usePersistentState";
import imgBanner06 from "../../assets/banner_6_1772117418.jpg";
import imgBanner14 from "../../assets/banner_14_1773319227.jpg";
import imgBanner15 from "../../assets/banner_15_1773319212.jpg";
import imgBanner17 from "../../assets/banner_17_1773366682.jpg";
import imgBanner18 from "../../assets/banner_18_1773366718.jpg";

export type BannerPosition = "hero" | "right_top" | "right_bottom";
export type BannerStatus = "active" | "scheduled" | "expired" | "draft";

export interface Banner {
  id: string;
  name: string;
  description: string;
  image: string;
  position: BannerPosition;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  link?: string;
  clicks?: number;
}

const SEED_BANNERS: Banner[] = [
  { id: "BNR-001", name: "Hero Banner 06",     description: "แคมเปญหลัก ประจำเดือน",                                  image: imgBanner06, position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products",               clicks: 1248 },
  { id: "BNR-002", name: "Hero Banner 14",     description: "โปรโมชั่นสมุนไพรไทย",                                    image: imgBanner14, position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products",               clicks: 892  },
  { id: "BNR-003", name: "Hero Banner 15",     description: "สินค้าแนะนำประจำสัปดาห์",                                image: imgBanner15, position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products",               clicks: 654  },
  { id: "BNR-004", name: "Hero Banner 17",     description: "เซ็ตของขวัญสมุนไพร",                                     image: imgBanner17, position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?gift=true",     clicks: 412  },
  { id: "BNR-006", name: "Hero Banner 18",     description: "โปรพิเศษเฉพาะสมาชิก",                                    image: imgBanner18, position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products",               clicks: 380  },
  { id: "BNR-005", name: "Bewell Essentials",   description: "สินค้าเสริมสุขภาพ — แนะนำโดยแพทย์",                  image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80",  position: "right_top",    startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?tag=bewell",    clicks: 318  },
  { id: "BNR-007", name: "Beauty & Skin",       description: "ครีมสมุนไพรบำรุงผิว — สูตรดั้งเดิม",                  image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&q=80",  position: "right_bottom", startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?cat=beauty",    clicks: 256  },
];

interface BannersContextType {
  banners: Banner[];
  /** Active banners filtered by position, useful for customer-facing render. */
  activeByPosition: (pos: BannerPosition) => Banner[];
  addBanner: (b: Omit<Banner, "id"> & { id?: string }) => Banner;
  updateBanner: (id: string, patch: Partial<Banner>) => void;
  removeBanner: (id: string) => void;
  saveBanner: (b: Banner) => void; // upsert: edits in place if id matches, else inserts
}

const BannersContext = createContext<BannersContextType | null>(null);

export function BannersProvider({ children }: { children: ReactNode }) {
  const [banners, setBanners] = usePersistentState<Banner[]>("metaherb:banners", SEED_BANNERS);

  // One-time migration: existing localStorage may still hold the old Unsplash hero URLs.
  // Replace hero images with the bundled local images so the new banner set always shows up.
  useEffect(() => {
    const stillUsingOldHero = banners.some((b) => b.position === "hero" && b.image.startsWith("https://images.unsplash.com/"));
    if (stillUsingOldHero) {
      const heroOnly = SEED_BANNERS.filter((b) => b.position === "hero");
      const nonHero = banners.filter((b) => b.position !== "hero");
      setBanners([...heroOnly, ...nonHero]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeByPosition = useCallback((pos: BannerPosition) =>
    banners.filter((b) => b.position === pos && b.status === "active"), [banners]);

  const addBanner: BannersContextType["addBanner"] = useCallback((b) => {
    const id = b.id ?? `BNR-${Date.now().toString().slice(-6)}`;
    const next: Banner = { ...(b as Banner), id };
    setBanners((prev) => [...prev, next]);
    return next;
  }, [setBanners]);

  const updateBanner = useCallback((id: string, patch: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, ...patch } : b));
  }, [setBanners]);

  const removeBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }, [setBanners]);

  const saveBanner = useCallback((b: Banner) => {
    setBanners((prev) => {
      const existing = prev.findIndex((x) => x.id === b.id);
      if (existing >= 0) return prev.map((x, i) => i === existing ? b : x);
      return [...prev, b];
    });
  }, [setBanners]);

  const value = useMemo(() => ({ banners, activeByPosition, addBanner, updateBanner, removeBanner, saveBanner }),
    [banners, activeByPosition, addBanner, updateBanner, removeBanner, saveBanner]);
  return <BannersContext.Provider value={value}>{children}</BannersContext.Provider>;
}

export function useBanners() {
  const ctx = useContext(BannersContext);
  if (!ctx) throw new Error("useBanners must be used within BannersProvider");
  return ctx;
}
