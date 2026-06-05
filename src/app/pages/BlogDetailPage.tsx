import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Eye, Share2, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { articles, getArticleById } from "../data/articles";
import { useLanguage } from "../store/LanguageContext";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const article = getArticleById(id || "1") || articles[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("blog_copy_link"));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
      <div className="flex flex-col gap-[16px]">
        {/* Top bar: Back + view/share */}
        <div className="flex items-center justify-between w-full">
          <button onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors">
            <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.4} />
            <span className={`${font} text-[12px]`} style={{ fontWeight: 500 }}>{t("common_back")}</span>
          </button>
          <div className="flex items-center gap-2">
            {/* Views pill */}
            <div className="inline-flex items-center gap-1.5 bg-[#f5f5f5] text-gray-700 px-3 py-1.5 rounded-full" title={t("blog_views")}>
              <Eye className="size-3.5" strokeWidth={2.2} />
              <span className={`${font} text-[12px] tabular-nums`} style={{ fontWeight: 500 }}>{article.views.toLocaleString()}</span>
            </div>
            {/* Share */}
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.92 }}
              className="inline-flex items-center justify-center bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] rounded-full size-8 cursor-pointer transition-colors"
              title={t("blog_share")}
            >
              <Share2 className="size-3.5" strokeWidth={2.2} />
            </motion.button>
          </div>
        </div>

        {/* Hero image */}
        <div className="w-full h-[260px] sm:h-[360px] lg:h-[450px] rounded-[16px] overflow-hidden bg-[#d9d9d9]">
          <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Views badge in top bar uses article views */}

        {/* Content card */}
        <article className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[16px] w-full">
          {/* Title + date */}
          <div className="flex flex-col gap-[10px]">
            <h1 className={`${font} text-[18px] sm:text-[20px] lg:text-[24px] text-black`} style={{ fontWeight: 500 }}>{article.title}</h1>
            <div className="flex items-center gap-[10px]">
              <Calendar className="size-3 text-[#737373]" strokeWidth={2.2} />
              <span className={`${font} text-[12px] text-[#737373]`}>{article.date}</span>
            </div>
          </div>

          <div className="h-px w-full bg-[#D4D4D8]" />

          {/* Body */}
          <div className={`${font} text-[14px] sm:text-[16px] text-black leading-relaxed flex flex-col gap-[10px]`}>
            {article.content.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={i} className="h-[6px]" />;
              if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                return <h2 key={i} className="text-[16px] text-black mt-2" style={{ fontWeight: 600 }}>{trimmed.replace(/\*\*/g, "")}</h2>;
              }
              if (trimmed.startsWith("* **")) {
                const parts = trimmed.replace("* **", "").split(":**");
                return <p key={i} className="pl-4">• <span style={{ fontWeight: 600 }}>{parts[0]}:</span>{parts[1]}</p>;
              }
              if (trimmed.startsWith("* ")) {
                return <p key={i} className="pl-4">• {trimmed.slice(2)}</p>;
              }
              const numMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
              if (numMatch) {
                const cleaned = numMatch[2].replace(/\*\*(.+?)\*\*/g, (_, t) => t);
                const boldMatch = numMatch[2].match(/^\*\*(.+?):\*\*\s*(.*)$/);
                return (
                  <p key={i} className="pl-4">
                    <span style={{ fontWeight: 600 }}>{numMatch[1]}. </span>
                    {boldMatch ? (<><span style={{ fontWeight: 600 }}>{boldMatch[1]}:</span> {boldMatch[2]}</>) : cleaned}
                  </p>
                );
              }
              return <p key={i}>{trimmed.replace(/\*\*/g, "")}</p>;
            })}
          </div>
        </article>
      </div>
    </div>
  );
}