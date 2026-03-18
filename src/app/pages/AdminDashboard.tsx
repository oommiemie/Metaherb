import { useState } from "react";
import { useOrders } from "../store/OrderContext";
import { BarChart3, Users, ShoppingCart, Package, Settings, Image, TrendingUp, Shield, DollarSign, FileText, Megaphone, UserCog } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const salesData = [
  { month: "ม.ค.", sales: 42000, orders: 120 },
  { month: "ก.พ.", sales: 55000, orders: 150 },
  { month: "มี.ค.", sales: 38000, orders: 95 },
  { month: "เม.ย.", sales: 62000, orders: 180 },
  { month: "พ.ค.", sales: 71000, orders: 210 },
  { month: "มิ.ย.", sales: 48000, orders: 130 },
];

const categoryData = [
  { name: "เครื่องดื่ม", value: 35 },
  { name: "อาหาร", value: 25 },
  { name: "สมุนไพร", value: 20 },
  { name: "ครีม", value: 12 },
  { name: "อื่นๆ", value: 8 },
];

const COLORS = ["#319754", "#f7931d", "#ee4d2d", "#3b82f6", "#a855f7"];

const tabs = [
  { id: "overview", label: "ภาพรวม", icon: BarChart3 },
  { id: "sales", label: "Sales Report", icon: DollarSign },
  { id: "customers", label: "Customer Report", icon: Users },
  { id: "products", label: "Product Report", icon: Package },
  { id: "marketing", label: "Marketing Report", icon: Megaphone },
  { id: "banners", label: "จัดการ Banner", icon: Image },
  { id: "admins", label: "จัดการแอดมิน", icon: UserCog },
  { id: "settings", label: "ตั้งค่าเว็บ", icon: Settings },
];

const mockAdmins = [
  { id: 1, name: "admin01", email: "admin@test.com", role: "Super Admin", status: "active" },
  { id: 2, name: "admin02", email: "admin02@test.com", role: "Content Manager", status: "active" },
  { id: 3, name: "admin03", email: "admin03@test.com", role: "Order Manager", status: "inactive" },
];

const mockBanners = [
  { id: 1, title: "Nature's Remedies", position: "Hero Banner", status: "active" },
  { id: 2, title: "ลดสูงสุด 70%", position: "Right Top", status: "active" },
  { id: 3, title: "สินค้ามาใหม่", position: "Right Bottom", status: "draft" },
];

export function AdminDashboard() {
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "รายได้รวม", value: "฿316,000", change: "+18%", icon: DollarSign, color: "bg-green-50 text-green-600" },
    { label: "คำสั่งซื้อทั้งหมด", value: "885", change: "+24", icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
    { label: "ลูกค้าทั้งหมด", value: "1,245", change: "+56", icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "ร้านค้าทั้งหมด", value: "32", change: "+3", icon: Package, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="size-6 text-[#319754]" />
        <div>
          <h1 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>แผงควบคุมผู้ดูแลระบบ</h1>
          <p className={`${font} text-[13px] text-gray-500`}>จัดการระบบ E-Commerce ทั้งหมด</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto pb-0">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] ${font} cursor-pointer whitespace-nowrap relative transition-colors ${
              activeTab === tab.id ? "text-[#319754]" : "text-gray-500"
            }`}>
            <tab.icon className="size-3.5" /> {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#319754]" />}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className={`size-10 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="size-5" /></div>
                  {s.change && <span className={`text-[11px] ${font} text-green-500`}>{s.change}</span>}
                </div>
                <p className={`${font} text-[22px] mt-3`} style={{ fontWeight: 700 }}>{s.value}</p>
                <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className={`${font} text-[14px] mb-4`} style={{ fontWeight: 600 }}>ยอดขายรายเดือน</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#319754" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className={`${font} text-[14px] mb-4`} style={{ fontWeight: 600 }}>สัดส่วนสินค้าขายดี</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Sales Report */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className={`${font} text-[16px] mb-4`} style={{ fontWeight: 600 }}>Sales Report</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#319754" name="ยอดขาย (฿)" />
                <Line type="monotone" dataKey="orders" stroke="#f7931d" name="จำนวนคำสั่งซื้อ" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{ label: "รายได้วันนี้", value: "฿12,450" }, { label: "รายได้เดือนนี้", value: "฿316,000" }, { label: "รายได้ปีนี้", value: "฿2,840,000" }].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
                <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                <p className={`${font} text-[24px] text-[#319754] mt-1`} style={{ fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer/Product/Marketing Reports */}
      {(activeTab === "customers" || activeTab === "products" || activeTab === "marketing") && (
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className={`${font} text-[16px] mb-4`} style={{ fontWeight: 600 }}>
            {activeTab === "customers" ? "Customer Report" : activeTab === "products" ? "Product Report" : "Marketing Report"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={activeTab === "customers" ? "orders" : "sales"} fill={activeTab === "marketing" ? "#f7931d" : "#3b82f6"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: activeTab === "customers" ? "ลูกค้าใหม่วันนี้" : activeTab === "products" ? "สินค้าขายดี" : "Conversion Rate", value: activeTab === "customers" ? "12" : activeTab === "products" ? "ชาออร์แกนิก" : "3.2%" },
              { label: activeTab === "customers" ? "ลูกค้าที่กลับมา" : activeTab === "products" ? "สต็อกต่ำ" : "Click Rate", value: activeTab === "customers" ? "45%" : activeTab === "products" ? "3 รายการ" : "12.5%" },
              { label: activeTab === "customers" ? "มูลค่าเฉลี่ย" : activeTab === "products" ? "หมวดหมู่ยอดนิยม" : "Revenue from Ads", value: activeTab === "customers" ? "฿450" : activeTab === "products" ? "เครื่องดื่ม" : "฿25,000" },
              { label: activeTab === "customers" ? "อัตราซื้อซ้ำ" : activeTab === "products" ? "รีวิวเฉลี่ย" : "Campaign Active", value: activeTab === "customers" ? "28%" : activeTab === "products" ? "4.6 ★" : "5" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className={`${font} text-[11px] text-gray-500`}>{s.label}</p>
                <p className={`${font} text-[16px] mt-1`} style={{ fontWeight: 600 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banner Management */}
      {activeTab === "banners" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>จัดการ Banner</h3>
            <button className={`bg-[#319754] text-white px-4 py-2 rounded-lg text-[13px] ${font} cursor-pointer`}>+ เพิ่ม Banner</button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className={`${font} text-[12px] text-gray-500 border-b bg-gray-50`}>
                  <th className="text-left py-3 px-4">ชื่อ Banner</th>
                  <th className="text-left py-3 px-4">ตำแหน่ง</th>
                  <th className="text-left py-3 px-4">สถานะ</th>
                  <th className="text-right py-3 px-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {mockBanners.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50">
                    <td className={`${font} text-[13px] py-3 px-4`}>{b.title}</td>
                    <td className={`${font} text-[13px] py-3 px-4 text-gray-500`}>{b.position}</td>
                    <td className={`${font} text-[11px] py-3 px-4`}>
                      <span className={`px-2 py-0.5 rounded ${b.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>{b.status === "active" ? "เปิดใช้งาน" : "ร่าง"}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className={`text-[12px] text-[#319754] ${font} cursor-pointer hover:underline mr-3`}>แก้ไข</button>
                      <button className={`text-[12px] text-red-400 ${font} cursor-pointer hover:underline`}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Management */}
      {activeTab === "admins" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>กำหนดหน้าที่แอดมิน</h3>
            <button className={`bg-[#319754] text-white px-4 py-2 rounded-lg text-[13px] ${font} cursor-pointer`}>+ เพิ่มแอดมิน</button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className={`${font} text-[12px] text-gray-500 border-b bg-gray-50`}>
                  <th className="text-left py-3 px-4">ชื่อ</th>
                  <th className="text-left py-3 px-4">อีเมล</th>
                  <th className="text-left py-3 px-4">หน้าที่</th>
                  <th className="text-left py-3 px-4">สถานะ</th>
                  <th className="text-right py-3 px-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {mockAdmins.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50">
                    <td className={`${font} text-[13px] py-3 px-4`}>{a.name}</td>
                    <td className={`${font} text-[13px] py-3 px-4 text-gray-500`}>{a.email}</td>
                    <td className={`${font} text-[13px] py-3 px-4`}>{a.role}</td>
                    <td className={`${font} text-[11px] py-3 px-4`}>
                      <span className={`px-2 py-0.5 rounded ${a.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>{a.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className={`text-[12px] text-[#319754] ${font} cursor-pointer hover:underline mr-3`}>แก้ไข</button>
                      <button className={`text-[12px] text-red-400 ${font} cursor-pointer hover:underline`}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-xl p-6 border border-gray-100 max-w-[600px]">
          <h3 className={`${font} text-[16px] mb-4`} style={{ fontWeight: 600 }}>ตั้งค่าหน้าเว็บ</h3>
          <div className="space-y-4">
            <div>
              <label className={`${font} text-[13px] text-gray-600`}>ชื่อเว็บไซต์</label>
              <input defaultValue="MetaHerb - สมุนไพรออร์แกนิค" className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] ${font} outline-none mt-1`} />
            </div>
            <div>
              <label className={`${font} text-[13px] text-gray-600`}>คำอธิบายเว็บไซต์ (SEO)</label>
              <textarea defaultValue="ร้านขายสมุนไพรออร์แกนิคคุณภาพ ส่งตรงจากธรรมชาติ" className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] ${font} outline-none mt-1 h-20 resize-none`} />
            </div>
            <div>
              <label className={`${font} text-[13px] text-gray-600`}>อีเมลติดต่อ</label>
              <input defaultValue="Metaherb@gmail.com" className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] ${font} outline-none mt-1`} />
            </div>
            <div>
              <label className={`${font} text-[13px] text-gray-600`}>เบอร์โทรศัพท์</label>
              <input defaultValue="061-421-3111" className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] ${font} outline-none mt-1`} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className={`${font} text-[13px]`}>เปิดให้ลงทะเบียนร้านค้าใหม่</span>
              <div className="w-10 h-5 bg-[#319754] rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 size-4 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className={`${font} text-[13px]`}>โหมดบำรุงรักษา</span>
              <div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer"><div className="absolute left-0.5 top-0.5 size-4 bg-white rounded-full" /></div>
            </div>
            <button className={`bg-[#319754] text-white px-6 py-2.5 rounded-lg text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>บันทึกการตั้งค่า</button>
          </div>
        </div>
      )}
    </div>
  );
}