import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Phone, Mail, MapPin, ChevronDown, Leaf, Clock, ShieldCheck, Facebook, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../store/LanguageContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imgHerb from "figma:asset/f24d55b139f649587f70c678ab822ead66587d45.png";
import imgTea from "figma:asset/bbbf823d211a68f6164b9a16d14453e6ebfaa746.png";
import imgProduct1 from "figma:asset/f1ceefb74e0b735c05a881e21bdc83ccd797fa20.png";
import imgProduct2 from "figma:asset/7f17e783f1ef7618e9192f2aafe3f9c41a98a922.png";
import imgProduct3 from "figma:asset/c62bf17009bd747369419c446709fd9ba2080b91.png";
import imgMission from "figma:asset/1d6e138ce0a1c2930909c26a7eede22840f0c150.png";
import imgLogo from "../../assets/logo.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontHeading = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function AboutPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error(t("common_required"));
      return;
    }
    toast.success(t("about_form_success"), { description: t("about_form_success_desc") });
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="w-full">
      {/* ========== HERO SECTION ========== Video extends up behind appbar.
          Negative margin matches actual header height (mobile 98 / desktop 124) so the
          video flushes against the viewport top with no white gap. */}
      <section className="relative -mt-[98px] md:-mt-[124px] h-[614px] sm:h-[714px] md:h-[866px] lg:h-[966px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://res.cloudinary.com/dujq74ght/video/upload/ท่องโลกสมุนไพร_EP._6_ตะลุยต่างแดน_ตอน__ชาซีลอน_ศรีลังกา__1_1_xvtgqw.webm" type="video/webm" />
            <source src="https://res.cloudinary.com/dujq74ght/video/upload/ท่องโลกสมุนไพร_EP._6_ตะลุยต่างแดน_ตอน__ชาซีลอน_ศรีลังกา__1_1_xvtgqw.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,31,13,0.85)] via-[rgba(13,31,13,0.3)] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:pl-[69px] flex flex-col gap-4 sm:gap-6 justify-center h-full pt-[98px] md:pt-[124px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] rounded-full px-4 py-2 w-fit">
            <Leaf className="size-3.5 text-[#a8d5a0]" />
            <span className="text-[#a8d5a0] text-[12px] tracking-wider uppercase">{t("about_welcome")}</span>
          </div>

          {/* Heading */}
          <h1 className={`${fontHeading} text-[32px] sm:text-[56px] lg:text-[80px] leading-[1.2] lg:leading-[1.2]`}>
            <span className="block text-white">{t("about_hero_1")}</span>
            <span className="block text-[#a8d5a0]">{t("about_hero_2")}</span>
            <span className="block text-white">{t("about_hero_3")}</span>
          </h1>

          {/* Subtitle */}
          <p className={`${font} text-[16px] sm:text-[20px] text-white/80 max-w-[500px]`}>
            {t("about_subtitle")}<br />
            {t("about_subtitle2")}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center mt-2">
            {/* Primary — gradient pill with shimmer + circular arrow */}
            <button onClick={() => navigate("/products")}
              className={`group/cta relative bg-gradient-to-br from-[#86c378] via-[#5ea854] to-[#3e8237] text-white pl-7 pr-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 rounded-full text-[15px] sm:text-[17px] ${font} cursor-pointer inline-flex items-center gap-3 sm:gap-4 shadow-[0_10px_30px_-6px_rgba(94,168,84,0.55)] hover:shadow-[0_16px_40px_-6px_rgba(94,168,84,0.75)] hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden`}
              style={{ fontWeight: 500 }}>
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative whitespace-nowrap">{t("about_cta_shop")}</span>
              <span className="relative size-10 sm:size-12 rounded-full bg-white/25 group-hover/cta:bg-white/35 flex items-center justify-center shadow-inner transition-colors duration-300">
                <ArrowRight className="size-4 sm:size-5 transition-transform duration-300 group-hover/cta:translate-x-[3px]" strokeWidth={2.6} />
              </span>
            </button>

            {/* Secondary — glass pill with chevron */}
            <button onClick={() => document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" })}
              className={`group/sec relative bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-5 sm:px-7 py-2 sm:py-2.5 h-[52px] sm:h-[60px] rounded-full text-[14px] sm:text-[16px] ${font} cursor-pointer inline-flex items-center gap-2 border border-white/30 hover:border-white/50 hover:-translate-y-[2px] active:translate-y-0 transition-all duration-300`}
              style={{ fontWeight: 500 }}>
              <span className="whitespace-nowrap">{t("about_cta_mission")}</span>
              <ChevronDown className="size-4 transition-transform duration-300 group-hover/sec:translate-y-[2px]" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Scroll indicator wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative">
            <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block relative z-[1]" preserveAspectRatio="none" style={{ height: "56px" }}>
              <path d="M0 55.125C491.333 -18.375 971 -18.375 1440 55.125H0Z" fill="#f5f0e8" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5f0e8] z-[2]" />
          </div>
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-[3]">
            <span className={`text-[#319754] text-[12px] tracking-wider uppercase`}>{t("about_scroll")}</span>
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
              <span className="text-[#319754] text-[12px] tracking-wider uppercase">{t("about_our_story")}</span>
            </div>
            <h2 className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[48px] text-[#4e4e4e]`}>
              {t("about_story_h1")}
            </h2>
            <h2 className={`text-[28px] sm:text-[36px] lg:text-[48px] italic text-[#4e4e4e]`} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              {t("about_story_h2")}
            </h2>
            <p className={`${font} text-[14px] sm:text-[16px] text-[#333] mt-4 max-w-[614px] mx-auto leading-8`}>
              {t("about_story_sub")}
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
                { icon: Leaf, title: t("about_feat1_title"), desc: t("about_feat1_desc") },
                { icon: Clock, title: t("about_feat2_title"), desc: t("about_feat2_desc") },
                { icon: ShieldCheck, title: t("about_feat3_title"), desc: t("about_feat3_desc") },
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
            <div className="w-full lg:w-1/2 shrink-0 relative h-[350px] sm:h-[450px] lg:h-[520px]">
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
                          <p className="text-white/80 text-[13px]">{t("about_product_featured")}</p>
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
            <div className="w-full lg:w-1/2 min-w-0">
              <h2 className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[40px] leading-tight`}>
                <span className="text-white block">{t("about_trust_h1")}</span>
                <span className="text-[#7db870] block">{t("about_trust_h2")}</span>
              </h2>

              {/* Product cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  { tag: "ขายดีอันดับ 1", tagColor: "#ff8a65", title: "ชาสมุนไพร 7 ชนิด", desc: "ผสมจากตะไคร้ ขิง ขม้น กระชาย ใบเตย มะตูม และดอกอัญชัน" },
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
                <p className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[48px] text-white uppercase`}>{t("about_mission_h1")}</p>
                <p className={`${fontHeading} text-[28px] sm:text-[36px] lg:text-[48px] text-white/70`}>{t("about_mission_h2")}</p>
              </div>

              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-auto max-w-[800px]">
                <h3 className={`${fontHeading} text-[24px] sm:text-[32px] lg:text-[40px] text-white leading-tight`}>
                  {t("about_mission_quote")}
                </h3>
                <p className={`${font} text-[16px] sm:text-[20px] lg:text-[24px] text-white/70 mt-3 leading-relaxed`}>
                  {t("about_mission_desc")}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-row lg:flex-col gap-4 flex-wrap justify-center">
              {[
                { value: "3+", label: t("about_stat_years") },
                { value: "120", label: t("about_stat_farm") },
                { value: "50+", label: t("about_stat_products") },
                { value: "2,400+", label: t("about_stat_customers") },
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
            <h2 className={`${fontHeading} text-[32px] sm:text-[40px] lg:text-[48px] text-[#1a2e1a]`}>{t("about_contact_h1")}</h2>
            <h2 className={`${fontHeading} text-[32px] sm:text-[40px] lg:text-[48px] text-[#7db870]`}>{t("about_contact_h2")}</h2>
            <p className={`${font} text-[14px] sm:text-[16px] text-[#4a6741] mt-4 max-w-[554px] mx-auto`}>
              {t("about_contact_sub")}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left - Contact info */}
            <div className="flex-1 space-y-6">
              <h3 className={`${fontHeading} text-[20px] sm:text-[22px] text-[#333]`}>{t("about_contact_info")}</h3>

              {/* Contact cards */}
              <div className="space-y-4">
                {[
                  { icon: Phone, label: t("about_phone"), value: "098-765-4321", sub: t("about_phone_hours") },
                  { icon: Mail, label: t("about_email"), value: "hello@siamherb.co.th", sub: t("about_email_reply") },
                  { icon: MapPin, label: t("about_address"), value: "บ้านเลขที่ 459/153 หมู่บ้านนิวไฮบ์ สุขสวัสดิ์", sub: "แขวงราษฎรบูรณะ เขตราษฎร์บรณะ กรุงเทพฯ 10140" },
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
                <h3 className={`${fontHeading} text-[20px] sm:text-[22px] text-[#333] mb-4`}>{t("about_follow_us")}</h3>
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
                <h3 className={`${fontHeading} text-[20px] sm:text-[22px] text-[#333] mb-1`}>{t("about_send_message")}</h3>
                <p className={`${font} text-[13px] text-[#4a6741] mb-6`}>{t("about_form_sub")}</p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className={`${font} text-[13px] text-[#333] mb-1 block`}>{t("about_form_name")}</label>
                      <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder={t("about_form_name_ph")} className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none focus:border-[#319754]`} />
                    </div>
                    <div className="flex-1">
                      <label className={`${font} text-[13px] text-[#333] mb-1 block`}>{t("about_form_email")}</label>
                      <input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder={t("about_form_email_ph")} className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none focus:border-[#319754]`} />
                    </div>
                  </div>

                  <div>
                    <label className={`${font} text-[13px] text-[#333] mb-1 block`}>{t("about_form_subject")}</label>
                    <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder={t("about_form_subject_ph")} className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none focus:border-[#319754]`} />
                  </div>

                  <div>
                    <label className={`${font} text-[13px] text-[#333] mb-1 block`}>{t("about_form_message")}</label>
                    <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={t("about_form_message_ph")}
                      rows={5}
                      className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-4 py-3 text-[14px] ${font} outline-none resize-none focus:border-[#319754]`} />
                  </div>

                  <button onClick={handleSubmit}
                    className={`w-full bg-[#319754] hover:bg-[#267a43] text-white py-3 rounded-xl text-[14px] ${font} cursor-pointer transition-colors flex items-center justify-center gap-2`}>
                    <Send className="size-4" /> {t("about_form_send")}
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