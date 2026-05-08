import React, { useState, Fragment, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { useOrders } from "../store/OrderContext";
import { useNavigate } from "react-router";
import {
  BarChart3, Package, ShoppingCart, Zap, Megaphone, Ticket,
  Settings, ChevronDown, ChevronLeft, Store, Search,
  Plus, MoreHorizontal, Eye, AlertCircle, X, Check, Clock, ArrowRight, ArrowUpRight, RotateCcw, Wallet,
  AlertTriangle, Phone, Mail, ChevronRight, Filter,
  FileText, TrendingUp, Users, ShoppingBag, BarChart2, Download, FileSpreadsheet,
  ClipboardList, ScanSearch, Truck, PackageCheck, PackageX, EyeOff
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from "recharts";
import { Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import imgCoin from "../../assets/cion.png";
import imgBox from "../../assets/box-in-caer.png";
import imgCoinUp from "../../assets/cion-up.png";
import imgCost from "../../assets/cost.png";
import imgNewCustomer from "../../assets/new-customer.png";
import imgRepeatCustomers from "../../assets/repeat-customers.png";
import imgGroupCustomer from "../../assets/gourp-customer.png";
import imgMember from "../../assets/member.png";
import imgProductsSold from "../../assets/products-sold.png";
import imgProductsStore from "../../assets/products-store.png";
import imgStock from "../../assets/stock.png";
import imgRating from "../../assets/rating.png";
import imgVisitors from "../../assets/visitors.png";
import imgBagInCart from "../../assets/bag-in-cart.png";
import imgConvert from "../../assets/convert.png";
import imgCoupon from "../../assets/coupon.png";
import imgSellingProducts from "../../assets/selling-products.png";
import imgRecommendedProducts from "../../assets/recommended-products.png";
import imgWalletIllust from "../../assets/wallet-illust.png";
import imgEscrowIllust from "../../assets/escrow.png";
import imgAccumIncomeIllust from "../../assets/accumulated-income.png";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/ui/hover-card";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { DateRange } from "react-day-picker";
import { buildReportData } from "../data/reportMockData";
import { toast } from "sonner";
import { MessageCircle, Star, Ban, ArrowRightCircle, MapPin, User as UserIcon, Printer, Pencil, Trash2, Boxes, Heart, Share2 } from "lucide-react";
import imgLogo from "../../assets/logo.png";
import imgSideBar from "figma:asset/9c30b1921f0988e49ef49ac4f89b2dd06b320b33.png";
import imgProd from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgFlash from "figma:asset/8effbd2f0b89604dcbe9aeb239cc524667996e66.png";
import imgEvidence0 from "figma:asset/d0cb417cf99aba1cdf79d5426f5fd585177d3d46.png";
import imgEvidence1 from "figma:asset/7506073c04064524065ab7d328509bd53de6d2ae.png";
import imgRefundProduct from "figma:asset/e9fa4baa6fae7a43e086cd2f7372c763ac79e774.png";
import bankLogoKBANK from "figma:asset/fc3734dca1dc1106a8a9ae04448d90848680e3b4.png";
import bankLogoSCB from "figma:asset/480398b2a511e7f907960af090b46919e996b2fb.png";
import bankLogoKTB from "figma:asset/3bc35e854570ff8d031628a1b961ff515af8c04c.png";
import bankLogoTTB from "figma:asset/85a8262de08aace150c02d0d1b8e2a2442158aa8.png";
import bankLogoBBL from "figma:asset/7644739c159ec3c06623b12e5cc595deb95f9ce4.png";
import svgOrderTabs from "../../imports/svg-ht9fbjz0sq";
import svgBankTabs from "../../imports/svg-q7abbwkyjt";
import svgChevron from "../../imports/svg-a36cmd0hr3";
import svgPaths from "../../imports/svg-fmfhn0ojdl";
import svgComplaint from "../../imports/svg-ysz5k1ajog";
import svgDetail from "../../imports/svg-4nbwddesrb";

const orderTabSvgs = {
  clipboard1: svgOrderTabs.p16f83e00,
  clipboard2: svgOrderTabs.p3f9d1a00,
  clipboard3: svgOrderTabs.p3322fb80,
  hourglass: svgOrderTabs.p1d19b180,
  bahtCircle: svgOrderTabs.p39f24900,
  magnify: svgOrderTabs.p36681c14,
  bahtCircle2: svgOrderTabs.p310c8100,
  shippingBox: svgOrderTabs.p226519f0,
  truckBox: svgOrderTabs.p2302bd80,
  clockFill: svgOrderTabs.p3b039580,
  checkCircle: svgOrderTabs.p3f907180,
  shippingBox2: svgOrderTabs.p338c7f70,
  xCircle: svgOrderTabs.pcbb7d80,
};

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

type OwnerTab = "overview" | "orders" | "order_detail" | "products" | "flash_sale" | "flash_event" | "promotions" | "coupons" | "bank_settings" | "shop_info" | "add_product" | "finance" | "complaints" | "complaint_detail" | "reports" | "report_sales" | "report_customers" | "report_products" | "report_market";
type OrderFilterTab = "all" | "pending_payment" | "pending_verify" | "ready_ship" | "shipping" | "shipped" | "cancelled";

interface SidebarItem {
  id: OwnerTab;
  label: string;
  icon: any;
  children?: { id: OwnerTab; label: string }[];
}

const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "Dashboard", icon: BarChart3 },
  { id: "orders", label: "คำสั่งซื้อ", icon: ShoppingCart },
  { id: "products", label: "สินค้า", icon: Package, children: [
    { id: "products", label: "จัดการสินค้า" },
    { id: "flash_sale", label: "Flash Sale" },
    { id: "promotions", label: "โปรโมชั่น" },
    { id: "coupons", label: "คูปอง" },
  ]},
  { id: "reports", label: "Report", icon: FileText, children: [
    { id: "report_sales", label: "รายงานผลยอดขาย" },
    { id: "report_customers", label: "รายงานข้อมูลลูกค้า" },
    { id: "report_products", label: "รายงานข้อมูลสินค้า" },
    { id: "report_market", label: "Market Report" },
  ]},
];

const sidebarSettings: SidebarItem[] = [];

const mockProducts = [
  { id: "1",  name: "พิมเสนน้ำอโรมา ตราเมต้าเฮิร์บ",       category: "เครื่องหอม & อโรม่า", type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 89.00",          stock: "120 ชิ้น", status: "เปิดขาย", statusColor: "#319754", flash: true, recommended: true,
    image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=400&q=80" }, // essential oil bottle (both Flash + Recommended)
  { id: "2",  name: "ขมิ้นชันแคปซูล 60 แคป",                category: "สมุนไพรแคปซูล",       type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 220.00",         stock: "85 ชิ้น",  status: "เปิดขาย", statusColor: "#319754", recommended: true,
    image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=400&q=80" }, // turmeric capsule
  { id: "3",  name: "ฟ้าทะลายโจรผง 100 g",                  category: "ผงสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 145.00",         stock: "40 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=400&q=80" }, // dried herbs
  { id: "4",  name: "กาแฟดริป Signature อเมริกาโนเย็น",     category: "อาหารและเครื่องดื่ม", type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 150.00 - 280.00", stock: "62 ชิ้น",  status: "เปิดขาย", statusColor: "#319754", flash: true,
    image: "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=400&q=80" }, // coffee drip
  { id: "5",  name: "ใบบัวบกแคปซูล 60 แคป",                 category: "สมุนไพรแคปซูล",       type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 180.00",         stock: "95 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=400&q=80" }, // green capsule / centella
  { id: "6",  name: "ชาเก๊กฮวยออร์แกนิก 20 ซอง",            category: "ชาสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 125.00",         stock: "210 ชิ้น", status: "เปิดขาย", statusColor: "#319754", recommended: true,
    image: "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=400&q=80" }, // herbal tea
  { id: "7",  name: "น้ำมันมะพร้าวสกัดเย็น 250 ml",         category: "น้ำมันสมุนไพร",       type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 290.00 - 520.00", stock: "48 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=400&q=80" }, // coconut oil
  { id: "8",  name: "ชามะรุม 30 ซอง",                        category: "ชาสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 130.00",         stock: "75 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&q=80" }, // tea bags
  { id: "9",  name: "เห็ดหลินจือสกัด 60 แคป",               category: "สมุนไพรสกัด",         type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 245.00",         stock: "0 ชิ้น",   status: "สินค้าหมด", statusColor: "#dc2626",
    image: "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=400&q=80" }, // mushroom dried
  { id: "10", name: "น้ำผึ้งดอกลำไย 250 ml",                category: "ผลิตภัณฑ์ออร์แกนิก",   type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 215.00 - 380.00", stock: "32 ชิ้น",  status: "เปิดขาย", statusColor: "#319754", flash: true, recommended: true,
    image: "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=400&q=80" }, // honey jar (both Flash + Recommended)
  { id: "11", name: "ขิงผงออร์แกนิก 100 g",                 category: "ผงสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 130.00",         stock: "150 ชิ้น", status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=400&q=80" }, // ginger powder
  { id: "12", name: "สบู่สมุนไพรขมิ้น",                      category: "ของใช้ออร์แกนิก",     type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 65.00",          stock: "180 ชิ้น", status: "เปิดขาย", statusColor: "#319754", recommended: true,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" }, // soap bar
  { id: "13", name: "บาล์มสมุนไพรไพล",                       category: "ของใช้ออร์แกนิก",     type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 95.00",          stock: "8 ชิ้น",   status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=400&q=80" }, // balm jar
  { id: "14", name: "ถุงหอมอโรมา MetaHerb Bloom Essence",   category: "เครื่องหอม & อโรม่า", type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 79.00 - 199.00",  stock: "0 ชิ้น",   status: "ปิดขาย", statusColor: "#737373",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" }, // sachet pouch
  { id: "15", name: "ชาตะไคร้ใบเตย 30 ซอง",                 category: "ชาสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 110.00",         stock: "245 ชิ้น", status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1592479996-0c8a1e8c5d4e?w=400&q=80" }, // tea bags / lemongrass
];

const mockFlashEvents = [
  { id: "1", name: "Flash Sale 2.2", items: 5, date: "00 M.M. 0000 - 00 M.M. 0000", status: "active", countdown: { h: "00", m: "00", s: "00" } },
  { id: "2", name: "Flash Sale 2.2", items: 5, date: "00 M.M. 0000 - 00 M.M. 0000", status: "pending" },
  { id: "3", name: "Flash Sale 2.2", items: 0, date: "00 M.M. 0000 - 00 M.M. 0000", status: "join" },
];

const mockFlashProducts = [
  { id: "1", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "2", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "3", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "4", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "5", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "6", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
];

type OrderStatus = "pending_payment" | "pending_verify" | "ready_ship" | "shipping" | "shipped" | "cancelled";
type ShippingMethod = "รับที่ร้าน" | "จัดส่งปกติ" | "จัดส่งด่วน";
type OrderItem = { name: string; option: string; qty: number; price: number; image: string };
type PaymentMethod = "พร้อมเพย์ PromptPay" | "บัญชีธนาคาร" | "บัตรเครดิต/บัตรเดบิต" | "ชำระเงินปลายทาง";
type ItemReview = {
  itemIndex: number;     // matches order.items[itemIndex]
  rating: number;        // 1-5
  comment: string;
  images: string[];      // review photo URLs
};
type OrderReview = {
  reviewerName: string;
  reviewerAvatar: string;
  reviewedAt: string;    // display string e.g. "15 ก.พ. 2569 - 14:30 น."
  shopRating: number;    // 1-5 overall shop rating
  itemReviews: ItemReview[];
};
type Order = {
  id: string;
  status: OrderStatus;
  date: string;
  customer: string;
  phone: string;
  address: string;
  total: number;
  items: OrderItem[];
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  reviewScore?: number; // overall — kept for quick badge display
  review?: OrderReview;
  note?: string;
  cancelReason?: string;
  cancelNote?: string;
  cancelledBy?: "shop" | "customer";
  cancellationStatus?: "pending" | "approved" | "denied"; // for customer-cancelled orders, requires shop approval
  previousStatus?: OrderStatus; // saved before cancellation so we can revert if shop denies
};

const CANCEL_REASONS = [
  "สินค้าหมดสต็อก",
  "ลูกค้าให้ที่อยู่ผิด",
  "ลูกค้าไม่ตอบกลับ",
  "ปัญหาในการชำระเงิน",
  "ลูกค้าเปลี่ยนใจ",
  "อื่นๆ (ระบุในหมายเหตุ)",
];

const orderProducts = [
  { name: "ขมิ้นชันแคปซูล",        option: "60 แคปซูล",   price: 220, image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=200&q=80" },
  { name: "ฟ้าทะลายโจร",           option: "50 แคปซูล",   price: 145, image: "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=200&q=80" },
  { name: "ชาเก๊กฮวยออร์แกนิก",     option: "20 ซอง",      price: 125, image: "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=200&q=80" },
  { name: "น้ำผึ้งดอกลำไย",         option: "250 ml",     price: 215, image: "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=200&q=80" },
  { name: "ใบบัวบกแคปซูล",          option: "60 แคปซูล",   price: 180, image: "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=200&q=80" },
  { name: "น้ำมันมะพร้าวสกัดเย็น",  option: "250 ml",     price: 290, image: "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=200&q=80" },
  { name: "เห็ดหลินจือสกัด",        option: "60 แคปซูล",   price: 245, image: "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=200&q=80" },
  { name: "ชาตะไคร้แห้ง",          option: "30 ซอง",      price: 130, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=200&q=80" },
  { name: "ขิงผงออร์แกนิก",         option: "100 g",      price: 130, image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=200&q=80" },
  { name: "สบู่สมุนไพรขมิ้น",        option: "ก้อน 100 g",  price: 65,  image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80" },
];

const orderCustomers = [
  { name: "somchai01",  phone: "090-111-2233", address: "12/3 ซ.ลาดพร้าว 1 แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900" },
  { name: "somying22",  phone: "081-222-3344", address: "456/78 หมู่ 5 ต.บางพูน อ.เมือง จ.ปทุมธานี 12000" },
  { name: "tantawan",   phone: "062-333-4455", address: "9 ซ.สุขุมวิท 23 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110" },
  { name: "saifon_99",  phone: "095-444-5566", address: "55 ม.7 ต.หางดง อ.หางดง จ.เชียงใหม่ 50230" },
  { name: "fasai_kk",   phone: "086-555-6677", address: "234 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000" },
  { name: "phukao",     phone: "099-666-7788", address: "78/9 ม.3 ต.ป่าตอง อ.กะทู้ จ.ภูเก็ต 83150" },
  { name: "talay99",    phone: "088-777-8899", address: "100 ซ.พหลโยธิน 11 แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400" },
  { name: "maenam",     phone: "061-888-9900", address: "67 ม.2 ต.บางกระทึก อ.สามพราน จ.นครปฐม 73210" },
  { name: "prachya_p",  phone: "094-999-0011", address: "32/14 ถ.พระราม 2 แขวงท่าข้าม เขตบางขุนเทียน กรุงเทพฯ 10150" },
  { name: "chaiya_d",   phone: "089-000-1122", address: "11 ม.6 ต.บ้านดู่ อ.เมือง จ.เชียงราย 57100" },
];

const reviewerProfiles = [
  { name: "ปาริชาติ สายลม",   avatar: "https://i.pravatar.cc/100?img=47" },
  { name: "ณัฐกานต์ ใจดี",     avatar: "https://i.pravatar.cc/100?img=49" },
  { name: "พิมพ์ชนก รุ่งเรือง", avatar: "https://i.pravatar.cc/100?img=44" },
  { name: "ธนวัฒน์ พงศ์ไพโรจน์", avatar: "https://i.pravatar.cc/100?img=15" },
  { name: "วิไลวรรณ ทองสุข",  avatar: "https://i.pravatar.cc/100?img=45" },
  { name: "ชนินทร์ บุญมี",     avatar: "https://i.pravatar.cc/100?img=68" },
];

const reviewComments = [
  "ของดีมากค่ะ ส่งเร็ว แพ็คดี กินแล้วรู้สึกดีจริงๆ จะกลับมาอุดหนุนใหม่แน่นอน",
  "คุ้มค่ามาก สินค้าแท้ตามรูปเลยค่ะ บรรจุภัณฑ์ดูพรีเมี่ยม ชอบมาก",
  "พอใช้ได้ ราคาเหมาะสม รสชาติถูกปาก แต่อยากให้แพ็คให้แน่นกว่านี้นิดนึง",
  "ส่งเร็วมากค่ะ แพ็คเกจสวย ของอยู่ในสภาพสมบูรณ์ ขอบคุณค่ะ",
  "สินค้าดี รสชาติดี กลิ่นหอม ใช้แล้วนอนหลับสบาย แนะนำเลยครับ",
  "ของดี ส่งไว ราคาสมเหตุสมผล สั่งซื้อครั้งที่ 3 แล้วค่ะ",
];

const reviewPhotoBank = [
  "https://images.unsplash.com/photo-1591628001888-76d51246b8a8?w=400&q=80",
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80",
  "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&q=80",
  "https://images.unsplash.com/photo-1597301518497-69c4d4d10e7a?w=400&q=80",
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80",
];

const customerNotes = [
  "ฝากห่อของขวัญด้วยค่ะ",
  "กรุณาโทรก่อนมาส่งครับ",
  "ฝากใส่ถุงดำให้หน่อยนะคะ ของไม่อยากให้คนเห็น",
  "รบกวนแพ็คดีๆ นะคะ ของกินค่ะ",
  "ไม่ต้องโทรนะคะ วางหน้าบ้านเลย",
];

const customerCancelReasons = [
  "ไม่ต้องการสินค้าแล้ว",
  "เปลี่ยนใจ ขอยกเลิกค่ะ",
  "สั่งผิดสินค้า",
  "ระยะเวลาจัดส่งนานเกินไป",
];
const shopCancelReasons = [
  "สินค้าหมดสต็อก",
  "ลูกค้าให้ที่อยู่ผิด",
  "ลูกค้าไม่ตอบกลับ",
  "ปัญหาในการชำระเงิน",
];

// Generate orders by status; counts match orderTabs counts so the filter pills always align
const buildOrders = (): Order[] => {
  const result: Order[] = [];
  // Variety + good coverage of all states (incl. shipped with reviews + cancelled with all combos)
  const distribution: { status: OrderStatus; count: number }[] = [
    { status: "pending_payment", count: 3 },
    { status: "pending_verify",  count: 3 },
    { status: "ready_ship",      count: 2 },
    { status: "shipping",        count: 6 },
    { status: "shipped",         count: 4 },
    { status: "cancelled",       count: 4 }, // mix: customer-pending, customer-approved, shop x2
  ];
  let seq = 3500;
  distribution.forEach(({ status, count }) => {
    for (let i = 0; i < count; i++) {
      seq += 1;
      const seed = (seq * 31 + status.length * 7) >>> 0;
      const cust = orderCustomers[seed % orderCustomers.length];
      const itemCount = 1 + (seed % 4); // 1-4 items
      const items: OrderItem[] = Array.from({ length: itemCount }, (_, k) => {
        const p = orderProducts[(seed + k * 5) % orderProducts.length];
        const qty = 1 + ((seed + k) % 3);
        return { name: p.name, option: p.option, qty, price: p.price * qty, image: p.image };
      });
      const total = items.reduce((s, it) => s + it.price, 0);
      // Spread dates across recent days (1-25 ก.พ. 2569)
      const day = Math.max(1, Math.min(25, 25 - ((seq + i * 3) % 24)));
      const hr = String(8 + (seed % 12)).padStart(2, "0");
      const mn = String((seed * 7) % 60).padStart(2, "0");
      const shippingOptions: ShippingMethod[] = ["รับที่ร้าน", "จัดส่งปกติ", "จัดส่งด่วน"];
      const shippingMethod = shippingOptions[seed % shippingOptions.length];
      const paymentOptions: PaymentMethod[] = ["พร้อมเพย์ PromptPay", "บัญชีธนาคาร", "บัตรเครดิต/บัตรเดบิต", "ชำระเงินปลายทาง"];
      const paymentMethod = paymentOptions[seed % paymentOptions.length];

      // Cancellation logic — distribute cancelled orders across types for testability:
      //   index 0 → customer-pending (needs shop approval)
      //   index 1 → customer-approved (already finalized)
      //   index 2,3 → shop-cancelled
      const isCancelled = status === "cancelled";
      let cancelledBy: "shop" | "customer" | undefined;
      let cancelReason: string | undefined;
      let cancelNote: string | undefined;
      let cancellationStatus: "pending" | "approved" | "denied" | undefined;
      let previousStatus: OrderStatus | undefined;
      if (isCancelled) {
        if (i === 0) {
          cancelledBy = "customer";
          cancellationStatus = "pending";
          cancelReason = customerCancelReasons[seed % customerCancelReasons.length];
          cancelNote = "ขอโทษนะคะ พึ่งรู้ว่ามีโปรที่อื่น";
          previousStatus = "pending_verify";
        } else if (i === 1) {
          cancelledBy = "customer";
          cancellationStatus = "approved";
          cancelReason = customerCancelReasons[(seed + 1) % customerCancelReasons.length];
          previousStatus = "pending_payment";
        } else {
          cancelledBy = "shop";
          cancellationStatus = "approved";
          cancelReason = shopCancelReasons[seed % shopCancelReasons.length];
          cancelNote = i === 2 ? "ทางร้านขออภัยในความไม่สะดวก สินค้านี้กำลังเข้าใหม่" : undefined;
        }
      }

      // Reviews: most shipped orders have reviews (with full per-item review data)
      let reviewScore: number | undefined;
      let review: OrderReview | undefined;
      if (status === "shipped" && seed % 4 !== 0) {
        const reviewer = reviewerProfiles[seed % reviewerProfiles.length];
        const itemReviews: ItemReview[] = items.map((_, k) => {
          const r = 3 + ((seed + k * 3) % 3); // 3-5
          const photoCount = (seed + k) % 3; // 0, 1, or 2 photos
          return {
            itemIndex: k,
            rating: r,
            comment: reviewComments[(seed + k) % reviewComments.length],
            images: Array.from({ length: photoCount }, (_, p) => reviewPhotoBank[(seed + k + p * 2) % reviewPhotoBank.length]),
          };
        });
        const shopRating = Math.round(itemReviews.reduce((s, r) => s + r.rating, 0) / itemReviews.length);
        reviewScore = shopRating; // overall = avg of per-item ratings
        // Reviewed a few days after shipped
        const reviewDay = Math.min(28, day + 3);
        const reviewHr = String(10 + (seed % 9)).padStart(2, "0");
        const reviewMn = String((seed * 11) % 60).padStart(2, "0");
        review = {
          reviewerName: reviewer.name,
          reviewerAvatar: reviewer.avatar,
          reviewedAt: `${reviewDay} ก.พ. 2569 - ${reviewHr}:${reviewMn} น.`,
          shopRating,
          itemReviews,
        };
      }

      result.push({
        id: `ORD-202602${String(day).padStart(2, "0")}-${String(seq).padStart(5, "0")}`,
        status,
        date: `${day} ก.พ. 2569 - ${hr}:${mn} น.`,
        customer: cust.name,
        phone: cust.phone,
        address: cust.address,
        total,
        items,
        shippingMethod,
        paymentMethod,
        trackingNumber: status === "shipping" || status === "shipped" ? `TH${seed.toString().padStart(10, "0")}` : undefined,
        reviewScore,
        review,
        note: seed % 4 === 0 ? customerNotes[seed % customerNotes.length] : undefined,
        cancelledBy,
        cancelReason,
        cancelNote,
        cancellationStatus,
        previousStatus,
      });
    }
  });
  return result;
};

const mockOrders: Order[] = buildOrders();

const countByStatus = (status: OrderFilterTab) =>
  status === "all" ? mockOrders.length : mockOrders.filter((o) => o.status === status).length;

const orderTabs: { id: OrderFilterTab; label: string; count: number }[] = [
  { id: "all",             label: "ทั้งหมด",      count: countByStatus("all")             },
  { id: "pending_payment", label: "รอชำระเงิน",   count: countByStatus("pending_payment") },
  { id: "pending_verify",  label: "รอตรวจสอบ",   count: countByStatus("pending_verify")  },
  { id: "ready_ship",      label: "พร้อมจัดส่ง", count: countByStatus("ready_ship")      },
  { id: "shipping",        label: "กำลังจัดส่ง", count: countByStatus("shipping")        },
  { id: "shipped",         label: "ส่งสำเร็จ",    count: countByStatus("shipped")         },
  { id: "cancelled",       label: "ยกเลิก",       count: countByStatus("cancelled")       },
];

/* ========== SIDEBAR ========== */
const childIconMap: Record<string, any> = { products: Package, flash_sale: Zap, promotions: Megaphone, coupons: Ticket, report_sales: TrendingUp, report_customers: Users, report_products: ShoppingBag, report_market: BarChart2 };

const sidebarActiveStyle = { backgroundImage: "linear-gradient(90deg, rgba(49,151,84,0.1) 0%, rgba(49,151,84,0.1) 100%), linear-gradient(90deg, #fff 0%, #fff 100%)" };

function MenuBtn({ isActive, icon: Icon, label, onClick, hasArrow, expanded, collapsed }: any) {
  return (
    <motion.button
      onClick={onClick}
      title={collapsed ? label : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={`flex items-center cursor-pointer transition-colors ${
        collapsed
          ? `mx-auto rounded-full p-1 ${isActive ? "bg-[#319754]/10 ring-1 ring-[#319754]/30" : "hover:bg-gray-50"}`
          : `w-full justify-between pl-2 ${hasArrow ? "pr-3" : "pr-2"} py-2 rounded-[200px] ${!isActive ? "bg-white hover:bg-gray-50" : ""}`
      }`}
      style={!collapsed && isActive ? sidebarActiveStyle : {}}
    >
      <div className={`flex items-center ${collapsed ? "" : "gap-2.5 flex-1 min-w-0"}`}>
        <div className={`size-[28px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? "bg-[#319754]" : "bg-[#f5f5f5]"}`}>
          <Icon className={`size-3 transition-colors ${isActive ? "text-white" : "text-black/85"}`} />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className={`${font} text-[14px] whitespace-nowrap overflow-hidden ${isActive ? "text-[#319754]" : "text-black"}`}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {hasArrow && !collapsed && (
        <motion.div animate={{ rotate: expanded ? 0 : -90 }} transition={{ type: "spring", stiffness: 380, damping: 28 }} className="shrink-0">
          <ChevronDown className="size-3 text-black" />
        </motion.div>
      )}
    </motion.button>
  );
}

function Sidebar({ active, onSelect, collapsed, onToggle }: { active: OwnerTab; onSelect: (t: OwnerTab) => void; collapsed: boolean; onToggle: () => void }) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ products: true, settings: false });
  const navigate = useNavigate();
  const toggle = (id: string) => setExpandedMenus((p) => ({ ...p, [id]: !p[id] }));

  const withTooltip = (label: string, node: React.ReactNode) => collapsed ? (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild><div>{node}</div></TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content side="right" sideOffset={12}
          className={`${font} bg-white text-gray-700 text-[12px] rounded-xl px-3 py-2 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[side=right]:slide-in-from-left-1`}
          style={{ fontWeight: 500 }}>
          {label}
          <TooltipPrimitive.Arrow className="fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  ) : node;

  return (
    <aside className={`flex flex-col shrink-0 p-4 h-full transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[282px]"}`}>
      <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center h-[77px] pr-0 ${collapsed ? "justify-end pl-2" : "justify-between pl-4"}`}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                key="header-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className={`${font} text-[16px] text-[#0a0a0a]`} style={{ fontWeight: 500 }}>ภาพรวม</motion.p>
            )}
          </AnimatePresence>
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="backdrop-blur-[2px] bg-white/50 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-l-full size-[24px] flex items-center justify-center cursor-pointer shrink-0">
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}>
              <ChevronLeft className="size-3 text-[#999]" />
            </motion.div>
          </motion.button>
        </div>

        {/* Menu */}
        <TooltipPrimitive.Provider delayDuration={120}>
        <motion.nav
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
          className={`flex-1 pb-4 space-y-2.5 overflow-y-auto ${collapsed ? "px-2" : "px-4"}`}>
          {sidebarItems.map((item) =>
            !item.children ? (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }}>
                {withTooltip(item.label,
                  <MenuBtn isActive={active === item.id} icon={item.icon} label={item.label} onClick={() => onSelect(item.id)} collapsed={collapsed} />
                )}
              </motion.div>
            ) : (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }} className="space-y-2.5">
                {collapsed ? (
                  <HoverCard openDelay={80} closeDelay={120}>
                    <HoverCardTrigger asChild>
                      <div>
                        <MenuBtn icon={item.icon} label={item.label} hasArrow={false} collapsed={collapsed}
                          onClick={() => { /* noop in collapsed: hover-only */ }} />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" align="start" sideOffset={12}
                      className="w-auto min-w-[200px] p-2.5 rounded-[16px] border-gray-100 bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
                      <p className={`${font} text-[11px] text-gray-400 px-2 pt-1 pb-2`} style={{ fontWeight: 500 }}>{item.label}</p>
                      <div className="space-y-1.5">
                        {item.children.map((child) => {
                          const isActive = active === child.id;
                          const Icon = childIconMap[child.id] || Package;
                          return (
                            <button key={child.id + child.label} onClick={() => onSelect(child.id)}
                              className={`w-full flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-[200px] cursor-pointer transition-colors ${isActive ? "bg-[#319754]/10" : "hover:bg-gray-50"}`}>
                              <div className={`size-[24px] rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-[#319754]" : "bg-[#f5f5f5]"}`}>
                                <Icon className={`size-3 ${isActive ? "text-white" : "text-black/85"}`} />
                              </div>
                              <span className={`${font} text-[13px] whitespace-nowrap ${isActive ? "text-[#319754]" : "text-black"}`} style={{ fontWeight: isActive ? 500 : 400 }}>{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <>
                    <MenuBtn icon={item.icon} label={item.label} onClick={() => toggle(item.id)} hasArrow expanded={expandedMenus[item.id]} collapsed={collapsed} />
                    <AnimatePresence initial={false}>
                      {expandedMenus[item.id] && (
                        <motion.div
                          key="submenu"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden">
                          <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
                            className="rounded-[16px] border border-[#f5f5f5] p-2.5 space-y-2.5">
                            {item.children.map((child) => (
                              <motion.div key={child.id + child.label} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.2 }}>
                                <MenuBtn isActive={active === child.id} icon={childIconMap[child.id] || Package} label={child.label} onClick={() => onSelect(child.id)} collapsed={collapsed} />
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            )
          )}

          {/* Complaints */}
          <motion.div variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }}>
            {withTooltip("การร้องเรียน",
              <MenuBtn isActive={active === "complaints" || active === "complaint_detail"} icon={AlertTriangle} label="การร้องเรียน" onClick={() => onSelect("complaints")} collapsed={collapsed} />
            )}
          </motion.div>

          {/* Finance */}
          <motion.div variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }}>
            {withTooltip("การเงิน",
              <MenuBtn isActive={active === "finance"} icon={Wallet} label="การเงิน" onClick={() => onSelect("finance")} collapsed={collapsed} />
            )}
          </motion.div>
        </motion.nav>
        </TooltipPrimitive.Provider>
      </div>
    </aside>
  );
}

/* ========== ORDER TAB CONTENT ========== */
// Status visual config — pill bg + status note tag (Figma)
const statusConfig: Record<OrderStatus, { label: string; pillBg: string; noteText: string; noteColor: string }> = {
  pending_payment: { label: "รอชำระเงิน",   pillBg: "#ff8d28", noteText: "ยังไม่ชำระเงิน",  noteColor: "#ff9500" },
  pending_verify:  { label: "รอตรวจสอบ",   pillBg: "#ff9500", noteText: "รอร้านตรวจสอบ",  noteColor: "#ff9500" },
  ready_ship:      { label: "พร้อมจัดส่ง", pillBg: "#007aff", noteText: "พร้อมส่งให้ลูกค้า", noteColor: "#007aff" },
  shipping:        { label: "กำลังจัดส่ง", pillBg: "#319754", noteText: "ระหว่างจัดส่ง",   noteColor: "#319754" },
  shipped:         { label: "ส่งสำเร็จ",    pillBg: "#10b981", noteText: "ส่งสำเร็จแล้ว",    noteColor: "#10b981" },
  cancelled:       { label: "ยกเลิก",       pillBg: "#ff3b30", noteText: "ยกเลิกแล้ว",       noteColor: "#ff3b30" },
};

function CancelOrderModal({ open, order, onClose, onConfirm }: {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: (reason: string, note: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [note, setNote] = useState("");

  // Reset state when opening for a new order
  useEffect(() => {
    if (open) { setSelectedReason(""); setNote(""); }
  }, [open, order?.id]);

  const isOther = selectedReason === "อื่นๆ (ระบุในหมายเหตุ)";
  const canSubmit = selectedReason && (!isOther || note.trim().length > 0);

  return (
    <AnimatePresence>
      {open && order && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-[#ff3b30]/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="size-5 text-[#ff3b30]" strokeWidth={2.4} />
                </div>
                <div className="flex-1">
                  <h3 className={`${font} text-[16px]`} style={{ fontWeight: 700 }}>ยกเลิกคำสั่งซื้อ</h3>
                  <p className={`${font} text-[12px] text-gray-500 mt-0.5`}>{order.id}</p>
                </div>
                <button onClick={onClose} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer shrink-0">
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <p className={`${font} text-[13px] text-black mb-3`} style={{ fontWeight: 500 }}>เลือกเหตุผลการยกเลิก <span className="text-[#ff3b30]">*</span></p>
              <div className="flex flex-col gap-2 mb-4">
                {CANCEL_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <button key={reason} type="button" onClick={() => setSelectedReason(reason)}
                      className={`${font} text-left text-[13px] px-4 py-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-[#319754]/10 border-[#319754] text-[#319754]"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      style={{ fontWeight: isSelected ? 500 : 400 }}>
                      <span className={`size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? "border-[#319754] bg-[#319754]" : "border-gray-300"
                      }`}>
                        {isSelected && <Check className="size-2.5 text-white" strokeWidth={3.5} />}
                      </span>
                      {reason}
                    </button>
                  );
                })}
              </div>

              <p className={`${font} text-[13px] text-black mb-2`} style={{ fontWeight: 500 }}>
                หมายเหตุเพิ่มเติม {isOther && <span className="text-[#ff3b30]">*</span>}
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isOther ? "กรุณาระบุเหตุผล..." : "ระบุรายละเอียดเพิ่มเติม (ไม่บังคับ)"}
                rows={3}
                className={`${font} bg-[#fafafa] w-full rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow resize-none mb-5`}
              />

              <div className="flex gap-2">
                <button onClick={onClose}
                  className={`${font} flex-1 h-11 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer text-[14px] transition-colors`}>
                  ปิด
                </button>
                <button
                  onClick={() => canSubmit && onConfirm(selectedReason, note.trim())}
                  disabled={!canSubmit}
                  className={`${font} flex-1 h-11 rounded-full bg-[#ff3b30] hover:bg-[#dc2626] disabled:bg-gray-300 disabled:cursor-not-allowed text-white cursor-pointer text-[14px] shadow-[0_2px_8px_rgba(255,59,48,0.25)] transition-colors`}
                  style={{ fontWeight: 600 }}>
                  ยืนยันยกเลิก
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OrderCard({ order, onUpdate, onShowDetail, onContact, onBlock, onConfirmShip, onRequestCancel }: {
  order: Order;
  onUpdate: (id: string, patch: Partial<Order>) => void;
  onShowDetail: (id: string) => void;
  onContact: (id: string) => void;
  onBlock: (id: string) => void;
  onConfirmShip: (id: string) => void;
  onRequestCancel: (id: string) => void;
}) {
  const cfg = statusConfig[order.status];

  // Status-specific action button row
  const actions = (() => {
    const cancelBtn = (
      <button onClick={(e) => { e.stopPropagation(); onRequestCancel(order.id); }}
        className={`${font} border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/5 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors`}>
        ยกเลิก
      </button>
    );
    const contactBtn = (
      <button onClick={(e) => { e.stopPropagation(); onContact(order.id); }}
        className={`${font} border border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
        <MessageCircle className="size-3.5" />
        ติดต่อลูกค้า
      </button>
    );
    switch (order.status) {
      case "pending_payment":
        return cancelBtn;
      case "pending_verify":
        return (
          <>
            {contactBtn}
            {cancelBtn}
            <button onClick={(e) => { e.stopPropagation(); onUpdate(order.id, { status: "ready_ship" }); toast.success("เปลี่ยนสถานะเป็นพร้อมจัดส่ง"); }}
              className={`${font} bg-[#319754] hover:bg-[#287745] text-white h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}>
              พร้อมจัดส่ง
              <ArrowRightCircle className="size-4" />
            </button>
          </>
        );
      case "ready_ship":
        return (
          <>
            {contactBtn}
            <button onClick={(e) => { e.stopPropagation(); onConfirmShip(order.id); }}
              className={`${font} bg-[#319754] hover:bg-[#287745] text-white h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}>
              <Truck className="size-4" />
              ยืนยันการจัดส่ง
            </button>
          </>
        );
      case "shipping":
        return contactBtn;
      case "shipped":
        return (
          <>
            {contactBtn}
            {order.reviewScore && (
              <button onClick={(e) => { e.stopPropagation(); toast.info(`ลูกค้าให้คะแนน ${order.reviewScore} ดาว`); }}
                className={`${font} border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/5 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
                <Star className="size-3.5" fill="#f59e0b" />
                ดูคะแนน {order.reviewScore}/5
              </button>
            )}
          </>
        );
      case "cancelled":
        return (
          <button onClick={(e) => { e.stopPropagation(); onBlock(order.id); }}
            className={`${font} border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/5 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
            <Ban className="size-3.5" />
            บล็อกลูกค้า
          </button>
        );
    }
  })();

  return (
    <div onClick={() => onShowDetail(order.id)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all">
      {/* Header: order id + status pill | date + arrow */}
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{order.id}</span>
            <span className={`${font} text-[12px] text-white px-4 py-1 rounded-full whitespace-nowrap`}
              style={{ backgroundColor: cfg.pillBg, fontWeight: 500 }}>
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`${font} text-[12px] text-[#8e8e93]`}>{order.date}</span>
            <ChevronRight className="size-4 text-[#8e8e93] group-hover:text-[#319754] group-hover:translate-x-0.5 transition-all" strokeWidth={2.4} />
          </div>
        </div>
        <div className="h-px bg-gray-200 w-full" />
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-2.5 p-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="size-[70px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
              <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
              <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{item.name}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`${font} text-[12px] text-black`}>{item.option}</span>
                  <span className={`${font} bg-[#f5f5f5] text-[#262626] text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap`} style={{ fontWeight: 500 }}>
                    จำนวน {item.qty} ชิ้น
                  </span>
                </div>
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>฿{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping info — clean delivery slip layout */}
      <div className="px-4">
        <div className="bg-[#fafbfc] border border-gray-100 rounded-2xl overflow-hidden">
          {/* Top bar: shipping method + tracking */}
          <div className="flex items-center gap-2 flex-wrap px-4 py-2.5 bg-white/60 border-b border-gray-100">
            <span className={`${font} bg-[#319754]/10 text-[#319754] text-[11px] pl-2 pr-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1.5`} style={{ fontWeight: 600 }}>
              {order.shippingMethod === "รับที่ร้าน"
                ? <Store className="size-3" strokeWidth={2.4} />
                : <Truck className="size-3" strokeWidth={2.4} />}
              {order.shippingMethod}
            </span>
            {order.trackingNumber && (
              <span className={`${font} text-[11px] text-gray-500 inline-flex items-center gap-1 ml-auto`}>
                <Package className="size-3" />
                <span className="tabular-nums" style={{ fontWeight: 500 }}>{order.trackingNumber}</span>
              </span>
            )}
          </div>

          {/* Body: recipient + address */}
          <div className="p-4 flex flex-col gap-3">
            {/* Recipient row */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                <UserIcon className="size-4 text-[#319754]" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className={`${font} text-[15px] text-black leading-tight`} style={{ fontWeight: 600 }}>{order.customer}</span>
                <span className={`${font} text-[12px] text-gray-500 tabular-nums mt-0.5`}>{order.phone}</span>
              </div>
            </div>

            {/* Address row */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-[#319754]" strokeWidth={2.2} />
              </div>
              <p className={`${font} text-[13px] text-gray-700 leading-relaxed flex-1 min-w-0`}>{order.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: total + status note | action buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className={`${font} text-[14px] text-[#8e8e93]`} style={{ fontWeight: 500 }}>รวมการสั่งซื้อ:</span>
            <span className={`${font} text-[20px] text-[#ff383c] tabular-nums`} style={{ fontWeight: 500 }}>
              ฿{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-[12px]`}
            style={{ backgroundColor: `${cfg.noteColor}1a`, color: cfg.noteColor }}>
            <AlertCircle className="size-3.5" fill={cfg.noteColor} stroke="white" strokeWidth={2.5} />
            {cfg.noteText}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ initialFilter = "all", orders, onUpdate, onOpenDetail }: {
  initialFilter?: OrderFilterTab;
  orders: Order[];
  onUpdate: (id: string, patch: Partial<Order>) => void;
  onOpenDetail: (id: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<OrderFilterTab>(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [shipModalOrderId, setShipModalOrderId] = useState<string | null>(null);
  const [shipTrackingInput, setShipTrackingInput] = useState("");
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);

  const handleConfirmShip = (id: string) => {
    setShipModalOrderId(id);
    setShipTrackingInput("");
  };

  const handleRequestCancel = (id: string) => {
    setCancelModalOrderId(id);
  };

  const handleConfirmCancel = (reason: string, note: string) => {
    if (!cancelModalOrderId) return;
    onUpdate(cancelModalOrderId, { status: "cancelled", cancelReason: reason, cancelNote: note || undefined, cancelledBy: "shop", cancellationStatus: "approved" });
    toast.success(`ยกเลิกคำสั่งซื้อแล้ว — เหตุผล: ${reason}`);
    setCancelModalOrderId(null);
  };

  const submitShip = () => {
    if (!shipModalOrderId || !shipTrackingInput.trim()) return;
    onUpdate(shipModalOrderId, { status: "shipping", trackingNumber: shipTrackingInput.trim() });
    toast.success("อัปเดตสถานะการจัดส่งเรียบร้อย — ลูกค้าจะติดตามพัสดุได้");
    setShipModalOrderId(null);
  };

  const handleContact = (id: string) => {
    const o = orders.find((x) => x.id === id);
    if (o) toast.info(`เปิดแชทกับ ${o.customer} (${o.phone})`);
  };

  const handleBlock = (id: string) => {
    const o = orders.find((x) => x.id === id);
    if (o && confirm(`บล็อกลูกค้า ${o.customer}? ลูกค้าจะไม่สามารถสั่งซื้อจากร้านได้อีก`)) {
      toast.success(`บล็อก ${o.customer} เรียบร้อย`);
    }
  };

  const shipOrder = orders.find((o) => o.id === shipModalOrderId) || null;
  const cancelOrder = orders.find((o) => o.id === cancelModalOrderId) || null;

  // Counts derived from current orders state so tabs stay in sync after status updates
  const liveCounts = (status: OrderFilterTab) =>
    status === "all" ? orders.length : orders.filter((o) => o.status === status).length;
  const liveTabs = orderTabs.map((t) => ({ ...t, count: liveCounts(t.id) }));

  return (
    <div>
      <h2 className={`${font} text-[22px] mb-6`} style={{ fontWeight: 600 }}>จัดการคำสั่งซื้อ</h2>

      {/* Filter tabs + search (in one pill) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-2 mb-6 flex items-center gap-2">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0">
        {(() => {
          // All icons share the brand green; all count badges share red — uniform look across tabs
          const ICON_COLOR = "#319754";
          const ICON_BG = "#d6eadd";
          const BADGE_COLOR = "#ff3b30";
          const tabStyle: Record<string, { Icon: any }> = {
            all:             { Icon: ClipboardList },
            pending_payment: { Icon: Wallet         },
            pending_verify:  { Icon: ScanSearch     },
            ready_ship:      { Icon: Package        },
            shipping:        { Icon: Truck          },
            shipped:         { Icon: PackageCheck   },
            cancelled:       { Icon: PackageX       },
          };
          return liveTabs.map((tab) => {
          const isAct = activeFilter === tab.id;
          const { Icon } = tabStyle[tab.id];
          const color = ICON_COLOR;
          const bg = ICON_BG;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              whileTap={{ scale: 0.94 }}
              whileHover={!isAct ? { scale: 1.04 } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${
                !isAct ? "hover:bg-gray-50" : ""
              }`}
            >
              {/* Sliding green pill (active background) */}
              {isAct && (
                <motion.span
                  layoutId="orderTabActivePill"
                  className="absolute inset-0 bg-[#319754] shadow-[0_2px_8px_rgba(49,151,84,0.25)] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <motion.span
                layout
                className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : bg }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="size-[14px]" style={{ color: isAct ? "#fff" : color }} strokeWidth={2.2} />
              </motion.span>
              <span
                className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}
              >
                {tab.label}
              </span>
              <motion.span
                layout
                className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                style={{
                  backgroundColor: isAct ? "rgba(255,255,255,0.25)" : BADGE_COLOR,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                <motion.span
                  key={tab.count}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {tab.count}
                </motion.span>
              </motion.span>
            </motion.button>
          );
        });
        })()}
        </div>
        {/* Search (inside same pill, aligned right) */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] w-[260px] shrink-0 ml-auto">
          <input
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาเลขคำสั่งซื้อ, ชื่อลูกค้า...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>
      {/* Order cards — filtered by active tab + search */}
      {(() => {
        const q = searchQuery.trim().toLowerCase();
        const visible = orders.filter((o) => {
          if (activeFilter !== "all" && o.status !== activeFilter) return false;
          if (!q) return true;
          return (
            o.id.toLowerCase().includes(q) ||
            o.customer.toLowerCase().includes(q) ||
            o.items.some((it) => it.name.toLowerCase().includes(q))
          );
        });
        if (visible.length === 0) {
          return (
            <div className="bg-white rounded-xl border border-gray-100 py-16 flex flex-col items-center justify-center gap-2">
              <ClipboardList className="size-10 text-gray-300" strokeWidth={1.5} />
              <p className={`${font} text-[14px] text-gray-400`}>ไม่มีคำสั่งซื้อในสถานะนี้</p>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {visible.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdate={onUpdate}
                onShowDetail={onOpenDetail}
                onContact={handleContact}
                onBlock={handleBlock}
                onConfirmShip={handleConfirmShip}
                onRequestCancel={handleRequestCancel}
              />
            ))}
          </div>
        );
      })()}

      {/* Ship-confirm modal */}
      <AnimatePresence>
        {shipOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShipModalOrderId(null)}>
            <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }}
              className="bg-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`${font} text-[18px]`} style={{ fontWeight: 700 }}>ยืนยันการจัดส่ง</h3>
                <button onClick={() => setShipModalOrderId(null)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className={`${font} text-[12px] text-gray-500`}>คำสั่งซื้อ</p>
                <p className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>{shipOrder.id}</p>
                <p className={`${font} text-[12px] text-gray-500 mt-2`}>ผู้รับ</p>
                <p className={`${font} text-[14px]`}>{shipOrder.customer} · {shipOrder.phone}</p>
                <p className={`${font} text-[12px] text-gray-500 mt-2`}>วิธีจัดส่ง</p>
                <p className={`${font} text-[14px]`}>{shipOrder.shippingMethod}</p>
                <p className={`${font} text-[12px] text-gray-500 mt-2`}>ที่อยู่</p>
                <p className={`${font} text-[13px]`}>{shipOrder.address}</p>
              </div>
              <label className={`${font} text-[13px] text-black block mb-2`} style={{ fontWeight: 500 }}>หมายเลขพัสดุ <span className="text-[#ff3b30]">*</span></label>
              <input
                value={shipTrackingInput}
                onChange={(e) => setShipTrackingInput(e.target.value)}
                placeholder="เช่น TH1234567890"
                className={`${font} bg-[#fafafa] h-11 w-full rounded-full px-4 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow mb-4`}
              />
              <p className={`${font} text-[11px] text-gray-500 mb-5`}>
                ลูกค้าจะได้รับแจ้งเตือนเพื่อติดตามพัสดุ และสถานะออเดอร์จะเปลี่ยนเป็น "กำลังจัดส่ง"
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShipModalOrderId(null)}
                  className={`${font} flex-1 h-11 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer text-[14px] transition-colors`}>
                  ยกเลิก
                </button>
                <button onClick={submitShip} disabled={!shipTrackingInput.trim()}
                  className={`${font} flex-1 h-11 rounded-full bg-[#319754] hover:bg-[#287745] disabled:bg-gray-300 disabled:cursor-not-allowed text-white cursor-pointer text-[14px] shadow-[0_2px_8px_rgba(49,151,84,0.25)] transition-colors`}
                  style={{ fontWeight: 600 }}>
                  ยืนยันการจัดส่ง
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel order modal — reason + note */}
      <CancelOrderModal
        open={!!cancelOrder}
        order={cancelOrder}
        onClose={() => setCancelModalOrderId(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}

/* ========== REVIEW MODAL ========== */
function StarRow({ rating, size = 4 }: { rating: number; size?: 3 | 4 | 5 }) {
  const sizeClass = size === 3 ? "size-3" : size === 5 ? "size-5" : "size-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= rating;
        return (
          <Star key={n} className={`${sizeClass} ${filled ? "text-[#f59e0b]" : "text-gray-300"}`}
            fill={filled ? "#f59e0b" : "transparent"} strokeWidth={1.8} />
        );
      })}
    </div>
  );
}

function ReviewModal({ open, order, onClose }: { open: boolean; order: Order | null; onClose: () => void }) {
  if (!order || !order.review) return null;
  const review = order.review;

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100 z-10">
              <div>
                <h3 className={`${font} text-[18px]`} style={{ fontWeight: 700 }}>รีวิวคำสั่งซื้อ</h3>
                <p className={`${font} text-[12px] text-gray-500 mt-0.5`}>{order.id}</p>
              </div>
              <button onClick={onClose} className="size-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Reviewer profile + date */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                <div className="size-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <ImageWithFallback src={review.reviewerAvatar} alt={review.reviewerName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>{review.reviewerName}</p>
                  <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>รีวิวเมื่อ {review.reviewedAt}</p>
                </div>
              </div>

              {/* Shop rating */}
              <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                    <Store className="size-5 text-[#319754]" />
                  </div>
                  <div>
                    <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>คะแนนร้านค้า</p>
                    <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>โดยรวมจากออเดอร์นี้</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRow rating={review.shopRating} size={5} />
                  <span className={`${font} text-[16px] text-[#f59e0b] tabular-nums`} style={{ fontWeight: 700 }}>{review.shopRating}.0</span>
                </div>
              </div>

              {/* Per-item reviews */}
              <div>
                <p className={`${font} text-[13px] text-gray-500 mb-2`} style={{ fontWeight: 500 }}>
                  รีวิวสินค้า ({review.itemReviews.length} รายการ)
                </p>
                <div className="flex flex-col gap-3">
                  {review.itemReviews.map((ir) => {
                    const item = order.items[ir.itemIndex];
                    if (!item) return null;
                    return (
                      <div key={ir.itemIndex} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                        {/* Product info */}
                        <div className="flex items-start gap-3">
                          <div className="size-[60px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{item.name}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`${font} text-[12px] text-gray-600`}>{item.option}</span>
                              <span className={`${font} bg-[#f5f5f5] text-[#262626] text-[10px] px-2 py-0.5 rounded-full`} style={{ fontWeight: 500 }}>
                                จำนวน {item.qty} ชิ้น
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <StarRow rating={ir.rating} size={4} />
                          <span className={`${font} text-[13px] text-[#f59e0b] tabular-nums`} style={{ fontWeight: 600 }}>{ir.rating}.0</span>
                        </div>

                        {/* Comment */}
                        {ir.comment && (
                          <p className={`${font} text-[13px] text-gray-700 leading-relaxed`}>{ir.comment}</p>
                        )}

                        {/* Review photos */}
                        {ir.images.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {ir.images.map((img, i) => (
                              <a key={i} href={img} target="_blank" rel="noopener noreferrer"
                                className="size-[80px] rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
                                <ImageWithFallback src={img} alt={`review-${i}`} className="w-full h-full object-cover" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========== ORDER DETAIL TAB (subpage) ========== */
function OrderDetailTab({ order, onBack, onUpdate }: {
  order: Order | null;
  onBack: () => void;
  onUpdate: (id: string, patch: Partial<Order>) => void;
}) {
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [shipTrackingInput, setShipTrackingInput] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  if (!order) {
    return (
      <div>
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors mb-4`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center justify-center gap-2">
          <ClipboardList className="size-10 text-gray-300" strokeWidth={1.5} />
          <p className={`${font} text-[14px] text-gray-400`}>ไม่พบคำสั่งซื้อ</p>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[order.status];

  const handleCancel = () => setCancelModalOpen(true);
  const handleConfirmCancel = (reason: string, note: string) => {
    onUpdate(order.id, { status: "cancelled", cancelReason: reason, cancelNote: note || undefined, cancelledBy: "shop", cancellationStatus: "approved" });
    toast.success(`ยกเลิกคำสั่งซื้อแล้ว — เหตุผล: ${reason}`);
    setCancelModalOpen(false);
  };
  const handleApproveCancel = () => {
    onUpdate(order.id, { cancellationStatus: "approved" });
    toast.success("ยินยอมการยกเลิก — คำสั่งซื้อถูกยกเลิกเรียบร้อย");
  };
  const handleDenyCancel = () => {
    if (confirm("ไม่ยินยอมให้ลูกค้ายกเลิก? ออเดอร์จะกลับสู่สถานะเดิมและลูกค้าจะไม่สามารถยกเลิกได้อีก")) {
      const revertTo = order.previousStatus ?? "pending_verify";
      onUpdate(order.id, {
        status: revertTo,
        cancellationStatus: "denied",
      });
      toast.success(`ไม่ยินยอม — ออเดอร์กลับสู่สถานะ "${statusConfig[revertTo].label}"`);
    }
  };
  const handleContact = () => toast.info(`เปิดแชทกับ ${order.customer} (${order.phone})`);
  const handleBlock = () => {
    if (confirm(`บล็อกลูกค้า ${order.customer}? ลูกค้าจะไม่สามารถสั่งซื้อจากร้านได้อีก`)) {
      toast.success(`บล็อก ${order.customer} เรียบร้อย`);
    }
  };
  const submitShip = () => {
    if (!shipTrackingInput.trim()) return;
    onUpdate(order.id, { status: "shipping", trackingNumber: shipTrackingInput.trim() });
    toast.success("อัปเดตสถานะการจัดส่งเรียบร้อย — ลูกค้าจะติดตามพัสดุได้");
    setShipModalOpen(false);
  };

  // Payment status (derived from order.status)
  const paymentPaid = order.status !== "pending_payment";
  const paymentNote = paymentPaid
    ? { text: "ชำระเงินแล้ว", color: "#319754" }
    : { text: "ยังไม่ชำระเงิน", color: "#ff9500" };

  return (
    <div>
      {/* Top bar: back + date inline */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
        <span className={`${font} text-[12px] text-[#8e8e93]`}>{order.date}</span>
      </div>

      {/* Title row: order id + status pill */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <h2 className={`${font} text-[20px] text-black leading-[30px]`} style={{ fontWeight: 500 }}>{order.id}</h2>
        <span className={`${font} text-[12px] text-white px-4 py-1 rounded-full whitespace-nowrap`}
          style={{ backgroundColor: cfg.pillBg, fontWeight: 500 }}>
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: items + payment info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Items card with header + divider */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex flex-col gap-4 pt-4 px-4">
              <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>รายการสินค้า</h3>
              <div className="h-px bg-gray-200 w-full" />
            </div>
            <div className="flex flex-col gap-2.5 p-4">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="size-[70px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <ImageWithFallback src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
                    <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{it.name}</p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${font} text-[12px] text-black`}>{it.option}</span>
                        <span className={`${font} bg-[#f5f5f5] text-[#262626] text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap`} style={{ fontWeight: 500 }}>
                          จำนวน {it.qty} ชิ้น
                        </span>
                      </div>
                      <span className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 600 }}>
                        ฿{it.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4">
              <span className={`${font} text-[14px] text-[#8e8e93]`} style={{ fontWeight: 500 }}>รวมการสั่งซื้อ:</span>
              <span className={`${font} text-[20px] text-[#ff383c] tabular-nums`} style={{ fontWeight: 500 }}>
                ฿{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Payment info card */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex flex-col gap-4 pt-4 px-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลการชำระเงิน</h3>
                <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-[12px]`}
                  style={{ backgroundColor: `${paymentNote.color}1a`, color: paymentNote.color }}>
                  <AlertCircle className="size-3.5" fill={paymentNote.color} stroke="white" strokeWidth={2.5} />
                  {paymentNote.text}
                </span>
              </div>
              <div className="h-px bg-gray-200 w-full" />
            </div>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`${font} text-[14px] text-black`}>วิธีชำระเงิน:</span>
                <span className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`${font} text-[14px] text-black`}>สถานะการชำระเงิน:</span>
                <span className={`${font} text-[12px] text-white px-4 py-1 rounded-full whitespace-nowrap`}
                  style={{ backgroundColor: paymentPaid ? "#319754" : "#ff8d28", fontWeight: 500 }}>
                  {paymentPaid ? "ชำระแล้ว" : "รอชำระเงิน"}
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation card — only when cancelled (replaces stepper) */}
          {order.status === "cancelled" && (() => {
            const byCustomer = order.cancelledBy === "customer";
            const byLabel = byCustomer ? "ลูกค้าเป็นผู้ยกเลิก" : "ร้านค้ายกเลิก";
            const ByIcon = byCustomer ? UserIcon : Store;
            const isPending = order.cancellationStatus === "pending";
            return (
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="flex flex-col gap-4 pt-4 px-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>การยกเลิกคำสั่งซื้อ</h3>
                    {isPending ? (
                      <span className={`${font} text-[12px] text-white px-3 py-0.5 rounded-full bg-[#ff9500] inline-flex items-center gap-1.5`} style={{ fontWeight: 500 }}>
                        <Clock className="size-3" />
                        รอร้านค้าอนุมัติ
                      </span>
                    ) : (
                      <span className={`${font} text-[12px] text-white px-3 py-0.5 rounded-full bg-[#ff3b30]`} style={{ fontWeight: 500 }}>ยกเลิกแล้ว</span>
                    )}
                  </div>
                  <div className="h-px bg-gray-200 w-full" />
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`size-10 rounded-full ${isPending ? "bg-[#ff9500]/10" : "bg-[#ff3b30]/10"} flex items-center justify-center shrink-0`}>
                      {isPending
                        ? <AlertCircle className="size-5 text-[#ff9500]" strokeWidth={2.4} />
                        : <X className="size-5 text-[#ff3b30]" strokeWidth={2.6} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[14px] ${isPending ? "text-[#ff9500]" : "text-[#ff3b30]"}`} style={{ fontWeight: 600 }}>
                        {isPending ? "ลูกค้าขอยกเลิกคำสั่งซื้อ — รอร้านค้าตัดสินใจ" : "คำสั่งซื้อนี้ถูกยกเลิก"}
                      </p>
                      <p className={`${font} text-[12px] text-gray-500 mt-0.5`}>{order.date}</p>
                    </div>
                  </div>

                  {/* Who cancelled */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`${font} text-[11px] text-[#8e8e93] uppercase tracking-wider`} style={{ fontWeight: 600 }}>ยกเลิกโดย</span>
                    <span className={`${font} inline-flex items-center gap-1.5 text-[12px] px-3 py-1 rounded-full whitespace-nowrap ${
                      byCustomer ? "bg-[#3b82f6]/10 text-[#3b82f6]" : "bg-[#ff9500]/10 text-[#ff9500]"
                    }`} style={{ fontWeight: 600 }}>
                      <ByIcon className="size-3" strokeWidth={2.4} />
                      {byLabel}
                    </span>
                  </div>

                  <div className={`flex flex-col gap-2 rounded-xl p-3.5 ${
                    isPending ? "bg-[#fff7ed] border border-[#fed7aa]" : "bg-[#fef2f2] border border-[#fecaca]"
                  }`}>
                    <div>
                      <p className={`${font} text-[11px] text-[#8e8e93] uppercase tracking-wider`} style={{ fontWeight: 600 }}>เหตุผลที่ยกเลิก</p>
                      <p className={`${font} text-[14px] text-[#101828] mt-1`} style={{ fontWeight: 500 }}>
                        {order.cancelReason || "—"}
                      </p>
                    </div>
                    {order.cancelNote && (
                      <div className={`pt-2 border-t ${isPending ? "border-[#fed7aa]" : "border-[#fecaca]"}`}>
                        <p className={`${font} text-[11px] text-[#8e8e93] uppercase tracking-wider`} style={{ fontWeight: 600 }}>หมายเหตุเพิ่มเติม</p>
                        <p className={`${font} text-[13px] text-[#101828] mt-1 leading-relaxed`}>{order.cancelNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Approve / Deny buttons — only for customer-cancelled, pending state */}
                  {isPending && (
                    <div className="flex gap-2 pt-1 justify-end flex-wrap">
                      <button onClick={handleDenyCancel}
                        className={`${font} h-9 px-4 rounded-full border border-[#319754] text-[#319754] hover:bg-[#319754]/5 cursor-pointer text-[13px] transition-colors inline-flex items-center justify-center gap-1.5`}
                        style={{ fontWeight: 500 }}>
                        <X className="size-3.5" strokeWidth={2.4} />
                        ไม่ยินยอม
                      </button>
                      <button onClick={handleApproveCancel}
                        className={`${font} h-9 px-4 rounded-full bg-[#ff3b30] hover:bg-[#dc2626] text-white cursor-pointer text-[13px] shadow-[0_2px_8px_rgba(255,59,48,0.25)] transition-colors inline-flex items-center justify-center gap-1.5`}
                        style={{ fontWeight: 600 }}>
                        <Check className="size-3.5" strokeWidth={2.6} />
                        ยินยอมยกเลิก
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Shipping progress — vertical timeline stepper (Figma style) */}
          {order.status !== "cancelled" && (() => {
            const steps = [
              { label: "คำสั่งซื้อ" },
              { label: "รอการชำระ" },
              { label: "ตรวจสอบการชำระ" },
              { label: "กำลังจัดเตรียม" },
              { label: "กำลังจัดส่ง" },
              { label: "จัดส่งสำเร็จ" },
            ];
            const stepMap: Partial<Record<OrderStatus, number>> = {
              pending_payment: 1,
              pending_verify:  2,
              ready_ship:      3,
              shipping:        4,
              shipped:         6, // beyond last → all done
            };
            const currentStep = stepMap[order.status] ?? 0;
            const accent = "#319754";

            return (
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="flex flex-col gap-4 pt-4 px-4">
                  <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>สถานะการจัดส่ง</h3>
                  <div className="h-px bg-gray-200 w-full" />
                </div>
                <div className="px-6 py-4">
                  {steps.map((s, i) => {
                    const done = i < currentStep;
                    const current = i === currentStep;
                    const isLast = i === steps.length - 1;
                    return (
                      <div key={s.label} className="flex gap-4 items-stretch">
                        <div className="flex flex-col items-center shrink-0 w-6">
                          <motion.div
                            initial={false}
                            animate={current ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                            transition={current ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                            className={`size-6 rounded-full flex items-center justify-center text-[12px] shrink-0 transition-all duration-300 ${
                              done    ? "bg-[#319754] text-white shadow-[0_2px_6px_rgba(49,151,84,0.25)]"
                              : current ? `bg-white border-2`
                              :           "bg-white border-2 border-gray-300 text-gray-400"
                            }`}
                            style={current ? { borderColor: accent, color: accent, boxShadow: `0 0 0 4px ${accent}1a` } : {}}
                          >
                            <span style={{ fontWeight: 700 }}>{i + 1}</span>
                          </motion.div>
                          {!isLast && (
                            <div className={`flex-1 w-0.5 my-1 transition-colors duration-300 ${
                              done ? "bg-[#319754]" : "bg-gray-200"
                            }`} style={{ minHeight: 32 }} />
                          )}
                        </div>
                        <div className={`flex flex-col gap-1 ${isLast ? "pb-0" : "pb-5"} pt-0.5 flex-1 min-w-0`}>
                          <p className={`${font} text-[14px] transition-colors duration-300 ${
                            done    ? "text-[#319754]"
                            : current ? ""
                            :           "text-gray-700"
                          }`} style={{ fontWeight: done || current ? 600 : 500, color: current ? accent : undefined }}>
                            {s.label}
                          </p>
                          <p className={`${font} text-[12px] ${done || current ? "text-gray-700" : "text-gray-400"}`}>
                            {done || current ? order.date : "-"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Review (if exists) */}
          {order.reviewScore && (
            <button onClick={() => setReviewModalOpen(true)}
              className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-[#ffeed4] transition-colors text-left w-full">
              <Star className="size-6 text-[#f59e0b]" fill="#f59e0b" />
              <div className="flex-1">
                <p className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ลูกค้ารีวิวสินค้า {order.reviewScore}/5 ดาว</p>
                <p className={`${font} text-[12px] text-gray-600 mt-0.5`}>กดเพื่อดูคำวิจารณ์</p>
              </div>
              <ChevronRight className="size-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Right 1/3: shipping info + notes + actions */}
        <div className="bg-white rounded-2xl overflow-hidden self-start">
          {/* Header with divider */}
          <div className="flex flex-col gap-4 pt-4 px-4">
            <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลการจัดส่ง</h3>
            <div className="h-px bg-gray-200 w-full" />
          </div>

          {/* Shipping info — keep existing icon-row layout (user request) */}
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                <UserIcon className="size-4 text-[#319754]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>{order.customer}</p>
                <p className={`${font} text-[12px] text-gray-500 tabular-nums`}>{order.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                {order.shippingMethod === "รับที่ร้าน" ? <Store className="size-4 text-[#319754]" /> : <Truck className="size-4 text-[#319754]" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{order.shippingMethod}</p>
                {order.trackingNumber && (
                  <p className={`${font} text-[12px] text-[#319754] tabular-nums`} style={{ fontWeight: 500 }}>{order.trackingNumber}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-[#319754]" strokeWidth={2.2} />
              </div>
              <p className={`${font} text-[13px] text-gray-700 leading-relaxed flex-1 min-w-0`}>{order.address}</p>
            </div>
          </div>

          {/* Customer note (if any) */}
          {order.note && (
            <div className="px-4 pb-4">
              <div className="bg-[rgba(242,242,247,0.7)] rounded-2xl p-4">
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>หมายเหตุจากลูกค้า</p>
                <p className={`${font} text-[12px] text-black mt-1`}>{order.note}</p>
              </div>
            </div>
          )}

          {/* Action buttons — full width stacked */}
          <div className="flex flex-col gap-3 p-4">
            {(order.status === "pending_verify" || order.status === "ready_ship" || order.status === "shipping" || order.status === "shipped") && (
              <button onClick={handleContact}
                className={`${font} w-full border border-[#319754] text-[#319754] hover:bg-[#319754]/5 h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2`}
                style={{ fontWeight: 500 }}>
                <MessageCircle className="size-4" />
                ติดต่อลูกค้า
              </button>
            )}
            {order.status === "pending_verify" && (
              <>
                <button onClick={() => toast.success("กำลังเตรียมพิมพ์ใบปะหน้า...")}
                  className={`${font} w-full border border-[#319754] text-[#319754] hover:bg-[#319754]/5 h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2`}
                  style={{ fontWeight: 500 }}>
                  <Printer className="size-4" />
                  พิมพ์ใบปะหน้า
                </button>
                <button onClick={() => { onUpdate(order.id, { status: "ready_ship" }); toast.success("เปลี่ยนสถานะเป็นพร้อมจัดส่ง"); }}
                  className={`${font} w-full bg-[#319754] hover:bg-[#287745] text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`} style={{ fontWeight: 500 }}>
                  พร้อมจัดส่ง
                  <ArrowRightCircle className="size-4" />
                </button>
              </>
            )}
            {order.status === "ready_ship" && (
              <button onClick={() => { setShipModalOpen(true); setShipTrackingInput(""); }}
                className={`${font} w-full bg-[#319754] hover:bg-[#287745] text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`} style={{ fontWeight: 500 }}>
                <Truck className="size-4" />
                ยืนยันการจัดส่ง
              </button>
            )}
            {(order.status === "pending_payment" || order.status === "pending_verify") && (
              <button onClick={handleCancel}
                className={`${font} w-full border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/5 h-10 rounded-full text-[14px] cursor-pointer transition-colors`}
                style={{ fontWeight: 500 }}>
                ยกเลิกคำสั่งซื้อ
              </button>
            )}
            {order.status === "cancelled" && (
              <button onClick={handleBlock}
                className={`${font} w-full border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/5 h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2`}
                style={{ fontWeight: 500 }}>
                <Ban className="size-4" />
                บล็อกลูกค้า
              </button>
            )}
            {order.reviewScore && (
              <button onClick={() => setReviewModalOpen(true)}
                className={`${font} w-full border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/5 h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2`}
                style={{ fontWeight: 500 }}>
                <Star className="size-4" fill="#f59e0b" />
                ดูคะแนน {order.reviewScore}/5
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ship-confirm modal (reused inside detail tab) */}
      <AnimatePresence>
        {shipModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShipModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }}
              className="bg-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`${font} text-[18px]`} style={{ fontWeight: 700 }}>ยืนยันการจัดส่ง</h3>
                <button onClick={() => setShipModalOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className={`${font} text-[12px] text-gray-500`}>คำสั่งซื้อ</p>
                <p className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>{order.id}</p>
                <p className={`${font} text-[12px] text-gray-500 mt-2`}>ผู้รับ</p>
                <p className={`${font} text-[14px]`}>{order.customer} · {order.phone}</p>
                <p className={`${font} text-[12px] text-gray-500 mt-2`}>วิธีจัดส่ง</p>
                <p className={`${font} text-[14px]`}>{order.shippingMethod}</p>
                <p className={`${font} text-[12px] text-gray-500 mt-2`}>ที่อยู่</p>
                <p className={`${font} text-[13px]`}>{order.address}</p>
              </div>
              <label className={`${font} text-[13px] text-black block mb-2`} style={{ fontWeight: 500 }}>หมายเลขพัสดุ <span className="text-[#ff3b30]">*</span></label>
              <input
                value={shipTrackingInput}
                onChange={(e) => setShipTrackingInput(e.target.value)}
                placeholder="เช่น TH1234567890"
                className={`${font} bg-[#fafafa] h-11 w-full rounded-full px-4 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow mb-4`}
              />
              <p className={`${font} text-[11px] text-gray-500 mb-5`}>
                ลูกค้าจะได้รับแจ้งเตือนเพื่อติดตามพัสดุ และสถานะออเดอร์จะเปลี่ยนเป็น "กำลังจัดส่ง"
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShipModalOpen(false)}
                  className={`${font} flex-1 h-11 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer text-[14px] transition-colors`}>
                  ยกเลิก
                </button>
                <button onClick={submitShip} disabled={!shipTrackingInput.trim()}
                  className={`${font} flex-1 h-11 rounded-full bg-[#319754] hover:bg-[#287745] disabled:bg-gray-300 disabled:cursor-not-allowed text-white cursor-pointer text-[14px] shadow-[0_2px_8px_rgba(49,151,84,0.25)] transition-colors`}
                  style={{ fontWeight: 600 }}>
                  ยืนยันการจัดส่ง
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel order modal */}
      <CancelOrderModal
        open={cancelModalOpen}
        order={order}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      {/* Review modal */}
      <ReviewModal
        open={reviewModalOpen}
        order={order}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
}

/* ========== PRODUCTS TAB ========== */
function ProductsTab({ onAddProduct }: { onAddProduct: () => void }) {
  const [productFilter, setProductFilter] = useState("all");
  const [previewProduct, setPreviewProduct] = useState<typeof mockProducts[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Counts derived from data so tabs always match current inventory
  const counts = {
    all: mockProducts.length,
    active: mockProducts.filter((p) => p.status === "เปิดขาย").length,
    inactive: mockProducts.filter((p) => p.status === "ปิดขาย").length,
    out: mockProducts.filter((p) => p.status === "สินค้าหมด").length,
  };

  const productFilterTabs = [
    { id: "all",      label: "สินค้าทั้งหมด", count: counts.all },
    { id: "active",   label: "สินค้าเปิดขาย", count: counts.active },
    { id: "inactive", label: "สินค้าปิดขาย", count: counts.inactive },
    { id: "out",      label: "สินค้าหมด",     count: counts.out },
  ];

  const filteredProducts = mockProducts.filter((p) => {
    if (productFilter === "all") return true;
    if (productFilter === "active") return p.status === "เปิดขาย";
    if (productFilter === "inactive") return p.status === "ปิดขาย";
    if (productFilter === "out") return p.status === "สินค้าหมด";
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * perPage;
  const pageItems = filteredProducts.slice(pageStart, pageStart + perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>จัดการสินค้า</h2>
        <motion.button
          onClick={onAddProduct}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}
        >
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่มสินค้า</span>
        </motion.button>
      </div>

      {/* Filter tabs + search (in one pill) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-2 mb-6 flex items-center gap-2">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0">
          {(() => {
            // All icons share the brand green; all count badges share red — uniform look across tabs
            const ICON_COLOR = "#319754";
            const ICON_BG = "#d6eadd";
            const BADGE_COLOR = "#ff3b30";
            const tabStyle: Record<string, { Icon: any }> = {
              all:      { Icon: Package        },
              active:   { Icon: PackageCheck   },
              inactive: { Icon: EyeOff         },
              out:      { Icon: AlertTriangle  },
            };
            return productFilterTabs.map((tab) => {
              const isAct = productFilter === tab.id;
              const { Icon } = tabStyle[tab.id];
              const color = ICON_COLOR;
              const bg = ICON_BG;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => { setProductFilter(tab.id); setCurrentPage(1); }}
                  whileTap={{ scale: 0.94 }}
                  whileHover={!isAct ? { scale: 1.04 } : undefined}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${
                    !isAct ? "hover:bg-gray-50" : ""
                  }`}
                >
                  {isAct && (
                    <motion.span
                      layoutId="productTabActivePill"
                      className="absolute inset-0 bg-[#319754] shadow-[0_2px_8px_rgba(49,151,84,0.25)] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <motion.span
                    layout
                    className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                    style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : bg }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="size-[14px]" style={{ color: isAct ? "#fff" : color }} strokeWidth={2.2} />
                  </motion.span>
                  <span
                    className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                    style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}
                  >
                    {tab.label}
                  </span>
                  <motion.span
                    layout
                    className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                    style={{
                      backgroundColor: isAct ? "rgba(255,255,255,0.25)" : BADGE_COLOR,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    <motion.span
                      key={tab.count}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {tab.count}
                    </motion.span>
                  </motion.span>
                </motion.button>
              );
            });
          })()}
        </div>
        {/* Search (inside same pill, aligned right) */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] w-[260px] shrink-0 ml-auto">
          <input
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาสินค้าของคุณ...."
          />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Table — matches report style */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div>
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "72px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "6%" }} />
            </colgroup>
            <thead>
              <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                <th className="text-left pb-3 pr-0 pl-0" style={{ fontWeight: 500 }}>รูปภาพ</th>
                <th className="text-left pb-3 pr-4 pl-2" style={{ fontWeight: 500 }}>สินค้า</th>
                <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>หมวดหมู่</th>
                <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>ประเภท</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>ราคา</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>คงเหลือ</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
                <th className="text-center pb-3" style={{ fontWeight: 500 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบสินค้าในหมวดนี้</td>
                </tr>
              )}
              {pageItems.map((p) => {
                const stockMatch = p.stock.match(/^(\d[\d,]*)\s*(.*)$/);
                return (
                  <tr key={p.id} onDoubleClick={() => setPreviewProduct(p)}
                    title="ดับเบิลคลิกเพื่อดูตัวอย่างสินค้า"
                    className="group/row border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors cursor-pointer select-none">
                    {/* Image — zooms on row hover; greyed-out + overlay text for unavailable items */}
                    <td className="py-2 pr-0 pl-0 align-middle w-[64px]">
                      {(() => {
                        const isOut    = p.status === "สินค้าหมด";
                        const isClosed = p.status === "ปิดขาย";
                        const overlayText = isOut ? "หมด" : isClosed ? "ปิด" : null;
                        return (
                          <div className="relative size-[64px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] group-hover/row:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
                            <ImageWithFallback src={p.image} alt={p.name}
                              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover/row:scale-110 ${overlayText ? "grayscale opacity-60" : ""}`} />
                            {overlayText && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                                <span className={`${font} text-white text-[14px] tracking-wider`} style={{ fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                                  {overlayText}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    {/* Name + Flash/recommended pill below */}
                    <td className="py-2 pl-2 pr-4 align-middle">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }} title={p.name}>{p.name}</p>
                        {(p.flash || p.recommended) && (
                          <div className="flex flex-wrap gap-1">
                            {p.flash && (
                              <span className={`${font} inline-flex items-center gap-1 bg-[#e62e05] text-white pl-1.5 pr-2 py-0.5 rounded-full text-[10px]`} style={{ fontWeight: 500 }}>
                                <Zap className="size-2.5 fill-white" strokeWidth={0} /> Flash Sale
                              </span>
                            )}
                            {p.recommended && (
                              <span className={`${font} inline-flex items-center gap-1 bg-[#319754] text-white pl-1.5 pr-2 py-0.5 rounded-full text-[10px]`} style={{ fontWeight: 500 }}>
                                ★ แนะนำ
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Category */}
                    <td className={`py-2 pr-4 align-middle ${font} text-[14px] text-black truncate`} title={p.category}>{p.category}</td>
                    {/* Type pill (tinted) — 2 overlapping circles for "หลายตัวเลือก" */}
                    <td className="py-2 pr-4 align-middle">
                      <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3.5 py-0.5 rounded-full text-[14px]`}
                        style={{ backgroundColor: `${p.typeColor}1a`, color: p.typeColor }}>
                        {p.type === "หลายตัวเลือก" ? (
                          <span className="relative inline-block size-[14px] shrink-0">
                            <span className="absolute left-0 top-0 size-[10px] rounded-full" style={{ backgroundColor: p.typeColor }} />
                            <span className="absolute right-0 bottom-0 size-[10px] rounded-full ring-[1.5px]"
                              style={{ backgroundColor: p.typeColor, '--tw-ring-color': `${p.typeColor}1a` } as React.CSSProperties} />
                          </span>
                        ) : (
                          <span className="size-3 rounded-full inline-block" style={{ backgroundColor: p.typeColor }} />
                        )}
                        {p.type}
                      </span>
                    </td>
                    {/* Price */}
                    <td className={`py-2 pr-4 text-center align-middle ${font} text-[14px] text-[#319754] tabular-nums`} style={{ fontWeight: 500 }}>{p.price}</td>
                    {/* Stock — bold number + regular unit */}
                    <td className="py-2 pr-4 text-center align-middle">
                      {stockMatch ? (
                        <span className={`${font} text-[14px] text-black`}>
                          <span className="tabular-nums" style={{ fontWeight: 500 }}>{stockMatch[1]}</span> <span>{stockMatch[2]}</span>
                        </span>
                      ) : (
                        <span className={`${font} text-[14px] text-black`}>{p.stock}</span>
                      )}
                    </td>
                    {/* Status pill (tinted) */}
                    <td className="py-2 pr-4 text-center align-middle">
                      <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3.5 py-0.5 rounded-full text-[14px]`}
                        style={{ backgroundColor: `${p.statusColor}1a`, color: p.statusColor }}>
                        <Package className="size-3" strokeWidth={2.4} />
                        {p.status}
                      </span>
                    </td>
                    {/* More menu — button expands into a card on click */}
                    <td className="py-2 text-center align-middle">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={6}
                          className="w-[230px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                        >
                          <motion.div
                            initial={{ scale: 0.4, opacity: 0, y: -6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.4, opacity: 0, y: -6 }}
                            transition={{ type: "spring", stiffness: 380, damping: 26 }}
                            style={{ transformOrigin: "top right" }}
                            className="overflow-hidden"
                          >
                            {/* เปิดขาย toggle */}
                            {(() => {
                              const isOpen = p.status === "เปิดขาย";
                              return (
                                <button
                                  onClick={() => toast.success(isOpen ? `ปิดการแสดง: ${p.name}` : `เปิดการแสดง: ${p.name}`)}
                                  className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left`}>
                                  <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เปิดขาย</span>
                                  <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${isOpen ? "bg-[#319754]" : "bg-gray-300"}`}>
                                    <span className={`absolute size-4 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${isOpen ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                                  </span>
                                </button>
                              );
                            })()}
                            <div className="h-px bg-gray-100 my-1" />
                            {/* แก้ไข */}
                            <button
                              onClick={() => toast.info(`แก้ไขสินค้า: ${p.name}`)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>แก้ไข</span>
                            </button>
                            {/* จัดการสตอก */}
                            <button
                              onClick={() => toast.info(`จัดการสตอก: ${p.name}`)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Boxes className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>จัดการสตอกสินค้า</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            {/* ลบ */}
                            <button
                              onClick={() => { if (confirm(`ลบสินค้า "${p.name}"?`)) toast.success(`ลบ: ${p.name}`); }}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                              <Trash2 className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ลบ</span>
                            </button>
                          </motion.div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
          <div className="flex items-center gap-2">
            <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
            <div className="relative">
              <select
                className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)}
              aria-label="หน้าก่อน"
              className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
              <ChevronLeft className="size-4" strokeWidth={2.4} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                style={{ fontWeight: safePage === p ? 600 : 400 }}>
                {p}
              </button>
            ))}
            <button disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)}
              aria-label="หน้าถัดไป"
              className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
              <ChevronRight className="size-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      {/* Product preview modal — replicates customer-facing ProductDetailPage layout */}
      <AnimatePresence>
        {previewProduct && (() => {
          // Extract numeric stock + price for the customer-style display
          const stockNum = parseInt(previewProduct.stock.replace(/[^\d]/g, "")) || 0;
          const priceText = previewProduct.price; // e.g. "฿ 89.00" or "฿ 150.00 - 280.00"
          const isMulti = previewProduct.type === "หลายตัวเลือก";
          const sampleOptions = isMulti
            ? ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3"]
            : ["มาตรฐาน"];
          // Sample additional thumbnails using same image
          const thumbs = [previewProduct.image, previewProduct.image, previewProduct.image];
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setPreviewProduct(null)}>
              <motion.div initial={{ scale: 0.95, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 24, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="bg-[#fafafa] rounded-t-3xl sm:rounded-3xl w-full max-w-[1100px] max-h-[92vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}>

                {/* Sticky preview header bar */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-md flex items-center justify-between px-5 py-3 border-b border-gray-100 z-10">
                  <div className="flex items-center gap-2">
                    <Eye className="size-4 text-[#319754]" strokeWidth={2.4} />
                    <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>ตัวอย่างที่ลูกค้าเห็น</h3>
                    <span className={`${font} text-[11px] text-[#8e8e93] hidden sm:inline`}>· ปุ่มถูกปิดใช้งานในโหมดพรีวิว</span>
                  </div>
                  <button onClick={() => setPreviewProduct(null)} className="size-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                    <X className="size-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 pointer-events-none select-none">
                  {/* Main product section */}
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left: Images */}
                    <div className="flex flex-col gap-2.5 shrink-0 w-full lg:w-[420px]">
                      {/* Action bar — back + heart + chat + share */}
                      <div className="flex items-center justify-between w-full">
                        <button onClick={() => toast.info("ปุ่ม 'กลับ' (ดูตัวอย่าง)")}
                          className={`${font} group inline-flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors text-[12px]`} style={{ fontWeight: 500 }}>
                          <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.4} />
                          กลับ
                        </button>
                        <div className="flex items-center gap-2">
                          <motion.button whileTap={{ scale: 0.92 }}
                            onClick={() => toast.info("ปุ่ม 'ถูกใจ' (ดูตัวอย่าง)")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-colors bg-[#f5f5f5] text-gray-700 hover:bg-[#ff383c]/10 hover:text-[#ff383c]">
                            <Heart className="size-3.5" strokeWidth={2.2} />
                            <span className={`${font} text-[12px]`} style={{ fontWeight: 500 }}>0</span>
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.92 }}
                            onClick={() => toast.info("ปุ่ม 'แชทกับร้าน' (ดูตัวอย่าง)")}
                            className="inline-flex items-center justify-center bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] rounded-full size-8 cursor-pointer transition-colors"
                            title="แชทกับร้าน">
                            <MessageCircle className="size-3.5" strokeWidth={2.2} />
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.92 }}
                            onClick={() => toast.info("ปุ่ม 'แชร์' (ดูตัวอย่าง)")}
                            className="inline-flex items-center justify-center bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] rounded-full size-8 cursor-pointer transition-colors"
                            title="แชร์สินค้า">
                            <Share2 className="size-3.5" strokeWidth={2.2} />
                          </motion.button>
                        </div>
                      </div>
                      {/* Main image */}
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer">
                        <ImageWithFallback src={previewProduct.image} alt={previewProduct.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                      {/* Thumbnails */}
                      <div className="flex gap-2.5 overflow-x-auto">
                        {thumbs.map((img, i) => (
                          <div key={i} className={`size-[70px] rounded-2xl overflow-hidden shrink-0 cursor-pointer ${i === 0 ? "border-2 border-[#f8e8ce]" : ""}`}>
                            <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1 flex flex-col gap-5 min-w-0">
                      {/* Name + Rating row */}
                      <div className="flex flex-col gap-2.5">
                        <h1 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{previewProduct.name}</h1>
                        <div className="flex gap-4 items-center">
                          <div className="flex items-center gap-1.5">
                            <Star className="size-3.5 text-[#F7C42B]" fill="#F7C42B" strokeWidth={0} />
                            <span className={`${font} text-[12px] text-black`}>4.4/5</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ShoppingBag className="size-3 text-black/85" strokeWidth={2.2} />
                            <span className={`${font} text-[12px] text-black`}>ขายได้ 90+</span>
                          </div>
                        </div>
                      </div>

                      {/* Flash Sale Banner OR Regular price (with optional discount) */}
                      {previewProduct.flash ? (
                        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff4ed" }}>
                          <div className="bg-[#e62e05] px-2.5 py-1.5 flex items-center gap-2.5">
                            <Zap className="size-5 text-white fill-white" />
                            <span className={`${font} text-[20px] text-white`} style={{ fontWeight: 500 }}>Flash Sale</span>
                            <span className={`${font} ml-auto text-[12px] text-white bg-black/20 px-3 py-1 rounded-full`}>เหลือเวลาอีก 12:13:14</span>
                          </div>
                          <div className="px-2.5 py-2.5 flex items-center gap-2.5 flex-wrap">
                            <span className={`${font} text-[24px] text-[#bc1b06]`} style={{ fontWeight: 500 }}>{priceText}</span>
                            <div className="bg-[#e62e05] px-4 py-1 rounded-full">
                              <span className={`${font} text-[12px] text-white`}>ลด 30%</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl p-4 flex flex-col gap-2.5">
                          <span className={`${font} text-[14px] text-[#666]`}>ราคาสินค้า</span>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className={`${font} text-[24px] ${previewProduct.recommended ? "text-[#bc1b06]" : "text-[#297a4e]"}`} style={{ fontWeight: 500 }}>{priceText}</span>
                            {previewProduct.recommended && (
                              <>
                                <span className={`${font} text-[16px] text-[#a3a3a3] line-through`} style={{ fontWeight: 500 }}>฿ 120.00</span>
                                <div className="bg-[#e62e05] px-4 py-1 rounded-full">
                                  <span className={`${font} text-[12px] text-white`}>ลด 26%</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Options */}
                      <div className="flex flex-col gap-2.5">
                        <span className={`${font} text-[14px] text-[#666]`}>ตัวเลือกสินค้า</span>
                        <div className="flex flex-wrap gap-2.5">
                          {sampleOptions.map((opt, i) => (
                            <button key={opt}
                              onClick={() => toast.info(`เลือก: ${opt}`)}
                              className={`${font} px-4 py-1 rounded-full text-[12px] border cursor-pointer transition-colors ${
                                i === 0 ? "border-[#319754] text-[#319754] bg-[#319754]/5" : "border-[#e5e5e5] text-black hover:border-[#319754] hover:text-[#319754]"
                              }`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex flex-col gap-2.5">
                        <span className={`${font} text-[14px] text-[#666]`}>จำนวนสินค้า</span>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="bg-[#f5f5f5] flex items-center gap-6 px-4 py-1 rounded-full">
                            <button onClick={() => toast.info("ลดจำนวน (ดูตัวอย่าง)")} className={`${font} cursor-pointer text-black hover:text-[#319754] text-[18px] transition-colors`} style={{ fontWeight: 600 }}>−</button>
                            <span className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 500 }}>1</span>
                            <button onClick={() => toast.info("เพิ่มจำนวน (ดูตัวอย่าง)")} className={`${font} cursor-pointer text-black hover:text-[#319754] text-[18px] transition-colors`} style={{ fontWeight: 600 }}>+</button>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Package className="size-4 text-black/85" strokeWidth={2.2} />
                            <span className={`${font} text-[12px] text-black`}>เหลือเพียง {stockNum} ชิ้น</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2.5 pt-3">
                        <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
                          onClick={() => toast.success("เพิ่มไปยังรถเข็น (ดูตัวอย่าง)")}
                          className={`${font} flex items-center justify-center gap-2.5 h-12 flex-1 sm:flex-none sm:w-[200px] rounded-full border border-[#db8b0a] text-[#db8b0a] hover:bg-[#db8b0a]/5 cursor-pointer text-[14px] transition-colors`}>
                          <ShoppingCart className="size-4" />
                          เพิ่มไปยังรถเข็น
                        </motion.button>
                        <button onClick={() => toast.success("ซื้อสินค้า (ดูตัวอย่าง)")}
                          className={`${font} flex items-center justify-center gap-2.5 h-12 flex-1 sm:flex-none sm:w-[200px] rounded-full bg-[#319754] hover:bg-[#267a43] text-white text-[14px] cursor-pointer transition-colors`} style={{ fontWeight: 500 }}>
                          <ShoppingBag className="size-4" />
                          ซื้อสินค้า
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description + Specs card */}
                  <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 mt-6">
                    <div className="flex flex-col gap-2.5">
                      <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>รายละเอียดผลิตภัณฑ์</h2>
                      <p className={`${font} text-[14px] text-black leading-relaxed`}>
                        {previewProduct.name} — สินค้าคุณภาพคัดสรรจาก MetaHerb เพื่อสุขภาพที่ดีของคุณ
                        ผลิตจากวัตถุดิบธรรมชาติแท้ ไม่ผสมสารกันบูด ปลอดภัย ได้มาตรฐานการผลิต
                      </p>
                    </div>
                    <div className="h-px w-full bg-[#D4D4D8]" />
                    <div className="flex flex-col gap-2.5">
                      <h3 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลจำเพาะ</h3>
                      {[
                        { label: "หมวดหมู่:", value: previewProduct.category },
                        { label: "ประเภท:", value: previewProduct.type },
                        { label: "รหัสสินค้า:", value: `META-${previewProduct.id.padStart(3, "0")}` },
                        { label: "คงเหลือ:", value: previewProduct.stock },
                      ].map((s) => (
                        <div key={s.label} className="flex gap-2.5">
                          <span className={`${font} text-[14px] text-black w-[100px] shrink-0`} style={{ fontWeight: 500 }}>{s.label}</span>
                          <span className={`${font} text-[14px] text-black`}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shop info card */}
                  <div className="bg-white rounded-2xl p-4 mt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="size-[70px] rounded-full overflow-hidden shrink-0 bg-[#319754]/10 flex items-center justify-center">
                        <Store className="size-8 text-[#319754]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={`${font} text-[18px] text-black`} style={{ fontWeight: 500 }}>METAHERB Store</span>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 items-center">
                          <div className="flex items-center gap-1.5">
                            <Package className="size-3.5 text-black/85" strokeWidth={2} />
                            <span className={`${font} text-[12px] text-black`}>รายการสินค้า</span>
                            <span className={`${font} text-[12px] text-[#a2845e]`} style={{ fontWeight: 500 }}>{mockProducts.length}</span>
                            <span className={`${font} text-[12px] text-black`}>รายการ</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="size-3.5 text-[#F7C42B]" fill="#F7C42B" strokeWidth={0} />
                            <span className={`${font} text-[12px] text-black`}>คะแนนร้านค้า</span>
                            <span className={`${font} text-[12px] text-[#a2845e]`} style={{ fontWeight: 500 }}>4.4/5</span>
                            <span className={`${font} text-[12px] text-black`}>การให้คะแนนทั้งหมด 100</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Heart className="size-3.5 text-black/85" strokeWidth={2} />
                            <span className={`${font} text-[12px] text-black`}>ถูกใจสินค้า</span>
                            <span className={`${font} text-[12px] text-[#a2845e]`} style={{ fontWeight: 500 }}>100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => toast.info("ดูร้านค้า (ดูตัวอย่าง)")}
                        className={`${font} group/shop flex items-center bg-[#eaf5ee] hover:bg-[#d6eadd] text-[#319754] h-10 rounded-full cursor-pointer transition-all duration-300 overflow-hidden pl-3 pr-3 hover:pr-4 text-[14px]`} style={{ fontWeight: 500 }}>
                        <Store className="size-4 shrink-0" strokeWidth={2} />
                        <span className="grid grid-cols-[0fr] group-hover/shop:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
                          <span className="overflow-hidden">
                            <span className="block whitespace-nowrap pl-2">ดูร้านค้า</span>
                          </span>
                        </span>
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => toast.info("แชทกับร้าน (ดูตัวอย่าง)")}
                        className={`${font} group/chat flex items-center border border-[#319754] text-[#319754] hover:bg-[#319754]/5 h-10 rounded-full cursor-pointer transition-all duration-300 overflow-hidden pl-3 pr-3 hover:pr-4 text-[14px]`} style={{ fontWeight: 500 }}>
                        <MessageCircle className="size-4 shrink-0" strokeWidth={2} />
                        <span className="grid grid-cols-[0fr] group-hover/chat:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
                          <span className="overflow-hidden">
                            <span className="block whitespace-nowrap pl-2">แชท</span>
                          </span>
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

/* ========== FLASH SALE TAB ========== */
function FlashSaleTab({ onViewEvent }: { onViewEvent: () => void }) {
  const [flashFilter, setFlashFilter] = useState("all");
  const [showPopup, setShowPopup] = useState(false);

  const flashFilterTabs = [
    { id: "all",       label: "ทั้งหมด",          count: 10, Icon: ClipboardList },
    { id: "active",    label: "กำลังดำเนินการ",   count: 6,  Icon: Zap           },
    { id: "scheduled", label: "กำหนดไว้ล่วงหน้า", count: 0,  Icon: Clock         },
  ];

  return (
    <div>
      {/* Header — title + add button */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>Flash Sale</h2>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}
        >
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่มสินค้า Flash Sale</span>
        </motion.button>
      </div>

      {/* Section A: Flash Sale Events */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="size-10 rounded-xl bg-[#e62e05]/10 flex items-center justify-center shrink-0">
            <Zap className="size-5 text-[#e62e05]" strokeWidth={2.2} fill="#e62e05" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>Flash Sale Event</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <AlertCircle className="size-3.5 text-gray-400" />
              <span className={`${font} text-[12px] text-[#8e8e93]`}>เข้าร่วม Flash Sale กับทาง METAHERB เพื่อรับข้อเสนอสุดพิเศษ</span>
            </div>
          </div>
        </div>
        <div className="h-px bg-gray-100 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFlashEvents.map((event) => {
            const isActive  = event.status === "active";
            const isPending = event.status === "pending";
            const isJoin    = event.status === "join";
            return (
              <motion.button
                key={event.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                onClick={() => isJoin ? setShowPopup(true) : onViewEvent()}
                className="group/event relative rounded-2xl overflow-hidden text-left cursor-pointer shadow-[0_4px_16px_rgba(230,46,5,0.18)] hover:shadow-[0_8px_24px_rgba(230,46,5,0.28)] transition-shadow"
              >
                {/* Gradient bg */}
                <div className="bg-gradient-to-br from-[#ff6b35] via-[#ff4500] to-[#e62e05] p-4 min-h-[160px] flex flex-col justify-between text-white relative overflow-hidden">
                  {/* Decorative zap watermark */}
                  <Zap className="absolute -bottom-4 -right-4 size-32 text-white/10" fill="currentColor" strokeWidth={0} />

                  {/* Top: name + status */}
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Zap className="size-4 text-white shrink-0" fill="white" strokeWidth={0} />
                      <span className={`${font} text-[16px] truncate`} style={{ fontWeight: 600 }}>{event.name}</span>
                    </div>
                    {isPending && (
                      <span className={`${font} bg-white/25 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0`} style={{ fontWeight: 500 }}>
                        รอยืนยัน
                      </span>
                    )}
                    {isJoin && (
                      <span className={`${font} bg-white text-[#e62e05] text-[10px] px-3 py-0.5 rounded-full whitespace-nowrap shrink-0`} style={{ fontWeight: 600 }}>
                        เข้าร่วมเลย
                      </span>
                    )}
                  </div>

                  {/* Middle: countdown for active */}
                  {isActive && event.countdown && (
                    <div className="flex items-center gap-2 relative z-10">
                      <Clock className="size-3.5 text-white/80" />
                      <span className={`${font} text-[11px] text-white/80`}>เหลือเวลาอีก</span>
                      <div className="flex items-center gap-1">
                        {[event.countdown.h, event.countdown.m, event.countdown.s].map((v, i, arr) => (
                          <Fragment key={i}>
                            <span className={`${font} bg-black/30 backdrop-blur-sm text-white text-[12px] px-1.5 py-0.5 rounded tabular-nums`} style={{ fontWeight: 600 }}>{v}</span>
                            {i < arr.length - 1 && <span className={`${font} text-white/60 text-[12px]`}>:</span>}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom: items + date */}
                  <div className="flex flex-col gap-1.5 relative z-10">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/95">
                      <Package className="size-3 shrink-0" />
                      <span>{isJoin ? "คุณยังไม่มีสินค้าเข้าร่วม" : `จำนวน ${event.items} รายการ`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/85">
                      <Clock className="size-3 shrink-0" />
                      <span className="truncate">{event.date}</span>
                    </div>
                  </div>

                  {/* Hover arrow indicator */}
                  <div className="absolute top-3 right-3 size-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/event:opacity-100 transition-opacity">
                    <ChevronRight className="size-4 text-white" strokeWidth={2.4} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Section B: Flash Sale Store */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
            <Store className="size-5 text-[#319754]" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>Flash Sale Store</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <AlertCircle className="size-3.5 text-gray-400" />
              <span className={`${font} text-[12px] text-[#8e8e93]`}>สินค้าในร้านที่เข้าร่วม Flash Sale</span>
            </div>
          </div>
        </div>

        {/* Filter tabs (unified style: green icons + red badges) */}
        <div className="bg-[#fafbfc] rounded-full p-2 mb-4 flex items-center gap-2 flex-wrap">
          {flashFilterTabs.map((tab) => {
            const isAct = flashFilter === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setFlashFilter(tab.id)}
                whileTap={{ scale: 0.94 }}
                whileHover={!isAct ? { scale: 1.04 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${
                  !isAct ? "hover:bg-white" : ""
                }`}
              >
                {isAct && (
                  <motion.span
                    layoutId="flashTabActivePill"
                    className="absolute inset-0 bg-[#319754] shadow-[0_2px_8px_rgba(49,151,84,0.25)] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <motion.span layout
                  className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}
                  transition={{ duration: 0.2 }}
                >
                  <tab.Icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
                </motion.span>
                <span className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                  style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>
                  {tab.label}
                </span>
                <motion.span layout
                  className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>
                  <motion.span key={tab.count} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                    {tab.count}
                  </motion.span>
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Table */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className={`${font} text-[12px] text-[#8e8e93] bg-[#fafbfc] border-b border-gray-100`}>
                <th className="text-left py-3 px-4" style={{ fontWeight: 500 }}>สินค้า</th>
                <th className="text-right py-3 px-4" style={{ fontWeight: 500 }}>ราคาปกติ</th>
                <th className="text-right py-3 px-4" style={{ fontWeight: 500 }}>ราคา Flash Sale</th>
                <th className="text-center py-3 px-4" style={{ fontWeight: 500 }}>ส่วนลด</th>
                <th className="text-left py-3 px-4" style={{ fontWeight: 500 }}>เวลาเริ่ม</th>
                <th className="text-left py-3 px-4" style={{ fontWeight: 500 }}>เวลาสิ้นสุด</th>
                <th className="text-center py-3 px-4" style={{ fontWeight: 500 }}>สถานะ</th>
                <th className="text-center py-3 px-4" style={{ fontWeight: 500 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {mockFlashProducts.map((p) => {
                const normal = parseFloat(String(p.normalPrice).replace(/[^\d.]/g, "")) || 0;
                const flash  = parseFloat(String(p.flashPrice).replace(/[^\d.]/g, ""))  || 0;
                const discountPct = normal > 0 && flash > 0 ? Math.round(((normal - flash) / normal) * 100) : 0;
                return (
                  <tr key={p.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/40 transition-colors group/row">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-[56px] rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200 group-hover/row:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
                          <ImageWithFallback src={imgProd} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/row:scale-110" />
                        </div>
                        <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>
                    {/* Normal price */}
                    <td className={`${font} text-[13px] text-gray-500 line-through text-right py-3 px-4 tabular-nums`}>{p.normalPrice}</td>
                    {/* Flash price */}
                    <td className={`${font} text-[14px] text-[#ff3b30] text-right py-3 px-4 tabular-nums`} style={{ fontWeight: 600 }}>{p.flashPrice}</td>
                    {/* Discount badge */}
                    <td className="py-3 px-4 text-center">
                      {discountPct > 0 && (
                        <span className={`${font} bg-[#e62e05] text-white text-[11px] px-2.5 py-0.5 rounded-full inline-block`} style={{ fontWeight: 600 }}>
                          -{discountPct}%
                        </span>
                      )}
                    </td>
                    {/* Start */}
                    <td className={`${font} text-[12px] text-gray-500 py-3 px-4`}>{p.start}</td>
                    {/* End */}
                    <td className={`${font} text-[12px] text-gray-500 py-3 px-4`}>{p.end}</td>
                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`${font} inline-flex items-center gap-1.5 text-[12px] px-3 py-0.5 rounded-full`}
                        style={{ backgroundColor: `${p.statusColor}1a`, color: p.statusColor, fontWeight: 500 }}>
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: p.statusColor }} />
                        {p.status}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flash Sale Join Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPopup(false)}>
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-[520px] shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Hero */}
            <div className="bg-gradient-to-b from-[rgba(230,46,5,0.7)] to-[#e62e05] h-[200px] relative flex items-center justify-center">
              <button onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 size-7 rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center cursor-pointer">
                <X className="size-3.5 text-white" />
              </button>
              <div className="w-[180px] h-[160px]">
                <ImageWithFallback src={imgFlash} alt="" className="w-full h-full object-contain" />
              </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-4">
              <h3 className={`${font} text-[20px] text-center`} style={{ fontWeight: 500 }}>เงื่อนไขและข้อเสนอสุดพิเศษ</h3>
              <div className={`${font} text-[14px] text-black space-y-2`}>
                <p style={{ fontWeight: 600 }}>ข้อเสนอสุดพิเศษ</p>
                <ul className="list-disc ml-5 space-y-1 text-[13px]">
                  <li>รับส่วนลดสูงสุดตามที่บริษัทกำหนดเฉพาะช่วงกิจกรรม Flash Sale</li>
                  <li>สินค้าที่เข้าร่วมกิจกรรมจะไ���้รับการโปรโมตผ่านช่องทางของ METAHERB</li>
                  <li>เพิ่มโอกาสในการเข้าถึงลูกค้าใหม่ และกระตุ้นยอดขายในระยะเวลาจำกัด</li>
                </ul>
                <p style={{ fontWeight: 600 }}>เงื่อนไขการเข้าร่วม</p>
                <ul className="list-disc ml-5 space-y-1 text-[13px]">
                  <li>การเข้าร่วม Flash Sale เป็นไปตามรอบกิจกรรมที่ผู้ดูแลระบบ (Admin) เป็นผู้กำหนด</li>
                  <li>ร้านค้าต้องเลือกและตั้งค่าสินค้าที่ต้องการเข้าร่วม Flash Sale ภายในระยะเวลาที่กำหนด</li>
                  <li>ราคาสินค้าและส่วนลดต้องเป็นไปตามเงื่อนไขที่ METAHERB กำหนด</li>
                  <li>ไม่สามารถยกเลิกหรือเปลี่ยนแปลงสินค้าที่เข้าร่วมได้หลังจากเริ่มกิจกรรมแล้ว</li>
                </ul>
              </div>
              <div className="border-t pt-4">
                <button onClick={() => setShowPopup(false)}
                  className={`w-full bg-[#008c45] h-[49px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>เข้าร่วม</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== FLASH EVENT DETAIL ========== */
function FlashEventDetail({ onBack }: { onBack: () => void }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className={`flex items-center gap-1 bg-[#d4d4d4] px-3 py-1 rounded-full text-[12px] ${font} cursor-pointer`}>
            <ChevronLeft className="size-3" /> กลับ
          </button>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>Flash Sale Event</h2>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 bg-[#319754] text-white px-4 py-2 rounded-full text-[13px] ${font} cursor-pointer`}>
          <Plus className="size-4" /> เพิ่มสินค้า Flash Sale
        </button>
      </div>

      {/* Date & countdown */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          <Clock className="size-4 text-gray-500" />
          <span className={`${font} text-[13px] text-gray-500`}>00 M.M. 0000 - 00 M.M. 0000</span>
        </div>
        <div className="flex items-center gap-1">
          {["00", "00", "00"].map((v, i) => (
            <span key={i} className="bg-[#319754] text-white text-[12px] px-2 py-0.5 rounded">{v}</span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b bg-gray-50`}>
              <th className="text-left py-3 px-4">สินค้า</th>
              <th className="text-left py-3 px-4">ราคาปกติ</th>
              <th className="text-left py-3 px-4">Flash Sale</th>
              <th className="text-left py-3 px-4">เวลาเริ่ม</th>
              <th className="text-left py-3 px-4">เวลาสิ้นสุด</th>
              <th className="text-left py-3 px-4">สถานะ</th>
              <th className="text-center py-3 px-4">เพิ่มเติม</th>
            </tr>
          </thead>
          <tbody>
            {mockFlashProducts.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="size-[50px] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className={`${font} text-[13px]`}>{p.name}</span>
                  </div>
                </td>
                <td className={`${font} text-[13px] py-3 px-4`}>{p.normalPrice}</td>
                <td className={`${font} text-[13px] py-3 px-4 text-[#ff3b30]`} style={{ fontWeight: 500 }}>{p.flashPrice}</td>
                <td className={`${font} text-[12px] py-3 px-4 text-gray-500`}>{p.start}</td>
                <td className={`${font} text-[12px] py-3 px-4 text-gray-500`}>{p.end}</td>
                <td className="py-3 px-4">
                  <span className={`${font} text-[12px] flex items-center gap-1`} style={{ color: p.statusColor }}>
                    <span className="size-2 rounded-full" style={{ backgroundColor: p.statusColor }} /> {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="cursor-pointer"><MoreHorizontal className="size-5 text-gray-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 p-4">
          <button className="size-7 rounded-full flex items-center justify-center cursor-pointer text-gray-400"><ChevronLeft className="size-4" /></button>
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p} className={`size-7 rounded-full flex items-center justify-center text-[12px] ${font} cursor-pointer ${p === 1 ? "bg-[#319754] text-white" : "text-gray-500"}`}>{p}</button>
          ))}
          <button className="size-7 rounded-full flex items-center justify-center cursor-pointer text-gray-400 rotate-180"><ChevronLeft className="size-4" /></button>
        </div>
      </div>

      {/* Add Product Flash Sale Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-[600px] max-h-[80vh] flex flex-col gap-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className={`${font} text-[20px]`} style={{ fontWeight: 500 }}>เพิ่มสินค้า Flash Sale</p>
              <button onClick={() => setShowAddModal(false)} className="size-7 rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center cursor-pointer">
                <X className="size-3.5" />
              </button>
            </div>
            <div className="border-t" />

            {/* Add product area */}
            <button className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#319754]/50">
              <Plus className="size-10 text-gray-400" />
              <span className={`${font} text-[14px] text-gray-500`}>เพิ่มเลือกสินค้าเข้าร่วม</span>
            </button>

            {/* Selected product */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
              <div className="size-[80px] bg-gray-200 rounded-2xl overflow-hidden shrink-0">
                <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>Product</span>
                  <span className="bg-[#007aff]/10 text-[#007aff] text-[12px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#007aff]" /> หลายตัวเลือก
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 500 }}>฿ 0.00</span>
                  <span className={`${font} text-[12px] text-gray-500 flex items-center gap-1`}>
                    <Package className="size-3" /> 0 ชิ้น
                  </span>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <span className={`${font} text-[12px]`}>ตัวเเลือกสินค้า</span>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <div className="size-[80px] bg-gray-200 rounded-2xl overflow-hidden shrink-0">
                    <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>Product</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`${font} text-[12px] text-gray-400`}>เข้าร่วม Flash Sale</span>
                        <div className="size-4 border border-gray-300 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 500 }}>฿ 0.00</span>
                      <span className={`${font} text-[12px] text-gray-500 flex items-center gap-1`}>
                        <Package className="size-3" /> 0 ชิ้น
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t" />
            <button className={`w-full bg-[#008c45] h-[49px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>
              เพิ่มสินค้า Flash Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== ADD PRODUCT (Figma redesign) ========== */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative inline-flex items-center w-[52px] h-7 rounded-full transition-colors cursor-pointer shrink-0 ${
        checked ? "bg-[#34c759]" : "bg-gray-300"
      }`}>
      <span className={`absolute size-6 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.18)] transition-transform ${
        checked ? "translate-x-[26px]" : "translate-x-[2px]"
      }`} />
    </button>
  );
}

function NumberStepper({ value, onChange, min = 0, step = 1 }: { value: number; onChange: (v: number) => void; min?: number; step?: number }) {
  const atMin = value <= min;
  const spring = { type: "spring" as const, stiffness: 500, damping: 22 };
  return (
    <div className="flex items-center h-8 rounded-full bg-[rgba(116,116,128,0.08)] overflow-hidden shrink-0">
      <motion.button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={atMin}
        whileHover={!atMin ? { backgroundColor: "rgba(0,0,0,0.06)" } : undefined}
        whileTap={!atMin ? { scale: 0.82 } : undefined}
        transition={spring}
        className={`${font} w-[38px] h-full flex items-center justify-center text-[18px] ${atMin ? "text-gray-300 cursor-not-allowed" : "text-black cursor-pointer"}`}
        style={{ fontWeight: 600 }}>
        <motion.span key={`m-${value}`} initial={{ scale: 0.6, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="inline-block">−</motion.span>
      </motion.button>
      <div className="w-px h-3.5 bg-gray-300/60" />
      <motion.button
        type="button"
        onClick={() => onChange(value + step)}
        whileHover={{ backgroundColor: "rgba(49,151,84,0.12)" }}
        whileTap={{ scale: 0.82 }}
        transition={spring}
        className={`${font} w-[38px] h-full flex items-center justify-center text-[18px] text-black cursor-pointer`}
        style={{ fontWeight: 600 }}>
        <motion.span key={`p-${value}`} initial={{ scale: 0.6, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="inline-block">+</motion.span>
      </motion.button>
    </div>
  );
}

function AddProductTab({ onBack }: { onBack: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0); // furthest step the user has visited (clicked or scrolled past)
  const [hasVariants, setHasVariants] = useState(false);
  const [seoEnabled, setSeoEnabled] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [openForSale, setOpenForSale] = useState(true);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [productImages] = useState<string[]>([]); // demo only — not actually uploaded
  type VariantRow = { id: string; image: string | null; name: string; price: number; stock: number; weight: number };
  const [variantRows, setVariantRows] = useState<VariantRow[]>([
    { id: "v1", image: null, name: "", price: 0, stock: 0, weight: 0 },
  ]);
  const updateRow = (id: string, patch: Partial<VariantRow>) =>
    setVariantRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () =>
    setVariantRows((prev) => [...prev, { id: `v${Date.now()}`, image: null, name: "", price: 0, stock: 0, weight: 0 }]);
  const removeRow = (id: string) =>
    setVariantRows((prev) => prev.filter((r) => r.id !== id));

  // Validation per section
  const infoValid = productName.trim().length > 0 && category.length > 0 && sku.trim().length > 0;
  const imagesValid = productImages.length > 0;
  const variantsValid = hasVariants
    ? variantRows.every((r) => r.name.trim().length > 0 && r.price > 0 && r.stock > 0 && r.weight > 0)
    : price > 0 && stock > 0 && weight > 0;

  const sections: { id: string; label: string; required: boolean; valid: boolean }[] = [
    { id: "images",   label: "รูปภาพสินค้า",   required: true,  valid: imagesValid    },
    { id: "info",     label: "ข้อมูลสินค้า",   required: true,  valid: infoValid      },
    { id: "variants", label: "ตัวเลือกสินค้า", required: true,  valid: variantsValid  },
    { id: "seo",      label: "ตั้งค่า SEO",    required: false, valid: !seoEnabled || true },
    { id: "settings", label: "ตั้งค่าสินค้า",  required: false, valid: true           },
  ];

  const scrollToSection = (id: string, idx: number) => {
    setActiveStep(idx);
    setMaxVisitedStep((prev) => Math.max(prev, idx));
    document.getElementById(`addprod-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Track scroll position to update activeStep + maxVisitedStep when user scrolls
  useEffect(() => {
    const sectionIds = ["images", "info", "variants", "seo", "settings"];
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that's currently most visible from the top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.id.replace("addprod-", "");
          const idx = sectionIds.indexOf(id);
          if (idx >= 0) {
            setActiveStep(idx);
            setMaxVisitedStep((prev) => Math.max(prev, idx));
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(`addprod-${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex items-start gap-4">
      {/* Left content */}
      <div className="flex-1 min-w-0">
        {/* Top bar: back button (matches OrderDetail header style) */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button onClick={onBack}
            className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>
            <ChevronLeft className="size-3.5" strokeWidth={2.5} />
            กลับ
          </button>
        </div>

        {/* Title row */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <h2 className={`${font} text-[20px] text-black leading-[30px]`} style={{ fontWeight: 500 }}>เพิ่มสินค้าใหม่</h2>
        </div>

        {/* Sections — equal spacing via space-y */}
        <div className="space-y-4">

        {/* Section: รูปภาพสินค้า */}
        <section id="addprod-images" onMouseEnter={() => { setActiveStep(0); setMaxVisitedStep((p) => Math.max(p, 0)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Package className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>รูปภาพสินค้า</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>อัปโหลดได้สูงสุด 3 รูป (JPG, PNG, WebP) ขนาดไม่เกิน 2MB</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="flex flex-wrap gap-3">
            {[
              { label: "รูปปกสินค้า", sub: "รูปหลัก", primary: true },
              { label: "รูป 2", sub: "เพิ่มเติม", primary: false },
              { label: "รูป 3", sub: "เพิ่มเติม", primary: false },
            ].map((item) => (
              <motion.button key={item.label} type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`group/upload relative bg-gradient-to-br from-gray-50 to-gray-100/60 border-2 border-dashed rounded-2xl size-[150px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shrink-0 overflow-hidden ${
                  item.primary
                    ? "border-[#319754]/40 hover:border-[#319754] hover:from-[#319754]/5 hover:to-[#319754]/10"
                    : "border-gray-300 hover:border-[#319754] hover:from-[#319754]/5 hover:to-[#319754]/10"
                }`}>
                {item.primary && (
                  <span className={`${font} absolute top-2 right-2 text-[9px] bg-[#319754] text-white px-2 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>
                    หลัก
                  </span>
                )}
                <div className="size-10 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-transform group-hover/upload:scale-110 group-hover/upload:rotate-90 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                  <Plus className="size-4 text-gray-500 group-hover/upload:text-[#319754] transition-colors" strokeWidth={2.4} />
                </div>
                <div className="text-center px-2">
                  <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 500 }}>{item.label}</p>
                  <p className={`${font} text-[10px] text-gray-400 mt-0.5`}>{item.sub}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Section: ข้อมูลสินค้า */}
        <section id="addprod-info" onMouseEnter={() => { setActiveStep(1); setMaxVisitedStep((p) => Math.max(p, 1)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <ClipboardList className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <h3 className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>ข้อมูลสินค้า</h3>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Row 1 */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ชื่อสินค้า <span className="text-[#ff3b30]">*</span></label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="เช่น: ขมิ้นชันผง"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>หมวดหมู่ <span className="text-[#ff3b30]">*</span></label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className={`${font} bg-[#fafafa] h-12 w-full rounded-full pl-6 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow appearance-none cursor-pointer`}>
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="herb_capsule">สมุนไพรแคปซูล</option>
                  <option value="herbal_tea">ชาสมุนไพร</option>
                  <option value="herb_powder">ผงสมุนไพร</option>
                  <option value="herbal_oil">น้ำมันสมุนไพร</option>
                </select>
                <ChevronDown className="size-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>หน่วย</label>
              <div className="relative">
                <select className={`${font} bg-[#fafafa] h-12 w-full rounded-full pl-6 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow appearance-none cursor-pointer`}>
                  <option>ชิ้น</option>
                  <option>กล่อง</option>
                  <option>ซอง</option>
                  <option>ขวด</option>
                </select>
                <ChevronDown className="size-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รหัสสินค้า (SKU) <span className="text-[#ff3b30]">*</span></label>
              <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="เช่น: META-001"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รูปแบบสินค้า</label>
              <input placeholder="เช่น: ใบชาอบแห้ง, แคปซูล, ผง"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ยี่ห้อ / แบรนด์</label>
              <input placeholder="เช่น: MetaHerb"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            {/* Row 3 — Description spans all 3 columns */}
            <div className="flex flex-col gap-2 md:col-span-3">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รายละเอียดสินค้า</label>
              <textarea rows={4} placeholder="อธิบายรายละเอียด คุณสมบัติ และประโยชน์ของสินค้า"
                className={`${font} bg-[#fafafa] w-full rounded-2xl px-6 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3] resize-none`} />
            </div>
          </div>
        </section>

        {/* Section: ตัวเลือกสินค้า */}
        <section id="addprod-variants" onMouseEnter={() => { setActiveStep(2); setMaxVisitedStep((p) => Math.max(p, 2)); }}
          className="rounded-2xl overflow-hidden border border-[#319754]/10 shadow-[0_1px_4px_rgba(49,151,84,0.06)]"
          style={{ background: "linear-gradient(135deg, rgba(49,151,84,0.08) 0%, rgba(49,151,84,0.04) 100%)" }}>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
                <Boxes className="size-5 text-[#319754]" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>ตัวเลือกสินค้า</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <AlertCircle className="size-3.5 text-gray-400" />
                  <span className={`${font} text-[12px] text-[#8e8e93]`}>เปิดใช้งานหากสินค้าของคุณมีหลายตัวเลือก เช่น ขนาด, สี</span>
                </div>
              </div>
              <ToggleSwitch checked={hasVariants} onChange={() => setHasVariants((v) => !v)} />
            </div>
          </div>
          {!hasVariants && (
            <div className="bg-white rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ราคา */}
                <div className="flex flex-col gap-2">
                  <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ราคา <span className="text-[#ff3b30]">*</span></label>
                  <div className={`${font} bg-[#fafafa] h-12 rounded-full pl-5 pr-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#319754]/30 transition-shadow`}>
                    <span className={`${font} text-[14px] text-[#8e8e93] shrink-0`}>฿</span>
                    <input
                      type="number"
                      value={price === 0 ? "" : price}
                      onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="0.00"
                      className={`${font} flex-1 min-w-0 bg-transparent text-[14px] text-black outline-none placeholder:text-[#a3a3a3] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`}
                    />
                    <NumberStepper value={price} onChange={setPrice} step={1} />
                  </div>
                </div>
                {/* จำนวนคงเหลือ */}
                <div className="flex flex-col gap-2">
                  <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>จำนวนสินค้าคงเหลือ <span className="text-[#ff3b30]">*</span></label>
                  <div className={`${font} bg-[#fafafa] h-12 rounded-full pl-5 pr-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#319754]/30 transition-shadow`}>
                    <input
                      type="number"
                      value={stock === 0 ? "" : stock}
                      onChange={(e) => setStock(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="0"
                      className={`${font} flex-1 min-w-0 bg-transparent text-[14px] text-black outline-none placeholder:text-[#a3a3a3] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`}
                    />
                    <NumberStepper value={stock} onChange={setStock} step={1} />
                  </div>
                </div>
                {/* น้ำหนัก */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>น้ำหนักสินค้า (กรัม) <span className="text-[#ff3b30]">*</span></label>
                    <span className={`${font} text-[12px] text-[#8e8e93]`}>จำเป็นสำหรับคำนวณค่าส่ง</span>
                  </div>
                  <div className={`${font} bg-[#fafafa] h-12 rounded-full pl-5 pr-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#319754]/30 transition-shadow`}>
                    <input
                      type="number"
                      value={weight === 0 ? "" : weight}
                      onChange={(e) => setWeight(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="0"
                      className={`${font} flex-1 min-w-0 bg-transparent text-[14px] text-black outline-none placeholder:text-[#a3a3a3] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`}
                    />
                    <span className={`${font} text-[12px] text-[#8e8e93] shrink-0 pr-1`}>g</span>
                    <NumberStepper value={weight} onChange={setWeight} step={10} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {hasVariants && (
            <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
              {variantRows.map((row) => (
                <div key={row.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 relative group/row">
                  {/* Image upload — 200x200, styled like รูปภาพสินค้า */}
                  <motion.button type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="group/upload relative bg-gradient-to-br from-gray-50 to-gray-100/60 border-2 border-dashed border-gray-300 hover:border-[#319754] hover:from-[#319754]/5 hover:to-[#319754]/10 rounded-2xl size-[200px] shrink-0 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden">
                    <div className="size-12 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-transform group-hover/upload:scale-110 group-hover/upload:rotate-90 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                      <Plus className="size-5 text-gray-500 group-hover/upload:text-[#319754] transition-colors" strokeWidth={2.4} />
                    </div>
                    <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>เพิ่มรูป</span>
                  </motion.button>

                  {/* Right side fields */}
                  <div className="flex-1 min-w-0 flex flex-col gap-4 self-stretch p-2.5">
                    {/* ชื่อตัวเลือก — full width */}
                    <div className="flex flex-col gap-2">
                      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ชื่อตัวเลือก <span className="text-[#ff3b30]">*</span></label>
                      <input value={row.name} onChange={(e) => updateRow(row.id, { name: e.target.value })}
                        placeholder="เช่น: 30 เม็ด, ขนาด L, สีแดง"
                        className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
                    </div>
                    {/* 3-col: ราคา / คงเหลือ / น้ำหนัก */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* ราคา */}
                      <div className="flex flex-col gap-2">
                        <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ราคา <span className="text-[#ff3b30]">*</span></label>
                        <div className={`${font} bg-[#fafafa] h-12 rounded-full pl-5 pr-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#319754]/30 transition-shadow`}>
                          <span className={`${font} text-[14px] text-[#8e8e93] shrink-0`}>฿</span>
                          <input type="number" value={row.price === 0 ? "" : row.price}
                            onChange={(e) => updateRow(row.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                            placeholder="0.00"
                            className={`${font} flex-1 min-w-0 bg-transparent text-[14px] text-black outline-none placeholder:text-[#a3a3a3] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`} />
                          <NumberStepper value={row.price} onChange={(v) => updateRow(row.id, { price: v })} step={1} />
                        </div>
                      </div>
                      {/* คงเหลือ */}
                      <div className="flex flex-col gap-2">
                        <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>จำนวนสินค้าคงเหลือ <span className="text-[#ff3b30]">*</span></label>
                        <div className={`${font} bg-[#fafafa] h-12 rounded-full pl-5 pr-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#319754]/30 transition-shadow`}>
                          <input type="number" value={row.stock === 0 ? "" : row.stock}
                            onChange={(e) => updateRow(row.id, { stock: Math.max(0, Number(e.target.value) || 0) })}
                            placeholder="0"
                            className={`${font} flex-1 min-w-0 bg-transparent text-[14px] text-black outline-none placeholder:text-[#a3a3a3] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`} />
                          <NumberStepper value={row.stock} onChange={(v) => updateRow(row.id, { stock: v })} step={1} />
                        </div>
                      </div>
                      {/* น้ำหนัก */}
                      <div className="flex flex-col gap-2">
                        <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>น้ำหนักสินค้า (กรัม) <span className="text-[#ff3b30]">*</span></label>
                        <div className={`${font} bg-[#fafafa] h-12 rounded-full pl-5 pr-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#319754]/30 transition-shadow`}>
                          <input type="number" value={row.weight === 0 ? "" : row.weight}
                            onChange={(e) => updateRow(row.id, { weight: Math.max(0, Number(e.target.value) || 0) })}
                            placeholder="0"
                            className={`${font} flex-1 min-w-0 bg-transparent text-[14px] text-black outline-none placeholder:text-[#a3a3a3] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`} />
                          <span className={`${font} text-[12px] text-[#8e8e93] shrink-0 pr-1`}>g</span>
                          <NumberStepper value={row.weight} onChange={(v) => updateRow(row.id, { weight: v })} step={10} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete button — top-right corner, shows on hover */}
                  {variantRows.length > 1 && (
                    <button type="button" onClick={() => removeRow(row.id)}
                      className="absolute top-3 right-3 size-8 rounded-full bg-white border border-gray-200 hover:border-[#ff3b30] hover:bg-[#ff3b30]/5 hover:text-[#ff3b30] text-gray-500 inline-flex items-center justify-center cursor-pointer transition-all shrink-0 opacity-0 group-hover/row:opacity-100"
                      title="ลบตัวเลือก">
                      <Trash2 className="size-3.5" strokeWidth={2.2} />
                    </button>
                  )}
                </div>
              ))}

              {/* Add row button */}
              <button type="button" onClick={addRow}
                className={`${font} flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#319754] hover:bg-[#319754]/5 text-gray-600 hover:text-[#319754] cursor-pointer transition-colors text-[14px]`}
                style={{ fontWeight: 500 }}>
                <Plus className="size-4" strokeWidth={2.4} />
                เพิ่มตัวเลือกสินค้า
              </button>
            </div>
          )}
        </section>

        {/* Section: ตั้งค่า SEO */}
        <section id="addprod-seo" onMouseEnter={() => { setActiveStep(3); setMaxVisitedStep((p) => Math.max(p, 3)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center shrink-0">
              <Search className="size-5 text-[#3b82f6]" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>ตั้งค่า SEO</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>เปิดตั้งค่า SEO เพื่อช่วยให้สินค้าติดอันดับใน Google ได้ดีขึ้น</span>
              </div>
            </div>
            <ToggleSwitch checked={seoEnabled} onChange={() => setSeoEnabled((v) => !v)} />
          </div>
          {seoEnabled && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>SEO Title</label>
                <input placeholder="เช่น: ขมิ้นชันผง 100% ออร์แกนิก"
                  className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>SEO Keywords</label>
                <input placeholder="คั่นด้วยเครื่องหมายจุลภาค (,)"
                  className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
              </div>
            </div>
          )}
        </section>

        {/* Section: ตั้งค่าสินค้า */}
        <section id="addprod-settings" onMouseEnter={() => { setActiveStep(4); setMaxVisitedStep((p) => Math.max(p, 4)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
              <Settings className="size-5 text-[#f59e0b]" strokeWidth={2.2} />
            </div>
            <h3 className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>ตั้งค่าสินค้า</h3>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* เปิดขาย */}
            <div className={`group/card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden border transition-colors ${
              openForSale ? "border-[#319754]/20" : "border-gray-100"
            }`}
              style={openForSale
                ? { background: "linear-gradient(135deg, rgba(49,151,84,0.08) 0%, rgba(49,151,84,0.03) 100%)" }
                : { backgroundColor: "#fafafa" }}>
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                    openForSale ? "bg-[#319754]/15" : "bg-gray-200/60"
                  }`}>
                    <Eye className={`size-4 transition-colors ${openForSale ? "text-[#319754]" : "text-gray-500"}`} strokeWidth={2.2} />
                  </div>
                  <span className={`${font} text-[15px] text-black`} style={{ fontWeight: 600 }}>เปิดขาย</span>
                </div>
                <ToggleSwitch checked={openForSale} onChange={() => setOpenForSale((v) => !v)} />
              </div>
              <div className="flex items-start gap-1.5 relative z-10">
                <AlertCircle className="size-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span className={`${font} text-[12px] text-[#8e8e93] leading-relaxed`}>แสดงสินค้านี้บนหน้าร้านค้าให้ลูกค้ามองเห็นและสั่งซื้อได้</span>
              </div>
              <motion.img
                src={imgSellingProducts}
                alt=""
                className="absolute -bottom-2 -right-2 size-[90px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover/card:scale-110 group-hover/card:-rotate-3"
                style={{
                  maskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.45) 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.45) 80%, transparent 100%)",
                  opacity: openForSale ? 1 : 0.5,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: openForSale ? 1 : 0.5 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden
              />
            </div>
            {/* สินค้าแนะนำ */}
            <div className={`group/card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden border transition-colors ${
              recommended ? "border-[#f7931d]/20" : "border-gray-100"
            }`}
              style={recommended
                ? { background: "linear-gradient(135deg, rgba(247,147,29,0.08) 0%, rgba(247,147,29,0.03) 100%)" }
                : { backgroundColor: "#fafafa" }}>
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className={`size-9 rounded-full flex items-center justify-center transition-colors ${
                    recommended ? "bg-[#f7931d]/15" : "bg-gray-200/60"
                  }`}>
                    <Star className={`size-4 transition-colors ${recommended ? "text-[#f7931d]" : "text-gray-500"}`}
                      fill={recommended ? "#f7931d" : "transparent"} strokeWidth={2.2} />
                  </div>
                  <span className={`${font} text-[15px] text-black`} style={{ fontWeight: 600 }}>สินค้าแนะนำ</span>
                </div>
                <ToggleSwitch checked={recommended} onChange={() => setRecommended((v) => !v)} />
              </div>
              <div className="flex items-start gap-1.5 relative z-10">
                <AlertCircle className="size-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span className={`${font} text-[12px] text-[#8e8e93] leading-relaxed`}>ตั้งค่าเป็นสินค้าแนะนำเพื่อโปรโมทบนหน้าหลักของร้าน</span>
              </div>
              <motion.img
                src={imgRecommendedProducts}
                alt=""
                className="absolute -bottom-2 -right-2 size-[90px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover/card:scale-110 group-hover/card:-rotate-3"
                style={{
                  maskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.45) 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.45) 80%, transparent 100%)",
                  opacity: recommended ? 1 : 0.5,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: recommended ? 1 : 0.5 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden
              />
            </div>
          </div>
        </section>
        </div>
      </div>

      {/* Right sidebar — sticky scroll-spy with progress + action buttons */}
      <aside className="w-[240px] shrink-0 sticky top-0">
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col">
          <p className={`${font} text-[11px] text-[#8e8e93] uppercase tracking-wider mb-4`} style={{ fontWeight: 600 }}>ขั้นตอนการเพิ่มสินค้า</p>
          {sections.map((s, i) => {
            const isActive = activeStep === i;
            const isLast = i === sections.length - 1;
            const isVisited = i <= maxVisitedStep; // user has scrolled past or clicked
            // Status logic:
            //   active → focused (no error tint)
            //   filled (valid) → green check
            //   required + empty + visited (and not active) → RED + !  (only after user passes by)
            //   optional / not yet visited → normal gray
            const showError = !isActive && isVisited && s.required && !s.valid;
            const showDone  = !isActive && isVisited && s.valid;
            return (
              <div key={s.id}>
                <motion.button onClick={() => scrollToSection(s.id, i)}
                  whileTap={{ scale: 0.98 }}
                  className={`${font} relative flex items-center gap-3 text-[14px] cursor-pointer w-full text-left rounded-xl px-2.5 py-2 transition-colors ${
                    isActive ? "" : "hover:bg-gray-50"
                  }`}>
                  {isActive && (
                    <motion.span layoutId="addprod-step-pill"
                      className="absolute inset-0 bg-[#319754]/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <motion.span
                    initial={false}
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={isActive ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                    className={`relative size-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      showDone   ? "bg-[#319754] shadow-[0_2px_4px_rgba(49,151,84,0.25)]"
                      : showError ? "bg-[#ff3b30] shadow-[0_2px_4px_rgba(255,59,48,0.25)]"
                      : isActive  ? "bg-white border-2 border-[#319754] shadow-[0_0_0_3px_rgba(49,151,84,0.15)]"
                      :             "bg-white border-2 border-gray-300"
                    }`}>
                    {showDone   ? <Check className="size-3 text-white" strokeWidth={3} />
                    : showError ? <AlertCircle className="size-3 text-white" strokeWidth={3} fill="transparent" />
                    : isActive  ? <span className="size-1.5 rounded-full bg-[#319754]" />
                    : null}
                  </motion.span>
                  <span className={`relative ${
                    isActive  ? "text-[#319754]"
                    : showDone  ? "text-gray-700"
                    : showError ? "text-[#ff3b30]"
                    :             "text-[#8e8e93]"
                  }`} style={{ fontWeight: isActive ? 600 : (showDone || showError) ? 500 : 400 }}>
                    {s.label}
                  </span>
                </motion.button>
                {!isLast && (
                  <div className={`ml-[18px] my-0.5 w-0.5 h-3 rounded-full transition-colors ${
                    showDone ? "bg-[#319754]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            );
          })}

          {/* Action buttons */}
          <div className="h-px bg-gray-100 my-4" />
          <div className="flex flex-col gap-2">
            <button onClick={() => toast.success("เพิ่มสินค้าเรียบร้อย")}
              className={`${font} bg-[#319754] hover:bg-[#287745] text-white h-10 w-full rounded-full text-[14px] cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
              style={{ fontWeight: 500 }}>
              เพิ่มสินค้า
            </button>
            <button onClick={onBack}
              className={`${font} border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/5 h-10 w-full rounded-full text-[14px] cursor-pointer transition-colors`}>
              ยกเลิก
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ========== OVERVIEW ========== */
function OverviewTab({ onViewOrders }: { onViewOrders?: (filter?: OrderFilterTab) => void }) {
  const [selectedDate, setSelectedDate] = useState(16);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const [salesPopupScope, setSalesPopupScope] = useState<"day" | "month" | "year" | null>(null);

  // Lock body scroll while popup is open
  useEffect(() => {
    if (!salesPopupScope) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [salesPopupScope]);

  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const dayNames = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

  // Monthly heat data per month index (for yearly view)
  const monthlyHeatData: Record<number, number> = {
    0: 5, 1: 4, 2: 3, 3: 4, 4: 2, 5: 3, 6: 2, 7: 3, 8: 1, 9: 1, 10: 2, 11: 1,
  };

  const year = currentYear;
  const month = currentMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const prevMonthDays = new Date(year, month, 0).getDate();

  const heatData: Record<number, number> = {
    1: 5, 2: 5, 3: 5, 4: 4, 5: 2, 6: 3, 7: 4,
    8: 1, 9: 2, 10: 2, 11: 3, 12: 1, 13: 2, 14: 2,
    15: 1, 16: 5, 17: 3, 18: 4, 19: 2, 20: 1, 21: 1,
    22: 2, 23: 4, 24: 4, 25: 4, 26: 1, 27: 1, 28: 1,
    29: 2, 30: 5, 31: 5,
  };

  const getHeatColor = (level: number) => {
    switch (level) {
      case 5: return "bg-[#ea6549]";
      case 4: return "bg-[#ee846d]";
      case 3: return "bg-[rgba(234,101,73,0.5)]";
      case 2: return "bg-[#fbe0db]";
      case 1: return "bg-[#fcefec]";
      default: return "bg-gray-50";
    }
  };

  const calendarCells: { day: number; inMonth: boolean; heat: number }[] = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({ day: prevMonthDays - startOffset + 1 + i, inMonth: false, heat: 0 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, inMonth: true, heat: heatData[d] || 0 });
  }
  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      calendarCells.push({ day: i, inMonth: false, heat: 0 });
    }
  }

  const baseTopProducts = [
    { name: "ขมิ้นชันแคปซูล", cat: "สมุนไพรแคปซูล", sold: 1842, revenue: 110520 },
    { name: "ฟ้าทะลายโจร", cat: "สมุนไพรแคปซูล", sold: 1654, revenue: 82700 },
    { name: "ชาเก๊กฮวยออร์แกนิก", cat: "ชาสมุนไพร", sold: 1523, revenue: 91380 },
    { name: "น้ำผึ้งดอกลำไย", cat: "ผลิตภัณฑ์ออร์แกนิก", sold: 1389, revenue: 97230 },
    { name: "ใบบัวบกแคปซูล", cat: "สมุนไพรแคปซูล", sold: 1245, revenue: 74700 },
    { name: "น้ำมันมะพร้าวสกัดเย็น", cat: "น้ำมันสมุนไพร", sold: 1102, revenue: 154280 },
    { name: "เห็ดหลินจือสกัด", cat: "สมุนไพรสกัด", sold: 987, revenue: 138180 },
    { name: "ชาตะไคร้แห้ง", cat: "ชาสมุนไพร", sold: 876, revenue: 43800 },
    { name: "ขิงผงออร์แกนิก", cat: "ผงสมุนไพร", sold: 812, revenue: 64960 },
    { name: "สบู่สมุนไพรขมิ้น", cat: "ของใช้ออร์แกนิก", sold: 745, revenue: 111750 },
  ];

  const baseTopCustomers = [
    { name: "คุณสมชาย", email: "somchai@email.com", orders: 1842, total: 25520 },
    { name: "คุณสมพรหญิง", email: "somying@email.com", orders: 1654, total: 22700 },
    { name: "คุณทานตะวัน", email: "tantawan@email.com", orders: 1523, total: 21380 },
    { name: "คุณสายฝน", email: "saifon@email.com", orders: 1389, total: 19230 },
    { name: "คุณฟ้าใส", email: "fasai@email.com", orders: 1245, total: 18700 },
    { name: "คุณทะเล", email: "talay@email.com", orders: 1102, total: 17280 },
    { name: "คุณภูเขา", email: "phukao@email.com", orders: 987, total: 16180 },
    { name: "คุณคำธาร", email: "lumtan@email.com", orders: 876, total: 15800 },
    { name: "คุณแม่น้ำ", email: "maenam@email.com", orders: 812, total: 14960 },
    { name: "คุณอวกาศ", email: "awakas@email.com", orders: 745, total: 13750 },
  ];

  const BahtIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={svgPaths.p19084720} fill="black" /></svg>
  );
  const DownArrow = () => (
    <svg width="10" height="5" viewBox="0 0 13 5" fill="none"><path d={svgPaths.p1d9de400} stroke="#ea6549" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  const UpArrow = () => (
    <svg width="10" height="5" viewBox="0 0 13 5" fill="none"><path d="M1 4.5L6.5 1L12 4.5" stroke="#319754" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );

  const seed = (a: number, b: number) => ((a * 137 + b * 293 + 7) % 100);
  const monthlyVisits = [3200, 2800, 4100, 3600, 2900, 3500, 4500, 3100, 2600, 3800, 4200, 2700];
  const monthlyOrders = [480, 390, 620, 510, 430, 560, 710, 450, 370, 580, 640, 400];
  const monthlySalesData = [96000, 78000, 124000, 102000, 86000, 112000, 142000, 90000, 74000, 116000, 128000, 80000];
  const dailyVisits = (day: number) => 50 + seed(currentMonth, day) * 3;
  const dailyOrders = (day: number) => 5 + seed(currentMonth + 3, day) * 0.5;
  const dailySalesVal = (day: number) => 1000 + seed(currentMonth + 7, day) * 120;

  const productImageMap: Record<string, string> = {
    "ขมิ้นชันแคปซูล": "https://picsum.photos/seed/turmeric-capsule/200",
    "ฟ้าทะลายโจร": "https://picsum.photos/seed/andrographis/200",
    "ชาเก๊กฮวยออร์แกนิก": "https://picsum.photos/seed/chrysanthemum-tea/200",
    "น้ำผึ้งดอกลำไย": "https://picsum.photos/seed/longan-honey/200",
    "ใบบัวบกแคปซูล": "https://picsum.photos/seed/centella/200",
    "น้ำมันมะพร้าวสกัดเย็น": "https://picsum.photos/seed/coconut-oil/200",
    "เห็ดหลินจือสกัด": "https://picsum.photos/seed/lingzhi/200",
    "ชาตะไคร้แห้ง": "https://picsum.photos/seed/lemongrass-tea/200",
    "ขิงผงออร์แกนิก": "https://picsum.photos/seed/ginger-powder/200",
    "สบู่สมุนไพรขมิ้น": "https://picsum.photos/seed/turmeric-soap/200",
  };
  const productThumb = (name: string) =>
    productImageMap[name] ?? `https://picsum.photos/seed/${encodeURIComponent(name)}/200`;

  const dailySalesOrders = (day: number) => {
    const orderCount = 2 + (seed(currentMonth + 11, day) % 3); // 2-4 orders
    return Array.from({ length: orderCount }, (_, oi) => {
      const c = baseTopCustomers[(seed(currentMonth + 5, day) + oi * 3) % baseTopCustomers.length];
      const itemCount = 1 + (seed(currentMonth + oi * 7, day) % 3); // 1-3 items per order
      const items = Array.from({ length: itemCount }, (_, ii) => {
        const p = baseTopProducts[(seed(currentMonth + oi * 13 + ii * 5, day)) % baseTopProducts.length];
        const qty = 1 + (seed(currentMonth + oi + ii, day) % 3);
        const unit = Math.round(p.revenue / Math.max(p.sold, 1));
        return { name: p.name, category: p.cat, qty, unit, subtotal: qty * unit };
      });
      const orderTotal = items.reduce((s, x) => s + x.subtotal, 0);
      const orderSeq = String(1 + oi + (seed(currentMonth, day) % 90)).padStart(4, "0");
      const orderId = `ORD-${currentYear}${String(currentMonth + 1).padStart(2, "0")}${String(day).padStart(2, "0")}-${orderSeq}`;
      const time = `${String((seed(currentMonth + oi * 3, day) % 12) + 8).padStart(2, "0")}:${String((seed(currentMonth + oi * 7, day) % 60)).padStart(2, "0")}`;
      return { id: orderId, buyer: c.name, buyerEmail: c.email, time, items, total: orderTotal };
    });
  };

  // Scoped Top Product / Top Customers — filter by calendar selection
  // monthly view → daily scope (~1/30), yearly view → monthly scope (full base values)
  const scopeSeed = viewMode === "monthly"
    ? seed(currentMonth + 13, selectedDate)
    : seed(currentYear + 17, currentMonth);
  const scopeScale = viewMode === "monthly" ? 1 / 30 : 1;
  const rotate = <T,>(arr: T[], by: number) => [...arr.slice(by), ...arr.slice(0, by)];

  const topProducts = rotate(baseTopProducts, scopeSeed % baseTopProducts.length)
    .map((p, i) => ({
      ...p,
      sold: Math.max(1, Math.round(p.sold * scopeScale * (1 - i * 0.04))),
      revenue: Math.max(1, Math.round(p.revenue * scopeScale * (1 - i * 0.04))),
    }))
    .sort((a, b) => b.sold - a.sold);

  const topCustomers = rotate(baseTopCustomers, (scopeSeed + 3) % baseTopCustomers.length)
    .map((c, i) => ({
      ...c,
      orders: Math.max(1, Math.round(c.orders * scopeScale * (1 - i * 0.04))),
      total: Math.max(1, Math.round(c.total * scopeScale * (1 - i * 0.04))),
    }))
    .sort((a, b) => b.orders - a.orders);

  const maxSold = topProducts[0].sold;
  const maxOrders = topCustomers[0].orders;

  const scopeLabel = viewMode === "monthly"
    ? `${selectedDate} ${monthNames[currentMonth]} ${currentYear + 543}`
    : `${monthNames[currentMonth]} ${currentYear + 543}`;
  const yearlyVisits = monthlyVisits.reduce((a, b) => a + b, 0);
  const yearlyOrders = monthlyOrders.reduce((a, b) => a + b, 0);
  const yearlySales = monthlySalesData.reduce((a, b) => a + b, 0);
  const prevMo = currentMonth > 0 ? currentMonth - 1 : 11;
  const pct = (cur: number, prev: number) => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : 0;
  const monthVisitChg = pct(monthlyVisits[currentMonth], monthlyVisits[prevMo]);
  const monthOrderChg = pct(monthlyOrders[currentMonth], monthlyOrders[prevMo]);
  const monthSalesChg = pct(monthlySalesData[currentMonth], monthlySalesData[prevMo]);
  const prevDay = selectedDate > 1 ? selectedDate - 1 : 1;
  const dayVisitChg = pct(dailyVisits(selectedDate), dailyVisits(prevDay));
  const dayOrderChg = pct(dailyOrders(selectedDate), dailyOrders(prevDay));
  const daySalesChg = pct(dailySalesVal(selectedDate), dailySalesVal(prevDay));
  const fmt = (n: number) => Math.round(n).toLocaleString("th-TH");
  const ChgRow = ({ value, label }: { value: number; label: string }) => {
    const up = value >= 0;
    return (
      <div className="flex items-center gap-1 mt-2">
        {up ? <UpArrow /> : <DownArrow />}
        <span className={`${font} text-[11px] ${up ? "text-[#319754]" : "text-[#ea6549]"}`}>~{Math.abs(value)}% <span className="text-gray-400">% เปลี่ยนแปลงจาก{label}</span></span>
      </div>
    );
  };

  return (
    <div>
      <h2 className={`${font} text-[24px] mb-6`} style={{ fontWeight: 500 }}>Dashboard</h2>

      {/* Wallet (left) + Order tracking (right) — side by side on xl */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5 items-stretch">
      {/* Wallet — brand-green card with wallet illustration center-bottom overlapping right cards */}
      <div className="group bg-[#319754] rounded-2xl flex items-stretch overflow-hidden shadow-[0px_4px_16px_rgba(49,151,84,0.22)] min-h-[220px] relative">
        {/* Wallet illustration positioned on outer card, center-bottom, extending below */}
        <motion.img
          src={imgWalletIllust}
          alt=""
          className="absolute bottom-[-40px] left-[calc(50%-29px)] -translate-x-1/2 size-[178px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 z-0"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          aria-hidden
        />
        {/* Left: hero — กระเป๋าตังค์ + ยอดพร้อมถอน */}
        <div className="flex-1 flex flex-col items-start justify-between p-4 relative min-w-0 z-10">
          <p className={`${font} text-[14px] text-white whitespace-nowrap`} style={{ fontWeight: 700 }}>กระเป๋าตังค์</p>
          <div className="flex flex-col gap-[10px] items-start">
            <p className={`${font} text-[12px] text-white/85 whitespace-nowrap`}>ยอดพร้อมถอน</p>
            <p className={`${font} text-[24px] text-white tabular-nums leading-none whitespace-nowrap`} style={{ fontWeight: 700 }}>
              <AnimatedValue value="฿2,775.21" />
            </p>
            <p className={`${font} text-[12px] text-white/85 whitespace-nowrap`}>+12.5% เทียบเดือนก่อน</p>
            <button className={`${font} bg-white hover:bg-gray-50 text-[#287745] h-10 w-[110px] rounded-full text-[13px] inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.12)]`}
              style={{ fontWeight: 600 }}>
              <Wallet className="size-3.5" />
              ถอนเงิน
            </button>
          </div>
        </div>

        {/* Right: stacked Escrow + รายได้สะสม cards (overlap wallet image) */}
        <div className="flex-1 flex flex-col gap-[10px] p-[10px] min-w-0 relative z-10">
          {/* ยอด Escrow */}
          <div className="bg-white/15 backdrop-blur-[10px] rounded-2xl flex-1 flex flex-col gap-2 items-start p-4 overflow-hidden">
            <div className={`flex items-center gap-1.5`}>
              <p className={`${font} text-[10px] text-white whitespace-nowrap`}>ยอด Escrow</p>
              <span className="inline-flex items-center justify-center size-2.5 rounded-full border border-white/50 text-[7px] text-white/80">i</span>
            </div>
            <p className={`${font} text-[20px] text-white tabular-nums leading-none whitespace-nowrap`} style={{ fontWeight: 700 }}>
              <AnimatedValue value="฿1,370.6" />
            </p>
            <p className={`${font} text-[10px] text-white/85 whitespace-nowrap`}>8 ออเดอร์รอ</p>
          </div>
          {/* รายได้สะสม */}
          <div className="bg-white/15 backdrop-blur-[10px] rounded-2xl flex-1 flex flex-col gap-2 items-start p-4 overflow-hidden">
            <p className={`${font} text-[10px] text-white whitespace-nowrap`}>รายได้สะสม</p>
            <p className={`${font} text-[20px] text-white tabular-nums leading-none whitespace-nowrap`} style={{ fontWeight: 700 }}>
              <AnimatedValue value="฿2,775.21" />
            </p>
            <p className={`${font} text-[10px] text-white/85 whitespace-nowrap`}>+18.2% MTD</p>
          </div>
        </div>
      </div>

      {/* Order tracking — quick status overview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className={`${font} text-[14px] text-[#101828]`} style={{ fontWeight: 700 }}>ติดตามคำสั่งซื้อ</h3>
            <span className={`${font} text-[11px] text-gray-400`}>ทั้งหมด</span>
          </div>
          <button onClick={() => onViewOrders?.()}
            className={`${font} text-[11px] inline-flex items-center gap-0.5 text-[#319754] hover:text-[#287745] cursor-pointer transition-colors`}
            style={{ fontWeight: 600 }}>
            ดูทั้งหมด
            <ChevronRight className="size-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1">
          {[
            { id: "pending_payment" as OrderFilterTab, label: "รอชำระเงิน", count: countByStatus("pending_payment"), accent: "#ff3b30", Icon: Wallet },
            { id: "pending_verify" as OrderFilterTab, label: "รอตรวจสอบ", count: countByStatus("pending_verify"), accent: "#f59e0b", Icon: ScanSearch },
            { id: "ready_ship" as OrderFilterTab, label: "พร้อมจัดส่ง", count: countByStatus("ready_ship"), accent: "#3b82f6", Icon: PackageCheck },
            { id: "shipping" as OrderFilterTab, label: "กำลังจัดส่ง", count: countByStatus("shipping"), accent: "#319754", Icon: Truck },
            { id: "shipped" as OrderFilterTab, label: "ส่งสำเร็จ", count: countByStatus("shipped"), accent: "#10b981", Icon: Check },
            { id: "cancelled" as OrderFilterTab, label: "ยกเลิก", count: countByStatus("cancelled"), accent: "#6b7280", Icon: PackageX },
          ].map((s) => (
            <button key={s.id} onClick={() => onViewOrders?.(s.id)}
              className="group bg-[#fafbfc] hover:bg-[#e8f7ed] border border-transparent hover:border-[#319754] rounded-2xl p-4 text-left transition-all cursor-pointer flex flex-col gap-2">
              <div className="flex items-center justify-between gap-1.5">
                <p className={`${font} text-[10px] text-[#101828] truncate`}>{s.label}</p>
                <div className="size-[25px] rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shrink-0" style={{ backgroundColor: `${s.accent}1a` }}>
                  <s.Icon className="size-3.5" style={{ color: s.accent }} />
                </div>
              </div>
              <p className={`${font} text-[22px] text-[#101828] tabular-nums leading-none`} style={{ fontWeight: 700 }}>
                <AnimatedValue value={String(s.count)} />
              </p>
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* Top section: Calendar + Stats */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8">
        {/* Calendar / Year Heatmap */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex-1 min-w-0 xl:basis-1/2">
          {/* Row 1: label + legend */}
          <div className="flex items-center justify-between mb-4">
            <p className={`${font} text-[14px] text-[#a4a4a4]`}>{viewMode === "monthly" ? "ประจำเดือน" : "ประจำปี"}</p>
            <div className="flex items-center gap-2.5 h-10">
              <div className="flex items-center gap-1.5"><span className={`${font} text-[12px]`}>สูง</span><div className="size-3 rounded-full bg-[#ea6549]" /></div>
              <div className="size-3 rounded-full bg-[#ee846d]" />
              <div className="size-3 rounded-full bg-[rgba(234,101,73,0.5)]" />
              <div className="size-3 rounded-full bg-[#fbe0db]" />
              <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-[#fcefec]" /><span className={`${font} text-[12px]`}>ต่ำ</span></div>
            </div>
          </div>

          {/* Row 2: nav + toggle */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              {viewMode === "monthly" ? (
                <>
                  <button onClick={() => setCurrentMonth(m => m > 0 ? m - 1 : 11)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className={`${font} text-[24px]`} style={{ fontWeight: 700 }}>{monthNames[currentMonth]} {currentYear + 543}</span>
                  <button onClick={() => setCurrentMonth(m => m < 11 ? m + 1 : 0)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors rotate-180">
                    <ChevronLeft className="size-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setCurrentYear(y => y - 1)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className={`${font} text-[24px]`} style={{ fontWeight: 700 }}>{currentYear + 543}</span>
                  <button onClick={() => setCurrentYear(y => y + 1)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors rotate-180">
                    <ChevronLeft className="size-3.5" />
                  </button>
                </>
              )}
            </div>
            <div className="bg-white flex items-center overflow-clip p-[4px] rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)]">
              {([
                { id: "monthly" as const, label: "รายเดือน" },
                { id: "yearly" as const, label: "รายปี" },
              ]).map((vm) => (
                <button key={vm.id} onClick={() => setViewMode(vm.id)}
                  className={`${font} text-[14px] cursor-pointer px-3 py-1 rounded-full relative transition-colors ${viewMode === vm.id ? "text-white" : "text-black"}`}
                  style={{ fontWeight: viewMode === vm.id ? 500 : 400 }}>
                  {viewMode === vm.id && (
                    <motion.div layoutId="overview-viewmode-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative z-10">{vm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {viewMode === "monthly" ? (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-3 mb-3">
                {dayNames.map(d => (
                  <div key={d} className={`${font} text-[14px] text-center text-black`}>{d}</div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-3">
                {calendarCells.map((cell, i) => {
                  const isSelected = cell.inMonth && cell.day === selectedDate;
                  const isOutside = !cell.inMonth;
                  return (
                    <button key={i}
                      onClick={() => cell.inMonth && setSelectedDate(cell.day)}
                      className={`aspect-square rounded-xl flex items-center justify-center text-[14px] ${font} cursor-pointer transition-all duration-200 relative
                        ${isOutside ? "bg-[#f5f5f5] text-[#a3a3a3] hover:bg-[#ebebeb]" : isSelected ? "bg-[#f1340c] text-white hover:bg-[#d92e0a] shadow-[0px_2px_8px_rgba(241,52,12,0.35)]" : getHeatColor(cell.heat) + " text-black hover:scale-110 hover:shadow-[0px_3px_10px_rgba(0,0,0,0.12)] hover:z-10"}
                        ${cell.inMonth && !isSelected && cell.heat === 0 ? "!bg-[#f5f5f5] hover:!bg-[#ebebeb]" : ""}`}>
                      {cell.day}
                      {isSelected && <div className="absolute inset-0 rounded-xl border-[1.5px] border-[#890404] pointer-events-none" />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Yearly: 3 rows x 4 cols month grid */
            <div className="grid grid-cols-4 gap-4">
              {monthNames.map((mName, mi) => {
                const heat = monthlyHeatData[mi] || 0;
                const isSelected = mi === currentMonth;
                return (
                  <button key={mi}
                    onClick={() => { setCurrentMonth(mi); setViewMode("monthly"); }}
                    className={`aspect-[4/3] rounded-xl flex items-end justify-center pb-3 text-[14px] ${font} cursor-pointer transition-all duration-200 relative
                      ${isSelected ? "bg-[#f1340c] text-white hover:bg-[#d92e0a] shadow-[0px_2px_8px_rgba(241,52,12,0.35)]" : getHeatColor(heat) + " text-black hover:scale-105 hover:shadow-[0px_3px_10px_rgba(0,0,0,0.12)] hover:z-10"}
                      ${heat === 0 && !isSelected ? "!bg-[#f5f5f5] hover:!bg-[#ebebeb]" : ""}`}>
                    {mName}
                    {isSelected && <div className="absolute inset-0 rounded-xl border-[1.5px] border-[#890404] pointer-events-none" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right stats */}
        <div className="flex flex-col gap-3 flex-1 xl:basis-1/2">
          {/* Row 1: sales — light green highlight card */}
          <div className="bg-gradient-to-br from-white to-[#f0faf3] rounded-2xl p-5 border border-[#e0f0e5] shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(49,151,84,0.1)] transition-shadow">
            <div className="flex items-center justify-between">
              <p className={`${font} text-[12px] text-[#3d7d52]`} style={{ fontWeight: 500 }}>{viewMode === "yearly" ? "ยอดขายรายปี" : "ยอดขายรายเดือน"}</p>
              <div className="size-8 rounded-full bg-[#319754]/15 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#287745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className={`${font} text-[28px] text-[#287745] tabular-nums`} style={{ fontWeight: 700 }}><AnimatedValue value={fmt(viewMode === "yearly" ? yearlySales : monthlySalesData[currentMonth])} /></span>
              <span className={`${font} text-[13px] text-[#3d7d52]/80`}>บาท</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-1 min-w-0">
                {(viewMode === "yearly" ? 15 : monthSalesChg) >= 0 ? <UpArrow /> : <DownArrow />}
                <span className={`${font} text-[11px] text-[#3d7d52] truncate`}>~{Math.abs(viewMode === "yearly" ? 15 : monthSalesChg)}% <span className="text-[#3d7d52]/65">% เปลี่ยนแปลงจาก{viewMode === "yearly" ? "ปีก่อน" : "เดือนก่อน"}</span></span>
              </div>
              <button onClick={() => setSalesPopupScope(viewMode === "yearly" ? "year" : "month")}
                className={`${font} text-[11px] inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-50 text-gray-600 px-3 rounded-full cursor-pointer transition-colors shrink-0 h-8`}
                style={{ fontWeight: 600 }}>
                <Eye className="size-3" />
                ดูรายละเอียด
              </button>
            </div>
          </div>

          {/* Row 2: visits + orders */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "ยอดเข้าชมรายปี" : "ยอดเข้าชมรายเดือน"}</p>
                <div className="size-8 rounded-full bg-[#319754]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}><AnimatedValue value={fmt(viewMode === "yearly" ? yearlyVisits : monthlyVisits[currentMonth])} /></span>
                <span className={`${font} text-[13px] text-gray-400`}>ครั้ง</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? 12 : monthVisitChg} label={viewMode === "yearly" ? "ปีก่อน" : "เดือนก่อน"} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "คำสั่งซื้อรายปี" : "คำสั่งซื้อรายเดือน"}</p>
                <div className="size-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}><AnimatedValue value={fmt(viewMode === "yearly" ? yearlyOrders : monthlyOrders[currentMonth])} /></span>
                <span className={`${font} text-[13px] text-gray-400`}>รายการ</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? 8 : monthOrderChg} label={viewMode === "yearly" ? "ปีก่อน" : "เดือนก่อน"} />
            </div>
          </div>

          {/* Row 3: sub-level visits + orders */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "ยอดเข้าชมรายเดือน" : "ยอดเข้าชมรายวัน"}</p>
                <div className="size-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}><AnimatedValue value={fmt(viewMode === "yearly" ? monthlyVisits[currentMonth] : dailyVisits(selectedDate))} /></span>
                <span className={`${font} text-[13px] text-gray-400`}>ครั้ง</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? monthVisitChg : dayVisitChg} label={viewMode === "yearly" ? "เดือนก่อน" : "วันก่อน"} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "คำสั่งซื้อรายเดือน" : "คำสั่งซื้อรายวัน"}</p>
                <div className="size-8 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}><AnimatedValue value={fmt(viewMode === "yearly" ? monthlyOrders[currentMonth] : dailyOrders(selectedDate))} /></span>
                <span className={`${font} text-[13px] text-gray-400`}>รายการ</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? monthOrderChg : dayOrderChg} label={viewMode === "yearly" ? "เดือนก่อน" : "วันก่อน"} />
            </div>
          </div>

          {/* Row 4: contextual sales */}
          <div className="bg-gradient-to-br from-white to-[#fef9f0] rounded-2xl border border-[#f0e6d4] p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(245,158,11,0.1)] transition-shadow">
            <div className="flex items-center justify-between">
              <p className={`${font} text-[12px] text-gray-400`}>
                {viewMode === "yearly"
                  ? `ยอดขาย ${monthNames[currentMonth]} ${currentYear + 543}`
                  : `ยอดขาย ${selectedDate} ${monthNames[currentMonth]} ${currentYear + 543}`}
              </p>
              <div className="size-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className={`${font} text-[26px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{fmt(viewMode === "yearly" ? monthlySalesData[currentMonth] : dailySalesVal(selectedDate))}</span>
              <span className={`${font} text-[13px] text-gray-400`}>บาท</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <ChgRow value={viewMode === "yearly" ? monthSalesChg : daySalesChg} label={viewMode === "yearly" ? "เดือนก่อน" : "วันก่อน"} />
              <button onClick={() => setSalesPopupScope(viewMode === "yearly" ? "month" : "day")}
                className={`${font} text-[11px] inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-50 text-gray-600 px-3 rounded-full cursor-pointer transition-colors shrink-0 mt-2 h-8`}
                style={{ fontWeight: 600 }}>
                <Eye className="size-3" />
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Top Product + Top Customers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className={`${font} text-[20px] mb-0.5`} style={{ fontWeight: 700 }}>Top Product</h3>
          <p className={`${font} text-[13px] text-gray-400 mb-4`}>10 อันดับสินค้าขายดี · {scopeLabel}</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${font} text-[13px] text-gray-500`}>
                  <th className="text-left pb-3 pr-2">#</th>
                  <th className="text-left pb-3 pr-4">สินค้า</th>
                  <th className="text-right pb-3 pr-4">ยอดขาย(ชิ้น)</th>
                  <th className="text-right pb-3">รายได้ (฿)</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-3 pr-2">
                      <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font} ${i < 3 ? "bg-[#ea6549] text-white" : "text-gray-500"}`} style={{ fontWeight: 600 }}>{i + 1}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <ImageWithFallback src={`https://picsum.photos/seed/${encodeURIComponent(p.name)}/120`} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`${font} text-[14px] truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                          <p className={`${font} text-[12px] text-gray-400 truncate`}>{p.cat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#4a90d9] rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                        </div>
                        <span className={`${font} text-[14px] w-12 text-right`}>{p.sold.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className={`py-3 text-right ${font} text-[14px]`}>{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className={`${font} text-[20px] mb-0.5`} style={{ fontWeight: 700 }}>Top Customers</h3>
          <p className={`${font} text-[13px] text-gray-400 mb-4`}>ยอดขายลูกค้าประจำ · {scopeLabel}</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${font} text-[13px] text-gray-500`}>
                  <th className="text-left pb-3 pr-2">#</th>
                  <th className="text-left pb-3 pr-4">ลูกค้า</th>
                  <th className="text-right pb-3 pr-4">คำสั่งซื้อ</th>
                  <th className="text-right pb-3">ยอดรวม (฿)</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-3 pr-2">
                      <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font} ${i < 3 ? "bg-[#ea6549] text-white" : "text-gray-500"}`} style={{ fontWeight: 600 }}>{i + 1}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{c.name}</p>
                      <p className={`${font} text-[12px] text-gray-400`}>{c.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#4a90d9] rounded-full" style={{ width: `${(c.orders / maxOrders) * 100}%` }} />
                        </div>
                        <span className={`${font} text-[14px] w-12 text-right`}>{c.orders.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className={`py-3 text-right ${font} text-[14px]`}>{c.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {salesPopupScope && (() => {
        // Build day-month tuples to aggregate based on scope
        const tasks: Array<[number, number]> = []; // [month, day]
        if (salesPopupScope === "day") {
          tasks.push([currentMonth, selectedDate]);
        } else if (salesPopupScope === "month") {
          const dim = new Date(currentYear, currentMonth + 1, 0).getDate();
          for (let d = 1; d <= dim; d++) tasks.push([currentMonth, d]);
        } else {
          for (let m = 0; m < 12; m++) {
            const dim = new Date(currentYear, m + 1, 0).getDate();
            for (let d = 1; d <= dim; d++) tasks.push([m, d]);
          }
        }

        // Note: dailySalesOrders is seeded by currentMonth — for year scope we approximate by reusing the helper across days.
        const byProduct = new Map<string, { name: string; category: string; unit: number; qty: number; sales: number }>();
        tasks.forEach(([_m, d]) => {
          dailySalesOrders(d).forEach((o) => o.items.forEach((it) => {
            const cur = byProduct.get(it.name);
            if (cur) { cur.qty += it.qty; cur.sales += it.subtotal; }
            else byProduct.set(it.name, { name: it.name, category: it.category, unit: it.unit, qty: it.qty, sales: it.subtotal });
          }));
        });
        const products = [...byProduct.values()]
          .map((p) => ({ ...p, cost: Math.round(p.sales * 0.45) }))
          .sort((a, b) => b.sales - a.sales);
        const totalSum = products.reduce((s, p) => s + p.sales, 0);
        const totalQty = products.reduce((s, p) => s + p.qty, 0);
        const title = salesPopupScope === "day"
          ? `รายการขาย ${selectedDate} ${monthNames[currentMonth]} ${currentYear + 543}`
          : salesPopupScope === "month"
            ? `รายการขาย ${monthNames[currentMonth]} ${currentYear + 543}`
            : `รายการขาย ปี ${currentYear + 543}`;
        const emptyText = salesPopupScope === "day" ? "ไม่มีรายการขายในวันนี้"
          : salesPopupScope === "month" ? "ไม่มีรายการขายในเดือนนี้"
          : "ไม่มีรายการขายในปีนี้";
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSalesPopupScope(null)}>
            <div className="bg-white rounded-2xl overflow-hidden w-full max-w-[720px] max-h-[85vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 700 }}>{title}</h3>
                  <p className={`${font} text-[13px] text-gray-400 mt-0.5`}>
                    ยอดรวม <span className="text-[#319754]" style={{ fontWeight: 600 }}>{totalSum.toLocaleString()} บาท</span> · {totalQty} ชิ้น · {products.length} รายการ
                  </p>
                </div>
                <button onClick={() => setSalesPopupScope(null)}
                  className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                  <X className="size-4 text-gray-600" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/50">
                {products.map((p, i) => {
                  const profit = p.sales - p.cost;
                  const margin = p.sales > 0 ? (profit / p.sales) * 100 : 0;
                  const profitLow = margin < 55;
                  return (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start gap-3">
                        <div className="size-12 rounded-lg overflow-hidden shrink-0">
                          <ImageWithFallback src={productThumb(p.name)} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 600 }} title={p.name}>{p.name}</p>
                          <p className={`${font} text-[11px] text-gray-400 truncate`}>{p.category}</p>
                          <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{p.unit.toLocaleString()} ฿/ชิ้น</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-50">
                        <div>
                          <p className={`${font} text-[10px] text-gray-400`}>จำนวน</p>
                          <p className={`${font} text-[14px] text-[#1a1a1a] mt-0.5`} style={{ fontWeight: 600 }}>{p.qty} <span className="text-[10px] text-gray-400">ชิ้น</span></p>
                        </div>
                        <div>
                          <p className={`${font} text-[10px] text-gray-400`}>ยอดขาย</p>
                          <p className={`${font} text-[14px] text-[#319754] mt-0.5`} style={{ fontWeight: 700 }}>฿{p.sales.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className={`${font} text-[10px] text-gray-400`}>ต้นทุน</p>
                          <p className={`${font} text-[14px] text-gray-600 mt-0.5`} style={{ fontWeight: 500 }}>฿{p.cost.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <p className={`${font} text-[11px] text-gray-400`}>กำไร / มาร์จิ้น</p>
                        <p className={`${font} text-[14px]`} style={{ fontWeight: 700, color: profitLow ? "#dc2626" : "#15803d" }}>
                          ฿{profit.toLocaleString()} <span className="text-[11px]">· {margin.toFixed(1)}%</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
                {products.length === 0 && (
                  <div className={`${font} col-span-full text-center py-10 text-[13px] text-gray-400`}>{emptyText}</div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ========== FINANCE TAB ========== */
const financeTransactions = [
  { date: "16 มี.ค. 2569 14:42", type: "ค่าธรรมเนียม GP", typeColor: "bg-[#ff9500] text-white", order: "#ORD-20260316-202753-1", amount: "-฿3.96", balance: "฿0.00" },
  { date: "16 มี.ค. 2569 14:42", type: "ปล่อยยอด", typeColor: "bg-[#319754] text-white", order: "#ORD-20260316-202753-1", amount: "+฿115.24", balance: "฿0.00" },
  { date: "16 มี.ค. 2569 14:41", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260316-202753-1", amount: "-฿119.20", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:52", type: "ค่าธรรมเนียม GP", typeColor: "bg-[#ff9500] text-white", order: "#ORD-20260313-472419-1", amount: "-฿5.56", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:52", type: "ปล่อยยอด", typeColor: "bg-[#319754] text-white", order: "#ORD-20260313-472419-1", amount: "+฿105.64", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:44", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260313-472419-1", amount: "-฿111.20", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:21", type: "ค่าธรรมเนียม GP", typeColor: "bg-[#ff9500] text-white", order: "#ORD-20260313-288830-1", amount: "-฿17.32", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:21", type: "ปล่อยยอด", typeColor: "bg-[#319754] text-white", order: "#ORD-20260313-288830-1", amount: "+���329.08", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:18", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260313-288830-1", amount: "-฿346.40", balance: "฿0.00" },
  { date: "12 มี.ค. 2569 19:00", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260312-108642-1", amount: "-฿160.00", balance: "฿0.00" },
];

function FinanceTab({ onBankSettings }: { onBankSettings: () => void }) {
  const [activeView, setActiveView] = useState<"all" | "withdraw">("all");
  const [selectedMonth, setSelectedMonth] = useState("มี.ค. 2569");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const monthOptions = [
    { value: "มี.ค. 2569", label: "มีนาคม" },
    { value: "ก.พ. 2569", label: "กุมภาพันธ์" },
    { value: "ม.ค. 2569", label: "มกราคม" },
  ];
  const filteredTx = financeTransactions.filter((tx) => tx.date.includes(selectedMonth));
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className={`${fontBold} text-[22px]`} style={{ fontWeight: 700 }}>กระเป๋าเงิน</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>จัดการรายได้และการถอนเงินของร้านค้า</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBankSettings} className={`border border-gray-300 text-gray-700 px-5 py-2 rounded-full text-[14px] ${font} cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-1.5`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            ตั้งค่าการเงิน
          </button>
          <button className={`bg-[#319754] text-white px-5 py-2 rounded-full text-[14px] ${font} cursor-pointer hover:bg-[#2a8348] transition-colors`}>ถอนเงิน</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "ยอดพร้อมถอน", value: "฿663.96", icon: "💰", gradient: "from-[#319754] to-[#46A165]", text: "text-white", sub: "text-white/70" },
          { label: "ยอด ESCROW ⓘ", value: "฿697.00", icon: "🔒", gradient: "from-[#007aff] to-[#339af0]", text: "text-white", sub: "text-white/70" },
          { label: "รายได้สะสม", value: "฿663.96", icon: "📈", gradient: "from-[#ff9500] to-[#ffb340]", text: "text-white", sub: "text-white/70" },
          { label: "ถอนไปแล้ว", value: "฿0.00", icon: "🏦", gradient: "from-gray-50 to-white", text: "text-gray-800", sub: "text-gray-500", isBorder: true },
        ].map((c) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.gradient} rounded-2xl p-5 relative overflow-hidden ${c.isBorder ? "border border-gray-200" : "shadow-sm"}`}>
            <div className="absolute -top-3 -right-3 text-[48px] opacity-15 select-none">{c.icon}</div>
            <p className={`${font} text-[12px] ${c.sub} mb-2`}>{c.label}</p>
            <p className={`${fontBold} text-[24px] ${c.text}`} style={{ fontWeight: 700 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
          <p className={`${fontBold} text-[16px]`} style={{ fontWeight: 600 }}>รายการเคลื่อนไหวล่าสุด</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className={`${font} bg-[#fafafa] flex items-center gap-[24px] px-[24px] py-[6px] rounded-[100px] cursor-pointer text-[14px] text-black`} style={{ fontWeight: 400 }}>
                {monthOptions.find(m => m.value === selectedMonth)?.label}
                <svg className="w-[16px] h-[9px] shrink-0" fill="none" viewBox="0 0 16 9">
                  <path d={svgChevron.p2aea2180} fill="black" fillOpacity="0.85" />
                </svg>
              </button>
              {showMonthDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMonthDropdown(false)} />
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[160px]">
                    {monthOptions.map((m) => (
                      <button key={m.value} onClick={() => { setSelectedMonth(m.value); setShowMonthDropdown(false); }}
                        className={`${font} w-full text-left px-4 py-2 text-[14px] cursor-pointer hover:bg-gray-50 transition-colors ${selectedMonth === m.value ? "text-[#319754]" : "text-gray-700"}`}
                        style={{ fontWeight: selectedMonth === m.value ? 500 : 400 }}>
                        {m.label}{selectedMonth === m.value && " ✓"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="bg-white flex items-center overflow-clip p-[4px] rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] w-fit">
              <button onClick={() => setActiveView("all")}
                className={`${font} text-[14px] cursor-pointer backdrop-blur-[2px] flex items-center justify-center px-[12px] py-[4px] rounded-[100px] transition-colors ${activeView === "all" ? "bg-[#319754] text-white" : "text-black"}`} style={{ fontWeight: activeView === "all" ? 500 : 400 }}>ดูทั้งหมด</button>
              <button onClick={() => setActiveView("withdraw")}
                className={`${font} text-[14px] cursor-pointer backdrop-blur-[2px] flex items-center justify-center px-[12px] py-[4px] rounded-[100px] transition-colors ${activeView === "withdraw" ? "bg-[#319754] text-white" : "text-black"}`} style={{ fontWeight: activeView === "withdraw" ? 500 : 400 }}>ประวัติการถอน</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-100">
                <th className={`${font} text-[12px] text-gray-500 text-left px-5 py-3`} style={{ fontWeight: 500 }}>วันที่</th>
                <th className={`${font} text-[12px] text-gray-500 text-left px-5 py-3`} style={{ fontWeight: 500 }}>ประเภท</th>
                <th className={`${font} text-[12px] text-gray-500 text-left px-5 py-3`} style={{ fontWeight: 500 }}>เลขออเดอร์</th>
                <th className={`${font} text-[12px] text-gray-500 text-right px-5 py-3`} style={{ fontWeight: 500 }}>จำนวนเงิน</th>
                <th className={`${font} text-[12px] text-gray-500 text-right px-5 py-3`} style={{ fontWeight: 500 }}>ยอดคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {(activeView === "all" ? filteredTx : []).map((tx, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className={`${font} text-[13px] text-gray-700 px-5 py-3 whitespace-nowrap`}>{tx.date}</td>
                  <td className="px-5 py-3">
                    <span className={`${font} text-[11px] px-2.5 py-1 rounded-md ${tx.typeColor}`} style={{ fontWeight: 500 }}>{tx.type}</span>
                  </td>
                  <td className={`${font} text-[13px] text-gray-700 px-5 py-3 whitespace-nowrap`}>{tx.order}</td>
                  <td className={`${font} text-[13px] text-right px-5 py-3 whitespace-nowrap ${tx.amount.startsWith("+") ? "text-[#319754]" : "text-gray-700"}`}>{tx.amount}</td>
                  <td className={`${font} text-[13px] text-gray-700 text-right px-5 py-3 whitespace-nowrap`}>{tx.balance}</td>
                </tr>
              ))}
              {activeView === "all" && filteredTx.length === 0 && (
                <tr><td colSpan={5} className={`${font} text-[13px] text-gray-400 text-center py-8`}>ไม่มีรายการในเดือนนี้</td></tr>
              )}
              {activeView === "withdraw" && (
                <tr><td colSpan={5} className={`${font} text-[13px] text-gray-400 text-center py-8`}>ยังไม่มีประวัติการถอน</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}

/* ========== BANK SETTINGS ========== */
const bankOptions = [
  { value: "KTB", label: "ธนาคารกรุงไทย", logo: bankLogoKTB },
  { value: "KBANK", label: "ธนาคารกสิกรไทย", logo: bankLogoKBANK },
  { value: "SCB", label: "ธนาคารไทยพาณิชย์", logo: bankLogoSCB },
  { value: "BBL", label: "ธนาคารกรุงเทพ", logo: bankLogoBBL },
  { value: "TTB", label: "ธนาคารทหารไทยธนชาต", logo: bankLogoTTB },
];

function BankSettingsTab({ onBack }: { onBack: () => void }) {
  const [editing, setEditing] = useState(false);
  const [bankData, setBankData] = useState({ bank: "KTB", account: "000-000-0000", name: "บริษัท เมต้าเฮิร์บ จำกัด" });
  const [draft, setDraft] = useState(bankData);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSave = () => {
    setBankData(draft);
    setEditing(false);
  };

  const selectedBank = bankOptions.find(b => b.value === bankData.bank) || bankOptions[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <button onClick={onBack} className="bg-[#d4d4d4] hover:bg-[#c4c4c4] flex gap-2.5 items-center justify-center px-4 py-1 rounded-full cursor-pointer transition-colors">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="rotate-180"><path d="M8 5.99654C8 5.82383 7.93314 5.66493 7.80612 5.54058L2.51294 0.17962C2.39264 0.0621761 2.24561 0 2.07184 0C1.73099 0 1.46365 0.26943 1.46365 0.62867C1.46365 0.80138 1.53049 0.960275 1.63742 1.07772L6.5029 5.99654L1.63742 10.9154C1.53049 11.0328 1.46365 11.1848 1.46365 11.3644C1.46365 11.7237 1.73099 11.9931 2.07184 11.9931C2.24561 11.9931 2.39264 11.9309 2.51294 11.8066L7.80612 6.4525C7.93314 6.32124 8 6.16925 8 5.99654Z" fill="black"/></svg>
            <span className={`${font} text-[12px] text-black`}>กลับ</span>
          </button>
          <h2 className={`${fontBold} text-[22px]`} style={{ fontWeight: 700 }}>ตั้งค่าการเงิน</h2>
        </div>
        <div className="pl-[82px]">
          <p className={`${font} text-[13px] text-[#6a7282]`}>จัดการบัญชีธนาคารสำหรับรับเงินจากการขาย</p>
        </div>
      </div>

      {/* Bank Card */}
      <div className="bg-white rounded-2xl p-4 w-full flex flex-col gap-4">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <h3 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>บัญชีธนาคารสำหรับรับเงิน</h3>
          {!editing ? (
            <button onClick={() => { setDraft(bankData); setEditing(true); }} className="bg-[#f2f2f7] hover:bg-[#e5e5ea] flex gap-2.5 items-center justify-center px-4 py-1 rounded-full cursor-pointer transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.00955 11.3122L10.0345 3.08148L8.74737 1.75248L0.714958 9.98325L0.0161701 11.6671C-0.0573865 11.8484 0.133861 12.0598 0.310397 11.9842L2.00955 11.3122ZM10.6819 2.43208L11.4248 1.68452C11.7999 1.29941 11.822 0.884102 11.4837 0.536747L11.2335 0.280008C10.9026 -0.0597926 10.498 -0.0295881 10.1228 0.347968L9.37992 1.10308L10.6819 2.43208Z" fill="black" fillOpacity="0.85"/></svg>
              <span className={`${font} text-[12px] text-black`}>แก้ไข</span>
            </button>
          ) : (
            <div className="flex gap-2.5 items-center">
              <button onClick={() => setEditing(false)} className="border border-[#ff3b30] flex items-center justify-center px-4 py-1 rounded-full cursor-pointer hover:bg-red-50 transition-colors">
                <span className={`${font} text-[12px] text-[#ff3b30]`}>ยกเลิก</span>
              </button>
              <button onClick={handleSave} className="bg-[#319754] hover:bg-[#2a8348] flex items-center justify-center px-4 py-1 rounded-full cursor-pointer transition-colors">
                <span className={`${font} text-[12px] text-white`}>บันทึก</span>
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#d4d4d8]" />

        {!editing ? (
          <>
            {/* Notice */}
            <div className="bg-[rgba(255,141,40,0.1)] px-2 py-1 rounded-full inline-flex self-start">
              <span className={`${font} text-[12px] text-[#ff9500]`}>เมื่อมีคำสั่งซื้อสำเร็จ Admin จะโอนเงินค่าสินค้า (หักค่าธรรมเนียม) ให้คุณผ่านบัญชีนี้</span>
            </div>

            {/* Bank info */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ธนาคาร</span>
              <div className="flex gap-2 items-center py-3">
                <img src={selectedBank.logo} alt="" className="w-7 h-7 object-contain rounded-full" />
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{selectedBank.label}</span>
              </div>
            </div>

            {/* Account number & name side by side */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <span className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>เลขที่บัญชี</span>
                <div className="py-3">
                  <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{bankData.account}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <span className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ชื่อบัญชี</span>
                <div className="py-3">
                  <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{bankData.name}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Notice */}
            <div className="bg-[rgba(255,141,40,0.1)] px-2 py-1 rounded-full inline-flex self-start">
              <span className={`${font} text-[12px] text-[#ff9500]`}>เมื่อมีคำสั่งซื้อสำเร็จ Admin จะโอนเงินค่าสินค้า (หักค่าธรรมเนียม) ให้คุณผ่านบัญชีนี้</span>
            </div>

            {/* Bank select */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ธนาคาร</label>
              <div className="relative w-full sm:w-1/2">
                {/* Custom dropdown trigger */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`bg-[#fafafa] h-[48px] w-full rounded-full px-6 py-3 text-[14px] ${font} outline-none cursor-pointer flex items-center gap-2.5 pr-12`}
                  style={{ fontWeight: 500 }}
                >
                  {(() => { const db = bankOptions.find(b => b.value === draft.bank); return db ? <><img src={db.logo} alt="" className="w-6 h-6 object-contain rounded-full shrink-0" /><span className="truncate">{db.label}</span></> : null; })()}
                </button>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none" className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}><path d="M7.83767 9C8.06314 9 8.28862 8.91545 8.44194 8.75493L15.4228 2.05352C15.5761 1.90986 15.6663 1.72394 15.6663 1.51268C15.6663 1.07323 15.3145 0.73521 14.8455 0.73521C14.6201 0.73521 14.4127 0.819718 14.2594 0.954933L7.35062 7.57182H8.31568L1.40699 0.954933C1.26269 0.819718 1.05525 0.73521 0.820745 0.73521C0.351748 0.73521 0 1.07323 0 1.51268C0 1.72394 0.0901917 1.90986 0.243518 2.06197L7.22436 8.75493C7.39572 8.91545 7.60316 9 7.83767 9Z" fill="black" fillOpacity="0.85"/></svg>
                </div>
                {/* Dropdown list */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute top-[52px] left-0 w-full bg-white rounded-2xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
                      {bankOptions.map(b => (
                        <button
                          key={b.value}
                          type="button"
                          onClick={() => { setDraft({ ...draft, bank: b.value }); setDropdownOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-6 py-3 hover:bg-[#f5f5f5] cursor-pointer transition-colors ${draft.bank === b.value ? "bg-[#f0faf3]" : ""}`}
                        >
                          <img src={b.logo} alt="" className="w-6 h-6 object-contain rounded-full shrink-0" />
                          <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{b.label}</span>
                          {draft.bank === b.value && (
                            <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Account number & name */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>เลขที่บัญชี</label>
                <input value={draft.account} onChange={(e) => setDraft({ ...draft, account: e.target.value })} placeholder="xxx-x-xxxxx-x" className={`bg-[#fafafa] h-[48px] w-full rounded-full px-6 py-3 text-[14px] ${font} outline-none`} style={{ fontWeight: 500 }} />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ชื่อบัญชี</label>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="ชื่อ-นามสกุล" className={`bg-[#fafafa] h-[48px] w-full rounded-full px-6 py-3 text-[14px] ${font} outline-none`} style={{ fontWeight: 500 }} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ========== COMPLAINTS DATA ========== */
type ComplaintStatus = "pending" | "in_progress" | "approved" | "completed" | "rejected";
type ComplaintType = "damaged" | "defective" | "return" | "refund" | "wrong_item";

interface Complaint {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  type: ComplaintType;
  status: ComplaintStatus;
  product: string;
  description: string;
  amount: number;
  refundChannel: string;
  createdAt: string;
  items: { name: string; qty: number; price: number; hasImage: boolean }[];
  timeline: { title: string; desc: string; date: string; done: boolean }[];
}

const typeLabels: Record<ComplaintType, string> = { damaged: "สินค้าเสียหาย", defective: "สินค้ามีตำหนิ", return: "คืนสินค้า", refund: "ขอเงินคืน", wrong_item: "สินค้าผิดรายการ" };
const statusLabels: Record<ComplaintStatus, string> = { pending: "รอดำเนินการ", in_progress: "กำลังดำเนินการ", approved: "อนุมัติแล้ว", completed: "เสร็จสิ้น", rejected: "ปฏิเสธ" };
const statusColors: Record<ComplaintStatus, string> = { pending: "bg-[#ff9500] text-white", in_progress: "bg-[#007aff] text-white", approved: "bg-[#319754] text-white", completed: "bg-gray-500 text-white", rejected: "bg-[#ff3b30] text-white" };
const typeTextColors: Record<ComplaintType, string> = { damaged: "text-[#ef4444]", defective: "text-[#f97316]", return: "text-[#3b82f6]", refund: "text-[#8b5cf6]", wrong_item: "text-[#eab308]" };

const mockComplaints: Complaint[] = [
  { id: "CPL-001", orderId: "ORD-20260301-5821", customer: "สมชาย ใจดี", customerEmail: "metaherb@gmail.com", customerPhone: "061-421-3111", type: "damaged", status: "in_progress", product: "ชาสมุนไพรเมต้าเฮิร์บ (กล่อง 30 ซอง)", description: "กล่องสินค้าบุบเสียหายอย่างหนัก ผลิตภัณฑ์ด้านในแตกออกและหกเลอะ ไม่สามารถใช้งานได้", amount: 450, refundChannel: "ธนาคารทหารไทยธนชาต [*1234]", createdAt: "15 มี.ค. 2569", items: [{ name: "ชาอูหลงผสมดอกหอมหมื่นลี้", qty: 1, price: 150, hasImage: true }, { name: "ชาเขียวมัทฉะผสมส้มยูซุ", qty: 1, price: 150, hasImage: false }, { name: "ชาเขียวมัทฉะลาเต้", qty: 1, price: 150, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "15 มี.ค. 2569 09:15", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "15 มี.ค. 2569 11:30", done: true }, { title: "อนุมัติและดำเนินการ", desc: "อยู่ระหว่างจัดส่งสินค้าทดแทน", date: "16 มี.ค. 2569 14:00", done: true }, { title: "จัดส่งสินค้าทดแทน", desc: "ส่งสินค้าทดแทนให้ลูกค้า", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-002", orderId: "ORD-20260228-015", customer: "วรรณา สุขสบาย", customerEmail: "wanna@email.com", customerPhone: "089-876-5432", type: "wrong_item", status: "pending", product: "ชาสมุนไพรรวม MetaHerb 30 ซอง", description: "สั่งชาสมุนไพรรวม แต่ได้รับชาดอกคาโมมายล์แทน", amount: 350, refundChannel: "ธนาคารไทยพาณิชย์ [*5432]", createdAt: "10 มี.ค. 2569", items: [{ name: "ชาสมุนไพรรวม MetaHerb 30 ซอง", qty: 1, price: 350, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "10 มี.ค. 2569 14:20", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "รอดำเนินการ", done: false }, { title: "อนุมัติและดำเนินการ", desc: "รอการพิจารณา", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-003", orderId: "ORD-20260225-008", customer: "ปราณี รักสมุนไพร", customerEmail: "pranee@email.com", customerPhone: "062-111-2222", type: "refund", status: "approved", product: "ครีมสมุนไพร MetaHerb 50g", description: "ใช้ผลิตภัณฑ์แล้วเกิดอาการแพ้ ต้องการขอเงินคืนเต็มจำนวน", amount: 890, refundChannel: "ธนาคารกรุงเทพ [*3333]", createdAt: "8 มี.ค. 2569", items: [{ name: "ครีมสมุนไพร MetaHerb 50g", qty: 1, price: 890, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "8 มี.ค. 2569 10:00", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "9 มี.ค. 2569 09:30", done: true }, { title: "อนุมัติและดำเนินการ", desc: "อนุมัติคืนเงินเรียบร้อย", date: "10 มี.ค. 2569 14:00", done: true }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-004", orderId: "ORD-20260220-022", customer: "อนุชา ต้นไม้", customerEmail: "anucha@email.com", customerPhone: "095-333-4444", type: "return", status: "completed", product: "เซ็ตสมุนไพรบำรุงผิว MetaHerb", description: "สินค้าที่ได้รับไม่ตรงกับรูปและรายละเอียดที่แสดงบนเว็บไซต์", amount: 1250, refundChannel: "ธนาคารกสิกรไทย [*4444]", createdAt: "5 มี.ค. 2569", items: [{ name: "เซ็ตสมุนไพรบำรุงผิว MetaHerb", qty: 1, price: 1250, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "5 มี.ค. 2569 08:30", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานตรวจสอบเสร็จสิ้น", date: "6 มี.ค. 2569 10:00", done: true }, { title: "อนุมัติและดำเนินการ", desc: "อนุมัติคืนสินค้าเรียบร้อย", date: "7 มี.ค. 2569 11:00", done: true }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียนเรียบร้อย", date: "10 มี.ค. 2569 16:00", done: true }] },
  { id: "CPL-005", orderId: "ORD-20260218-030", customer: "มานะ ขยันดี", customerEmail: "mana@email.com", customerPhone: "087-555-6666", type: "defective", status: "rejected", product: "น้ำมันไพล MetaHerb 50ml", description: "ฝาขวดปิดไม่สนิท น้ำมันไหลซึมออกมา", amount: 195, refundChannel: "ธนาคารกรุงไทย [*6666]", createdAt: "1 มี.ค. 2569", items: [{ name: "น้ำมันไพล MetaHerb 50ml", qty: 1, price: 195, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "1 มี.ค. 2569 13:00", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานตรวจสอบเสร็จสิ้น", date: "2 มี.ค. 2569 09:00", done: true }, { title: "ปฏิเสธคำร้อง", desc: "ไม่อยู่ในเงื่อนไขการรับประกัน", date: "3 มี.ค. 2569 10:00", done: true }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-006", orderId: "ORD-20260315-011", customer: "จิราภรณ์ ดอกไม้", customerEmail: "jira@email.com", customerPhone: "063-777-8888", type: "damaged", status: "pending", product: "สบู่สมุนไพร MetaHerb 3 ก้อน", description: "กล่องพัสดุถูกทับจนบุบ สินค้าข้างในเสียรูป", amount: 450, refundChannel: "ธนาคารกสิกรไทย [*8888]", createdAt: "17 มี.ค. 2569", items: [{ name: "สบู่สมุนไพร MetaHerb 3 ก้อน", qty: 1, price: 450, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "17 มี.ค. 2569 10:45", done: true }, { title: "ตรวจสอบข้อมูล", desc: "รอตรวจสอบ", date: "รอดำเนินการ", done: false }, { title: "อนุมัติและดำเนินการ", desc: "รอการพิจารณา", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-007", orderId: "ORD-20260310-005", customer: "กนกวรรณ ใจเย็น", customerEmail: "kanok@email.com", customerPhone: "091-999-0000", type: "refund", status: "in_progress", product: "แชมพูสมุนไพร MetaHerb 300ml", description: "ชำระเงินซ้ำ 2 รอบ ต้องการเงินคืน 1 รายการ", amount: 780, refundChannel: "ธนาคารกรุงไทย [*0000]", createdAt: "12 มี.ค. 2569", items: [{ name: "แชมพูสมุนไพร MetaHerb 300ml", qty: 1, price: 780, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "12 มี.ค. 2569 16:30", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "14 มี.ค. 2569 09:00", done: true }, { title: "อนุมัติและดำเนินการ", desc: "รอการพิจารณา", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
];

/* ========== COMPLAINTS TAB (List) ========== */
function ComplaintsTab({ onViewDetail }: { onViewDetail: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ComplaintType | "all">("all");

  const statusTabs: { id: ComplaintStatus | "all"; label: string; count: number }[] = [
    { id: "all", label: "ทั้งหมด", count: mockComplaints.length },
    { id: "pending", label: "รอดำเนินการ", count: mockComplaints.filter((c) => c.status === "pending").length },
    { id: "in_progress", label: "กำลังดำเนินการ", count: mockComplaints.filter((c) => c.status === "in_progress").length },
    { id: "approved", label: "อนุมัติแล้ว", count: mockComplaints.filter((c) => c.status === "approved").length },
    { id: "completed", label: "เสร็จสิ้น", count: mockComplaints.filter((c) => c.status === "completed").length },
    { id: "rejected", label: "ปฏิเสธ", count: mockComplaints.filter((c) => c.status === "rejected").length },
  ];

  const typeTabs: { id: ComplaintType | "all"; label: string }[] = [
    { id: "all", label: "ทุกประเภท" },
    { id: "damaged", label: "สินค้าเสียหาย" },
    { id: "defective", label: "สินค้ามีตำหนิ" },
    { id: "return", label: "คืนสินค้า" },
    { id: "refund", label: "ขอเงินคืน" },
    { id: "wrong_item", label: "สินค้าผิดรายการ" },
  ];

  const filtered = mockComplaints.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.id.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q) || c.orderId.toLowerCase().includes(q) || c.product.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>การร้องเรียน</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-300 rounded-full pl-4 pr-1.5 py-1.5 w-[320px]">
            <input className={`${font} flex-1 text-[13px] outline-none bg-transparent`} placeholder="ค้นหาเลขร้องเรียน, ชื่อลูกค้า..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="bg-[#319754] p-1.5 rounded-full cursor-pointer"><Search className="size-4 text-white" /></button>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="bg-white rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] flex items-center justify-start gap-1 overflow-x-auto p-2 mb-4">
        {statusTabs.map((tab) => {
          const isAct = statusFilter === tab.id;
          return (
            <button key={tab.id} onClick={() => setStatusFilter(tab.id)}
              className={`backdrop-blur-[2px] flex gap-2.5 items-center justify-center pl-3 pr-2 py-1 rounded-[100px] cursor-pointer shrink-0 transition-colors ${isAct ? "bg-[#319754]" : ""}`}>
              <span className={`${font} text-[14px] whitespace-nowrap ${isAct ? "text-white" : "text-black"}`} style={{ fontWeight: isAct ? 500 : 400 }}>{tab.label}</span>
              <div className={`flex items-center justify-center px-2 py-1 rounded-[100px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] ${isAct ? "bg-white" : "bg-[#ff383c]"}`}>
                <span className={`${font} text-[8px] ${isAct ? "text-[#ff383c]" : "text-white"}`}>{tab.count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="size-4 text-gray-400" />
        {typeTabs.map((tab) => (
          <button key={tab.id} onClick={() => setTypeFilter(tab.id)}
            className={`px-3 py-1 rounded-full text-[12px] cursor-pointer transition-colors border ${typeFilter === tab.id ? "border-[#319754] bg-[#319754]/10 text-[#319754]" : "border-gray-200 text-gray-500 hover:bg-gray-50"} ${font}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table - Figma style */}
      <div className="bg-white rounded-[16px] overflow-hidden relative border border-[#e8e8e8]">
        {/* Header */}
        <div className="bg-[#fafafa] border-b border-[#e8e8e8] grid grid-cols-[1fr_1fr_0.75fr_0.5fr_0.5fr] items-center px-5 py-3">
          {["การร้องเรียน","สินค้า / คำสั่งซื้อ","ผู้แจ้ง","ประเภท","สถานะ"].map((h, i) => (
            <p key={i} className={`${font} text-[12px] text-[#999]`} style={{ fontWeight: 500 }}>{h}</p>
          ))}
        </div>
        {/* Rows */}
        {filtered.map((c) => {
          const typeIconConfig: Record<ComplaintType, { bg: string; border: string; color: string }> = {
            refund: { bg: "bg-[#eef2ff]", border: "border-[#c7d2fe]", color: "#6366F1" },
            damaged: { bg: "bg-[#fef2f2]", border: "border-[#fecaca]", color: "#EF4444" },
            return: { bg: "bg-[#f0fdf4]", border: "border-[#bbf7d0]", color: "#319754" },
            wrong_item: { bg: "bg-[#fffbeb]", border: "border-[#fde68a]", color: "#F59E0B" },
            defective: { bg: "bg-[#fff7ed]", border: "border-[#fed7aa]", color: "#F97316" },
          };
          const typeBadgeConfig: Record<ComplaintType, { bg: string; text: string }> = {
            refund: { bg: "bg-[#eef2ff]", text: "text-[#6366f1]" },
            damaged: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]" },
            return: { bg: "bg-[#f0fdf4]", text: "text-[#319754]" },
            wrong_item: { bg: "bg-[#fffbeb]", text: "text-[#f59e0b]" },
            defective: { bg: "bg-[#fff7ed]", text: "text-[#f97316]" },
          };
          const statusBadgeConfig: Record<ComplaintStatus, { bg: string; text: string; color: string }> = {
            pending: { bg: "bg-[#fffbeb]", text: "text-[#f59e0b]", color: "#F59E0B" },
            in_progress: { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]", color: "#3B82F6" },
            approved: { bg: "bg-[#f0fdf4]", text: "text-[#319754]", color: "#319754" },
            completed: { bg: "bg-[#eef2ff]", text: "text-[#6366f1]", color: "#6366F1" },
            rejected: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]", color: "#EF4444" },
          };
          const ti = typeIconConfig[c.type];
          const tb = typeBadgeConfig[c.type];
          const sb = statusBadgeConfig[c.status];
          return (
            <div key={c.id} className="grid grid-cols-[1fr_1fr_0.75fr_0.5fr_0.5fr] items-center px-5 py-4 border-b border-[#f5f5f5] hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={() => onViewDetail(c.id)}>
              {/* Col 1: Icon + ID + Date */}
              <div className="flex items-center gap-3">
                <div className={`${ti.bg} border ${ti.border} rounded-lg size-9 shrink-0 flex items-center justify-center`}>
                  {c.type === "refund" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p2949e900} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p22e64900} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "damaged" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p18993c00} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M8 14.6667V8" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p14df0fc0} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M5 2.84667L11 6.28" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "return" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p12949080} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M2 2V5.33333H5.33333" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "wrong_item" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p19987d80} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M14 2V5.33333H10.6667" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p2a3e9c80} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M5.33333 10.6667H2V14" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "defective" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p18993c00} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M8 14.6667V8" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p14df0fc0} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M5 2.84667L11 6.28" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{c.id}</p>
                  <p className={`${font} text-[11px] text-[#999]`}>{c.createdAt}</p>
                </div>
              </div>
              {/* Col 2: Product + Order ID */}
              <div className="flex flex-col justify-center min-w-0">
                <p className={`${font} text-[13px] text-black truncate`}>{c.product}</p>
                <p className={`${font} text-[11px] text-[#999]`}>{c.orderId}</p>
              </div>
              {/* Col 3: Email + Phone */}
              <div className="flex flex-col justify-center min-w-0">
                <p className={`${font} text-[13px] text-black truncate`}>{c.customerEmail}</p>
                <p className={`${font} text-[11px] text-[#999]`}>{c.customerPhone}</p>
              </div>
              {/* Col 4: Type badge */}
              <div>
                <span className={`${font} text-[11px] ${tb.bg} ${tb.text} px-2.5 py-1 rounded-full inline-block`}>{typeLabels[c.type]}</span>
              </div>
              {/* Col 5: Status badge with icon */}
              <div>
                <span className={`${font} text-[11px] ${sb.bg} ${sb.text} pl-[10px] pr-2.5 py-1 rounded-full inline-flex items-center gap-1`}>
                  {c.status === "pending" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M6 3V6L8 7" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {c.status === "in_progress" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgComplaint.p3e7757b0} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M6 4V6" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M6 8H6.005" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {(c.status === "approved" || c.status === "completed") && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgComplaint.p23551518} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 5.5L6 7L11 2" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {c.status === "rejected" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgComplaint.p3e7757b0} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M7.5 4.5L4.5 7.5" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 4.5L7.5 7.5" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {statusLabels[c.status]}
                </span>
              </div>

            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={`${font} text-center py-12 text-[#999] text-[14px]`}>ไม่พบรายการร้องเรียน</div>
        )}
      </div>
    </div>
  );
}

/* ========== COMPLAINT DETAIL TAB (Figma-matched layout) ========== */
function ComplaintDetailTab({ complaintId, onBack }: { complaintId: string; onBack: () => void }) {
  const complaint = mockComplaints.find((c) => c.id === complaintId) || mockComplaints[0];
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(complaint.status);
  const [noteText, setNoteText] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  /* --- type icon config for header --- */
  const typeIconConfig: Record<ComplaintType, { bg: string; border: string; color: string }> = {
    refund: { bg: "bg-[#eef2ff]", border: "border-[#c7d2fe]", color: "#6366F1" },
    damaged: { bg: "bg-[#fef2f2]", border: "border-[#fecaca]", color: "#EF4444" },
    return: { bg: "bg-[#f0fdf4]", border: "border-[#bbf7d0]", color: "#319754" },
    wrong_item: { bg: "bg-[#fffbeb]", border: "border-[#fde68a]", color: "#F59E0B" },
    defective: { bg: "bg-[#fff7ed]", border: "border-[#fed7aa]", color: "#F97316" },
  };
  const statusBadgeConfig: Record<ComplaintStatus, { bg: string; text: string; borderColor: string; color: string }> = {
    pending: { bg: "bg-[#fffbeb]", text: "text-[#f59e0b]", borderColor: "rgba(245,158,11,0.38)", color: "#F59E0B" },
    in_progress: { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]", borderColor: "rgba(59,130,246,0.38)", color: "#3B82F6" },
    approved: { bg: "bg-[#f0fdf4]", text: "text-[#319754]", borderColor: "rgba(49,151,84,0.38)", color: "#319754" },
    completed: { bg: "bg-[#eef2ff]", text: "text-[#6366f1]", borderColor: "rgba(99,102,241,0.38)", color: "#6366F1" },
    rejected: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]", borderColor: "rgba(239,68,68,0.38)", color: "#EF4444" },
  };
  const ti = typeIconConfig[complaint.type];
  const sb = statusBadgeConfig[complaint.status];

  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <button onClick={onBack} className="flex gap-2 items-center bg-[#d4d4d4] rounded-full px-4 py-1 cursor-pointer hover:bg-[#c4c4c4] transition-colors">
          <ChevronLeft size={14} />
          <span className={`${font} text-[12px] text-black`}>กลับ</span>
        </button>
      </div>

      {/* ===== HEADER: Type icon + Title + Status badge ===== */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`${ti.bg} border ${ti.border} rounded-[12px] size-12 shrink-0 flex items-center justify-center`}>
            {complaint.type === "refund" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "damaged" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "return" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "wrong_item" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "defective" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
          </div>
          <div>
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{typeLabels[complaint.type]}</p>
            <p className={`${font} text-[13px] text-[#999]`}>#{complaint.id} · {complaint.createdAt}</p>
          </div>
        </div>
        {/* Status badge */}
        <div className={`${sb.bg} rounded-full h-[37px] flex items-center gap-2 px-4`} style={{ border: `1px solid ${sb.borderColor}` }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d={svgDetail.p39ee6532} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            {complaint.status === "pending" && <path d="M8 4V8L10.6667 9.33333" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />}
            {complaint.status === "in_progress" && <><path d="M8 5.33333V8" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M8 10.6667H8.00667" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></>}
            {(complaint.status === "approved" || complaint.status === "completed") && <path d={svgDetail.p1f2c5400} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />}
            {complaint.status === "rejected" && <><path d="M10 6L6 10" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M6 6L10 10" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></>}
          </svg>
          <p className={`${font} text-[14px] ${sb.text}`} style={{ fontWeight: 500 }}>{statusLabels[complaint.status]}</p>
        </div>
      </div>

      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className="flex gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Card: รายละเอียดคำร้องเรียน */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-4 p-5">
              {/* Section heading with bottom border */}
              <div className="pb-3 border-b border-[#e8e8e8]">
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>รายละเอียดคำร้องเรียน</p>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-4">
                {/* Row 1: เลขที่คำสั่งซื้อ | สินค้า */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>เลขที่คำสั่งซื้อ</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.orderId}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>สินค้า</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.product}</p>
                  </div>
                </div>
                {/* Row 2: อีเมล | เบอร์ติดต่อ */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>อีเมล</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.customerEmail}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>เบอร์ติดต่อ</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.customerPhone}</p>
                  </div>
                </div>
                {/* Row 3: ยอดขอคืนเงิน */}
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ยอดขอคืนเงิน</p>
                  <p className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 500 }}>฿{complaint.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* รายละเอียดปัญหา */}
              <div className="flex flex-col gap-1">
                <p className={`${font} text-[11px] text-[#999]`}>รายละเอียดปัญหา</p>
                <div className="bg-[#fafafa] rounded-[10px] relative border border-[#e8e8e8] px-[17px] py-[17px]">
                  <p className={`${font} text-[14px] text-black`}>{complaint.description}</p>
                </div>
              </div>

              {/* Evidence images */}
              <div className="flex gap-3">
                <div className="rounded-[10px] relative shrink-0 size-[133px] overflow-hidden border border-[#d4d4d8]">
                  <img src={imgEvidence0} alt="หลักฐาน 1" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-[10px] relative shrink-0 size-[133px] overflow-hidden border border-[#d4d4d8]">
                  <img src={imgEvidence1} alt="หลักฐาน 2" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Card: สินค้าที่ต้องการขอคืนเงิน */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8] overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
              <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>สินค้าที่ต้องการขอคืนเงิน</p>
              <div className="h-px bg-[#d4d4d8]" />
              {complaint.items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[12px] relative border border-[#d9d9d9]">
                  <div className="flex items-center gap-2 p-4">
                    <div className="rounded-lg shrink-0 size-16 overflow-hidden">
                      {item.hasImage ? (
                        <img src={imgRefundProduct} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="bg-[#e7e7e7] rounded-lg size-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[12px] text-black truncate`} style={{ fontWeight: 500 }}>{item.name}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>฿ {item.price.toFixed(2)}</p>
                      <p className={`${font} text-[10px] text-black`}>จำนวน {item.qty} ชิ้น</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: ข้อมูลบัญชีธนาคาร */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-4 pt-5 px-5 pb-5">
              {/* Heading with icon */}
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d={svgDetail.p35993080} stroke="#6366F1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M1.33333 6.66667H14.6667" stroke="#6366F1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลบัญชีธนาคาร</p>
              </div>

              {/* Bank info grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ธนาคาร</p>
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ธนาคารไทยพาณิชย์ (SCB)</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ชื่อบัญชี</p>
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>มาลี สวยงาม</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>เลขบัญชี</p>
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>987-6-54321-0</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ยอดโอน</p>
                  <p className={`${font} text-[18px] text-[#6366f1]`} style={{ fontWeight: 500 }}>฿{complaint.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: บันทึกของเจ้าหน้าที่ */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-3 pt-5 px-5 pb-5">
              {/* Heading row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d={svgDetail.p1bb15080} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                  <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>บันทึกของเจ้าหน้าที่</p>
                </div>
                <button onClick={() => setIsEditingNote(!isEditingNote)} className="flex items-center gap-1 cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 11.6667H12.25" stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    <path d={svgDetail.p3d94d500} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                  </svg>
                  <span className={`${font} text-[12px] text-[#319754]`} style={{ fontWeight: 500 }}>แก้ไข</span>
                </button>
              </div>
              {/* Note content */}
              {isEditingNote ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="เพิ่มบันทึก..."
                    className={`${font} text-[14px] bg-[#f0fdf4] rounded-[12px] border border-[#bbf7d0] px-[17px] py-[17px] min-h-[57px] resize-none outline-none`}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditingNote(false)} className={`${font} text-[12px] text-[#999] px-3 py-1 rounded-full cursor-pointer`}>ยกเลิก</button>
                    <button onClick={() => setIsEditingNote(false)} className={`${font} text-[12px] text-white bg-[#319754] px-4 py-1 rounded-full cursor-pointer`}>บันทึก</button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f0fdf4] rounded-[12px] relative border border-[#bbf7d0] px-[17px] py-[17px]">
                  <p className={`${font} text-[14px] text-[#999]`}>{noteText || "ยังไม่มีบันทึก"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="shrink-0 flex flex-col gap-5" style={{ width: 408 }}>

          {/* Card: อัปเดตสถานะ */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-4 p-5">
              {/* Section heading */}
              <div className="pb-3 border-b border-[#e8e8e8]">
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>อัปเดตสถานะ</p>
              </div>

              {/* Status radio buttons */}
              <div className="flex flex-col gap-2">
                {(["pending", "in_progress", "approved", "completed", "rejected"] as ComplaintStatus[]).map((status) => {
                  const isSelected = selectedStatus === status;
                  const sbc = statusBadgeConfig[status];
                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`relative h-[45.5px] rounded-[12px] flex items-center gap-2 px-[17px] cursor-pointer transition-colors ${
                        isSelected ? `${sbc.bg}` : "bg-white"
                      }`}
                      style={{ border: `1px solid ${isSelected ? sbc.borderColor : "#e8e8e8"}` }}
                    >
                      {/* Status icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        {status === "pending" && (
                          <>
                            <path d={svgDetail.p39ee6532} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M8 4V8L10.6667 9.33333" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                        {status === "in_progress" && (
                          <>
                            <path d={svgDetail.p39ee6532} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M8 5.33333V8" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M8 10.6667H8.00667" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                        {(status === "approved" || status === "completed") && (
                          <>
                            <path d={svgDetail.p34e03900} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d={svgDetail.p1f2c5400} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                        {status === "rejected" && (
                          <>
                            <path d={svgDetail.p39ee6532} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M10 6L6 10" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M6 6L10 10" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                      </svg>
                      <p className={`${font} text-[13px] ${isSelected ? sbc.text : "text-[#666]"}`} style={{ fontWeight: 500 }}>{statusLabels[status]}</p>
                      {/* Active indicator dot */}
                      {isSelected && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 size-2 rounded-full" style={{ backgroundColor: sbc.color }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Save button */}
              <button className="bg-[#319754] h-[45px] rounded-full w-full flex items-center justify-center cursor-pointer hover:bg-[#2a8248] transition-colors">
                <span className={`${font} text-[14px] text-white`} style={{ fontWeight: 500 }}>บันทึกสถานะ</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {/* ส่งอีเมลหาลูกค้า */}
            <button className="bg-[#f0fdf4] h-[41.5px] rounded-full w-full flex items-center justify-center gap-2 border border-[#bbf7d0] cursor-pointer hover:bg-[#dcfce7] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d={svgDetail.p17070980} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d={svgDetail.p120c8200} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
              <span className={`${font} text-[13px] text-[#319754]`}>ส่งอีเมลหาลูกค้า</span>
            </button>
            {/* โทรหาลูกค้า */}
            <button className="bg-[#f5f5f5] h-[41.5px] rounded-full w-full flex items-center justify-center gap-2 border border-[#e8e8e8] cursor-pointer hover:bg-[#ebebeb] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d={svgDetail.p2a44c680} stroke="#555" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
              <span className={`${font} text-[13px] text-[#555]`}>โทรหาลูกค้า</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ========== REPORT — SALES ========== */
// Animated counter — keeps prefix (฿) and suffix text, animates the numeric part 0 → target
function AnimatedValue({ value, duration = 1000 }: { value: string; duration?: number }) {
  const match = value.match(/^([฿]?\s*)([\d,]+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : 0;
  const decimals = match && match[2].includes(".") ? (match[2].split(".")[1] || "").length : 0;
  const prefix = match ? match[1] : "";
  const suffix = match ? match[3] : "";
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!match) return;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setCurrent(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  if (!match) return <>{value}</>;
  const formatted = decimals > 0
    ? current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : Math.round(current).toLocaleString();
  return <>{prefix}{formatted}{suffix}</>;
}

function ReportSalesTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [productSort, setProductSort] = useState<"sales_desc" | "sales_asc" | "qty_desc" | "margin_desc" | "stock_asc">("sales_desc");
  const [productPage, setProductPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dailyRange, setDailyRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [monthRange, setMonthRange] = useState<{ from: number; to: number; year: number }>({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() });
  const [monthClickPhase, setMonthClickPhase] = useState<0 | 1>(0);
  const [yearRange, setYearRange] = useState<{ from: number; to: number }>({ from: today.getFullYear(), to: today.getFullYear() });
  const [yearClickPhase, setYearClickPhase] = useState<0 | 1>(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datasetCalOpen, setDatasetCalOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const thaiMonthsFull = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

  // Past 5 years available for yearly filter (CE values, will display in BE)
  const availableYears = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i); // [current, current-1, ..., current-4]

  const datasetLabel = (() => {
    switch (period) {
      case "daily": {
        if (dailyRange?.from && dailyRange.to && dailyRange.to.getTime() !== dailyRange.from.getTime()) {
          return `${fmtDate(dailyRange.from)} - ${fmtDate(dailyRange.to)}`;
        }
        const d = dailyRange?.from ?? today;
        return `วันที่ ${d.getDate()} ${thaiMonthsFull[d.getMonth()]} ${d.getFullYear() + 543}`;
      }
      case "weekly":
        return `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
      case "monthly": {
        const yr = monthRange.year + 543;
        if (monthRange.from === monthRange.to) return `เดือน${thaiMonthsFull[monthRange.from]} ${yr}`;
        return `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
      }
      case "yearly": {
        if (yearRange.from === yearRange.to) return `ปี ${yearRange.from + 543}`;
        const a = Math.min(yearRange.from, yearRange.to);
        const b = Math.max(yearRange.from, yearRange.to);
        return `ปี ${a + 543} – ${b + 543}`;
      }
      case "custom":
        return rangeLabel;
    }
  })();

  const handleMonthClick = (m: number) => {
    if (monthClickPhase === 0) {
      setMonthRange((cur) => ({ ...cur, from: m, to: m }));
      setMonthClickPhase(1);
    } else {
      setMonthRange((cur) => ({ ...cur, from: Math.min(cur.from, m), to: Math.max(cur.from, m) }));
      setMonthClickPhase(0);
      setDatasetCalOpen(false);
    }
  };

  const handleYearClick = (y: number) => {
    if (yearClickPhase === 0) {
      setYearRange({ from: y, to: y });
      setYearClickPhase(1);
    } else {
      setYearRange((cur) => ({ from: Math.min(cur.from, y), to: Math.max(cur.from, y) }));
      setYearClickPhase(0);
      setDatasetCalOpen(false);
    }
  };

  // All 4 report tabs share a single source of truth (src/app/data/reportMockData.ts)
  // so the same date filter always produces matching numbers across the dashboard.
  const data = buildReportData({ period, dailyRange, selectedDate, monthRange, yearRange, today });

  const PIE_COLORS = ["#319754", "#46A165", "#7bc290", "#aedab8", "#f7931d", "#fbbf24"];

  // Shade a hex color by ±percent (positive = lighter, negative = darker)
  const shade = (hex: string, percent: number) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, Math.min(255, (n >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
    const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
  };

  // Custom 3D bar shape (top face lighter + right face darker, drawn behind front rect)
  const Bar3D = (props: any) => {
    const { x, y, width, height, fill } = props;
    if (!height || height <= 0 || !width) return null;
    const depth = Math.min(Math.max(width * 0.28, 5), 9);
    const top = shade(fill, 12);
    const right = shade(fill, -18);
    return (
      <g>
        <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={right} />
        <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={top} />
        <rect x={x} y={y} width={width} height={height} fill={fill} />
      </g>
    );
  };

  // Mock products / customers for the orders popup
  const baseProducts = [
    { name: "ขมิ้นชันแคปซูล", cat: "สมุนไพรแคปซูล", unit: 60 },
    { name: "ฟ้าทะลายโจร", cat: "สมุนไพรแคปซูล", unit: 50 },
    { name: "ชาเก๊กฮวยออร์แกนิก", cat: "ชาสมุนไพร", unit: 60 },
    { name: "น้ำผึ้งดอกลำไย", cat: "ผลิตภัณฑ์ออร์แกนิก", unit: 70 },
    { name: "ใบบัวบกแคปซูล", cat: "สมุนไพรแคปซูล", unit: 60 },
    { name: "น้ำมันมะพร้าวสกัดเย็น", cat: "น้ำมันสมุนไพร", unit: 140 },
    { name: "เห็ดหลินจือสกัด", cat: "สมุนไพรสกัด", unit: 140 },
    { name: "ชาตะไคร้แห้ง", cat: "ชาสมุนไพร", unit: 50 },
    { name: "ขิงผงออร์แกนิก", cat: "ผงสมุนไพร", unit: 80 },
    { name: "สบู่สมุนไพรขมิ้น", cat: "ของใช้ออร์แกนิก", unit: 150 },
  ];
  const baseCustomers = [
    { name: "คุณสมชาย", email: "somchai@email.com" },
    { name: "คุณสมหญิง", email: "somying@email.com" },
    { name: "คุณทานตะวัน", email: "tantawan@email.com" },
    { name: "คุณสายฝน", email: "saifon@email.com" },
    { name: "คุณฟ้าใส", email: "fasai@email.com" },
    { name: "คุณภูเขา", email: "phukao@email.com" },
    { name: "คุณทะเล", email: "talay@email.com" },
    { name: "คุณแม่น้ำ", email: "maenam@email.com" },
  ];
  const productImageMap: Record<string, string> = {
    "ขมิ้นชันแคปซูล": "https://picsum.photos/seed/turmeric-capsule/200",
    "ฟ้าทะลายโจร": "https://picsum.photos/seed/andrographis/200",
    "ชาเก๊กฮวยออร์แกนิก": "https://picsum.photos/seed/chrysanthemum-tea/200",
    "น้ำผึ้งดอกลำไย": "https://picsum.photos/seed/longan-honey/200",
    "ใบบัวบกแคปซูล": "https://picsum.photos/seed/centella/200",
    "น้ำมันมะพร้าวสกัดเย็น": "https://picsum.photos/seed/coconut-oil/200",
    "เห็ดหลินจือสกัด": "https://picsum.photos/seed/lingzhi/200",
    "ชาตะไคร้แห้ง": "https://picsum.photos/seed/lemongrass-tea/200",
    "ขิงผงออร์แกนิก": "https://picsum.photos/seed/ginger-powder/200",
    "สบู่สมุนไพรขมิ้น": "https://picsum.photos/seed/turmeric-soap/200",
  };
  const productThumb = (name: string) =>
    productImageMap[name] ?? `https://picsum.photos/seed/${encodeURIComponent(name)}/200`;

  const labelHash = (s: string) => Array.from(s).reduce((a, ch) => a + ch.charCodeAt(0), 0);

  // Generate deterministic orders for a row that fit the row's totals
  const rowOrders = (row: { label: string; sales: number; orders: number }) => {
    if (row.orders === 0) return [];
    const n = Math.max(1, row.orders);
    const h = labelHash(row.label);
    let remaining = row.sales;
    return Array.from({ length: n }, (_, oi) => {
      const isLast = oi === n - 1;
      const targetTotal = isLast ? remaining : Math.max(60, Math.round(row.sales / n + ((h + oi * 17) % 200) - 100));
      const orderTotal = Math.min(remaining, Math.max(60, targetTotal));
      remaining -= orderTotal;
      const c = baseCustomers[(h + oi * 3) % baseCustomers.length];
      const itemCount = 1 + ((h + oi * 11) % 3); // 1-3 items
      let leftover = orderTotal;
      const items = Array.from({ length: itemCount }, (_, ii) => {
        const p = baseProducts[(h + oi * 13 + ii * 5) % baseProducts.length];
        const isLastItem = ii === itemCount - 1;
        const idealQty = Math.max(1, Math.round((leftover / Math.max(itemCount - ii, 1)) / p.unit));
        const qty = isLastItem ? Math.max(1, Math.round(leftover / p.unit)) : Math.max(1, idealQty);
        const subtotal = qty * p.unit;
        leftover -= subtotal;
        return { name: p.name, category: p.cat, qty, unit: p.unit, subtotal };
      });
      const realTotal = items.reduce((s, x) => s + x.subtotal, 0);
      const orderSeq = String(1 + oi + (h % 90)).padStart(4, "0");
      const orderId = `ORD-${row.label.replace(/[^\w]/g, "")}-${orderSeq}`;
      const time = `${String((h + oi * 3) % 12 + 8).padStart(2, "0")}:${String((h + oi * 7) % 60).padStart(2, "0")}`;
      return { id: orderId, buyer: c.name, buyerEmail: c.email, time, items, total: realTotal };
    });
  };

  // KPI cards — 4 different metrics, all filtered by the active period + date selection.
  // Default (period=daily, today) → everything shows today's totals.
  const kpi = (() => {
    const sumKey = (k: string) => data.reduce((s, d) => s + ((d as any)[k] || 0), 0);
    const sales = sumKey("sales");
    const orders = sumKey("orders");
    // Derived metrics — qty estimated from orders, cost ~55% of sales (typical for herbal goods)
    const qty = orders * 3;
    const cost = Math.round(sales * 0.55);
    const profit = sales - cost;

    let scope = "วันนี้";
    if (period === "daily") {
      const from = dailyRange?.from ?? today;
      const to = dailyRange?.to ?? today;
      const isRange = !!(from && to && to.getTime() !== from.getTime());
      if (isRange) {
        scope = `${fmtDate(from)} – ${fmtDate(to)}`;
      } else if (from.toDateString() === today.toDateString()) {
        scope = "วันนี้";
      } else {
        scope = `วันที่ ${from.getDate()} ${thaiMonthsFull[from.getMonth()]} ${from.getFullYear() + 543}`;
      }
    } else if (period === "weekly") {
      scope = `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
    } else if (period === "monthly") {
      const yr = monthRange.year + 543;
      scope = monthRange.from === monthRange.to
        ? `เดือน${thaiMonthsFull[monthRange.from]} ${yr}`
        : `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
    } else if (period === "yearly") {
      const a = Math.min(yearRange.from, yearRange.to) + 543;
      const b = Math.max(yearRange.from, yearRange.to) + 543;
      scope = a === b ? `ปี ${a}` : `ปี ${a} – ${b}`;
    }
    // Useful sub-stats per card (replaces redundant "scope" badge)
    const days = Math.max(1, data.length);
    const avgSales = Math.round(sales / days);
    const avgOrders = Math.max(1, Math.round(orders / days));
    const aov = orders > 0 ? Math.round(sales / orders) : 0; // average order value
    const costRatio = sales > 0 ? Math.round((cost / sales) * 100) : 0;
    const margin = sales > 0 ? ((profit / sales) * 100) : 0;

    return { scope, sales, orders, cost, profit, avgSales, avgOrders, aov, costRatio, margin };
  })();
  const fmt = (n: number) => "฿" + n.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานผลยอดขาย</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date picker */}
          <Popover open={datasetCalOpen} onOpenChange={setDatasetCalOpen}>
            <PopoverTrigger asChild>
              <button
                className={`${font} text-[13px] inline-flex items-center gap-2 h-[40px] px-4 rounded-full cursor-pointer bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(49,151,84,0.18)] hover:text-[#319754] transition-shadow group`}
                aria-label="เปลี่ยนวันที่"
              >
                <CalendarIcon className="size-3.5 text-gray-500 group-hover:text-[#319754]" />
                <span style={{ fontWeight: 500 }}>{datasetLabel}</span>
                <ChevronDown className="size-3.5 text-gray-400 group-hover:text-[#319754]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {(period === "daily" || period === "custom") && (
                <>
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={period === "daily" ? dailyRange : range}
                    onSelect={period === "daily" ? setDailyRange : setRange}
                    defaultMonth={(period === "daily" ? dailyRange?.from : range?.from) ?? today}
                  />
                  <div className="flex items-center justify-between gap-2 p-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิกเลือกวันเดียว หรือคลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { period === "daily" ? setDailyRange({ from: today, to: today }) : setRange(undefined); }}
                        className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                      <button onClick={() => setDatasetCalOpen(false)}
                        className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                    </div>
                  </div>
                </>
              )}
              {period === "weekly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronLeft className="size-4 text-gray-600" />
                    </button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {selectedDate.getFullYear() + 543}</span>
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronRight className="size-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const isActive = selectedDate.getMonth() === i;
                      return (
                        <button key={m} onClick={() => { setSelectedDate(new Date(selectedDate.getFullYear(), i, 1)); setDatasetCalOpen(false); }}
                          className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-[#319754] text-white" : "hover:bg-gray-100 text-gray-700"}`}
                          style={{ fontWeight: isActive ? 600 : 500 }}>
                          {m}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t">
                    <button onClick={() => { setSelectedDate(today); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "monthly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year - 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronLeft className="size-4 text-gray-600" />
                    </button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {monthRange.year + 543}</span>
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year + 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronRight className="size-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const inRange = i >= Math.min(monthRange.from, monthRange.to) && i <= Math.max(monthRange.from, monthRange.to);
                      const isEdge = i === monthRange.from || i === monthRange.to;
                      return (
                        <button key={m} onClick={() => handleMonthClick(i)}
                          className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                          style={{ fontWeight: isEdge ? 600 : 500 }}>
                          {m}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setMonthRange({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() }); setMonthClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "yearly" && (
                <div className="p-3 w-[200px]">
                  <p className={`${font} text-[11px] text-gray-400 mb-2`}>ย้อนหลังได้ถึง 5 ปี</p>
                  <div className="flex flex-col gap-1">
                    {availableYears.map((y) => {
                      const inRange = y >= Math.min(yearRange.from, yearRange.to) && y <= Math.max(yearRange.from, yearRange.to);
                      const isEdge = y === yearRange.from || y === yearRange.to;
                      return (
                        <button key={y} onClick={() => handleYearClick(y)}
                          className={`${font} text-[13px] py-2 px-3 rounded-lg cursor-pointer transition-colors text-left ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                          style={{ fontWeight: isEdge ? 600 : 500 }}>
                          ปี {y + 543}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setYearRange({ from: today.getFullYear(), to: today.getFullYear() }); setYearClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ปีนี้</button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {/* Period tabs */}
          <div className="inline-flex items-center bg-white rounded-full p-1 overflow-x-auto max-w-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-period-bg-top" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
          {/* Export button */}
          <Popover>
            <PopoverTrigger asChild>
              <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#319754] hover:bg-[#287745] text-white h-[40px] px-5 rounded-full cursor-pointer shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)] transition-shadow`}>
                <Download className="size-4" />
                ส่งออก
                <ChevronDown className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button onClick={() => console.log("export excel")}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
                <span>Excel (.xlsx)</span>
              </button>
              <button onClick={() => console.log("export pdf")}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileText className="size-4 text-[#dc2626]" />
                <span>PDF (.pdf)</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: `รายได้ ${kpi.scope}`, value: fmt(kpi.sales),
              subLabel: `เฉลี่ย ${fmt(kpi.avgSales)}/วัน`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              accent: "#10b981",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              ),
              bgArt: (
                <motion.img
                  src={imgCoin}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `จำนวนคำสั่งซื้อ ${kpi.scope}`, value: kpi.orders.toLocaleString() + " ออเดอร์",
              subLabel: `เฉลี่ย ฿${kpi.aov.toLocaleString()}/ออเดอร์`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              accent: "#0ea5e9",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              ),
              bgArt: (
                <motion.img
                  src={imgBox}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `ต้นทุน ${kpi.scope}`, value: fmt(kpi.cost),
              subLabel: `${kpi.costRatio}% ของรายได้`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
              accent: "#6366f1",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              ),
              bgArt: (
                <motion.img
                  src={imgCost}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `กำไร ${kpi.scope}`, value: fmt(kpi.profit),
              subLabel: `มาร์จิ้น ${kpi.margin.toFixed(1)}%`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
              accent: "#f59e0b",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              ),
              bgArt: (
                <motion.img
                  src={imgCoinUp}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                  aria-hidden
                />
              ),
            },
          ].map((s: any) => (
            <div key={s.label} className="group rounded-2xl p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden"
              style={{ backgroundColor: `${s.accent}0d` }}>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                  <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>
                    {s.icon}
                  </div>
                </div>
                <p className={`${font} text-[26px] mt-3 tracking-tight tabular-nums`} style={{ fontWeight: 700, color: s.accent }}>
                  <AnimatedValue value={s.value} />
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md`}
                    style={{ backgroundColor: `${s.accent}15`, color: s.accent, fontWeight: 600 }}>
                    {s.subIcon}
                    {s.subLabel}
                  </span>
                </div>
              </div>
              {s.bgArt}
            </div>
          ))}
        </div>

        <h3 className={`${font} text-[18px] mb-5`} style={{ fontWeight: 600 }}>รายงานผลยอดขาย</h3>

        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className={`${font} text-[13px] inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 hover:border-[#319754] focus:outline-none focus:border-[#319754] cursor-pointer min-w-[230px]`}>
                  <CalendarIcon className="size-4 text-gray-500" />
                  <span className={range?.from ? "text-[#1a1a1a]" : "text-gray-400"}>{rangeLabel}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={range}
                  onSelect={setRange}
                  defaultMonth={range?.from}
                />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                  <button onClick={() => { setRange(undefined); }}
                    className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                  <button onClick={() => setCalendarOpen(false)}
                    className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                </div>
              </PopoverContent>
            </Popover>
            <button className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-5 py-1.5 rounded-full cursor-pointer`}>ค้นหา</button>
          </div>
        )}

        <ResponsiveContainer width="100%" height={340}>
          {chartType === "line" ? (
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowOrange" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload || !payload.length) return null;
                  return (
                    <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                      <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                      <div className="flex flex-col gap-1.5">
                        {payload.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                            <span className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                              <span className="text-gray-600">{p.name}</span>
                            </span>
                            <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>
                              {p.dataKey === "sales" ? `฿${p.value.toLocaleString()}` : p.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {payload?.map((entry: any, i: number) => (
                      <div
                        key={i}
                        className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] transition-shadow cursor-default`}
                        style={{
                          backgroundColor: `${entry.color}10`,
                          color: entry.color,
                          fontWeight: 600,
                          boxShadow: `0 1px 3px ${entry.color}1a`,
                        }}
                      >
                        <span
                          className="block rounded-full"
                          style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }}
                        />
                        <span>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#319754" strokeWidth={3} name="ยอดขาย (฿)"
                style={{ filter: "url(#glowGreen)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#319754", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#319754", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(49,151,84,0.35))" } }}
                animationDuration={800}
              />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f7931d" strokeWidth={3} name="จำนวนคำสั่งซื้อ"
                style={{ filter: "url(#glowOrange)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#f7931d", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#f7931d", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(247,147,29,0.35))" } }}
                animationDuration={800}
              />
            </ComposedChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }} barCategoryGap="22%" barGap={6}>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload || !payload.length) return null;
                  return (
                    <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                      <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                      <div className="flex flex-col gap-1.5">
                        {payload.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                            <span className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                              <span className="text-gray-600">{p.name}</span>
                            </span>
                            <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>
                              {p.dataKey === "sales" ? `฿${p.value.toLocaleString()}` : p.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {payload?.map((entry: any, i: number) => (
                      <div
                        key={i}
                        className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]`}
                        style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}
                      >
                        <span className="block rounded-full"
                          style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }} />
                        <span>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Bar yAxisId="left" dataKey="sales" name="ยอดขาย (฿)" fill="#319754" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
              <Bar yAxisId="right" dataKey="orders" name="จำนวนคำสั่งซื้อ" fill="#f7931d" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
            </BarChart>
          ) : (
            (() => {
              const pieData = data.filter((d) => (d as any).sales > 0);
              const pieTotal = pieData.reduce((s, d) => s + ((d as any).sales || 0), 0);
              return (
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={72} outerRadius={120}
                    paddingAngle={2}
                    dataKey="sales" nameKey="label"
                    labelLine={false}
                    label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
                      if (percent < 0.06) return null;
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
                          style={{ fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>
                          {(percent * 100).toFixed(0)}%
                        </text>
                      );
                    }}
                    isAnimationActive
                    animationDuration={700}
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={3} />
                    ))}
                  </Pie>
                  {/* Center text — uses 42% to compensate for Legend area at bottom */}
                  <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 11, fill: "#9ca3af" }}>ยอดขายรวม</text>
                  <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 20, fill: "#1a1a1a", fontWeight: 700 }}>
                    ฿{pieTotal.toLocaleString()}
                  </text>
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (!active || !payload || !payload.length) return null;
                      const p = payload[0];
                      const pct = pieTotal > 0 ? ((p.value / pieTotal) * 100).toFixed(1) : "0";
                      return (
                        <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[160px]`}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.payload.fill || PIE_COLORS[0] }} />
                            <span className="text-[12px] text-gray-600" style={{ fontWeight: 500 }}>{p.name}</span>
                          </div>
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[16px] tabular-nums" style={{ fontWeight: 700, color: p.payload.fill || PIE_COLORS[0] }}>฿{p.value.toLocaleString()}</span>
                            <span className="text-[11px] text-gray-400 tabular-nums">{pct}%</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 20 }}
                    content={({ payload }: any) => (
                      <div className="flex items-center justify-center gap-2 flex-wrap max-w-full px-4">
                        {payload?.map((entry: any, i: number) => (
                          <div key={i}
                            className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]`}
                            style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                            <span className="block rounded-full"
                              style={{ width: 8, height: 8, backgroundColor: entry.color, boxShadow: `0 0 0 2.5px ${entry.color}25` }} />
                            <span>{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              );
            })()
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-chart-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Sales Report */}
      {(() => {
        const allProducts = [
          { name: "ขมิ้นชันแคปซูล 60 แคป", sku: "HRB-001", initial: "ขม", bg: "#fef3c7", fg: "#b45309", category: "สมุนไพรแคปซูล", qty: 8, sales: 1420, cost: 640, trend: [4,5,6,5,7,8], stock: 42 },
          { name: "ฟ้าทะลายโจรผง 100 g", sku: "HRB-014", initial: "ฟท", bg: "#dcfce7", fg: "#15803d", category: "ผงสมุนไพร", qty: 5, sales: 1150, cost: 480, trend: [3,4,3,4,5,5], stock: 28 },
          { name: "น้ำมันมะพร้าวสกัดเย็น", sku: "OIL-003", initial: "นม", bg: "#fef9c3", fg: "#a16207", category: "น้ำมันสมุนไพร", qty: 3, sales: 870, cost: 420, trend: [4,3,4,3,3,3], stock: 9 },
          { name: "ชาตะไคร้ใบเตย 30 ซอง", sku: "TEA-007", initial: "ชต", bg: "#ecfccb", fg: "#4d7c0f", category: "ชาสมุนไพร", qty: 2, sales: 580, cost: 240, trend: [4,3,3,2,2,2], stock: 56 },
          { name: "ยาดมสมุนไพร 6 หลอด", sku: "INH-002", initial: "ยด", bg: "#ffe4e6", fg: "#be123c", category: "ของใช้ออร์แกนิก", qty: 1, sales: 262, cost: 110, trend: [2,1,2,1,1,1], stock: 3 },
          { name: "รางจืดแคปซูล 30 แคป", sku: "HRB-022", initial: "รจ", bg: "#f3f4f6", fg: "#525252", category: "สมุนไพรแคปซูล", qty: 0, sales: 0, cost: 0, trend: [0,0,0,0,0,0], stock: 18 },
          { name: "ใบบัวบกแคปซูล 60 แคป", sku: "HRB-005", initial: "บก", bg: "#dcfce7", fg: "#15803d", category: "สมุนไพรแคปซูล", qty: 7, sales: 1280, cost: 560, trend: [3,4,5,6,6,7], stock: 35 },
          { name: "เห็ดหลินจือสกัด 60 แคป", sku: "HRB-009", initial: "หล", bg: "#fef3c7", fg: "#92400e", category: "สมุนไพรสกัด", qty: 4, sales: 980, cost: 420, trend: [2,3,4,3,4,4], stock: 22 },
          { name: "ชาเก๊กฮวยออร์แกนิก 20 ซอง", sku: "TEA-002", initial: "กฮ", bg: "#fef9c3", fg: "#854d0e", category: "ชาสมุนไพร", qty: 6, sales: 760, cost: 320, trend: [3,4,4,5,5,6], stock: 41 },
          { name: "น้ำผึ้งดอกลำไย 250 ml", sku: "HNY-001", initial: "นผ", bg: "#fef3c7", fg: "#a16207", category: "ผลิตภัณฑ์ออร์แกนิก", qty: 3, sales: 645, cost: 280, trend: [2,2,3,3,3,3], stock: 14 },
          { name: "ขิงผงออร์แกนิก 100 g", sku: "PWR-004", initial: "ขผ", bg: "#fef9c3", fg: "#854d0e", category: "ผงสมุนไพร", qty: 4, sales: 520, cost: 220, trend: [2,3,3,4,4,4], stock: 31 },
          { name: "สบู่สมุนไพรขมิ้น", sku: "SOAP-01", initial: "สม", bg: "#fde68a", fg: "#854d0e", category: "ของใช้ออร์แกนิก", qty: 12, sales: 1800, cost: 720, trend: [6,8,9,10,11,12], stock: 67 },
          { name: "บาล์มสมุนไพรไพล", sku: "BLM-001", initial: "บส", bg: "#ffe4e6", fg: "#be123c", category: "ของใช้ออร์แกนิก", qty: 2, sales: 380, cost: 160, trend: [1,2,2,2,2,2], stock: 8 },
          { name: "ชามะรุม 30 ซอง", sku: "TEA-009", initial: "ชม", bg: "#ecfccb", fg: "#4d7c0f", category: "ชาสมุนไพร", qty: 5, sales: 650, cost: 290, trend: [3,3,4,4,5,5], stock: 26 },
          { name: "ขมิ้นชันผง 50 g", sku: "PWR-002", initial: "ขผ", bg: "#fef9c3", fg: "#a16207", category: "ผงสมุนไพร", qty: 3, sales: 420, cost: 180, trend: [2,2,3,3,3,3], stock: 19 },
          { name: "น้ำมันงาขี้ม้อน 250 ml", sku: "OIL-005", initial: "งม", bg: "#fed7aa", fg: "#9a3412", category: "น้ำมันสมุนไพร", qty: 1, sales: 320, cost: 140, trend: [1,1,1,1,1,1], stock: 6 },
          { name: "เก๊กฮวยอบแห้ง 50 g", sku: "HRB-031", initial: "กฮ", bg: "#fef9c3", fg: "#854d0e", category: "สมุนไพร", qty: 4, sales: 480, cost: 200, trend: [2,3,3,4,4,4], stock: 23 },
          { name: "ตะไคร้แห้งบดละเอียด 50 g", sku: "PWR-008", initial: "ตค", bg: "#dcfce7", fg: "#15803d", category: "ผงสมุนไพร", qty: 2, sales: 240, cost: 100, trend: [1,1,2,2,2,2], stock: 17 },
          { name: "ลูกซัด 60 แคป", sku: "HRB-040", initial: "ลซ", bg: "#fef3c7", fg: "#b45309", category: "สมุนไพรแคปซูล", qty: 3, sales: 540, cost: 240, trend: [2,2,3,3,3,3], stock: 11 },
          { name: "เห็ดถั่งเช่า 30 แคป", sku: "HRB-018", initial: "ถช", bg: "#fde68a", fg: "#854d0e", category: "สมุนไพรสกัด", qty: 2, sales: 720, cost: 320, trend: [1,2,2,2,2,2], stock: 4 },
          { name: "หญ้าหวานผง 30 g", sku: "PWR-012", initial: "หว", bg: "#dcfce7", fg: "#15803d", category: "ผงสมุนไพร", qty: 6, sales: 390, cost: 170, trend: [3,4,4,5,5,6], stock: 33 },
          { name: "พริกไทยดำบด 100 g", sku: "PWR-015", initial: "พท", bg: "#f3f4f6", fg: "#525252", category: "ผงสมุนไพร", qty: 5, sales: 320, cost: 140, trend: [3,3,4,4,5,5], stock: 45 },
          { name: "เปลือกมังคุดผง 50 g", sku: "PWR-020", initial: "มค", bg: "#fce7f3", fg: "#9d174d", category: "ผงสมุนไพร", qty: 3, sales: 285, cost: 125, trend: [2,2,2,3,3,3], stock: 21 },
          { name: "ดอกคำฝอย 30 g", sku: "HRB-055", initial: "คฝ", bg: "#fed7aa", fg: "#9a3412", category: "สมุนไพร", qty: 4, sales: 360, cost: 160, trend: [2,3,3,4,4,4], stock: 29 },
        ];

        // Filter products by chart period — base list is "monthly", scale + drop to simulate other periods
        const periodHash = period.length * 13 + (range?.from?.getMonth() ?? new Date().getMonth()) * 5;
        const periodScale = period === "daily" ? 0.35 : period === "weekly" ? 0.7 : period === "yearly" ? 12 : 1;
        const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;
        let periodProducts = allProducts.map((p, i) => {
          const drop = period === "daily" ? (i + periodHash) % 3 === 0 : period === "weekly" ? (i + periodHash) % 5 === 0 : false;
          if (drop || p.qty === 0) return { ...p, qty: 0, sales: 0, cost: 0 };
          return {
            ...p,
            qty: Math.max(1, Math.round(p.qty * periodScale)),
            sales: Math.round(p.sales * periodScale),
            cost: Math.round(p.cost * periodScale),
          };
        }).filter((p) => p.qty > 0);

        // Further narrow when a chart point is focused
        if (focusedLabel) {
          const focusRow = data.find((d) => d.label === focusedLabel);
          const focusOrders = focusRow?.orders ?? 0;
          if (focusOrders === 0) {
            periodProducts = [];
          } else {
            const focusHash = Array.from(focusedLabel).reduce((s, c) => s + c.charCodeAt(0), 0);
            const rotateBy = focusHash % Math.max(periodProducts.length, 1);
            const rotated = [...periodProducts.slice(rotateBy), ...periodProducts.slice(0, rotateBy)];
            const count = Math.min(focusOrders + 2, rotated.length); // a few products per order
            const totalRowSales = focusRow?.sales ?? 0;
            const baseSum = rotated.slice(0, count).reduce((s, p) => s + p.sales, 0) || 1;
            const focusScale = totalRowSales / baseSum;
            periodProducts = rotated.slice(0, count).map((p) => ({
              ...p,
              qty: Math.max(1, Math.round(p.qty * focusScale)),
              sales: Math.max(1, Math.round(p.sales * focusScale)),
              cost: Math.max(1, Math.round(p.cost * focusScale)),
            }));
          }
        }

        const sorted = [...periodProducts].sort((a, b) => {
          switch (productSort) {
            case "sales_desc": return b.sales - a.sales;
            case "sales_asc": return a.sales - b.sales;
            case "qty_desc": return b.qty - a.qty;
            case "margin_desc": {
              const ma = a.sales > 0 ? (a.sales - a.cost) / a.sales : 0;
              const mb = b.sales > 0 ? (b.sales - b.cost) / b.sales : 0;
              return mb - ma;
            }
            case "stock_asc": return a.stock - b.stock;
          }
        });

        // The table uses its own bucketing (per-DAY, not per-hour), so the daily-single-day
        // case shows one group with the date label instead of 6 hourly buckets.
        const tableBuckets: { label: string }[] = (() => {
          const fmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
          if (period === "daily") {
            const from = dailyRange?.from ?? today;
            const to = dailyRange?.to ?? today;
            const isRange = from && to && to.getTime() !== from.getTime();
            if (!isRange) return [{ label: fmt(from) }];
            const out: { label: string }[] = [];
            let cur = new Date(from);
            let i = 0;
            while (cur.getTime() <= to.getTime() && i < 92) {
              out.push({ label: fmt(cur) });
              cur.setDate(cur.getDate() + 1);
              i++;
            }
            return out;
          }
          // For other periods, reuse chart bucket labels (already correct per current selection).
          return data.map((d) => ({ label: d.label }));
        })();

        // Build date groups for the table — show what was sold on each bucket.
        // Each bucket gets 3-5 products picked from the period product pool with small per-bucket qty.
        const dateGroups = tableBuckets.map((bucket, bucketIdx) => {
          const seed = ((bucketIdx * 37 + 1234) >>> 0);
          const numItems = 3 + (seed % 3); // 3..5 products
          const items: { name: string; sku: string; qty: number; sales: number; cost: number }[] = [];
          for (let i = 0; i < numItems && sorted.length > 0; i++) {
            const productIdx = (seed + i * 13) % sorted.length;
            const p = sorted[productIdx];
            const itemSeed = ((seed + i * 47) >>> 0);
            const qty = 1 + (itemSeed % 8);
            const unitPrice = Math.max(1, Math.round(p.sales / Math.max(p.qty, 1)));
            const salesAmt = qty * unitPrice;
            const costRatio = p.sales > 0 ? p.cost / p.sales : 0.5;
            const costAmt = Math.round(salesAmt * costRatio);
            items.push({ name: p.name, sku: p.sku, qty, sales: salesAmt, cost: costAmt });
          }
          // Sort items within group using same productSort key
          items.sort((a, b) => {
            switch (productSort) {
              case "sales_desc": return b.sales - a.sales;
              case "sales_asc": return a.sales - b.sales;
              case "qty_desc": return b.qty - a.qty;
              case "margin_desc": {
                const ma = a.sales > 0 ? (a.sales - a.cost) / a.sales : 0;
                const mb = b.sales > 0 ? (b.sales - b.cost) / b.sales : 0;
                return mb - ma;
              }
              default: return b.sales - a.sales;
            }
          });
          const totalQty = items.reduce((s, it) => s + it.qty, 0);
          const totalSales = items.reduce((s, it) => s + it.sales, 0);
          const totalCost = items.reduce((s, it) => s + it.cost, 0);
          return { label: bucket.label, items, totalQty, totalSales, totalCost };
        });

        // Paginate by groups
        const totalPages = Math.max(1, Math.ceil(dateGroups.length / productPerPage));
        const safePage = Math.min(productPage, totalPages);
        const pageStart = (safePage - 1) * productPerPage;
        const pageGroups = dateGroups.slice(pageStart, pageStart + productPerPage);

        const pageTotalQty = pageGroups.reduce((s, g) => s + g.totalQty, 0);
        const pageTotalSales = pageGroups.reduce((s, g) => s + g.totalSales, 0);
        const pageTotalCost = pageGroups.reduce((s, g) => s + g.totalCost, 0);
        const pageTotalProfit = pageTotalSales - pageTotalCost;
        const pageMargin = pageTotalSales > 0 ? (pageTotalProfit / pageTotalSales) * 100 : 0;
        const totalRows = pageGroups.reduce((s, g) => s + g.items.length, 0);

        const Sparkline = ({ values }: { values: number[] }) => {
          if (values.every((v) => v === 0)) return <div className="h-6 border-t border-dashed border-gray-300 mt-2.5 w-16 mx-auto" />;
          const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
          const w = 64, h = 24;
          const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
          const trend = values[values.length - 1] - values[0];
          const color = trend > 0 ? "#15803d" : trend < 0 ? "#dc2626" : "#9ca3af";
          return (
            <svg width={w} height={h} className="inline-block">
              <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        };

        const stockColor = (s: number) => s <= 5 ? "#dc2626" : s <= 15 ? "#ea580c" : "#15803d";

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>รายงานการขายสินค้า</h3>
                  {focusedLabel && (
                    <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                      <span className="size-1.5 rounded-full bg-[#c2410c]" />
                      เฉพาะ {focusedLabel}
                      <button onClick={() => setFocusedLabel(null)} className="ml-0.5 hover:text-[#7c2d12] cursor-pointer">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-1 inline-flex items-center gap-1.5`}>
                  <CalendarIcon className="size-3.5" />
                  <span>ข้อมูลของ <span className="text-gray-600" style={{ fontWeight: 500 }}>{datasetLabel}</span> · {dateGroups.length} กลุ่ม ({totalRows} รายการ) · แสดง {dateGroups.length === 0 ? 0 : pageStart + 1}–{pageStart + pageGroups.length}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={productSort} onChange={(e) => setProductSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-4 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="sales_desc">เรียงในกลุ่ม: ยอดขายสูงสุด</option>
                    <option value="sales_asc">เรียงในกลุ่ม: ยอดขายต่ำสุด</option>
                    <option value="qty_desc">เรียงในกลุ่ม: จำนวนขายสูงสุด</option>
                    <option value="margin_desc">เรียงในกลุ่ม: มาร์จิ้นสูงสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "16%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>วันที่</th>
                    <th className="text-left pb-3 pr-3 pl-5" style={{ fontWeight: 500 }}>สินค้า</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>จำนวนขาย</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ยอดขาย</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ต้นทุน</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>กำไร / มาร์จิ้น</th>
                  </tr>
                </thead>
                <tbody>
                  {pageGroups.map((group, gi) => {
                    const groupProfit = group.totalSales - group.totalCost;
                    const groupMargin = group.totalSales > 0 ? (groupProfit / group.totalSales) * 100 : 0;
                    return (
                      <Fragment key={gi}>
                        {group.items.map((p, i) => {
                          const profit = p.sales - p.cost;
                          const margin = p.sales > 0 ? (profit / p.sales) * 100 : 0;
                          const profitDown = margin < 55 && profit > 0;
                          const isFirst = i === 0;
                          const isLast = i === group.items.length - 1;
                          return (
                            <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${isLast ? "border-b-2 border-gray-100" : "border-b border-gray-50"}`}>
                              {isFirst && (
                                <td rowSpan={group.items.length} className="py-3 pr-3 align-top bg-[#f0faf3]/50 border-r border-gray-100">
                                  <div className="flex flex-col gap-1.5 px-2 py-1">
                                    <div className="flex items-center gap-1.5">
                                      <CalendarIcon className="size-3.5 text-[#319754] shrink-0" />
                                      <span className={`${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>{group.label}</span>
                                    </div>
                                    <div className={`${font} text-[10px] text-gray-500 flex flex-col gap-0.5 pl-5`}>
                                      <span>{group.items.length} รายการ · {group.totalQty} ชิ้น</span>
                                      <span className="text-[#319754]" style={{ fontWeight: 600 }}>฿{group.totalSales.toLocaleString()}</span>
                                      <span className={groupProfit >= 0 ? "text-[#15803d]" : "text-[#dc2626]"}>กำไร {groupMargin.toFixed(1)}%</span>
                                    </div>
                                  </div>
                                </td>
                              )}
                              <td className="py-3 pr-3 pl-5">
                                <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={p.name}>{p.name}</p>
                                <p className={`${font} text-[11px] text-gray-400 truncate`}>SKU: {p.sku}</p>
                              </td>
                              <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>
                                {p.qty} <span className="text-gray-400 text-[11px]">ชิ้น</span>
                              </td>
                              <td className={`py-3 pr-3 text-right ${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>฿{p.sales.toLocaleString()}</td>
                              <td className={`py-3 pr-3 text-right ${font} text-[13px] text-gray-600`}>฿{p.cost.toLocaleString()}</td>
                              <td className="py-3 text-right">
                                <p className={`${font} text-[14px]`} style={{ fontWeight: 700, color: profit > 0 ? (profitDown ? "#dc2626" : "#15803d") : "#9ca3af" }}>
                                  ฿{profit.toLocaleString()}
                                </p>
                                <p className={`${font} text-[11px]`} style={{ color: profit > 0 ? (profitDown ? "#dc2626" : "#15803d") : "#9ca3af" }}>
                                  {p.sales > 0 ? `${margin.toFixed(1)}%` : "-"}
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
                  {pageGroups.length === 0 && (
                    <tr><td colSpan={6} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบรายการขายในช่วงนี้</td></tr>
                  )}
                </tbody>
                {pageGroups.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100">
                      <td className={`pt-3 pr-3 ${font} text-[12px]`} style={{ fontWeight: 600 }}>{pageGroups.length} กลุ่ม</td>
                      <td className={`pt-3 pr-3 pl-5 ${font} text-[12px]`} style={{ fontWeight: 600 }}>รวม {totalRows} รายการ</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700 }}>{pageTotalQty} <span className="text-gray-400 text-[11px]">ชิ้น</span></td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[14px]`} style={{ fontWeight: 700 }}>฿{pageTotalSales.toLocaleString()}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-gray-600`} style={{ fontWeight: 600 }}>฿{pageTotalCost.toLocaleString()}</td>
                      <td className={`pt-3 text-right ${font} text-[14px] text-[#15803d]`} style={{ fontWeight: 700 }}>
                        ฿{pageTotalProfit.toLocaleString()}
                        <span className={`${font} text-[11px] block`} style={{ fontWeight: 500 }}>{pageMargin.toFixed(1)}%</span>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={productPerPage} onChange={(e) => { setProductPerPage(Number(e.target.value)); setProductPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>กลุ่มต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setProductPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setProductPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setProductPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

/* ========== REPORT — CUSTOMERS ========== */
function ReportCustomersTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [custSort, setCustSort] = useState<"total_desc" | "total_asc" | "orders_desc" | "recent" | "oldest">("total_desc");
  const [custPage, setCustPage] = useState(1);
  const [custPerPage, setCustPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dailyRange, setDailyRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [monthRange, setMonthRange] = useState<{ from: number; to: number; year: number }>({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() });
  const [monthClickPhase, setMonthClickPhase] = useState<0 | 1>(0);
  const [yearRange, setYearRange] = useState<{ from: number; to: number }>({ from: today.getFullYear(), to: today.getFullYear() });
  const [yearClickPhase, setYearClickPhase] = useState<0 | 1>(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datasetCalOpen, setDatasetCalOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const thaiMonthsFull = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const availableYears = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const datasetLabel = (() => {
    switch (period) {
      case "daily": {
        if (dailyRange?.from && dailyRange.to && dailyRange.to.getTime() !== dailyRange.from.getTime()) {
          return `${fmtDate(dailyRange.from)} - ${fmtDate(dailyRange.to)}`;
        }
        const d = dailyRange?.from ?? today;
        return `วันที่ ${d.getDate()} ${thaiMonthsFull[d.getMonth()]} ${d.getFullYear() + 543}`;
      }
      case "weekly":
        return `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
      case "monthly": {
        const yr = monthRange.year + 543;
        if (monthRange.from === monthRange.to) return `เดือน${thaiMonthsFull[monthRange.from]} ${yr}`;
        return `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
      }
      case "yearly": {
        if (yearRange.from === yearRange.to) return `ปี ${yearRange.from + 543}`;
        const a = Math.min(yearRange.from, yearRange.to);
        const b = Math.max(yearRange.from, yearRange.to);
        return `ปี ${a + 543} – ${b + 543}`;
      }
      case "custom":
        return rangeLabel;
    }
  })();

  const handleMonthClick = (m: number) => {
    if (monthClickPhase === 0) {
      setMonthRange((cur) => ({ ...cur, from: m, to: m }));
      setMonthClickPhase(1);
    } else {
      setMonthRange((cur) => ({ ...cur, from: Math.min(cur.from, m), to: Math.max(cur.from, m) }));
      setMonthClickPhase(0);
      setDatasetCalOpen(false);
    }
  };
  const handleYearClick = (y: number) => {
    if (yearClickPhase === 0) {
      setYearRange({ from: y, to: y });
      setYearClickPhase(1);
    } else {
      setYearRange((cur) => ({ from: Math.min(cur.from, y), to: Math.max(cur.from, y) }));
      setYearClickPhase(0);
      setDatasetCalOpen(false);
    }
  };

  const data = buildReportData({ period, dailyRange, selectedDate, monthRange, yearRange, today });

  // Blue + green palette (alternating shades) for the donut slices
  const PIE_COLORS = ["#3b82f6", "#319754", "#0ea5e9", "#10b981", "#1d4ed8", "#15803d"];

  const fmt = (n: number) => n.toLocaleString();

  // KPI cards — 4 metrics filtered by date selection (matches Sales pattern)
  const kpi = (() => {
    const sumKey = (k: string) => data.reduce((s, d) => s + ((d as any)[k] || 0), 0);
    const newCust = sumKey("newCust");
    const repeat = sumKey("repeat");
    const total = newCust + repeat;
    const days = Math.max(1, data.length);
    const avgNew = Math.round(newCust / days);
    const avgRepeat = Math.round(repeat / days);
    const avgTotal = Math.round(total / days);
    const repeatRate = total > 0 ? ((repeat / total) * 100) : 0;

    let scope = "วันนี้";
    if (period === "daily") {
      const from = dailyRange?.from ?? today;
      const to = dailyRange?.to ?? today;
      const isRange = !!(from && to && to.getTime() !== from.getTime());
      if (isRange) scope = `${fmtDate(from)} – ${fmtDate(to)}`;
      else if (from.toDateString() === today.toDateString()) scope = "วันนี้";
      else scope = `วันที่ ${from.getDate()} ${thaiMonthsFull[from.getMonth()]} ${from.getFullYear() + 543}`;
    } else if (period === "weekly") {
      scope = `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
    } else if (period === "monthly") {
      const yr = monthRange.year + 543;
      scope = monthRange.from === monthRange.to
        ? `เดือน${thaiMonthsFull[monthRange.from]} ${yr}`
        : `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
    } else if (period === "yearly") {
      const a = Math.min(yearRange.from, yearRange.to) + 543;
      const b = Math.max(yearRange.from, yearRange.to) + 543;
      scope = a === b ? `ปี ${a}` : `ปี ${a} – ${b}`;
    }
    return { scope, newCust, repeat, total, avgNew, avgRepeat, avgTotal, repeatRate };
  })();

  // 3D bar shape helper (matches Sales)
  const shade = (hex: string, percent: number) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, Math.min(255, (n >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
    const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
  };
  const Bar3D = (props: any) => {
    const { x, y, width, height, fill } = props;
    if (!height || height <= 0 || !width) return null;
    const depth = Math.min(Math.max(width * 0.28, 5), 9);
    const top = shade(fill, 12);
    const right = shade(fill, -18);
    return (
      <g>
        <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={right} />
        <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={top} />
        <rect x={x} y={y} width={width} height={height} fill={fill} />
      </g>
    );
  };

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานข้อมูลลูกค้า</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Popover open={datasetCalOpen} onOpenChange={setDatasetCalOpen}>
            <PopoverTrigger asChild>
              <button
                className={`${font} text-[13px] inline-flex items-center gap-2 h-[40px] px-4 rounded-full cursor-pointer bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(49,151,84,0.18)] hover:text-[#319754] transition-shadow group`}
                aria-label="เปลี่ยนวันที่"
              >
                <CalendarIcon className="size-3.5 text-gray-500 group-hover:text-[#319754]" />
                <span style={{ fontWeight: 500 }}>{datasetLabel}</span>
                <ChevronDown className="size-3.5 text-gray-400 group-hover:text-[#319754]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {(period === "daily" || period === "custom") && (
                <>
                  <Calendar mode="range" numberOfMonths={2} selected={period === "daily" ? dailyRange : range}
                    onSelect={period === "daily" ? setDailyRange : setRange}
                    defaultMonth={(period === "daily" ? dailyRange?.from : range?.from) ?? today} />
                  <div className="flex items-center justify-between gap-2 p-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 1 วัน หรือ 2 ครั้งสำหรับช่วง</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { period === "daily" ? setDailyRange({ from: today, to: today }) : setRange(undefined); }}
                        className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                      <button onClick={() => setDatasetCalOpen(false)}
                        className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                    </div>
                  </div>
                </>
              )}
              {period === "weekly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronLeft className="size-4 text-gray-600" />
                    </button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {selectedDate.getFullYear() + 543}</span>
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronRight className="size-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const isActive = selectedDate.getMonth() === i;
                      return (
                        <button key={m} onClick={() => { setSelectedDate(new Date(selectedDate.getFullYear(), i, 1)); setDatasetCalOpen(false); }}
                          className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-[#319754] text-white" : "hover:bg-gray-100 text-gray-700"}`}
                          style={{ fontWeight: isActive ? 600 : 500 }}>{m}</button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t">
                    <button onClick={() => { setSelectedDate(today); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "monthly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year - 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronLeft className="size-4 text-gray-600" />
                    </button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {monthRange.year + 543}</span>
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year + 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                      <ChevronRight className="size-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const inRange = i >= Math.min(monthRange.from, monthRange.to) && i <= Math.max(monthRange.from, monthRange.to);
                      const isEdge = i === monthRange.from || i === monthRange.to;
                      return (
                        <button key={m} onClick={() => handleMonthClick(i)}
                          className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                          style={{ fontWeight: isEdge ? 600 : 500 }}>{m}</button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setMonthRange({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() }); setMonthClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "yearly" && (
                <div className="p-3 w-[200px]">
                  <p className={`${font} text-[11px] text-gray-400 mb-2`}>ย้อนหลังได้ถึง 5 ปี</p>
                  <div className="flex flex-col gap-1">
                    {availableYears.map((y) => {
                      const inRange = y >= Math.min(yearRange.from, yearRange.to) && y <= Math.max(yearRange.from, yearRange.to);
                      const isEdge = y === yearRange.from || y === yearRange.to;
                      return (
                        <button key={y} onClick={() => handleYearClick(y)}
                          className={`${font} text-[13px] py-2 px-3 rounded-lg cursor-pointer transition-colors text-left ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                          style={{ fontWeight: isEdge ? 600 : 500 }}>ปี {y + 543}</button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setYearRange({ from: today.getFullYear(), to: today.getFullYear() }); setYearClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ปีนี้</button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <div className="inline-flex items-center bg-white rounded-full p-1 overflow-x-auto max-w-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-cust-period-bg-top" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#319754] hover:bg-[#287745] text-white h-[40px] px-5 rounded-full cursor-pointer shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)] transition-shadow`}>
                <Download className="size-4" />
                ส่งออก
                <ChevronDown className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button onClick={() => console.log("export excel")}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
                <span>Excel (.xlsx)</span>
              </button>
              <button onClick={() => console.log("export pdf")}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileText className="size-4 text-[#dc2626]" />
                <span>PDF (.pdf)</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: `ลูกค้าใหม่ ${kpi.scope}`, value: fmt(kpi.newCust) + " คน",
              subLabel: `เฉลี่ย ${kpi.avgNew.toLocaleString()} คน/วัน`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              accent: "#3b82f6",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
              bgArt: (
                <motion.img
                  src={imgNewCustomer}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `ลูกค้าซื้อซ้ำ ${kpi.scope}`, value: fmt(kpi.repeat) + " คน",
              subLabel: `เฉลี่ย ${kpi.avgRepeat.toLocaleString()} คน/วัน`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              accent: "#319754",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
              bgArt: (
                <motion.img
                  src={imgRepeatCustomers}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `ลูกค้าทั้งหมด ${kpi.scope}`, value: fmt(kpi.total) + " คน",
              subLabel: `เฉลี่ย ${kpi.avgTotal.toLocaleString()} คน/วัน`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg>,
              accent: "#0ea5e9",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg>,
              bgArt: (
                <motion.img
                  src={imgGroupCustomer}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `ลูกค้าทั้งหมดในร้าน`, value: fmt(1247) + " คน",
              subLabel: `+${fmt(kpi.newCust)} คนใหม่ ${kpi.scope}`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
              accent: "#10b981",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
              bgArt: (
                <motion.img
                  src={imgMember}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                  aria-hidden
                />
              ),
            },
          ].map((s: any) => (
            <div key={s.label} className="group rounded-2xl p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden"
              style={{ backgroundColor: `${s.accent}0d` }}>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                  <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>{s.icon}</div>
                </div>
                <p className={`${font} text-[26px] mt-3 tracking-tight tabular-nums`} style={{ fontWeight: 700, color: s.accent }}><AnimatedValue value={s.value} /></p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md`}
                    style={{ backgroundColor: `${s.accent}15`, color: s.accent, fontWeight: 600 }}>
                    {s.subIcon}
                    {s.subLabel}
                  </span>
                </div>
              </div>
              {s.bgArt}
            </div>
          ))}
        </div>

        <h3 className={`${font} text-[18px] mb-5`} style={{ fontWeight: 600 }}>รายงานข้อมูลลูกค้า</h3>

        <ResponsiveContainer width="100%" height={340}>
          {chartType === "line" ? (
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <filter id="custGlowBlue" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="custGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                      <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                      <div className="flex flex-col gap-1.5">
                        {payload.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                            <span className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                              <span className="text-gray-600">{p.name}</span>
                            </span>
                            <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>{p.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {payload?.map((entry: any, i: number) => (
                      <div key={i} className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]`}
                        style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                        <span className="block rounded-full" style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }} />
                        <span>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Line type="monotone" dataKey="newCust" stroke="#3b82f6" strokeWidth={3} name="ลูกค้าใหม่ (คน)"
                style={{ filter: "url(#custGlowBlue)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(59,130,246,0.35))" } }}
                animationDuration={800}
              />
              <Line type="monotone" dataKey="repeat" stroke="#319754" strokeWidth={3} name="ซื้อซ้ำ (คน)"
                style={{ filter: "url(#custGlowGreen)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#319754", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#319754", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(49,151,84,0.35))" } }}
                animationDuration={800}
              />
            </ComposedChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }} barCategoryGap="22%" barGap={6}>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                      <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                      <div className="flex flex-col gap-1.5">
                        {payload.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                            <span className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                              <span className="text-gray-600">{p.name}</span>
                            </span>
                            <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>{p.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {payload?.map((entry: any, i: number) => (
                      <div key={i} className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]`}
                        style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                        <span className="block rounded-full" style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }} />
                        <span>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Bar dataKey="newCust" name="ลูกค้าใหม่ (คน)" fill="#3b82f6" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
              <Bar dataKey="repeat" name="ซื้อซ้ำ (คน)" fill="#319754" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
            </BarChart>
          ) : (
            (() => {
              const pieData = data.filter((d) => (d as any).newCust > 0);
              const pieTotal = pieData.reduce((s, d) => s + ((d as any).newCust || 0), 0);
              return (
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={72} outerRadius={120} paddingAngle={2}
                    dataKey="newCust" nameKey="label" labelLine={false}
                    label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
                      if (percent < 0.06) return null;
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (<text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>{(percent * 100).toFixed(0)}%</text>);
                    }}
                    isAnimationActive animationDuration={700}
                  >
                    {pieData.map((d, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={3} />))}
                  </Pie>
                  <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fill: "#9ca3af" }}>ลูกค้าใหม่รวม</text>
                  <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 20, fill: "#1a1a1a", fontWeight: 700 }}>{pieTotal.toLocaleString()} คน</text>
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0];
                      const pct = pieTotal > 0 ? ((p.value / pieTotal) * 100).toFixed(1) : "0";
                      return (
                        <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[160px]`}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.payload.fill || PIE_COLORS[0] }} />
                            <span className="text-[12px] text-gray-600" style={{ fontWeight: 500 }}>{p.name}</span>
                          </div>
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[16px] tabular-nums" style={{ fontWeight: 700, color: p.payload.fill || PIE_COLORS[0] }}>{p.value.toLocaleString()} คน</span>
                            <span className="text-[11px] text-gray-400 tabular-nums">{pct}%</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 20 }}
                    content={({ payload }: any) => (
                      <div className="flex items-center justify-center gap-2 flex-wrap max-w-full px-4">
                        {payload?.map((entry: any, i: number) => (
                          <div key={i} className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]`}
                            style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                            <span className="block rounded-full" style={{ width: 8, height: 8, backgroundColor: entry.color, boxShadow: `0 0 0 2.5px ${entry.color}25` }} />
                            <span>{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              );
            })()
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-cust-chart-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      {(() => {
        const baseCustomers = [
          { id: "CST-001", email: "somchai.j@gmail.com", name: "สมชาย ใจดี", group: "VIP", initial: "สม", bg: "#fef3c7", fg: "#b45309", orders: 5, total: 1420, lastBuy: "2 พ.ค.", daysAgo: 2, fav: "ขมิ้นชัน" },
          { id: "CST-007", email: "malee.s@hotmail.com", name: "มาลี สดใส", group: "VIP", initial: "มล", bg: "#fde68a", fg: "#854d0e", orders: 4, total: 980, lastBuy: "28 เม.ย.", daysAgo: 6, fav: "ฟ้าทะลายโจร" },
          { id: "CST-003", email: "warapron.t@gmail.com", name: "วราภรณ์ ทองดี", group: "ประจำ", initial: "วร", bg: "#dcfce7", fg: "#15803d", orders: 3, total: 720, lastBuy: "25 เม.ย.", daysAgo: 9, fav: "น้ำมันมะพร้าว" },
          { id: "CST-012", email: "preeya.k@gmail.com", name: "ปรียา แก้วใส", group: "ใหม่", initial: "ปร", bg: "#dbeafe", fg: "#1e40af", orders: 1, total: 580, lastBuy: "3 พ.ค.", daysAgo: 1, fav: "ชาตะไคร้" },
          { id: "CST-002", email: "adithep.p@yahoo.com", name: "อดิเทพ พงษ์เพชร", group: "เสี่ยงหาย", initial: "อด", bg: "#fee2e2", fg: "#b91c1c", orders: 2, total: 420, lastBuy: "95 วันที่แล้ว", daysAgo: 95, fav: "ยาดมสมุนไพร" },
          { id: "CST-011", email: "naphaporn.d@gmail.com", name: "นภาพร ดวงดี", group: "ใหม่", initial: "นภ", bg: "#dbeafe", fg: "#1e40af", orders: 1, total: 162, lastBuy: "4 พ.ค.", daysAgo: 0, fav: "รางจืด" },
          { id: "CST-005", email: "pichaya.r@hotmail.com", name: "พิชญา รุ่งเรือง", group: "ประจำ", initial: "พช", bg: "#dcfce7", fg: "#15803d", orders: 3, total: 540, lastBuy: "1 พ.ค.", daysAgo: 3, fav: "ใบบัวบก" },
          { id: "CST-008", email: "thanaphol.s@gmail.com", name: "ธนพล ศรีสุข", group: "VIP", initial: "ธน", bg: "#fef3c7", fg: "#b45309", orders: 4, total: 880, lastBuy: "29 เม.ย.", daysAgo: 5, fav: "เห็ดหลินจือ" },
          { id: "CST-014", email: "sudarat.m@gmail.com", name: "สุดารัตน์ มีโชค", group: "ใหม่", initial: "สด", bg: "#dbeafe", fg: "#1e40af", orders: 1, total: 280, lastBuy: "2 พ.ค.", daysAgo: 2, fav: "น้ำผึ้งดอกลำไย" },
          { id: "CST-006", email: "kitti.p@yahoo.com", name: "กิตติ ภักดี", group: "เสี่ยงหาย", initial: "กต", bg: "#fee2e2", fg: "#b91c1c", orders: 2, total: 380, lastBuy: "75 วันที่แล้ว", daysAgo: 75, fav: "สบู่สมุนไพร" },
          { id: "CST-009", email: "wanwipa.j@hotmail.com", name: "วรรณวิภา จงเจริญ", group: "หายไป", initial: "วว", bg: "#f3f4f6", fg: "#525252", orders: 1, total: 180, lastBuy: "120 วันที่แล้ว", daysAgo: 120, fav: "ขิงผง" },
          { id: "CST-010", email: "phuri.t@gmail.com", name: "ภูริ ทองเนื้อเก้า", group: "ประจำ", initial: "ภร", bg: "#dcfce7", fg: "#15803d", orders: 3, total: 620, lastBuy: "30 เม.ย.", daysAgo: 4, fav: "บาล์มไพล" },
        ];

        // Filter customers by chart period — base list is "monthly", scale + drop to simulate other periods
        const periodHash = period.length * 13 + (range?.from?.getMonth() ?? new Date().getMonth()) * 5;
        const periodScale = period === "daily" ? 0.35 : period === "weekly" ? 0.7 : period === "yearly" ? 12 : 1;
        const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;
        let working = baseCustomers.map((c, i) => {
          const drop = period === "daily" ? (i + periodHash) % 3 === 0 : period === "weekly" ? (i + periodHash) % 5 === 0 : false;
          if (drop) return { ...c, orders: 0, total: 0 };
          return {
            ...c,
            orders: Math.max(1, Math.round(c.orders * periodScale)),
            total: Math.max(1, Math.round(c.total * periodScale)),
          };
        }).filter((c) => c.orders > 0);

        // Further narrow by chart focus
        if (focusedLabel) {
          const focusedRow = data.find((d) => d.label === focusedLabel);
          const totalCust = focusedRow ? focusedRow.newCust + focusedRow.repeat : 0;
          if (totalCust === 0) working = [];
          else {
            const hash = Array.from(focusedLabel).reduce((s, ch) => s + ch.charCodeAt(0), 0);
            const rotateBy = hash % Math.max(working.length, 1);
            working = [...working.slice(rotateBy), ...working.slice(0, rotateBy)]
              .slice(0, Math.min(totalCust, working.length))
              .map((c, i) => ({
                ...c,
                orders: Math.max(1, Math.round(c.orders * (1 - i * 0.08))),
                total: Math.max(1, Math.round(c.total * (0.4 + (((hash + i) % 60) / 100)))),
              }));
          }
        }

        const sorted = [...working].sort((a, b) => {
          switch (custSort) {
            case "total_desc": return b.total - a.total;
            case "total_asc": return a.total - b.total;
            case "orders_desc": return b.orders - a.orders;
            case "recent": return a.daysAgo - b.daysAgo;
            case "oldest": return b.daysAgo - a.daysAgo;
          }
        });

        const totalPages = Math.max(1, Math.ceil(sorted.length / custPerPage));
        const safePage = Math.min(custPage, totalPages);
        const pageStart = (safePage - 1) * custPerPage;
        const pageItems = sorted.slice(pageStart, pageStart + custPerPage);

        const pageOrders = pageItems.reduce((s, c) => s + c.orders, 0);
        const pageTotal = pageItems.reduce((s, c) => s + c.total, 0);
        const pageAovAvg = pageOrders > 0 ? Math.round(pageTotal / pageOrders) : 0;

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>ลูกค้าที่มียอดซื้อสูงสุด</h3>
                  {focusedLabel && (
                    <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                      <span className="size-1.5 rounded-full bg-[#c2410c]" />
                      เฉพาะ {focusedLabel}
                      <button onClick={() => setFocusedLabel(null)} className="ml-0.5 hover:text-[#7c2d12] cursor-pointer">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-1 inline-flex items-center gap-1.5`}>
                  <CalendarIcon className="size-3.5" />
                  <span>ข้อมูลของ <span className="text-gray-600" style={{ fontWeight: 500 }}>{datasetLabel}</span> · แสดง {sorted.length === 0 ? 0 : pageStart + 1}–{pageStart + pageItems.length} จาก {sorted.length} คน</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={custSort} onChange={(e) => setCustSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-4 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="total_desc">เรียง: ยอดซื้อรวม</option>
                    <option value="total_asc">เรียง: ยอดซื้อต่ำสุด</option>
                    <option value="orders_desc">เรียง: ออเดอร์มากสุด</option>
                    <option value="recent">เรียง: ซื้อล่าสุด</option>
                    <option value="oldest">เรียง: ห่างจากซื้อ</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "17%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-2" style={{ fontWeight: 500 }}>#</th>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>ลูกค้า</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ออเดอร์</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ยอดรวม</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>AOV</th>
                    <th className="text-center pb-3 pr-3" style={{ fontWeight: 500 }}>อัตราซื้อซ้ำ</th>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>ซื้อล่าสุด</th>
                    <th className="text-left pb-3" style={{ fontWeight: 500 }}>สินค้าที่ชอบ</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c, i) => {
                    const aov = c.orders > 0 ? Math.round(c.total / c.orders) : 0;
                    const stale = c.daysAgo > 30;
                    const rank = pageStart + i;
                    const rankBg = rank === 0 ? "#facc15" : rank === 1 ? "#94a3b8" : rank === 2 ? "#f97316" : "transparent";
                    const rankFg = rank < 3 ? "white" : "#9ca3af";
                    const repeatRate = c.orders > 1 ? Math.round(((c.orders - 1) / c.orders) * 100) : 0;
                    const rrColor = repeatRate >= 70 ? "#15803d" : repeatRate >= 40 ? "#319754" : repeatRate > 0 ? "#0ea5e9" : "#9ca3af";
                    const rrBg = repeatRate >= 70 ? "#dcfce7" : repeatRate >= 40 ? "#d6eadd" : repeatRate > 0 ? "#dbeafe" : "#f3f4f6";
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font}`}
                            style={{ backgroundColor: rankBg, color: rankFg, fontWeight: 600 }}>
                            {rank + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-3 min-w-0">
                          <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={c.name}>{c.name}</p>
                          <p className={`${font} text-[11px] text-gray-400 truncate`} title={c.email}>{c.email}</p>
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>{c.orders}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>฿{c.total.toLocaleString()}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-gray-600`}>฿{aov.toLocaleString()}</td>
                        <td className="py-3 pr-3 text-center">
                          <span className={`${font} inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded-full tabular-nums`}
                            style={{ backgroundColor: rrBg, color: rrColor, fontWeight: 600 }}>
                            {repeatRate}%
                          </span>
                        </td>
                        <td className={`py-3 pr-3 ${font} text-[12px] truncate`} style={{ color: stale ? "#dc2626" : "#374151", fontWeight: stale ? 600 : 400 }} title={c.lastBuy}>{c.lastBuy}</td>
                        <td className={`py-3 ${font} text-[12px] text-[#1a1a1a] truncate`} title={c.fav}>{c.fav}</td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={8} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบลูกค้าที่ตรงกับเงื่อนไข</td></tr>
                  )}
                </tbody>
                {pageItems.length > 0 && (
                  <tfoot>
                    {(() => {
                      const totalOrders = pageItems.reduce((s, c) => s + c.orders, 0);
                      const repeatOrders = pageItems.reduce((s, c) => s + Math.max(0, c.orders - 1), 0);
                      const avgRepeatRate = totalOrders > 0 ? Math.round((repeatOrders / totalOrders) * 100) : 0;
                      return (
                        <tr className="border-t-2 border-gray-100">
                          <td />
                          <td className={`pt-3 pr-3 ${font} text-[12px] truncate`} style={{ fontWeight: 600 }}>รวม ({pageItems.length} คนที่แสดง)</td>
                          <td className={`pt-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700 }}>{pageOrders}</td>
                          <td className={`pt-3 pr-3 text-right ${font} text-[14px]`} style={{ fontWeight: 700 }}>฿{pageTotal.toLocaleString()}</td>
                          <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-gray-700`} style={{ fontWeight: 700 }}>฿{pageAovAvg.toLocaleString()}</td>
                          <td className={`pt-3 pr-3 text-center ${font} text-[13px] text-[#319754]`} style={{ fontWeight: 700 }}>{avgRepeatRate}%</td>
                          <td colSpan={2} />
                        </tr>
                      );
                    })()}
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={custPerPage} onChange={(e) => { setCustPerPage(Number(e.target.value)); setCustPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>คนต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setCustPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCustPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setCustPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ========== REPORT — PRODUCTS ========== */
function ReportProductsTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [productSort, setProductSort] = useState<"sold_desc" | "sold_asc" | "revenue_desc">("sold_desc");
  const [productPage, setProductPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(50);
  const [ratingSort, setRatingSort] = useState<"rating_desc" | "rating_asc" | "reviews_desc">("rating_desc");
  const [ratingPage, setRatingPage] = useState(1);
  const [ratingPerPage, setRatingPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dailyRange, setDailyRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [monthRange, setMonthRange] = useState<{ from: number; to: number; year: number }>({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() });
  const [monthClickPhase, setMonthClickPhase] = useState<0 | 1>(0);
  const [yearRange, setYearRange] = useState<{ from: number; to: number }>({ from: today.getFullYear(), to: today.getFullYear() });
  const [yearClickPhase, setYearClickPhase] = useState<0 | 1>(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datasetCalOpen, setDatasetCalOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const thaiMonthsFull = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const availableYears = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const datasetLabel = (() => {
    switch (period) {
      case "daily": {
        if (dailyRange?.from && dailyRange.to && dailyRange.to.getTime() !== dailyRange.from.getTime()) return `${fmtDate(dailyRange.from)} - ${fmtDate(dailyRange.to)}`;
        const d = dailyRange?.from ?? today;
        return `วันที่ ${d.getDate()} ${thaiMonthsFull[d.getMonth()]} ${d.getFullYear() + 543}`;
      }
      case "weekly": return `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
      case "monthly": {
        const yr = monthRange.year + 543;
        if (monthRange.from === monthRange.to) return `เดือน${thaiMonthsFull[monthRange.from]} ${yr}`;
        return `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
      }
      case "yearly": {
        if (yearRange.from === yearRange.to) return `ปี ${yearRange.from + 543}`;
        const a = Math.min(yearRange.from, yearRange.to);
        const b = Math.max(yearRange.from, yearRange.to);
        return `ปี ${a + 543} – ${b + 543}`;
      }
      case "custom": return rangeLabel;
    }
  })();

  const handleMonthClick = (m: number) => {
    if (monthClickPhase === 0) { setMonthRange((cur) => ({ ...cur, from: m, to: m })); setMonthClickPhase(1); }
    else { setMonthRange((cur) => ({ ...cur, from: Math.min(cur.from, m), to: Math.max(cur.from, m) })); setMonthClickPhase(0); setDatasetCalOpen(false); }
  };
  const handleYearClick = (y: number) => {
    if (yearClickPhase === 0) { setYearRange({ from: y, to: y }); setYearClickPhase(1); }
    else { setYearRange((cur) => ({ from: Math.min(cur.from, y), to: Math.max(cur.from, y) })); setYearClickPhase(0); setDatasetCalOpen(false); }
  };

  const shade = (hex: string, percent: number) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, Math.min(255, (n >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
    const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
  };
  const Bar3D = (props: any) => {
    const { x, y, width, height, fill } = props;
    if (!height || height <= 0 || !width) return null;
    const depth = Math.min(Math.max(width * 0.28, 5), 9);
    return (<g>
      <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={shade(fill, -18)} />
      <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={shade(fill, 12)} />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>);
  };

  const data = buildReportData({ period, dailyRange, selectedDate, monthRange, yearRange, today });

  const PIE_COLORS = ["#319754", "#46A165", "#7bc290", "#aedab8", "#10b981", "#34d399"];

  // KPI scope for filtered cards
  const kpi = (() => {
    const sumKey = (k: string) => data.reduce((s, d) => s + ((d as any)[k] || 0), 0);
    const units = sumKey("units");
    const days = Math.max(1, data.length);
    const avgUnits = Math.round(units / days);
    let scope = "วันนี้";
    if (period === "daily") {
      const from = dailyRange?.from ?? today; const to = dailyRange?.to ?? today;
      const isRange = !!(from && to && to.getTime() !== from.getTime());
      if (isRange) scope = `${fmtDate(from)} – ${fmtDate(to)}`;
      else if (from.toDateString() === today.toDateString()) scope = "วันนี้";
      else scope = `วันที่ ${from.getDate()} ${thaiMonthsFull[from.getMonth()]} ${from.getFullYear() + 543}`;
    } else if (period === "weekly") scope = `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
    else if (period === "monthly") {
      const yr = monthRange.year + 543;
      scope = monthRange.from === monthRange.to ? `เดือน${thaiMonthsFull[monthRange.from]} ${yr}` : `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
    } else if (period === "yearly") {
      const a = Math.min(yearRange.from, yearRange.to) + 543; const b = Math.max(yearRange.from, yearRange.to) + 543;
      scope = a === b ? `ปี ${a}` : `ปี ${a} – ${b}`;
    }
    return { scope, units, avgUnits };
  })();

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานข้อมูลสินค้า</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Popover open={datasetCalOpen} onOpenChange={setDatasetCalOpen}>
            <PopoverTrigger asChild>
              <button
                className={`${font} text-[13px] inline-flex items-center gap-2 h-[40px] px-4 rounded-full cursor-pointer bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(49,151,84,0.18)] hover:text-[#319754] transition-shadow group`}
                aria-label="เปลี่ยนวันที่"
              >
                <CalendarIcon className="size-3.5 text-gray-500 group-hover:text-[#319754]" />
                <span style={{ fontWeight: 500 }}>{datasetLabel}</span>
                <ChevronDown className="size-3.5 text-gray-400 group-hover:text-[#319754]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {(period === "daily" || period === "custom") && (
                <>
                  <Calendar mode="range" numberOfMonths={2} selected={period === "daily" ? dailyRange : range}
                    onSelect={period === "daily" ? setDailyRange : setRange}
                    defaultMonth={(period === "daily" ? dailyRange?.from : range?.from) ?? today} />
                  <div className="flex items-center justify-between gap-2 p-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 1 วัน หรือ 2 ครั้งสำหรับช่วง</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { period === "daily" ? setDailyRange({ from: today, to: today }) : setRange(undefined); }}
                        className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                      <button onClick={() => setDatasetCalOpen(false)}
                        className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                    </div>
                  </div>
                </>
              )}
              {period === "weekly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronLeft className="size-4 text-gray-600" /></button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {selectedDate.getFullYear() + 543}</span>
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronRight className="size-4 text-gray-600" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const isActive = selectedDate.getMonth() === i;
                      return (<button key={m} onClick={() => { setSelectedDate(new Date(selectedDate.getFullYear(), i, 1)); setDatasetCalOpen(false); }}
                        className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-[#319754] text-white" : "hover:bg-gray-100 text-gray-700"}`}
                        style={{ fontWeight: isActive ? 600 : 500 }}>{m}</button>);
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t">
                    <button onClick={() => { setSelectedDate(today); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "monthly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year - 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronLeft className="size-4 text-gray-600" /></button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {monthRange.year + 543}</span>
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year + 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronRight className="size-4 text-gray-600" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const inRange = i >= Math.min(monthRange.from, monthRange.to) && i <= Math.max(monthRange.from, monthRange.to);
                      const isEdge = i === monthRange.from || i === monthRange.to;
                      return (<button key={m} onClick={() => handleMonthClick(i)}
                        className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                        style={{ fontWeight: isEdge ? 600 : 500 }}>{m}</button>);
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setMonthRange({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() }); setMonthClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "yearly" && (
                <div className="p-3 w-[200px]">
                  <p className={`${font} text-[11px] text-gray-400 mb-2`}>ย้อนหลังได้ถึง 5 ปี</p>
                  <div className="flex flex-col gap-1">
                    {availableYears.map((y) => {
                      const inRange = y >= Math.min(yearRange.from, yearRange.to) && y <= Math.max(yearRange.from, yearRange.to);
                      const isEdge = y === yearRange.from || y === yearRange.to;
                      return (<button key={y} onClick={() => handleYearClick(y)}
                        className={`${font} text-[13px] py-2 px-3 rounded-lg cursor-pointer transition-colors text-left ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                        style={{ fontWeight: isEdge ? 600 : 500 }}>ปี {y + 543}</button>);
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setYearRange({ from: today.getFullYear(), to: today.getFullYear() }); setYearClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ปีนี้</button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <div className="inline-flex items-center bg-white rounded-full p-1 overflow-x-auto max-w-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-prod-period-bg-top" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#319754] hover:bg-[#287745] text-white h-[40px] px-5 rounded-full cursor-pointer shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)] transition-shadow`}>
                <Download className="size-4" />
                ส่งออก
                <ChevronDown className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
                <span>Excel (.xlsx)</span>
              </button>
              <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileText className="size-4 text-[#dc2626]" />
                <span>PDF (.pdf)</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: `จำนวนขาย ${kpi.scope}`, value: kpi.units.toLocaleString() + " ชิ้น",
              subLabel: `เฉลี่ย ${kpi.avgUnits.toLocaleString()} ชิ้น/วัน`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              accent: "#319754",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
              bgArt: (
                <motion.img
                  src={imgProductsSold}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  aria-hidden
                />
              ),
            },
            {
              label: "สินค้าทั้งหมดในร้าน", value: "247 รายการ",
              subLabel: "9 หมวดหมู่",
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
              accent: "#0ea5e9",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8 21 13l-5 5"/><path d="M21 13H8a4 4 0 00-4 4v3"/></svg>,
              bgArt: (
                <motion.img
                  src={imgProductsStore}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  aria-hidden
                />
              ),
            },
            {
              label: "สต็อกต่ำ / หมด", value: "4 รายการ",
              subLabel: "1 รายการสินค้าหมด",
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
              accent: "#dc2626",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
              bgArt: (
                <motion.img
                  src={imgStock}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  aria-hidden
                />
              ),
            },
            {
              label: "รีวิวเฉลี่ยร้าน", value: "4.6 ★",
              subLabel: "1,247 รีวิวรวม",
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
              accent: "#f59e0b",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
              bgArt: (
                <motion.img
                  src={imgRating}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                  aria-hidden
                />
              ),
            },
          ].map((s: any) => (
            <div key={s.label} className="group rounded-2xl p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden"
              style={{ backgroundColor: `${s.accent}0d` }}>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                  <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>{s.icon}</div>
                </div>
                <p className={`${font} text-[26px] mt-3 tracking-tight tabular-nums`} style={{ fontWeight: 700, color: s.accent }}><AnimatedValue value={s.value} /></p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md`}
                    style={{ backgroundColor: `${s.accent}15`, color: s.accent, fontWeight: 600 }}>
                    {s.subIcon}{s.subLabel}
                  </span>
                </div>
              </div>
              {s.bgArt}
            </div>
          ))}
        </div>

        <h3 className={`${font} text-[18px] mb-5`} style={{ fontWeight: 600 }}>รายงานข้อมูลสินค้า</h3>

        <ResponsiveContainer width="100%" height={340}>
          {chartType === "line" ? (
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <filter id="prodGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="prodGlowPink" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
              <Tooltip
                cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (<div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                    <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                    <div className="flex flex-col gap-1.5">{payload.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} /><span className="text-gray-600">{p.name}</span></span>
                        <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>{p.dataKey === "revenue" ? `฿${p.value.toLocaleString()}` : p.value.toLocaleString()}</span>
                      </div>
                    ))}</div>
                  </div>);
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">{payload?.map((entry: any, i: number) => (
                    <div key={i} className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]`}
                      style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                      <span className="block rounded-full" style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }} />
                      <span>{entry.value}</span>
                    </div>
                  ))}</div>
                )}
              />
              <Line yAxisId="left" type="monotone" dataKey="units" stroke="#319754" strokeWidth={3} name="จำนวนขาย (ชิ้น)"
                style={{ filter: "url(#prodGlowGreen)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#319754", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#319754", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(49,151,84,0.35))" } }}
                animationDuration={800}
              />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} name="รายได้ (฿)"
                style={{ filter: "url(#prodGlowPink)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#ec4899", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#ec4899", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(236,72,153,0.35))" } }}
                animationDuration={800}
              />
            </ComposedChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }} barCategoryGap="22%" barGap={6}>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
              <Tooltip cursor={{ fill: "rgba(148,163,184,0.08)" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (<div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                    <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                    <div className="flex flex-col gap-1.5">{payload.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} /><span className="text-gray-600">{p.name}</span></span>
                        <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>{p.dataKey === "revenue" ? `฿${p.value.toLocaleString()}` : p.value.toLocaleString()}</span>
                      </div>
                    ))}</div>
                  </div>);
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">{payload?.map((entry: any, i: number) => (
                    <div key={i} className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]`}
                      style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                      <span className="block rounded-full" style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }} />
                      <span>{entry.value}</span>
                    </div>
                  ))}</div>
                )}
              />
              <Bar yAxisId="left" dataKey="units" name="จำนวนขาย (ชิ้น)" fill="#319754" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
              <Bar yAxisId="right" dataKey="revenue" name="รายได้ (฿)" fill="#ec4899" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
            </BarChart>
          ) : (
            (() => {
              const pieData = data.filter((d) => (d as any).units > 0);
              const pieTotal = pieData.reduce((s, d) => s + ((d as any).units || 0), 0);
              return (<PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={72} outerRadius={120} paddingAngle={2}
                  dataKey="units" nameKey="label" labelLine={false}
                  label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
                    if (percent < 0.06) return null;
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (<text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>{(percent * 100).toFixed(0)}%</text>);
                  }}
                  isAnimationActive animationDuration={700}
                >
                  {pieData.map((d, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={3} />))}
                </Pie>
                <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fill: "#9ca3af" }}>ขายรวม</text>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 20, fill: "#1a1a1a", fontWeight: 700 }}>{pieTotal.toLocaleString()} ชิ้น</text>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0];
                    const pct = pieTotal > 0 ? ((p.value / pieTotal) * 100).toFixed(1) : "0";
                    return (<div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[160px]`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.payload.fill || PIE_COLORS[0] }} />
                        <span className="text-[12px] text-gray-600" style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[16px] tabular-nums" style={{ fontWeight: 700, color: p.payload.fill || PIE_COLORS[0] }}>{p.value.toLocaleString()} ชิ้น</span>
                        <span className="text-[11px] text-gray-400 tabular-nums">{pct}%</span>
                      </div>
                    </div>);
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 20 }}
                  content={({ payload }: any) => (
                    <div className="flex items-center justify-center gap-2 flex-wrap max-w-full px-4">{payload?.map((entry: any, i: number) => (
                      <div key={i} className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]`}
                        style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                        <span className="block rounded-full" style={{ width: 8, height: 8, backgroundColor: entry.color, boxShadow: `0 0 0 2.5px ${entry.color}25` }} />
                        <span>{entry.value}</span>
                      </div>
                    ))}</div>
                  )}
                />
              </PieChart>);
            })()
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-prod-chart-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Product + Rating Product (side-by-side) */}
      {(() => {
        const baseProducts = [
          { name: "พิมเสนน้ำอโรมา ตราเมต้าเฮิร์บ", category: "ผลิตภัณฑ์สมุนไพร", sold: 16, revenue: 1122 },
          { name: "ถุงหอมอโรมา MetaHerb Bloom Essence", category: "เครื่องหอม & อโรม่า", sold: 11, revenue: 1069.2 },
          { name: "กาแฟดริป signature อเมริกาโนเย็น", category: "อาหารและเครื่องดื่ม", sold: 5, revenue: 850 },
          { name: "ขมิ้นชันแคปซูล 60 แคป", category: "สมุนไพรแคปซูล", sold: 8, revenue: 1420 },
          { name: "ฟ้าทะลายโจรผง 100 g", category: "ผงสมุนไพร", sold: 5, revenue: 1150 },
          { name: "น้ำมันมะพร้าวสกัดเย็น", category: "น้ำมันสมุนไพร", sold: 3, revenue: 870 },
          { name: "ชาตะไคร้ใบเตย 30 ซอง", category: "ชาสมุนไพร", sold: 2, revenue: 580 },
          { name: "ใบบัวบกแคปซูล 60 แคป", category: "สมุนไพรแคปซูล", sold: 7, revenue: 1280 },
          { name: "เห็ดหลินจือสกัด 60 แคป", category: "สมุนไพรสกัด", sold: 4, revenue: 980 },
          { name: "ชาเก๊กฮวยออร์แกนิก 20 ซอง", category: "ชาสมุนไพร", sold: 6, revenue: 760 },
          { name: "น้ำผึ้งดอกลำไย 250 ml", category: "ผลิตภัณฑ์ออร์แกนิก", sold: 3, revenue: 645 },
          { name: "ขิงผงออร์แกนิก 100 g", category: "ผงสมุนไพร", sold: 4, revenue: 520 },
          { name: "สบู่สมุนไพรขมิ้น", category: "ของใช้ออร์แกนิก", sold: 12, revenue: 1800 },
          { name: "บาล์มสมุนไพรไพล", category: "ของใช้ออร์แกนิก", sold: 2, revenue: 380 },
          { name: "ชามะรุม 30 ซอง", category: "ชาสมุนไพร", sold: 5, revenue: 650 },
        ];

        // Period + date selection filtering — rotates products + scales by selection
        const periodHash = (() => {
          let key = period.length * 13;
          if (period === "daily") {
            const d = dailyRange?.from ?? today;
            key += d.getDate() * 7 + d.getMonth() * 31 + (d.getFullYear() % 100) * 3;
            const to = dailyRange?.to ?? d;
            if (to.getTime() !== d.getTime()) key += to.getDate() * 11;
          } else if (period === "weekly") {
            key += selectedDate.getMonth() * 19 + (selectedDate.getFullYear() % 100) * 5;
          } else if (period === "monthly") {
            key += monthRange.from * 11 + monthRange.to * 7 + (monthRange.year % 100) * 3;
          } else if (period === "yearly") {
            key += (yearRange.from % 100) * 23 + (yearRange.to % 100) * 17;
          }
          return key;
        })();
        // Scale qty/revenue by number of buckets in `data` so totals reflect selected scope
        const periodScale = Math.max(0.35, Math.min(20, data.length * 0.4));
        let working = baseProducts.map((p, i) => {
          const drop = (i + periodHash) % 4 === 0 && period === "daily" && (!dailyRange?.to || dailyRange.to.getTime() === dailyRange.from!.getTime());
          if (drop) return { ...p, sold: 0, revenue: 0 };
          return {
            ...p,
            sold: Math.max(1, Math.round(p.sold * periodScale)),
            revenue: Math.round(p.revenue * periodScale),
          };
        }).filter((p) => p.sold > 0);

        // Narrow by chart focus
        if (focusedLabel) {
          const focusRow = data.find((d) => d.label === focusedLabel);
          const focusUnits = focusRow?.units ?? 0;
          if (focusUnits === 0) working = [];
          else {
            const focusHash = Array.from(focusedLabel).reduce((s, ch) => s + ch.charCodeAt(0), 0);
            const rotateBy = focusHash % Math.max(working.length, 1);
            const rotated = [...working.slice(rotateBy), ...working.slice(0, rotateBy)];
            const count = Math.min(Math.max(3, Math.ceil(focusUnits / 2)), rotated.length);
            working = rotated.slice(0, count).map((p, i) => ({
              ...p,
              sold: Math.max(1, Math.round(p.sold * (1 - i * 0.1))),
              revenue: Math.max(1, Math.round(p.revenue * (0.5 + (((focusHash + i) % 50) / 100)))),
            }));
          }
        }

        const sorted = [...working].sort((a, b) => {
          switch (productSort) {
            case "sold_desc": return b.sold - a.sold;
            case "sold_asc": return a.sold - b.sold;
            case "revenue_desc": return b.revenue - a.revenue;
          }
        });

        const totalPages = Math.max(1, Math.ceil(sorted.length / productPerPage));
        const safePage = Math.min(productPage, totalPages);
        const pageStart = (safePage - 1) * productPerPage;
        const pageItems = sorted.slice(pageStart, pageStart + productPerPage);
        const maxSold = pageItems.length > 0 ? Math.max(...pageItems.map((p) => p.sold)) : 1;

        const pageTotalSold = pageItems.reduce((s, p) => s + p.sold, 0);
        const pageTotalRevenue = pageItems.reduce((s, p) => s + p.revenue, 0);

        const rankColor = (i: number) => i === 0 ? "#facc15" : i === 1 ? "#94a3b8" : i === 2 ? "#f97316" : "transparent";
        const rankText = (i: number) => i < 3 ? "white" : "#9ca3af";

        // Build rating data (deterministic per product name)
        const hashStr = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
        const ratingData = baseProducts.map((p) => {
          const h = hashStr(p.name);
          // Rating: 3.5 - 5.0 in 0.1 steps (favoring 4.0-5.0 for realism)
          const ratingRaw = 3.5 + ((h >>> 3) % 16) * 0.1; // 3.5 to 5.0
          const rating = Math.round(ratingRaw * 10) / 10;
          const reviews = 5 + ((h >>> 5) % 248); // 5 - 252 reviews
          const trendPct = (((h >>> 7) % 30) - 12); // -12 to +17
          return { name: p.name, category: p.category, rating, reviews, trend: trendPct };
        });
        const ratingSorted = [...ratingData].sort((a, b) => {
          switch (ratingSort) {
            case "rating_desc": return b.rating - a.rating || b.reviews - a.reviews;
            case "rating_asc": return a.rating - b.rating || b.reviews - a.reviews;
            case "reviews_desc": return b.reviews - a.reviews;
          }
        });
        const avgRating = (ratingData.reduce((s, p) => s + p.rating, 0) / ratingData.length).toFixed(2);
        const totalReviews = ratingData.reduce((s, p) => s + p.reviews, 0);
        // Pagination for rating table
        const ratingTotalPages = Math.max(1, Math.ceil(ratingSorted.length / ratingPerPage));
        const ratingSafePage = Math.min(ratingPage, ratingTotalPages);
        const ratingPageStart = (ratingSafePage - 1) * ratingPerPage;
        const ratingTop = ratingSorted.slice(ratingPageStart, ratingPageStart + ratingPerPage);

        return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>Top Product</h3>
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-1 inline-flex items-center gap-1.5`}>
                  <CalendarIcon className="size-3.5" />
                  <span>ข้อมูลของ <span className="text-gray-600" style={{ fontWeight: 500 }}>{datasetLabel}</span> · สินค้าทั้งหมด {sorted.length} รายการ · แสดง {sorted.length === 0 ? 0 : pageStart + 1}–{pageStart + pageItems.length}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={productSort} onChange={(e) => setProductSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="sold_desc">เรียง: ยอดขายสูงสุด</option>
                    <option value="sold_asc">เรียง: ยอดขายต่ำสุด</option>
                    <option value="revenue_desc">เรียง: รายได้สูงสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "44%" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "22%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-2" style={{ fontWeight: 500 }}>#</th>
                    <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>สินค้า</th>
                    <th className="text-right pb-3 pr-4" style={{ fontWeight: 500 }}>ยอดขาย (ชิ้น)</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>รายได้ (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((p, i) => {
                    const rank = pageStart + i;
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font}`}
                            style={{ backgroundColor: rankColor(rank), color: rankText(rank), fontWeight: 600 }}>
                            {rank + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              <ImageWithFallback src={`https://picsum.photos/seed/${encodeURIComponent(p.name)}/120`} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={p.name}>{p.name}</p>
                              <p className={`${font} text-[11px] text-gray-400 truncate`}>{p.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#319754] rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                            </div>
                            <span className={`${font} text-[14px] w-8 text-right`}>{p.sold.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className={`py-3 text-right ${font} text-[14px]`} style={{ fontWeight: 600 }}>{p.revenue.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={4} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบข้อมูลสินค้า</td></tr>
                  )}
                </tbody>
                {pageItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100">
                      <td />
                      <td className={`pt-3 pr-4 ${font} text-[13px]`} style={{ fontWeight: 600 }}>รวม ({pageItems.length} รายการที่แสดง)</td>
                      <td className={`pt-3 pr-4 text-right ${font} text-[14px]`} style={{ fontWeight: 700 }}>{pageTotalSold.toLocaleString()}</td>
                      <td className={`pt-3 text-right ${font} text-[14px] text-[#319754]`} style={{ fontWeight: 700 }}>{pageTotalRevenue.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={productPerPage} onChange={(e) => { setProductPerPage(Number(e.target.value)); setProductPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setProductPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setProductPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setProductPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>

          {/* Rating Product card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>Rating Product</h3>
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full bg-[#f59e0b]" />
                    เฉลี่ย {avgRating} ★
                  </span>
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-1 inline-flex items-center gap-1.5`}>
                  <CalendarIcon className="size-3.5" />
                  <span>ข้อมูลของ <span className="text-gray-600" style={{ fontWeight: 500 }}>{datasetLabel}</span> · สินค้าทั้งหมด {ratingSorted.length} รายการ · แสดง {ratingSorted.length === 0 ? 0 : ratingPageStart + 1}–{ratingPageStart + ratingTop.length} · รีวิวรวม {totalReviews.toLocaleString()} ครั้ง</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={ratingSort} onChange={(e) => setRatingSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="rating_desc">เรียง: คะแนนสูงสุด</option>
                    <option value="rating_asc">เรียง: คะแนนต่ำสุด</option>
                    <option value="reviews_desc">เรียง: รีวิวมากสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "44%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "18%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-2" style={{ fontWeight: 500 }}>#</th>
                    <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>สินค้า</th>
                    <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>คะแนน</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>รีวิว</th>
                  </tr>
                </thead>
                <tbody>
                  {ratingTop.map((p, i) => {
                    const rank = ratingPageStart + i;
                    const rankBg = rank === 0 ? "#facc15" : rank === 1 ? "#94a3b8" : rank === 2 ? "#f97316" : "transparent";
                    const rankText = rank < 3 ? "white" : "#9ca3af";
                    const stars = Math.round(p.rating);
                    return (
                      <tr key={p.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font}`}
                            style={{ backgroundColor: rankBg, color: rankText, fontWeight: 600 }}>
                            {rank + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              <ImageWithFallback src={`https://picsum.photos/seed/${encodeURIComponent(p.name)}/120`} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={p.name}>{p.name}</p>
                              <p className={`${font} text-[11px] text-gray-400 truncate`}>{p.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <svg key={j} className="size-[12px] shrink-0" viewBox="0 0 24 24" fill={j < stars ? "#f59e0b" : "#e5e7eb"}>
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              ))}
                            </div>
                            <span className={`${font} text-[13px] text-[#c2410c] tabular-nums`} style={{ fontWeight: 600 }}>{p.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`${font} text-[13px] text-gray-700 tabular-nums`} style={{ fontWeight: 500 }}>{p.reviews.toLocaleString()}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-100">
                    <td />
                    <td className={`pt-3 pr-4 ${font} text-[13px]`} style={{ fontWeight: 600 }}>คะแนนเฉลี่ยทั้งร้าน</td>
                    <td className="pt-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <svg key={j} className="size-[12px] shrink-0" viewBox="0 0 24 24" fill={j < Math.round(parseFloat(avgRating)) ? "#f59e0b" : "#e5e7eb"}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span className={`${font} text-[14px] text-[#c2410c] tabular-nums`} style={{ fontWeight: 700 }}>{avgRating}</span>
                      </div>
                    </td>
                    <td className={`pt-3 text-right ${font} text-[14px] tabular-nums`} style={{ fontWeight: 700 }}>{totalReviews.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={ratingPerPage} onChange={(e) => { setRatingPerPage(Number(e.target.value)); setRatingPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={ratingSafePage === 1} onClick={() => setRatingPage(ratingSafePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${ratingSafePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: ratingTotalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setRatingPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${ratingSafePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: ratingSafePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={ratingSafePage === ratingTotalPages} onClick={() => setRatingPage(ratingSafePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${ratingSafePage === ratingTotalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

/* ========== REPORT — MARKET ========== */
function ReportMarketTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [chSort, setChSort] = useState<"revenue_desc" | "visits_desc" | "conv_desc" | "roas_desc">("revenue_desc");
  const [chPage, setChPage] = useState(1);
  const [chPerPage, setChPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dailyRange, setDailyRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [monthRange, setMonthRange] = useState<{ from: number; to: number; year: number }>({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() });
  const [monthClickPhase, setMonthClickPhase] = useState<0 | 1>(0);
  const [yearRange, setYearRange] = useState<{ from: number; to: number }>({ from: today.getFullYear(), to: today.getFullYear() });
  const [yearClickPhase, setYearClickPhase] = useState<0 | 1>(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datasetCalOpen, setDatasetCalOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const thaiMonthsFull = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const availableYears = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const datasetLabel = (() => {
    switch (period) {
      case "daily": {
        if (dailyRange?.from && dailyRange.to && dailyRange.to.getTime() !== dailyRange.from.getTime()) return `${fmtDate(dailyRange.from)} - ${fmtDate(dailyRange.to)}`;
        const d = dailyRange?.from ?? today;
        return `วันที่ ${d.getDate()} ${thaiMonthsFull[d.getMonth()]} ${d.getFullYear() + 543}`;
      }
      case "weekly": return `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
      case "monthly": {
        const yr = monthRange.year + 543;
        if (monthRange.from === monthRange.to) return `เดือน${thaiMonthsFull[monthRange.from]} ${yr}`;
        return `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
      }
      case "yearly": {
        if (yearRange.from === yearRange.to) return `ปี ${yearRange.from + 543}`;
        const a = Math.min(yearRange.from, yearRange.to);
        const b = Math.max(yearRange.from, yearRange.to);
        return `ปี ${a + 543} – ${b + 543}`;
      }
      case "custom": return rangeLabel;
    }
  })();

  const handleMonthClick = (m: number) => {
    if (monthClickPhase === 0) { setMonthRange((cur) => ({ ...cur, from: m, to: m })); setMonthClickPhase(1); }
    else { setMonthRange((cur) => ({ ...cur, from: Math.min(cur.from, m), to: Math.max(cur.from, m) })); setMonthClickPhase(0); setDatasetCalOpen(false); }
  };
  const handleYearClick = (y: number) => {
    if (yearClickPhase === 0) { setYearRange({ from: y, to: y }); setYearClickPhase(1); }
    else { setYearRange((cur) => ({ from: Math.min(cur.from, y), to: Math.max(cur.from, y) })); setYearClickPhase(0); setDatasetCalOpen(false); }
  };

  const shade = (hex: string, percent: number) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, Math.min(255, (n >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
    const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
  };
  const Bar3D = (props: any) => {
    const { x, y, width, height, fill } = props;
    if (!height || height <= 0 || !width) return null;
    const depth = Math.min(Math.max(width * 0.28, 5), 9);
    return (<g>
      <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={shade(fill, -18)} />
      <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={shade(fill, 12)} />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>);
  };

  const data = buildReportData({ period, dailyRange, selectedDate, monthRange, yearRange, today });

  const PIE_COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#6366f1", "#818cf8", "#f59e0b"];

  const kpi = (() => {
    const sumKey = (k: string) => data.reduce((s, d) => s + ((d as any)[k] || 0), 0);
    const visits = sumKey("visits");
    const orders = sumKey("orders");
    const conv = visits > 0 ? ((orders / visits) * 100) : 0;
    const days = Math.max(1, data.length);
    const avgVisits = Math.round(visits / days);
    const avgOrders = Math.round(orders / days);
    const aov = orders > 0 ? Math.round((orders * 250) / orders) : 0; // mock AOV
    let scope = "วันนี้";
    if (period === "daily") {
      const from = dailyRange?.from ?? today; const to = dailyRange?.to ?? today;
      const isRange = !!(from && to && to.getTime() !== from.getTime());
      if (isRange) scope = `${fmtDate(from)} – ${fmtDate(to)}`;
      else if (from.toDateString() === today.toDateString()) scope = "วันนี้";
      else scope = `วันที่ ${from.getDate()} ${thaiMonthsFull[from.getMonth()]} ${from.getFullYear() + 543}`;
    } else if (period === "weekly") scope = `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
    else if (period === "monthly") {
      const yr = monthRange.year + 543;
      scope = monthRange.from === monthRange.to ? `เดือน${thaiMonthsFull[monthRange.from]} ${yr}` : `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
    } else if (period === "yearly") {
      const a = Math.min(yearRange.from, yearRange.to) + 543; const b = Math.max(yearRange.from, yearRange.to) + 543;
      scope = a === b ? `ปี ${a}` : `ปี ${a} – ${b}`;
    }
    return { scope, visits, orders, conv, avgVisits, avgOrders, aov };
  })();

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานข้อมูลตลาด</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Popover open={datasetCalOpen} onOpenChange={setDatasetCalOpen}>
            <PopoverTrigger asChild>
              <button
                className={`${font} text-[13px] inline-flex items-center gap-2 h-[40px] px-4 rounded-full cursor-pointer bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(49,151,84,0.18)] hover:text-[#319754] transition-shadow group`}
                aria-label="เปลี่ยนวันที่"
              >
                <CalendarIcon className="size-3.5 text-gray-500 group-hover:text-[#319754]" />
                <span style={{ fontWeight: 500 }}>{datasetLabel}</span>
                <ChevronDown className="size-3.5 text-gray-400 group-hover:text-[#319754]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {(period === "daily" || period === "custom") && (
                <>
                  <Calendar mode="range" numberOfMonths={2} selected={period === "daily" ? dailyRange : range}
                    onSelect={period === "daily" ? setDailyRange : setRange}
                    defaultMonth={(period === "daily" ? dailyRange?.from : range?.from) ?? today} />
                  <div className="flex items-center justify-between gap-2 p-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 1 วัน หรือ 2 ครั้งสำหรับช่วง</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { period === "daily" ? setDailyRange({ from: today, to: today }) : setRange(undefined); }}
                        className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                      <button onClick={() => setDatasetCalOpen(false)}
                        className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                    </div>
                  </div>
                </>
              )}
              {period === "weekly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronLeft className="size-4 text-gray-600" /></button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {selectedDate.getFullYear() + 543}</span>
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), 1))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronRight className="size-4 text-gray-600" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const isActive = selectedDate.getMonth() === i;
                      return (<button key={m} onClick={() => { setSelectedDate(new Date(selectedDate.getFullYear(), i, 1)); setDatasetCalOpen(false); }}
                        className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-[#319754] text-white" : "hover:bg-gray-100 text-gray-700"}`}
                        style={{ fontWeight: isActive ? 600 : 500 }}>{m}</button>);
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t">
                    <button onClick={() => { setSelectedDate(today); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "monthly" && (
                <div className="p-3 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year - 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronLeft className="size-4 text-gray-600" /></button>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {monthRange.year + 543}</span>
                    <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year + 1 }))}
                      className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer"><ChevronRight className="size-4 text-gray-600" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {thaiMonthsShort.map((m, i) => {
                      const inRange = i >= Math.min(monthRange.from, monthRange.to) && i <= Math.max(monthRange.from, monthRange.to);
                      const isEdge = i === monthRange.from || i === monthRange.to;
                      return (<button key={m} onClick={() => handleMonthClick(i)}
                        className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                        style={{ fontWeight: isEdge ? 600 : 500 }}>{m}</button>);
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setMonthRange({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() }); setMonthClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                  </div>
                </div>
              )}
              {period === "yearly" && (
                <div className="p-3 w-[200px]">
                  <p className={`${font} text-[11px] text-gray-400 mb-2`}>ย้อนหลังได้ถึง 5 ปี</p>
                  <div className="flex flex-col gap-1">
                    {availableYears.map((y) => {
                      const inRange = y >= Math.min(yearRange.from, yearRange.to) && y <= Math.max(yearRange.from, yearRange.to);
                      const isEdge = y === yearRange.from || y === yearRange.to;
                      return (<button key={y} onClick={() => handleYearClick(y)}
                        className={`${font} text-[13px] py-2 px-3 rounded-lg cursor-pointer transition-colors text-left ${isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"}`}
                        style={{ fontWeight: isEdge ? 600 : 500 }}>ปี {y + 543}</button>);
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                    <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                    <button onClick={() => { setYearRange({ from: today.getFullYear(), to: today.getFullYear() }); setYearClickPhase(0); setDatasetCalOpen(false); }}
                      className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ปีนี้</button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <div className="inline-flex items-center bg-white rounded-full p-1 overflow-x-auto max-w-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-mkt-period-bg-top" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#319754] hover:bg-[#287745] text-white h-[40px] px-5 rounded-full cursor-pointer shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)] transition-shadow`}>
                <Download className="size-4" />
                ส่งออก
                <ChevronDown className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
                <span>Excel (.xlsx)</span>
              </button>
              <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileText className="size-4 text-[#dc2626]" />
                <span>PDF (.pdf)</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: `ผู้เข้าชม ${kpi.scope}`, value: kpi.visits.toLocaleString() + " คน",
              subLabel: `เฉลี่ย ${kpi.avgVisits.toLocaleString()} คน/วัน`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              accent: "#7c3aed",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
              bgArt: (
                <motion.img
                  src={imgVisitors}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `ออเดอร์ ${kpi.scope}`, value: kpi.orders.toLocaleString() + " รายการ",
              subLabel: `เฉลี่ย ${kpi.avgOrders.toLocaleString()} รายการ/วัน`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              accent: "#f59e0b",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
              bgArt: (
                <motion.img
                  src={imgBagInCart}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  aria-hidden
                />
              ),
            },
            {
              label: `อัตราคอนเวิร์ต ${kpi.scope}`, value: kpi.conv.toFixed(2) + "%",
              subLabel: `${kpi.orders.toLocaleString()} จาก ${kpi.visits.toLocaleString()} ครั้ง`,
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
              accent: "#10b981",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
              bgArt: (
                <motion.img
                  src={imgConvert}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  aria-hidden
                />
              ),
            },
            {
              label: "คูปองที่ใช้", value: "32 ครั้ง",
              subLabel: "8 คูปองล่าสุด",
              subIcon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 010-4h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4z"/></svg>,
              accent: "#ec4899",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 010-4h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4z"/></svg>,
              bgArt: (
                <motion.img
                  src={imgCoupon}
                  alt=""
                  className="absolute -bottom-6 -right-2 size-[110px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  aria-hidden
                />
              ),
            },
          ].map((s: any) => (
            <div key={s.label} className="group rounded-2xl p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden"
              style={{ backgroundColor: `${s.accent}0d` }}>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                  <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>{s.icon}</div>
                </div>
                <p className={`${font} text-[26px] mt-3 tracking-tight tabular-nums`} style={{ fontWeight: 700, color: s.accent }}><AnimatedValue value={s.value} /></p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md`}
                    style={{ backgroundColor: `${s.accent}15`, color: s.accent, fontWeight: 600 }}>
                    {s.subIcon}{s.subLabel}
                  </span>
                </div>
              </div>
              {s.bgArt}
            </div>
          ))}
        </div>

        <h3 className={`${font} text-[18px] mb-5`} style={{ fontWeight: 600 }}>การเข้าชม & คอนเวิร์ต</h3>

        <ResponsiveContainer width="100%" height={340}>
          {chartType === "line" ? (
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <filter id="mktGlowPurple" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="mktGlowOrange" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.8" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (<div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                    <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                    <div className="flex flex-col gap-1.5">{payload.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} /><span className="text-gray-600">{p.name}</span></span>
                        <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>{p.value.toLocaleString()}</span>
                      </div>
                    ))}</div>
                  </div>);
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">{payload?.map((entry: any, i: number) => (
                    <div key={i} className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]`}
                      style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                      <span className="block rounded-full" style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }} />
                      <span>{entry.value}</span>
                    </div>
                  ))}</div>
                )}
              />
              <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#7c3aed" strokeWidth={3} name="ผู้เข้าชม"
                style={{ filter: "url(#mktGlowPurple)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#7c3aed", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#7c3aed", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(124,58,237,0.35))" } }}
                animationDuration={800}
              />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={3} name="คอนเวิร์ต (ออเดอร์)"
                style={{ filter: "url(#mktGlowOrange)" }}
                dot={{ r: 4, fill: "#fff", stroke: "#f59e0b", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#f59e0b", stroke: "#fff", strokeWidth: 3, style: { filter: "drop-shadow(0 0 4px rgba(245,158,11,0.35))" } }}
                animationDuration={800}
              />
            </ComposedChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }} barCategoryGap="22%" barGap={6}>
              <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={16} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(148,163,184,0.08)" }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (<div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[180px]`}>
                    <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
                    <div className="flex flex-col gap-1.5">{payload.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} /><span className="text-gray-600">{p.name}</span></span>
                        <span className="tabular-nums" style={{ fontWeight: 600, color: p.color }}>{p.value.toLocaleString()}</span>
                      </div>
                    ))}</div>
                  </div>);
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }}
                content={({ payload }: any) => (
                  <div className="flex items-center justify-center gap-3 flex-wrap">{payload?.map((entry: any, i: number) => (
                    <div key={i} className={`${font} inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px]`}
                      style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                      <span className="block rounded-full" style={{ width: 10, height: 10, backgroundColor: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }} />
                      <span>{entry.value}</span>
                    </div>
                  ))}</div>
                )}
              />
              <Bar yAxisId="left" dataKey="visits" name="ผู้เข้าชม" fill="#7c3aed" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
              <Bar yAxisId="right" dataKey="orders" name="คอนเวิร์ต (ออเดอร์)" fill="#f59e0b" maxBarSize={36} animationDuration={700} shape={<Bar3D />} />
            </BarChart>
          ) : (
            (() => {
              const pieData = data.filter((d) => (d as any).visits > 0);
              const pieTotal = pieData.reduce((s, d) => s + ((d as any).visits || 0), 0);
              return (<PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={72} outerRadius={120} paddingAngle={2}
                  dataKey="visits" nameKey="label" labelLine={false}
                  label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
                    if (percent < 0.06) return null;
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (<text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>{(percent * 100).toFixed(0)}%</text>);
                  }}
                  isAnimationActive animationDuration={700}
                >
                  {pieData.map((d, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={3} />))}
                </Pie>
                <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fill: "#9ca3af" }}>ผู้เข้าชมรวม</text>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 20, fill: "#1a1a1a", fontWeight: 700 }}>{pieTotal.toLocaleString()} คน</text>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0];
                    const pct = pieTotal > 0 ? ((p.value / pieTotal) * 100).toFixed(1) : "0";
                    return (<div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[160px]`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.payload.fill || PIE_COLORS[0] }} />
                        <span className="text-[12px] text-gray-600" style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[16px] tabular-nums" style={{ fontWeight: 700, color: p.payload.fill || PIE_COLORS[0] }}>{p.value.toLocaleString()} คน</span>
                        <span className="text-[11px] text-gray-400 tabular-nums">{pct}%</span>
                      </div>
                    </div>);
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 20 }}
                  content={({ payload }: any) => (
                    <div className="flex items-center justify-center gap-2 flex-wrap max-w-full px-4">{payload?.map((entry: any, i: number) => (
                      <div key={i} className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]`}
                        style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                        <span className="block rounded-full" style={{ width: 8, height: 8, backgroundColor: entry.color, boxShadow: `0 0 0 2.5px ${entry.color}25` }} />
                        <span>{entry.value}</span>
                      </div>
                    ))}</div>
                  )}
                />
              </PieChart>);
            })()
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-mkt-chart-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      {(() => {
        const baseChannels = [
          { name: "Google Search", type: "Organic", visits: 1240, orders: 52, revenue: 24800, cost: 0, initial: "G", bg: "#fff", fg: "#4285f4" },
          { name: "TikTok", type: "Social", visits: 1450, orders: 45, revenue: 19800, cost: 2200, initial: "T", bg: "#0f0f0f", fg: "#fff" },
          { name: "Facebook", type: "Social", visits: 980, orders: 38, revenue: 18200, cost: 1500, initial: "f", bg: "#1877f2", fg: "#fff" },
          { name: "Google Ads", type: "Paid", visits: 890, orders: 31, revenue: 16500, cost: 3200, initial: "Ad", bg: "#fef3c7", fg: "#a16207" },
          { name: "Instagram", type: "Social", visits: 720, orders: 28, revenue: 14600, cost: 1200, initial: "I", bg: "#fce7f3", fg: "#be185d" },
          { name: "Line OA", type: "Direct", visits: 540, orders: 22, revenue: 12300, cost: 800, initial: "L", bg: "#dcfce7", fg: "#15803d" },
          { name: "Email Marketing", type: "Direct", visits: 320, orders: 18, revenue: 8400, cost: 200, initial: "@", bg: "#fee2e2", fg: "#b91c1c" },
          { name: "Direct (URL)", type: "Direct", visits: 280, orders: 12, revenue: 6800, cost: 0, initial: "U", bg: "#f3f4f6", fg: "#525252" },
          { name: "Affiliate", type: "Partner", visits: 210, orders: 9, revenue: 5400, cost: 540, initial: "Af", bg: "#e0e7ff", fg: "#4338ca" },
          { name: "YouTube", type: "Social", visits: 180, orders: 6, revenue: 3200, cost: 600, initial: "Y", bg: "#fee2e2", fg: "#b91c1c" },
        ];

        // Period + date selection filtering — channels rotate + scale by selection
        const periodHash = (() => {
          let key = period.length * 13;
          if (period === "daily") {
            const d = dailyRange?.from ?? today;
            key += d.getDate() * 7 + d.getMonth() * 31 + (d.getFullYear() % 100) * 3;
            const to = dailyRange?.to ?? d;
            if (to.getTime() !== d.getTime()) key += to.getDate() * 11;
          } else if (period === "weekly") {
            key += selectedDate.getMonth() * 19 + (selectedDate.getFullYear() % 100) * 5;
          } else if (period === "monthly") {
            key += monthRange.from * 11 + monthRange.to * 7 + (monthRange.year % 100) * 3;
          } else if (period === "yearly") {
            key += (yearRange.from % 100) * 23 + (yearRange.to % 100) * 17;
          }
          return key;
        })();
        const periodScale = Math.max(0.35, Math.min(20, data.length * 0.4));
        let working = baseChannels.map((c, i) => {
          const drop = (i + periodHash) % 5 === 0 && period === "daily" && (!dailyRange?.to || dailyRange.to.getTime() === dailyRange.from!.getTime());
          if (drop) return { ...c, visits: 0, orders: 0, revenue: 0, cost: 0 };
          return {
            ...c,
            visits: Math.max(1, Math.round(c.visits * periodScale)),
            orders: Math.max(1, Math.round(c.orders * periodScale)),
            revenue: Math.round(c.revenue * periodScale),
            cost: Math.round(c.cost * periodScale),
          };
        }).filter((c) => c.visits > 0);

        // Narrow by chart focus
        if (focusedLabel) {
          const focusRow = data.find((d) => d.label === focusedLabel);
          const focusVisits = focusRow?.visits ?? 0;
          if (focusVisits === 0) working = [];
          else {
            const focusHash = Array.from(focusedLabel).reduce((s, ch) => s + ch.charCodeAt(0), 0);
            const rotateBy = focusHash % Math.max(working.length, 1);
            const rotated = [...working.slice(rotateBy), ...working.slice(0, rotateBy)];
            working = rotated.map((c, i) => ({
              ...c,
              visits: Math.max(1, Math.round(c.visits * (0.4 + (((focusHash + i) % 60) / 100)))),
              orders: Math.max(1, Math.round(c.orders * (0.4 + (((focusHash + i * 3) % 60) / 100)))),
              revenue: Math.max(1, Math.round(c.revenue * (0.4 + (((focusHash + i * 5) % 60) / 100)))),
              cost: Math.max(0, Math.round(c.cost * (0.4 + (((focusHash + i * 7) % 60) / 100)))),
            }));
          }
        }

        const sorted = [...working].sort((a, b) => {
          switch (chSort) {
            case "revenue_desc": return b.revenue - a.revenue;
            case "visits_desc": return b.visits - a.visits;
            case "conv_desc": {
              const ac = a.visits > 0 ? a.orders / a.visits : 0;
              const bc = b.visits > 0 ? b.orders / b.visits : 0;
              return bc - ac;
            }
            case "roas_desc": {
              const ar = a.cost > 0 ? a.revenue / a.cost : Infinity;
              const br = b.cost > 0 ? b.revenue / b.cost : Infinity;
              if (ar === Infinity && br === Infinity) return b.revenue - a.revenue;
              return br - ar;
            }
          }
        });

        const totalPages = Math.max(1, Math.ceil(sorted.length / chPerPage));
        const safePage = Math.min(chPage, totalPages);
        const pageStart = (safePage - 1) * chPerPage;
        const pageItems = sorted.slice(pageStart, pageStart + chPerPage);

        const pageVisits = pageItems.reduce((s, c) => s + c.visits, 0);
        const pageOrdersTotal = pageItems.reduce((s, c) => s + c.orders, 0);
        const pageRevenue = pageItems.reduce((s, c) => s + c.revenue, 0);
        const pageCost = pageItems.reduce((s, c) => s + c.cost, 0);
        const pageConv = pageVisits > 0 ? (pageOrdersTotal / pageVisits) * 100 : 0;
        const pageRoas = pageCost > 0 ? pageRevenue / pageCost : 0;

        const typeColor = (t: string) => {
          switch (t) {
            case "Organic": return { bg: "#dcfce7", fg: "#15803d" };
            case "Social": return { bg: "#fce7f3", fg: "#be185d" };
            case "Paid": return { bg: "#fef3c7", fg: "#a16207" };
            case "Direct": return { bg: "#dbeafe", fg: "#1e40af" };
            case "Partner": return { bg: "#e0e7ff", fg: "#4338ca" };
            default: return { bg: "#f3f4f6", fg: "#525252" };
          }
        };

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>ประสิทธิภาพช่องทางการตลาด</h3>
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-1 inline-flex items-center gap-1.5`}>
                  <CalendarIcon className="size-3.5" />
                  <span>ข้อมูลของ <span className="text-gray-600" style={{ fontWeight: 500 }}>{datasetLabel}</span> · แสดง {sorted.length === 0 ? 0 : pageStart + 1}–{pageStart + pageItems.length} จาก {sorted.length} ช่องทาง</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={chSort} onChange={(e) => setChSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-4 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="revenue_desc">เรียง: รายได้สูงสุด</option>
                    <option value="visits_desc">เรียง: ผู้เข้าชมมากสุด</option>
                    <option value="conv_desc">เรียง: Conv. Rate สูงสุด</option>
                    <option value="roas_desc">เรียง: ROAS สูงสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "12%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>ช่องทาง</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ผู้เข้าชม</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ออเดอร์</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>Conv. Rate</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>รายได้ (฿)</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c, i) => {
                    const conv = c.visits > 0 ? (c.orders / c.visits) * 100 : 0;
                    const roas = c.cost > 0 ? c.revenue / c.cost : null;
                    const tc = typeColor(c.type);
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-9 rounded-full flex items-center justify-center shrink-0 border border-gray-100"
                              style={{ backgroundColor: c.bg, color: c.fg }}>
                              <span className={`${font} text-[12px]`} style={{ fontWeight: 700 }}>{c.initial}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={c.name}>{c.name}</p>
                              <span className={`${font} inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full mt-0.5`}
                                style={{ backgroundColor: tc.bg, color: tc.fg, fontWeight: 600 }}>{c.type}</span>
                            </div>
                          </div>
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>{c.visits.toLocaleString()}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#f59e0b]`} style={{ fontWeight: 600 }}>{c.orders}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 600, color: conv >= 4 ? "#15803d" : conv >= 2 ? "#ca8a04" : "#9ca3af" }}>
                          {conv.toFixed(1)}%
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>฿{c.revenue.toLocaleString()}</td>
                        <td className={`py-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700, color: roas === null ? "#9ca3af" : roas >= 3 ? "#15803d" : roas >= 1 ? "#ca8a04" : "#dc2626" }}>
                          {roas === null ? "—" : `${roas.toFixed(1)}x`}
                        </td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={6} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบข้อมูลช่องทาง</td></tr>
                  )}
                </tbody>
                {pageItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100">
                      <td className={`pt-3 pr-3 ${font} text-[12px] truncate`} style={{ fontWeight: 600 }}>รวม ({pageItems.length} ช่องทางที่แสดง)</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700 }}>{pageVisits.toLocaleString()}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-[#f59e0b]`} style={{ fontWeight: 700 }}>{pageOrdersTotal}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-gray-700`} style={{ fontWeight: 700 }}>{pageConv.toFixed(1)}%</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[14px] text-[#7c3aed]`} style={{ fontWeight: 700 }}>฿{pageRevenue.toLocaleString()}</td>
                      <td className={`pt-3 text-right ${font} text-[13px] text-[#15803d]`} style={{ fontWeight: 700 }}>{pageCost > 0 ? `${pageRoas.toFixed(1)}x` : "—"}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={chPerPage} onChange={(e) => { setChPerPage(Number(e.target.value)); setChPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>ช่องทางต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setChPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setChPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setChPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ========== MAIN ========== */
export function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OwnerTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState("CPL-001");
  const [ordersInitialFilter, setOrdersInitialFilter] = useState<OrderFilterTab>("all");
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const mainRef = React.useRef<HTMLElement>(null);

  // Reset scroll to top when switching tabs (also handles sidebar nav, openOrderDetail, etc)
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab, selectedOrderId]);

  const handleSelect = (tab: OwnerTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  // Map subpages to their parent menu so the sidebar stays highlighted on detail/sub-views
  const subpageToParent: Partial<Record<OwnerTab, OwnerTab>> = {
    order_detail:     "orders",
    complaint_detail: "complaints",
    add_product:      "products",
    flash_event:      "flash_sale",
    bank_settings:    "finance",
  };
  const sidebarActive = subpageToParent[activeTab] ?? activeTab;

  const openOrders = (filter: OrderFilterTab = "all") => {
    setOrdersInitialFilter(filter);
    setActiveTab("orders");
  };

  const updateOrder = (id: string, patch: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const openOrderDetail = (id: string) => {
    setSelectedOrderId(id);
    setActiveTab("order_detail");
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      <div className={`${sidebarCollapsed ? "hidden md:block" : "fixed inset-y-0 left-0 md:static md:inset-auto z-30 md:z-auto"} h-full md:overflow-y-auto shrink-0 transition-all duration-300`}>
        <Sidebar active={sidebarActive} onSelect={handleSelect} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Content — only this area scrolls, sidebar stays fixed */}
      <main ref={mainRef} className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0 min-h-0">
        {activeTab === "overview" && <OverviewTab onViewOrders={openOrders} />}
        {activeTab === "orders" && <OrdersTab initialFilter={ordersInitialFilter} orders={orders} onUpdate={updateOrder} onOpenDetail={openOrderDetail} />}
        {activeTab === "order_detail" && <OrderDetailTab order={orders.find((o) => o.id === selectedOrderId) || null} onBack={() => setActiveTab("orders")} onUpdate={updateOrder} />}
        {activeTab === "products" && <ProductsTab onAddProduct={() => setActiveTab("add_product")} />}
        {activeTab === "flash_sale" && <FlashSaleTab onViewEvent={() => setActiveTab("flash_event")} />}
        {activeTab === "flash_event" && <FlashEventDetail onBack={() => setActiveTab("flash_sale")} />}
        {activeTab === "add_product" && <AddProductTab onBack={() => setActiveTab("products")} />}
        {activeTab === "promotions" && (
          <div>
            <h2 className={`${font} text-[22px] mb-4`} style={{ fontWeight: 600 }}>โปรโมชั่น</h2>
            <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีโปรโมชั่นที่ใช้งานอยู่</p>
          </div>
        )}
        {activeTab === "coupons" && (
          <div>
            <h2 className={`${font} text-[22px] mb-4`} style={{ fontWeight: 600 }}>คูปอง</h2>
            <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีคูปองที่ใช้งานอยู่</p>
          </div>
        )}
        {activeTab === "complaints" && <ComplaintsTab onViewDetail={(id: string) => { setSelectedComplaintId(id); setActiveTab("complaint_detail"); }} />}
        {activeTab === "complaint_detail" && <ComplaintDetailTab complaintId={selectedComplaintId} onBack={() => setActiveTab("complaints")} />}
        {activeTab === "finance" && <FinanceTab onBankSettings={() => setActiveTab("bank_settings")} />}
        {activeTab === "bank_settings" && <BankSettingsTab onBack={() => setActiveTab("finance")} />}
        {activeTab === "report_sales" && <ReportSalesTab />}
        {activeTab === "report_customers" && <ReportCustomersTab />}
        {activeTab === "report_products" && <ReportProductsTab />}
        {activeTab === "report_market" && <ReportMarketTab />}


      </main>
    </div>
  );
}