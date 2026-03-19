import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Phone, Mail, MapPin, ChevronDown, Leaf, Clock, ShieldCheck, Facebook, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imgHerb from "figma:asset/f24d55b139f649587f70c678ab822ead66587d45.png";
import imgTea from "figma:asset/bbbf823d211a68f6164b9a16d14453e6ebfaa746.png";
import imgProduct1 from "figma:asset/f1ceefb74e0b735c05a881e21bdc83ccd797fa20.png";
import imgProduct2 from "figma:asset/7f17e783f1ef7618e9192f2aafe3f9c41a98a922.png";
import imgProduct3 from "figma:asset/c62bf17009bd747369419c446709fd9ba2080b91.png";
import imgMission from "figma:asset/1d6e138ce0a1c2930909c26a7eede22840f0c150.png";
import imgLogo from "figma:asset/c494dc0dab30c1bf59f2f6e2c114db61b1755370.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontHeading = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function AboutPage() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    toast.success("ส่งข้อความเรียบร้อยแล้ว!", { description: "ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง" });
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="w-full">
      {/* ========== HERO SECTION ========== */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[770px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://res.cloudinary.com/dujq74ght/video/upload/ท่องโลกสมุนไพร_EP._6_ตะลุยต่างแดน_ตอน__ชาซีลอน_ศรีลังกา__1_1_xvtgqw.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,31,13,0.85)] via-[rgba(13,31,13,0.3)] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:pl-[69px] flex flex-col gap-6 justify-center h-full pt-[111px] lg:pt-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] rounded-full px-4 py-2 w-fit">
            <Leaf className="size-3.5 text-[#a8d5a0]" />
            <span className="text-[#a8d5a0] text-[12px] tracking-wider uppercase">ยินดีต้อนรับ</span>
          </div>

          {/* Heading */}
          <h1 className={`${fontHeading} text-[40px] sm:text-[56px] lg:text-[80px] lg:leading-[88px] leading-[1.1]`}>
            <span className="block text-white">จากพืชพรรณ</span>
            <span className="block text-[#a8d5a0]">สู่ผลิตภัณฑ์</span>
            <span className="block text-white">เมต้าเฮิร์บ</span>
          </h1>

          {/* Subtitle */}
          <p className={`${font} text-[16px] sm:text-[20px] text-white/80 max-w-[500px]`}>
            แม้เป็นสมุนไพรที่หายากแต่เมต้าเฮิร์บ<br />
            สามารถคัดสรรและจัดหาให้คุณได้
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={() => navigate("/products")}
              className={`bg-[#7db870] hover:bg-[#6da760] text-white px-8 sm:px-16 py-3 sm:py-6 rounded-full text-[16px] sm:text-[20px] ${font} cursor-pointer flex items-center gap-4 transition-colors`}>
              เลือกซื้อได้ที่ <ArrowRight className="size-5 sm:size-6" />
            </button>
            <button onClick={() => document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" })}
              className={`bg-white/10 hover:bg-white/20 text-white px-6 sm:px-7 py-3 sm:py-6 rounded-full text-[14px] sm:text-[16px] ${font} cursor-pointer transition-colors`}>
              พันธกิจของเรา
            </button>
          </div>
        </div>

        {/* Scroll indicator wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1439 56" fill="none" className="w-full block">
            <path d="M0 55.125C491.333 -18.375 971 -18.375 1439 55.125H0Z" fill="#f5f0e8" />
          </svg>
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2">
            <span className={`text-[#319754] text-[12px] tracking-wider uppercase`}>เลื่อนเพื่อดูเนื้อหา</span>
          </div>
        </div>
      </section>

      {/* ========== STORY SECTION ========== */}
      <section className="bg-[#f5f0e8] py-16 sm:py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[68px]">
          {/* Section heading */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] rounded-full px-4 py-2 mb-4">
              <Leaf className="size-3.5 text-[#319754]" />
              <span className="text-[#319754] text-[12px] tracking-wider uppercase">เรื่องราวของเรา</span>
            </div>
            <h2 className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[48px] text-[#4e4e4e]`}>
              ผลผลิตจากเกษตรกร
            </h2>
            <h2 className={`text-[28px] sm:text-[36px] lg:text-[48px] italic text-[#4e4e4e]`} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              สู่ทุกบ้านทั่วไทย
            </h2>
            <p className={`${font} text-[14px] sm:text-[16px] text-[#333] mt-4 max-w-[614px] mx-auto leading-8`}>
              เราเป็นผู้นำด้านสมุนไพรคุณภาพ เพื่อสุขภาพที่ยั่งยืนที่เมต้าเฮิร์บ
            </p>
          </div>

          {/* Story content */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-[73px] items-center">
            {/* Image */}
            <div className="w-full lg:w-[665px] shrink-0 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl h-[280px] sm:h-[350px] lg:h-[444px]">
                <ImageWithFallback src={imgHerb} alt="สมุนไพรไทย" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.4)] to-transparent rounded-3xl" />
              </div>
              {/* Small floating image */}
              <div className="absolute -bottom-6 right-4 sm:right-8 lg:right-[-20px] size-[120px] sm:size-[160px] lg:size-[192px] rounded-[40px] overflow-hidden border-4 border-[#f5f0e8] shadow-xl">
                <ImageWithFallback src={imgTea} alt="ชาสมุนไพร" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 space-y-6 mt-8 lg:mt-0">
              {[
                {
                  icon: Leaf,
                  title: "ต้นกำเนิดจากธรรมชาติแท้",
                  desc: "สมุนไพรทุกชนิดของเราได้รับการปลูกและดูแลโดยเกษตรกรท้องถิ่น บนพื้นที่กว่า 120 ไร่ที่ดอยแม่สลอง เชียงราย ภายใต้มาตรฐานเกษตรอินทรีย์ที่เคร่งครัด",
                },
                {
                  icon: Clock,
                  title: "ภูมิปัญญาดั้งเดิมสู่นวัตกรรมใหม่",
                  desc: "เราผสมผสานองค์ความรู้สมุนไพรไทยโบราณที่สืบทอดมากว่า 200 ปี เข้ากับเทคโนโลยีการผลิตสมัยใหม่ เพื่อให้ได้ผลิตภัณฑ์ที่มีประสิทธิภาพสูงสุดและปลอดภัย",
                },
                {
                  icon: ShieldCheck,
                  title: "การรับรองมาตรฐานระดับสากล",
                  desc: "ผลิตภัณฑ์ทุกชิ้นผ่านการตรวจสอบคุณภาพและได้รับการรับรองจาก อย. Thailand, Organic Thailand และ ISO 22000 ก่อนส่งถึงมือลูกค้า",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="size-12 bg-[#e7cfbc] rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="size-6 text-[#9D5400]" />
                  </div>
                  <div>
                    <h3 className={`${fontHeading} text-[17px] sm:text-[19px] text-[#333]`}>{item.title}</h3>
                    <p className={`${font} text-[14px] sm:text-[15px] text-[#4a6741] leading-7 mt-1`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUST / PRODUCTS SECTION ========== */}
      <section className="bg-[#1a2e1a] py-16 sm:py-20 lg:py-24 overflow-hidden relative">
        {/* Decorative circles */}
        <div className="absolute right-[-30px] lg:right-[140px] top-[-96px] size-[256px] rounded-full bg-[rgba(125,184,112,0.1)]" />
        <div className="absolute left-[-64px] bottom-[-40px] size-[192px] rounded-full bg-[rgba(125,184,112,0.1)]" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[68px]">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            {/* Product images - stacked/rotated with swiper */}
            <div className="w-full lg:w-[520px] shrink-0 relative h-[350px] sm:h-[450px] lg:h-[520px]">
              {/* Back rotated image (decorative) */}
              <div className="absolute left-[40px] sm:left-[60px] top-0 sm:top-[-20px] w-[260px] sm:w-[360px] lg:w-[512px] aspect-square rounded-[40px] overflow-hidden border border-white shadow-lg z-0" style={{ transform: "rotate(13deg)" }}>
                <ImageWithFallback src={imgProduct1} alt="ผลิตภัณฑ์" className="w-full h-full object-cover" />
              </div>
              {/* Middle rotated image (decorative) */}
              <div className="absolute left-[20px] sm:left-[30px] top-[10px] sm:top-[-10px] w-[270px] sm:w-[370px] lg:w-[512px] aspect-square rounded-[40px] overflow-hidden border border-white shadow-lg z-[1]" style={{ transform: "rotate(7deg)" }}>
                <ImageWithFallback src={imgProduct2} alt="ผลิตภัณฑ์" className="w-full h-full object-cover" />
              </div>
              {/* Front swipeable image */}
              <div className="absolute left-0 top-[20px] sm:top-[10px] w-[280px] sm:w-[380px] lg:w-[512px] aspect-square rounded-[40px] overflow-hidden border border-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] z-10">
                <Slider dots={true} infinite autoplay autoplaySpeed={4000} speed={600} arrows={false} fade
                  appendDots={(dots: React.ReactNode) => (
                    <div style={{ position: "absolute", bottom: "16px", width: "100%" }}>
                      <ul className="flex justify-center gap-2">{dots}</ul>
                    </div>
                  )}
                  customPaging={() => (
                    <div className="size-2.5 rounded-full bg-white/40 transition-all [.slick-active_&]:bg-white [.slick-active_&]:w-6 [.slick-active_&]:rounded-full" />
                  )}
                >
                  {[
                    { img: imgProduct3, title: "พิมเสนน้ำอโรมา ตราเมต้าเฮิร์บ", desc: "พิมเสนน้ำอโรม่า ตราเมต้าเฮิร์บ มีชิ้นส่วนสมุนไพร" },
                    { img: imgProduct1, title: "ชาสมุนไพรเชียงราย", desc: "ผสมจากสมุนไพร 7 ชนิด คัดสรรพิเศษ" },
                    { img: imgProduct2, title: "น้ำมันสมุนไพร ตราเมต้าเฮิร์บ", desc: "น้ำมันสมุนไพรสกัดจากธรรมชาติ 100%" },
                  ].map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-full aspect-square">
                        <ImageWithFallback src={item.img} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.8)] via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-6 right-6">
                          <p className="text-white/80 text-[13px]">ผลิตภัณฑ์เด่นของเรา</p>
                          <p className="text-white text-[18px] sm:text-[21px]" style={{ fontWeight: 700 }}>{item.title}</p>
                          <p className="text-[#a8d5a0] text-[13px]">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* Right side content */}
            <div className="flex-1 min-w-0">
              <h2 className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[40px] leading-tight`}>
                <span className="text-white block">ความไว้วางใจที่</span>
                <span className="text-[#7db870] block">สร้างมาจากมาตรฐาน</span>
              </h2>

              {/* Product cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  { tag: "ขายดีอันดับ 1", tagColor: "#ff8a65", title: "ชาสมุนไพร 7 ชนิด", desc: "ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน" },
                  { tag: "สินค้าใหม่", tagColor: "#7db870", title: "ชาสมุนไพร 7 ชนิด", desc: "ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน" },
                  { tag: "ยอดนิยม", tagColor: "#5b8dee", title: "ชาสมุนไพร 7 ชนิด", desc: "ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน" },
                ].map((card, i) => (
                  <div key={i} className={`bg-white/5 border border-white/10 rounded-2xl p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${i === 2 ? "sm:col-span-1" : ""}`}>
                    <span className="text-white text-[12px] px-3 py-1 rounded-full" style={{ backgroundColor: card.tagColor }}>{card.tag}</span>
                    <h4 className="text-white text-[16px] mt-2" style={{ fontWeight: 600 }}>{card.title}</h4>
                    <p className="text-white/70 text-[14px] mt-1">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mt-6">
                {["✓ อย. ไทย", "✓ Organic Thailand", "✓ ISO 22000", "✓ GMP"].map((cert) => (
                  <span key={cert} className="bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] text-[#a8d5a0] text-[13px] px-4 py-1.5 rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MISSION SECTION ========== */}
      <section id="mission" className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[68px]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Mission image */}
            <div className="w-full lg:w-[960px] shrink-0 relative rounded-3xl overflow-hidden h-[300px] sm:h-[400px] lg:h-[541px]">
              <ImageWithFallback src={imgMission} alt="สมุนไพรไทย" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.8)] via-[rgba(13,31,13,0.2)] to-transparent" />

              {/* Overlaid text */}
              <div className="absolute top-6 sm:top-8 left-6 sm:left-8">
                <p className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[48px] text-white uppercase`}>พันธกิจและวิสัยทัศน์</p>
                <p className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[48px] text-white/70`}>เราทำงานเพื่ออะไร ?</p>
              </div>

              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-auto max-w-[800px]">
                <h3 className={`${fontHeading} text-[24px] sm:text-[32px] lg:text-[40px] text-white leading-tight`}>
                  "เป็นผู้นำสมุนไพรไทยสู่ตลาดโลก"
                </h3>
                <p className={`${font} text-[16px] sm:text-[20px] lg:text-[24px] text-white/70 mt-3 leading-relaxed`}>
                  มุ่งมั่นที่จะเป็นผู้นำในการนำเสนอสมุนไพรไทยคุณภาพสู่ผู้บริโภค เพื่อสุขภาพที่ดีและยั่งยืน
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-row lg:flex-col gap-4 flex-wrap justify-center">
              {[
                { value: "3+", label: "ปีแห่งประสบการณ์" },
                { value: "120", label: "ไร่แปลงเกษตรอินทรีย์" },
                { value: "50+", label: "ผลิตภัณฑ์สมุนไพร" },
                { value: "2,400+", label: "ลูกค้าทั่วไทย" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#f5f0e8] border border-[#e0d5c5] rounded-2xl p-5 sm:p-6 flex-1 min-w-[140px] lg:min-w-[280px]">
                  <p className="text-[#333] text-[28px] sm:text-[32px]" style={{ fontWeight: 700 }}>{stat.value}</p>
                  <p className={`${font} text-[13px] sm:text-[14px] text-[#4a6741]`} style={{ fontWeight: 600 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section className="bg-[#f5f0e8] py-16 sm:py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[68px]">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className={`${fontHeading} text-[32px] sm:text-[40px] lg:text-[48px] text-[#1a2e1a]`}>พูดคุยกับเรา</h2>
            <h2 className={`${fontHeading} text-[32px] sm:text-[40px] lg:text-[48px] text-[#7db870]`}>ได้ทุกช่องทาง</h2>
            <p className={`${font} text-[14px] sm:text-[16px] text-[#4a6741] mt-4 max-w-[554px] mx-auto`}>
              เราพร้อมให้คำปรึกษาเรื่องสมุนไพรและผลิตภัณฑ์ทุกชนิด ติดต่อเราได้ผ่านช่องทางที่คุณสะดวก
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left - Contact info */}
            <div className="flex-1 space-y-6">
              <h3 className={`${fontHeading} text-[20px] sm:text-[22px] text-[#333]`}>ข้อมูลการติดต่อ</h3>

              {/* Contact cards */}
              <div className="space-y-4">
                {[
                  { icon: Phone, label: "โทรศัพท์", value: "098-765-4321", sub: "จันทร์-ศุกร์: 08.30 - 17.30" },
                  { icon: Mail, label: "อีเมล", value: "hello@siamherb.co.th", sub: "ตอบกลับภายใน 24 ชั่วโมง" },
                  { icon: MapPin, label: "ที่อยู่", value: "บ้านเลขที่ 459/153 หมู่บ้านนิวไฮบ์ สุขสวัสดิ์", sub: "แขวงราษฎรบูรณะ เขตราษฎร์บรณะ กรุงเทพฯ 10140" },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-2xl border border-[#e0d5c5] shadow-sm p-5 flex gap-4 items-start">
                    <div className="size-11 bg-[#e8f5e2] rounded-xl flex items-center justify-center shrink-0">
                      <c.icon className="size-5 text-[#7db870]" />
                    </div>
                    <div>
                      <p className="text-[#4a6741] text-[13px]">{c.label}</p>
                      <p className="text-[#1a2e1a] text-[15px]" style={{ fontWeight: 600 }}>{c.value}</p>
                      <p className={`${font} text-[12px] text-black`}>{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social media */}
              <div className="mt-6">
                <h3 className={`${fontHeading} text-[20px] sm:text-[22px] text-[#333] mb-4`}>ติดตามเราบนโซเชียล</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "Facebook", handle: "SiamHerbOfficial" },
                    { name: "Line", handle: "@siamherb" },
                    { name: "YouTube", handle: "SiamHerbTV" },
                    { name: "Instagram", handle: "@siamherb.th" },
                  ].map((s) => (
                    <div key={s.name} className="bg-white border border-[#e0d5c5] rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="size-10 bg-[#e7cfbc] rounded-xl flex items-center justify-center">
                        <span className="text-[#9D5400] text-[12px]" style={{ fontWeight: 700 }}>{s.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-[#1a2e1a] text-[14px]" style={{ fontWeight: 600 }}>{s.name}</p>
                        <p className="text-[#4a6741] text-[12px]">{s.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logo */}
              <div className="mt-6 flex items-center gap-3">
                <img src={imgLogo} className="size-12" alt="MetaHerb" />
                <span className={`${fontHeading} text-[20px]`}>
                  <span className="text-[#ed1c24]">META</span>
                  <span className="text-[#f7931d]">HERB</span>
                </span>
              </div>
            </div>

            {/* Right - Contact form */}
            <div className="flex-1 max-w-[600px]">
              <div className="bg-white rounded-2xl border border-[#e0d5c5] shadow-sm p-6 sm:p-8">
                <h3 className={`${fontHeading} text-[20px] sm:text-[22px] text-[#333] mb-1`}>ส่งข้อความถึงเรา</h3>
                <p className={`${font} text-[13px] text-[#4a6741] mb-6`}>กรอกแบบฟอร์มด้านล่าง</p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className={`${font} text-[13px] text-[#333] mb-1 block`}>ชื่อ-นามสกุล</label>
                      <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="ชื่อของคุณ" className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none focus:border-[#319754]`} />
                    </div>
                    <div className="flex-1">
                      <label className={`${font} text-[13px] text-[#333] mb-1 block`}>อีเมล</label>
                      <input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="อีเมลของคุณ" className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none focus:border-[#319754]`} />
                    </div>
                  </div>

                  <div>
                    <label className={`${font} text-[13px] text-[#333] mb-1 block`}>หัวข้อ</label>
                    <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="หัวข้อการติดต่อ" className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none focus:border-[#319754]`} />
                  </div>

                  <div>
                    <label className={`${font} text-[13px] text-[#333] mb-1 block`}>ข้อความ</label>
                    <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="พิมพ์ข้อความของคุณ..."
                      rows={5}
                      className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none resize-none focus:border-[#319754]`} />
                  </div>

                  <button onClick={handleSubmit}
                    className={`w-full bg-[#319754] hover:bg-[#267a43] text-white py-3 rounded-xl text-[14px] ${font} cursor-pointer transition-colors flex items-center justify-center gap-2`}>
                    <Send className="size-4" /> ส่งข้อความ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}