import React, { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Leaf,
  Droplets,
  Clock,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import OrderLaundryChatModal from "./OrderLaundryChatModal";

/** -----------------------------
 *  Assets & Copy (RU/EN)
 *  ----------------------------- */

const BALI_IMAGES = ["/images/balli.png"];

const COPY = {
  en: {
    topPill: "Green Lab Laundry • Bali",
    nav: {
      home: "Home",
      langLeft: "ENG",
      langRight: "RUS",
    },
    hero: {
      title: "Green Lab | Bali",
      subtitle:
        "Eco-friendly laundry pickup & delivery across Bali. Minimal fuss, maximum freshness - gentle care for every fabric.",
      ctaPrimary: "Request pickup in WhatsApp",
      ctaSecondary: "Request in Telegram",
      badges: ["Eco detergents", "24h average turnaround", "Pickup & delivery"],
    },
    quick: {
      title: "Short & simple",
      text:
        "We’re a clean, modern laundry service. Tell us your location — we’ll confirm pickup time and guide you through the quickest option.",
    },
    steps: {
      title: "How it works",
      items: [
        {
          title: "Message us",
          desc: "Send your location + preferred pickup time.",
          icon: Sparkles,
        },
        {
          title: "Pickup",
          desc: "Courier picks up your bag — no counting items.",
          icon: MapPin,
        },
        {
          title: "Wash & return",
          desc: "We wash, dry and fold — then deliver back fresh.",
          icon: Droplets,
        },
      ],
    },
    notes: {
      title: "Care notes (short)",
      items: [
        "We separate by color & fabric type.",
        "Eco detergents: gentle for skin and island nature.",
        "For leather/suede/fur or special items — ask first in chat.",
      ],
    },
    areas: {
      title: "Popular areas",
      desc:
        "Canggu • Seminyak • Ubud • Uluwatu • Sanur • Nusa Dua — and more. Share your pin, we’ll confirm.",
      chips: ["Canggu", "Seminyak", "Ubud", "Uluwatu", "Sanur", "Nusa Dua"],
    },
    cards: {
      title: "Why Green Lab",
      items: [
        {
          title: "Fresh by design",
          desc:
            "Clean, airy process — no heavy chemical vibe. Your clothes feel truly fresh.",
          icon: Leaf,
        },
        {
          title: "Fast & predictable",
          desc: "Clear messages, quick pickup, and a smooth return flow.",
          icon: Clock,
        },
        {
          title: "Gentle handling",
          desc: "Delicates get extra attention. We respect your fabrics.",
          icon: Droplets,
        },
      ],
    },
    cta: {
      title: "Ready to schedule pickup?",
      desc:
        "Send your location and we’ll reply with the fastest option for your area.",
      primary: "Open WhatsApp",
      secondary: "Copy message",
      copied: "Message copied ✅",
      message:
        "Hi Green Lab! I’d like to request laundry pickup in Bali. My location: (paste pin). Preferred time: (today/tomorrow).",
    },
    footer: {
      small:
        "© Green Lab Laundry, Bali. Eco-friendly laundry pickup & delivery.",
      legal: "All rights reserved.",
    },
    faq: {
      title: "Quick FAQ",
      items: [
        {
          q: "How do I book a pickup?",
          a: "Send your pin and preferred time in WhatsApp or Telegram. We confirm and dispatch a courier.",
        },
        {
          q: "Do I need to count items?",
          a: "No. Hand over the bag — we sort, count, and send a clear bill in chat.",
        },
        {
          q: "How fast is delivery back?",
          a: "Most loads return in about 24h. If delicates need more time, we tell you upfront.",
        },
      ],
    },
  },
  ru: {
    topPill: "Green Lab Laundry • Bali",
    nav: {
      home: "Главная",
      langLeft: "ENG",
      langRight: "RUS",
    },
    hero: {
      title: "Green Lab | Bali",
      subtitle:
        "Эко-прачечная с забором и доставкой по Бали. Минимум суеты - максимум свежести. Бережно к любым тканям.",
      ctaPrimary: "Заказать в WhatsApp",
      ctaSecondary: "Заказать в Telegram",
      badges: ["Эко-средства", "В среднем 24 часа", "Забор и доставка"],
    },
    quick: {
      title: "Коротко и по делу",
      text:
        "Мы — современная прачечная без лишней бюрократии. Напишите локацию — подтвердим время забора и подскажем самый быстрый вариант.",
    },
    steps: {
      title: "Как это работает",
      items: [
        {
          title: "Пишите нам",
          desc: "Кидаете локацию + удобное время забора.",
          icon: Sparkles,
        },
        {
          title: "Забор вещей",
          desc: "Курьер забирает пакет — не нужно считать вещи.",
          icon: MapPin,
        },
        {
          title: "Стирка и возврат",
          desc: "Стираем, сушим, складываем — и привозим обратно.",
          icon: Droplets,
        },
      ],
    },
    notes: {
      title: "Нюансы ухода (кратко)",
      items: [
        "Сортируем по цветам и типу ткани.",
        "Эко-средства: мягко для кожи и природы острова.",
        "Кожа/замша/мех и «особые» вещи — сначала уточните в чате.",
      ],
    },
    areas: {
      title: "Популярные районы",
      desc:
        "Canggu • Seminyak • Ubud • Uluwatu • Sanur • Nusa Dua — и другие. Пришлите геометку — подтвердим.",
      chips: ["Canggu", "Seminyak", "Ubud", "Uluwatu", "Sanur", "Nusa Dua"],
    },
    cards: {
      title: "Почему Green Lab",
      items: [
        {
          title: "Свежесть — как стандарт",
          desc:
            "Чистый процесс без «тяжёлой химии». Одежда реально ощущается свежей.",
          icon: Leaf,
        },
        {
          title: "Быстро и понятно",
          desc: "Без лишних вопросов: забрали, постирали, вернули — всё по-человечески.",
          icon: Clock,
        },
        {
          title: "Бережное обращение",
          desc: "Деликатные вещи — под особым вниманием. Мы уважаем ткани.",
          icon: Droplets,
        },
      ],
    },
    cta: {
      title: "Готовы заказать забор?",
      desc:
        "Напишите локацию — ответим и предложим самый быстрый вариант под ваш район.",
      primary: "Открыть WhatsApp",
      secondary: "Скопировать текст",
      copied: "Скопировано ✅",
      message:
        "Привет, Green Lab! Хочу заказать забор вещей на Бали. Моя локация: (геометка). Удобное время: (сегодня/завтра).",
    },
    footer: {
      small: "© Green Lab Laundry, Bali. Эко-стирка с забором и доставкой.",
      legal: "Все права защищены.",
    },
    faq: {
      title: "Быстрый FAQ",
      items: [
        {
          q: "Как заказать забор?",
          a: "Напишите в WhatsApp или Telegram: геометка + удобное время. Подтвердим и отправим курьера.",
        },
        {
          q: "Нужно считать вещи?",
          a: "Нет. Передайте пакет — мы отсортируем, посчитаем и отправим прозрачный чек в чате.",
        },
        {
          q: "Когда вернёте?",
          a: "Обычно около 24 часов. Если деликатные вещи требуют больше времени — предупредим заранее.",
        },
      ],
    },
  },
};

function waShareUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function tgShareUrl(text) {
  return `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
}

/** -----------------------------
 *  UI bits (same style family)
 *  ----------------------------- */

function BackgroundColumns() {
  const cols = 8;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-stone-50 to-white" />
      <div className="absolute -top-36 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="absolute inset-0 grid grid-cols-8 opacity-[0.55]">
        {Array.from({ length: cols }).map((_, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.08 * i }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-200/30 via-white/0 to-emerald-100/15" />
            <div className="absolute inset-y-0 right-0 w-px bg-emerald-900/5" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FlashlightCard({ children, className = "" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  }

  const glow = useMotionTemplate`
    radial-gradient(520px circle at ${mouseX}px ${mouseY}px,
      rgba(16,185,129,0.16),
      transparent 70%)
  `;

  return (
    <div
      onMouseMove={onMove}
      className={`relative overflow-hidden rounded-2xl border border-white/60 ring-1 ring-emerald-100/60 bg-white/18 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_18px_70px_-40px_rgba(16,185,129,0.55)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{ background: glow }}
        whileHover={{ opacity: 1 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-emerald-50/20 to-white/5 opacity-85" />
      <div className="relative">{children}</div>
    </div>
  );
}

function BeamPillButton({ children, onClick, variant = "primary" }) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform active:scale-[0.98]
      ${isPrimary ? "bg-emerald-950 text-white" : "bg-white/70 text-emerald-950 border border-emerald-900/10"}
      `}
    >
      {/* border beam */}
      <motion.span
        className="pointer-events-none absolute -inset-px rounded-full"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 180deg, rgba(16,185,129,0.0), rgba(16,185,129,0.55), rgba(16,185,129,0.0))",
            filter: "blur(0px)",
          }}
          initial={{ rotate: 0 }}
          whileHover={{
            rotate: 360,
            transition: { duration: 1.1, ease: "linear" },
          }}
        />
        <span className="absolute inset-[1px] rounded-full bg-transparent" />
      </motion.span>

      {/* subtle inner shimmer */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0"
        whileHover={{ opacity: isPrimary ? 0.18 : 0.08 }}
        transition={{ duration: 0.25 }}
        style={{
          background:
            "linear-gradient(90deg, rgba(16,185,129,0.0), rgba(16,185,129,0.25), rgba(16,185,129,0.0))",
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}

function LetterClipTitle({ text, className = "" }) {
  const letters = useMemo(() => Array.from(text), [text]);

  return (
    <span className={`inline-flex flex-wrap items-baseline leading-tight ${className}`}>
      {letters.map((ch, i) => (
        <span key={`${ch}-${i}`} className="relative inline-block overflow-hidden pb-0.5">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", filter: "blur(8px)" }}
            animate={{ y: "0%", filter: "blur(0px)" }}
            transition={{
              duration: 0.75,
              ease: [0.2, 0.8, 0.2, 1],
              delay: 0.02 * i,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 14, opacity: 0.85 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function HeroCardRotator({ images, ariaLabel = "Hero visuals", variant }) {
  const isMobile = variant === "mobile";
  return (
    <div
      className={`relative w-full overflow-hidden ${
        isMobile ? "" : "rounded-3xl border border-white/70 bg-white shadow-xl shadow-emerald-900/10"
      }`}
      style={isMobile ? undefined : { perspective: 1100 }}
      aria-label={ariaLabel}
    >
      <div className={isMobile ? "relative h-[380px] w-screen" : "relative h-[460px] md:h-[560px]"}>
        <motion.img
          key={images[0]}
          src={images[0]}
          alt="Green Lab Bali atmosphere"
          loading="eager"
          decoding="async"
          className={`absolute inset-0 h-full w-full ${isMobile ? "object-cover" : "object-contain sm:object-cover"}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {!isMobile && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/10 via-emerald-950/0 to-transparent" />
        )}
      </div>
    </div>
  );
}

/** -----------------------------
 *  Page: Green Lab | Bali
 *  ----------------------------- */

export default function GreenLabBali() {
  const [lang, setLang] = useState("en");
  const t = COPY[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const isEn = lang === "en";
  const [faqOpen, setFaqOpen] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  useEffect(() => {
    document.body.style.overflow = chatOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [chatOpen]);

  const openWhatsApp = () => {
    const url = waShareUrl(t.cta.message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openTelegram = () => {
    const url = tgShareUrl(t.cta.message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const scrollToHow = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(t.cta.message);
      setToast(t.cta.copied);
    } catch {
      // fallback: select via prompt (still works everywhere)
      // eslint-disable-next-line no-alert
      window.prompt("Copy the message:", t.cta.message);
      setToast(t.cta.copied);
    }
  };

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => (prev === idx ? null : idx));
  };

  const [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1700);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-50 font-sans text-stone-800 selection:bg-emerald-200 selection:text-emerald-950">
      {/* top progress */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-emerald-500"
        style={{ scaleX }}
      />

      {/* header */}
      <header className="fixed top-0 z-40 w-full px-3 sm:px-6 py-3">
        <div className="w-full max-w-6xl mx-auto">
          <nav className="flex w-full flex-wrap md:flex-nowrap items-center justify-between gap-3 rounded-full border border-white/40 bg-white/60 px-3 sm:px-5 py-2.5 backdrop-blur-md shadow-sm lg:max-w-5xl lg:mx-auto">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/60 px-3 py-1.5 text-xs font-semibold tracking-widest text-emerald-950 transition hover:bg-white"
            >
              <ArrowRight className="rotate-180" size={14} />
              {t.nav.home}
            </Link>

            <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-stone-600">
              <Link to="/canggu" className="hover:text-emerald-800 transition-colors">
                Canggu
              </Link>
              <Link to="/bali" className="hover:text-emerald-800 transition-colors">
                Bali
              </Link>
            </div>

            <div className="flex items-center gap-2 font-bold tracking-tight text-emerald-950">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Leaf size={18} />
              </div>
              <span className="text-sm sm:text-base">Green Lab</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 pr-1 text-stone-500">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 hover:border-emerald-200 hover:text-emerald-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="16" height="16" rx="4" ry="4" />
                    <circle cx="12" cy="12" r="3.6" />
                    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 hover:border-emerald-200 hover:text-emerald-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 10.5V8.25c0-.62.5-1.12 1.12-1.12H16V4.5h-2.25A3.75 3.75 0 0 0 10 8.25v2.25H8v2.25h2v7h3v-7h2l.5-2.25h-2z" />
                  </svg>
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 hover:border-emerald-200 hover:text-emerald-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 4.5 3.8 11.2c-.7.27-.7 1.31 0 1.58l3.54 1.38 1.46 4.41c.2.61 1.02.82 1.5.37l2.17-2.01 4.06 3.01c.6.45 1.46.12 1.62-.63L22 5.64c.18-.85-.64-1.55-1.46-1.14Z" />
                  </svg>
                </a>
              </div>
              <div className="relative flex w-[120px] items-center overflow-hidden rounded-full border border-emerald-900/10 bg-white/90 px-1 py-1 text-[11px] font-semibold text-stone-500 shadow-sm">
                <motion.div
                  className="absolute inset-y-[4px] rounded-full bg-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
                  style={{ width: "calc(50% - 8px)" }}
                  animate={{ left: isEn ? "4px" : "calc(50% + 4px)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                />
                <button
                  className={`relative z-10 flex-1 py-1 text-center transition-colors ${isEn ? "text-emerald-900" : "text-stone-500"}`}
                  onClick={() => setLang("en")}
                  type="button"
                >
                  ENG
                </button>
                <button
                  className={`relative z-10 flex-1 py-1 text-center transition-colors ${!isEn ? "text-emerald-900" : "text-stone-500"}`}
                  onClick={() => setLang("ru")}
                  type="button"
                >
                  RUS
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile side drawer + trigger */}
      <button
        className="fixed bottom-5 right-4 z-40 md:hidden inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900 text-white shadow-lg active:scale-95"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        type="button"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 z-40 h-full w-48 max-w-[60vw] bg-white shadow-2xl md:hidden flex flex-col rounded-l-3xl border border-stone-100"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
            >
              <div className="flex items-center justify-between px-3 py-3.5 border-b border-stone-100">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Leaf size={18} />
                  <span>Green Lab</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="h-9 w-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-600"
                  aria-label="Close menu"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-1 px-3 py-3">
                <div className="px-2 pb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">
                  Navigation
                </div>
                <button
                  className="px-3 py-2.5 text-left text-base font-semibold text-stone-800 rounded-xl hover:bg-emerald-50"
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                >
                  Home
                </button>
                <button
                  className="px-3 py-2.5 text-left text-base font-semibold text-stone-800 rounded-xl hover:bg-emerald-50"
                  onClick={() => {
                    navigate("/canggu");
                    setMenuOpen(false);
                  }}
                >
                  Canggu
                </button>
                <button
                  className="px-3 py-2.5 text-left text-base font-semibold text-stone-800 rounded-xl hover:bg-emerald-50"
                  onClick={() => {
                    navigate("/bali");
                    setMenuOpen(false);
                  }}
                >
                  Bali
                </button>
              </div>
              <div className="px-3 py-3.5 border-t border-stone-100">
                <div className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
                  Social
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:border-emerald-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="4" width="16" height="16" rx="4" ry="4" />
                      <circle cx="12" cy="12" r="3.5" />
                      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:border-emerald-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.5 10.5V8.25c0-.62.5-1.12 1.12-1.12H16V4.5h-2.25A3.75 3.75 0 0 0 10 8.25v2.25H8v2.25h2v7h3v-7h2l.5-2.25h-2z" />
                    </svg>
                  </a>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="h-10 w-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:border-emerald-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 4.5 3.8 11.2c-.7.27-.7 1.31 0 1.58l3.54 1.38 1.46 4.41c.2.61 1.02.82 1.5.37l2.17-2.01 4.06 3.01c.6.45 1.46.12 1.62-.63L22 5.64c.18-.85-.64-1.55-1.46-1.14Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* hero */}
      <section className="relative px-6 pb-18 pt-12 sm:pt-32">
        <div className="hidden md:block">
          <BackgroundColumns />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/65 px-4 py-2 text-xs font-semibold tracking-widest text-emerald-900 backdrop-blur-md">
                <Sparkles size={14} className="opacity-80" />
                {t.topPill}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight text-emerald-950 md:text-6xl">
                <LetterClipTitle text={t.hero.title} />
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-stone-600 md:text-xl">
                {t.hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
                <BeamPillButton onClick={openWhatsApp} variant="primary">
                  {t.hero.ctaPrimary}
                </BeamPillButton>

                <BeamPillButton onClick={openTelegram} variant="secondary">
                  {t.hero.ctaSecondary}
                </BeamPillButton>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-7 flex flex-wrap gap-2">
                {t.hero.badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-stone-600 backdrop-blur-md"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <motion.div
            className="order-1 lg:order-2 w-full"
            initial={{ y: 12, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="block lg:hidden -mx-6 -mt-14">
              <HeroCardRotator images={BALI_IMAGES} variant="mobile" />
            </div>
            <motion.div
              className="hidden lg:block rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-3"
              whileHover={{ rotateX: 1.8, rotateY: -1.8 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <HeroCardRotator images={BALI_IMAGES} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* quick about */}
      <section className="relative px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <FlashlightCard className="p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl">
                  <h2 className="mb-2 text-2xl font-bold text-emerald-950 md:text-3xl">
                    {t.quick.title}
                  </h2>
                  <p className="text-stone-600 leading-relaxed">{t.quick.text}</p>
                  <div className="mt-4 space-y-2 text-sm text-stone-700">
                    <div className="font-semibold text-emerald-900">Address</div>
                    <div>Green Lab Laundry Bali (Ubud) - Jl. Raya Sriwedari No.53, Tegallalang, Ubud</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900">
                    <Leaf size={16} /> Eco
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-800">
                    <Clock size={16} /> 24h
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-800">
                    <MapPin size={16} /> Bali
                  </span>
                </div>
              </div>
            </FlashlightCard>
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section id="how-it-works" className="relative px-6 py-16">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/60" />
        <div className="relative mx-auto max-w-6xl">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-emerald-200/28 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-white/60 blur-[70px]" />
          </div>
          <Reveal>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-emerald-950 md:text-4xl">
                  {t.steps.title}
                </h2>
                <div className="mt-3 h-1 w-20 rounded-full bg-emerald-500" />
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.steps.items.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={0.06 * i}>
                  <FlashlightCard className="h-full p-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-emerald-800">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-stone-900">{s.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{s.desc}</p>
                  </FlashlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* why greenlab cards */}
      <section className="relative px-6 py-16">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/60" />
        <div className="relative mx-auto max-w-6xl">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/28 blur-3xl" />
            <div className="absolute right-0 bottom-6 h-64 w-64 rounded-full bg-white/55 blur-[65px]" />
          </div>
          <Reveal>
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-emerald-950 md:text-4xl">
                {t.cards.title}
              </h2>
              <div className="mt-3 h-1 w-20 rounded-full bg-emerald-500" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.cards.items.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.title} delay={0.06 * i}>
                  <FlashlightCard className="h-full p-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-stone-900">{c.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{c.desc}</p>
                  </FlashlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-16">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-white via-emerald-50/70 to-white" />
        <div className="relative mx-auto max-w-6xl">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-10 top-10 h-60 w-60 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-white/60 blur-[70px]" />
          </div>

          <Reveal>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-emerald-950 md:text-4xl">{t.faq.title}</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.faq.items.map((item, i) => (
              <Reveal key={item.q} delay={0.04 * i}>
                <FlashlightCard className="p-5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-base font-semibold text-emerald-950">{item.q}</span>
                    <motion.span
                      animate={{ rotate: faqOpen === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-full border border-emerald-900/10 bg-white/60 p-1 text-emerald-900"
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>

                  {faqOpen === i ? (
                    <div className="mt-3 text-sm leading-relaxed text-stone-600 transition-opacity duration-150">
                      {item.a}
                    </div>
                  ) : null}
                </FlashlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* areas + notes */}
      <section className="relative px-6 py-16">
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <FlashlightCard className="p-8">
              <h3 className="text-2xl font-bold text-emerald-950">{t.areas.title}</h3>
              <p className="mt-2 text-stone-600 leading-relaxed">{t.areas.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {t.areas.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-emerald-900/10 bg-white/60 px-3 py-1.5 text-xs font-semibold text-stone-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </FlashlightCard>
          </Reveal>

          <Reveal delay={0.06}>
            <FlashlightCard className="p-8">
              <h3 className="text-2xl font-bold text-emerald-950">{t.notes.title}</h3>
              <ul className="mt-5 space-y-3">
                {t.notes.items.map((line, i) => (
                  <li key={i} className="flex gap-3 text-stone-600">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </FlashlightCard>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="rounded-3xl border border-emerald-900/10 bg-white/70 p-10 backdrop-blur-md">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold tracking-tight text-emerald-950 md:text-4xl">
                    {t.cta.title}
                  </h2>
                  <p className="mt-3 text-stone-600 leading-relaxed">{t.cta.desc}</p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <BeamPillButton onClick={openWhatsApp} variant="primary">
                      {t.cta.primary}
                    </BeamPillButton>
                    <BeamPillButton onClick={copyMessage} variant="secondary">
                      {t.cta.secondary}
                    </BeamPillButton>
                  </div>

                  <p className="mt-4 text-xs text-stone-400">
                    WhatsApp opens via share link (no number needed). If you want a direct chat number later — we’ll
                    swap it in 5 seconds.
                  </p>
                </div>

                <div className="md:col-span-1">
                  <FlashlightCard className="p-6">
                    <div className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
                      Message template
                    </div>
                  <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700 leading-relaxed">
                      {t.cta.message}
                    </div>
                  </FlashlightCard>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Floating Chat CTA */}
      <div
        className="fixed bottom-20 right-4 z-30 rounded-2xl border border-emerald-900/10 bg-white/85 px-4 py-3 shadow-lg shadow-emerald-900/10 backdrop-blur"
        style={{ width: "min(340px, calc(100vw - 32px))" }}
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div className="min-w-0 text-emerald-900 leading-tight">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800/80 leading-[1.2] break-words">
              {isEn ? "Order laundry via" : "Заказать стирку через"}
            </span>
            <span className="block text-sm font-semibold">{isEn ? "Chat" : "Чат"}</span>
          </div>
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-3 py-2 text-sm font-semibold shadow-md hover:shadow-lg active:scale-95 transition whitespace-nowrap"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-base">💬</span>
            {isEn ? "Open chat" : "Открыть чат"}
          </button>
        </div>
      </div>

      <OrderLaundryChatModal open={chatOpen} onClose={() => setChatOpen(false)} isEn={isEn} />

      {/* toast */}
      <AnimatePresence>
        {toast ? (
          <motion.div
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-900/10 bg-white/80 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg backdrop-blur-md"
            initial={{ y: 16, opacity: 0.7, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 12, opacity: 0.7, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* footer */}
      <footer className="border-t border-stone-200 bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-6 flex-col sm:flex-row">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Leaf size={18} />
              </span>
              <span>Green Lab</span>
            </div>
            <div className="flex items-center gap-4" />
            <div className="text-center sm:text-right">
              <div className="text-sm text-stone-500">{t.footer.small}</div>
              <div className="mt-1 text-xs text-stone-400">{t.footer.legal}</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

