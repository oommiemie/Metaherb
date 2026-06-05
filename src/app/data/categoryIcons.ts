import {
  Leaf, UtensilsCrossed, Pill, Sparkles, Flower2, Gift, Coffee, FlaskConical, Droplets,
  Package, Heart, Star, Flame, Wheat, Apple,
} from "lucide-react";

/**
 * Shared icon registry — categories store an `iconKey` string and the
 * customer pages (HomePage, ProductsPage) + the admin Categories editor
 * all resolve through this helper. Keeping it small means HomePage's
 * 9-icon row works without dragging in AdminDashboard's bigger preset
 * list.
 */
const ICON_MAP: Record<string, any> = {
  "leaf": Leaf,
  "utensils-crossed": UtensilsCrossed,
  "pill": Pill,
  "sparkles": Sparkles,
  "flower-2": Flower2,
  "gift": Gift,
  "coffee": Coffee,
  "flask": FlaskConical,
  "droplets": Droplets,
  "package": Package,
  "heart": Heart,
  "star": Star,
  "flame": Flame,
  "wheat": Wheat,
  "apple": Apple,
};

export function getCategoryIcon(key: string) {
  return ICON_MAP[key] ?? Leaf;
}
