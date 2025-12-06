import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Clock,
  Droplets,
  Leaf,
  Menu,
  Star,
  X,
  CheckCircle,
  Shirt,
  Footprints,
  ChevronDown,
  ChevronUp,
  Send,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import OrderLaundryChatModal from "./OrderLaundryChatModal";

// --- Assets & Data ---

const HERO_IMAGE = "/Green-Lab/docs/images/green.png";
const TELEGRAM_LINK = "https://t.me/GreenLabLaundry_bot";

const GALLERY = [
  "/Green-Lab/docs/images/513824798_18016107722726969_485241696461650006_n.jpg",
  "/Green-Lab/docs/images/526096997_18019881974726969_4116232978043975983_n.jpg",
  "/Green-Lab/docs/images/526297596_18019881965726969_7235280508079493943_n.jpg",
  "/Green-Lab/docs/images/526875130_18019881971726969_2939863245526086880_n.jpg",
  "/Green-Lab/docs/images/466967109_122124392378476517_3195026296722551612_n.jpg",
  "/Green-Lab/docs/images/473598656_122133338162476517_5916728568169499213_n.jpg",
  "/Green-Lab/docs/images/509784267_18016107713726969_8146465886920415524_n.jpg",
];

const CONTENT = {
  en: {
    nav: { order: "Order Now", home: "Home" },
    hero: {
      title: "Premium Eco Laundry in Bali",
      subtitle:
        "We pick up, wash, dry, and deliver your clothes with gentle care. Experience the new standard of freshness.",
      cta: "Book via WhatsApp",
      scroll: "Scroll to explore",
      telegram: "Laundry in 1 click",
    },
    heroButtons: {
      canggu: "Green Lab | Canggu",
      bali: "Green Lab | Bali",
    },
    trusted: "Trusted by expats & villas in Bali",
    about: {
      title: "Pure & Gentle",
      desc: "Green Lab Laundry is a modern eco-friendly laundry service in Bali. We treat every fabric with respect, using organic detergents safe for you and the island nature.",
    },
    pricing: {
      title: "Transparent Pricing",
      subtitle: "Simple rates. No hidden fees.",
      main: {
        clothes: {
          title: "Clothes, bed linen, towels",
          price: "35k",
          unit: "per kg",
          desc: "Min order 4kg"
        },
        shoes: {
          title: "Shoes cleaning",
          price: "100k",
          unit: "per pair",
          desc: "Deep clean"
        }
      },
      included: {
        title: "EVERYTHING IS INCLUDED:",
        items: [
          "Pickup & Delivery", "Washing",
          "Drying", "Ironing",
          "Folding", "Stain removal"
        ]
      },
      listTitle: "Full Price List",
      categories: [
        {
          name: "Laundry by Weight",
          items: [
            { name: "Standard (24h)", price: "35k / kg" },
            { name: "Standard + Vanish", price: "40k / kg" },
            { name: "Eco (Amway Home)", price: "45k / kg" },
            { name: "Eco (Amway) + Vanish", price: "50k / kg" },
            { name: "Kids Laundry", price: "55k / kg" },
            { name: "Express (3-5 hours)", price: "Double Price" },
          ]
        },
        {
          name: "Individual Items",
          items: [
            { name: "Hand Wash / Stain Remover", price: "50k / pcs" },
            { name: "Jacket", price: "70k / pcs" },
            { name: "Coat", price: "70k / pcs" },
            { name: "Vest", price: "50k / pcs" },
            { name: "Shoes (Deep Clean)", price: "100k / pair" },
            { name: "Sandals", price: "50k / pair" },
            { name: "Bag", price: "70k / pcs" },
            { name: "Backpack", price: "85k / pcs" },
            { name: "Helmet", price: "70k / pcs" },
            { name: "Hat / Cap", price: "40k / pcs" },
            { name: "Hanger", price: "10k / pcs" },
            { name: "Ironing Only", price: "10k / pcs" },
          ]
        }
      ]
    },
    features: [
      { title: "Eco Detergents", desc: "Hypoallergenic & organic solutions", icon: Leaf },
      { title: "Fast Delivery", desc: "Clean & fresh in 24 hours", icon: Clock },
      { title: "Gentle Care", desc: "Special treatment for delicate fabrics", icon: Droplets },
    ],
    footer: {
      rights: "All rights reserved.",
    },
    gallery: {
      title: "Before & After",
      hint: "Swipe to view",
    },
  },
  ru: {
    nav: { order: "Заказать", home: "Главная" },
    hero: {
      title: "Премиальная эко-прачечная на Бали",
      subtitle:
        "Забираем, стираем, сушим и доставляем ваши вещи. Новый стандарт чистоты и бережного ухода.",
      cta: "Заказать в WhatsApp",
      scroll: "Листайте вниз",
      telegram: "Заказать стирку в 1 клик",
    },
    heroButtons: {
      canggu: "Green Lab | Чангу",
      bali: "Green Lab | Бали",
    },
    trusted: "Нам доверяют экспаты и виллы Бали",
    about: {
      title: "Чистота и Забота",
      desc: "Green Lab Laundry - современная экологичная прачечная. Мы с уважением относимся к тканям, используя органические средства, безопасные для вас и природы острова.",
    },
    pricing: {
      title: "Честные Цены",
      subtitle: "Понятные тарифы. Без скрытых доплат.",
      main: {
        clothes: {
          title: "Одежда, белье, полотенца",
          price: "35k",
          unit: "за кг",
          desc: "Мин. заказ 4кг"
        },
        shoes: {
          title: "Чистка обуви",
          price: "100k",
          unit: "за пару",
          desc: "Глубокая чистка"
        }
      },
      included: {
        title: "В СТОИМОСТЬ ВКЛЮЧЕНО:",
        items: [
          "Забор и доставка", "Стирка",
          "Сушка", "Глажка",
          "Складывание", "Выведение пятен"
        ]
      },
      listTitle: "Полный прайс-лист",
      categories: [
        {
          name: "Стирка по весу",
          items: [
            { name: "Стандарт (24 часа)", price: "35k / кг" },
            { name: "Стандарт + Vanish", price: "40k / кг" },
            { name: "Эко (Amway Home)", price: "45k / кг" },
            { name: "Эко (Amway) + Vanish", price: "50k / кг" },
            { name: "Детская стирка", price: "55k / кг" },
            { name: "Экспресс (3-5 часов)", price: "Двойной тариф" },
          ]
        },
        {
          name: "Индивидуальные вещи",
          items: [
            { name: "Ручная стирка / Пятновыводитель", price: "50k / шт" },
            { name: "Куртка", price: "70k / шт" },
            { name: "Пальто", price: "70k / шт" },
            { name: "Жилет", price: "50k / шт" },
            { name: "Обувь", price: "100k / пара" },
            { name: "Сандалии", price: "50k / пара" },
            { name: "Сумка", price: "70k / шт" },
            { name: "Рюкзак", price: "85k / шт" },
            { name: "Шлем", price: "70k / шт" },
            { name: "Шляпа / Кепка", price: "40k / шт" },
            { name: "Вешалка", price: "10k / шт" },
            { name: "Только глажка", price: "10k / шт" },
          ]
        }
      ]
    },
    features: [
      { title: "Эко-средства", desc: "Гипоаллергенно и безопасно", icon: Leaf },
      { title: "Быстрая доставка", desc: "Чистота и свежесть за 24 часа", icon: Clock },
      { title: "Бережный уход", desc: "Деликатный режим для ваших вещей", icon: Droplets },
    ],
    footer: {
      rights: "Все права защищены.",
    },
    gallery: {
      title: "До / После",
      hint: "Листайте в сторону",
    },
  },
};

// --- Reusable Components ---

const FlashlightCard = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative border border-stone-200 bg-white/50 overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

const AnimatedText = ({ text, className = "" }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.02 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const BeamButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group inline-flex w-36 sm:w-44 md:w-48 aspect-square items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-white/80 via-emerald-50/70 to-white/75 backdrop-blur-md text-emerald-950 text-sm font-semibold shadow-lg shadow-emerald-900/10 transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0 px-4 text-center leading-snug select-none"
    >
      <span className="relative flex w-full items-center justify-center gap-2">
        <span className="absolute inset-0 rounded-2xl bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative">{children}</span>
      </span>
    </button>
  );
};

const ToggleCard = ({ src, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(src)}
    className="flex-shrink-0 w-72 h-52 sm:w-80 sm:h-56 lg:w-96 lg:h-64 rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm active:scale-[0.99] transition"
    aria-label="Open image"
  >
    <img src={src} alt="Gallery item" loading="lazy" decoding="async" className="h-full w-full object-cover" />
  </button>
);

function tgShareUrl(text) {
  return `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
}

const HeroImage = ({ telegramLabel }) => {
  const [tagVisible, setTagVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [tagLeaving, setTagLeaving] = useState(false);
  const [tagOpening, setTagOpening] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", handler);
    const t = setTimeout(() => setTagVisible(true), 2000);
    return () => {
      clearTimeout(t);
      mq.removeEventListener?.("change", handler);
    };
  }, []);

  const dropClass = !reduceMotion && tagVisible ? "animate-drop-in" : tagVisible ? "opacity-100" : "opacity-0";
  const swingClass = !reduceMotion && tagVisible ? "animate-swing-dampen" : "";
  const flyOutClass = !reduceMotion && tagLeaving ? "animate-fly-out" : tagLeaving ? "opacity-0" : "";
  const containerAnimClass = tagLeaving ? flyOutClass : dropClass;

  return (
    <div className="relative w-full flex justify-center min-h-[320px] sm:min-h-[360px] -mt-8 sm:mt-0">
      <motion.img
        src={HERO_IMAGE}
        loading="eager"
        decoding="async"
        alt="Green Lab Laundry"
        className="block h-[320px] w-auto max-h-[360px] max-w-[320px] -translate-y-8 sm:-translate-y-10 object-contain md:translate-x-6 lg:translate-x-10"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      <div
        className={`pointer-events-none fixed left-[8%] sm:left-[10%] md:left-[12%] -top-[120px] sm:-top-[88px] ${containerAnimClass}`}
        style={{ zIndex: 120, paddingTop: "0px" }}
        aria-hidden={!tagVisible}
      >
        <div className={`tag-container relative flex flex-col items-center ${swingClass}`}>
          <div className="w-[1.5px] h-[190px] sm:h-[210px] bg-emerald-900/30 shadow-sm origin-top" />
          <div className="absolute top-[190px] sm:top-[210px] -translate-y-1/2">
            <span className="block h-6 w-6 rounded-full border border-stone-300 bg-white shadow-sm" />
          </div>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="group pointer-events-auto relative -mt-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50 focus-visible:ring-offset-2 rounded-xl"
            aria-label={telegramLabel}
            title={telegramLabel}
            onClick={(e) => {
              e.preventDefault();
              if (tagOpening) return;
              setTagOpening(true);
              setTagLeaving(true);
              setTimeout(() => {
                window.open(TELEGRAM_LINK, "_blank", "noopener,noreferrer");
                setTimeout(() => {
                  setTagVisible(false);
                  setTagLeaving(false);
                  setTagOpening(false);
                }, 220);
              }, 220);
            }}
          >
            <div className="relative w-[190px] sm:w-[210px] bg-white rounded-2xl border border-emerald-950/10 shadow-[0_12px_30px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3 sm:gap-4 transition-all duration-250 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_36px_rgba(0,0,0,0.12)] group-active:scale-[0.98]">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border border-stone-200 shadow-inner flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 bg-stone-800 rounded-full opacity-20" />
              </div>

              <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-700">
                <Send size={18} className="ml-0.5 sm:w-5 sm:h-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-stone-900 font-serif text-base sm:text-lg leading-tight flex items-center gap-1">
                  {telegramLabel}
                  <ChevronRight
                    size={14}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"
                  />
                </span>
                <span className="text-stone-500 text-[11px] sm:text-xs font-medium tracking-wide">
                  Takes 30 sec
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes drop-in {
          0% { transform: translateY(-240px); opacity: 0; }
          70% { transform: translateY(0); opacity: 1; }
          85% { transform: translateY(-6px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes swing-dampen {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(5deg); }
          40% { transform: rotate(-3deg); }
          60% { transform: rotate(2deg); }
          80% { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes fly-out {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-240px); opacity: 0; }
        }
        .animate-drop-in { animation: drop-in 520ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-swing-dampen { animation: swing-dampen 1.6s ease-in-out 300ms forwards; }
        .animate-fly-out { animation: fly-out 320ms ease forwards; }
        .tag-container { transform-origin: top center; }
      `}</style>
    </div>
  );
};

// --- Pricing Components ---

const PriceCard = ({ title, price, unit, icon: Icon, colorClass, desc }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-lg ${colorClass}`}>
    <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
            <Icon size={32} className="opacity-90" />
            <div className="text-xs font-bold uppercase tracking-wider opacity-70 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                {desc}
            </div>
        </div>
      <h3 className="text-lg font-medium opacity-90 mb-6 pr-4 leading-snug">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl sm:text-5xl font-bold tracking-tight">{price}</span>
        <span className="text-lg opacity-80 font-medium">{unit}</span>
      </div>
    </div>
    {/* Decorative background circle */}
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
  </div>
);

const PriceListAccordion = ({ title, categories }) => {
    const [openIndex, setOpenIndex] = useState(0); // Open first category by default

    return (
        <div className="mt-8 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                <h3 className="font-bold text-xl text-emerald-950">{title}</h3>
            </div>
            {categories.map((cat, idx) => (
                <div key={idx} className="border-b border-stone-100 last:border-0">
                    <button 
                        onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors text-left"
                    >
                        <span className="font-semibold text-emerald-900">{cat.name}</span>
                        {openIndex === idx ? <ChevronUp size={20} className="text-emerald-500"/> : <ChevronDown size={20} className="text-stone-400"/>}
                    </button>
                    <AnimatePresence>
                        {openIndex === idx && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden bg-white"
                            >
                                <div className="px-6 pb-6 pt-2 grid gap-3 sm:grid-cols-2">
                                    {cat.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-dashed border-stone-100 last:border-0">
                                            <span className="text-stone-600 text-sm font-medium pr-2">{item.name}</span>
                                            <span className="text-emerald-700 font-bold whitespace-nowrap">{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}

// --- Main Page Component ---

export default function GreenLabLanding() {
  const [lang, setLang] = useState("en");
  const t = CONTENT[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const isEn = lang === "en";
  const [chatOpen, setChatOpen] = useState(false);
  const [lightbox, setLightbox] = useState("");
  const galleryRef = useRef(null);
  const handleLang = (next) => {
    if (next === lang) return;
    setLang(next);
  };
  
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const scrollGallery = (dir) => {
    if (!galleryRef.current) return;
    galleryRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  useEffect(() => {
    document.body.style.overflow = chatOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [chatOpen]);

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50" style={{ scaleX }} />

      {/* Header */}
      <header className="fixed top-0 z-40 w-full px-3 sm:px-6 py-3">
        <div className="w-full max-w-6xl mx-auto">
          <nav className="flex w-full flex-wrap md:flex-nowrap items-center justify-between gap-3 rounded-full border border-white/40 bg-white/60 px-3 sm:px-5 py-2.5 backdrop-blur-md shadow-sm lg:max-w-5xl lg:mx-auto">
            <div className="flex items-center gap-3">
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
            </div>

            <div className="flex items-center gap-2 font-bold tracking-tight text-emerald-950">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Leaf size={18} />
              </div>
              <span className="text-sm sm:text-base">Green Lab</span>
            </div>

            <div className="flex items-center gap-3">
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
                  onClick={() => handleLang("en")}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleLang("en");
                  }}
                  type="button"
                  aria-label="Switch to English"
                >
                  ENG
                </button>
                <button
                  className={`relative z-10 flex-1 py-1 text-center transition-colors ${!isEn ? "text-emerald-900" : "text-stone-500"}`}
                  onClick={() => handleLang("ru")}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleLang("ru");
                  }}
                  type="button"
                  aria-label="Switch to Russian"
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
              className="fixed top-0 right-0 z-40 h-full w-44 max-w-[55vw] bg-white shadow-2xl md:hidden flex flex-col rounded-l-3xl border border-stone-100"
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
                    className="h-10 w-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:border-emerald-200 transition-colors"
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="z-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] text-emerald-950 mb-6 tracking-tight">
                <AnimatedText text={t.hero.title} />
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-stone-500 mb-10 leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <BeamButton onClick={() => navigate("/canggu")}>{t.heroButtons.canggu}</BeamButton>
              <BeamButton onClick={() => navigate("/bali")}>{t.heroButtons.bali}</BeamButton>
            </motion.div>
          </div>

          {/* Visual Content */}
          <motion.div
            className="order-1 lg:order-2 perspective-1000"
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <HeroImage telegramLabel={t.hero.telegram} />
          </motion.div>
        </div>
      </section>

      {/* --- NEW PRICING SECTION --- */}
      <section className="py-20 px-6 bg-stone-50" id="pricing">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-3">{t.pricing.title}</h2>
                <p className="text-stone-500">{t.pricing.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Main Price Card 1: Clothes (Blue/Dark in reference -> Emerald Dark here) */}
                <div className="lg:col-span-5">
                    <PriceCard 
                        title={t.pricing.main.clothes.title}
                        price={t.pricing.main.clothes.price}
                        unit={t.pricing.main.clothes.unit}
                        icon={Shirt}
                        desc={t.pricing.main.clothes.desc}
                        colorClass="bg-emerald-900 text-white"
                    />
                </div>

                {/* Info Card: Included (Green in reference -> Lighter Brand Green here) */}
                <div className="lg:col-span-4 flex flex-col justify-center rounded-3xl bg-emerald-600 text-white p-8 shadow-lg relative overflow-hidden">
                     <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-6 opacity-90 uppercase tracking-wide">{t.pricing.included.title}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {t.pricing.included.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-emerald-200 flex-shrink-0" />
                                    <span className="font-medium text-sm sm:text-base">{item}</span>
                                </div>
                            ))}
                        </div>
                     </div>
                     <Leaf className="absolute -bottom-6 -right-6 text-emerald-500/30 w-48 h-48 rotate-12" />
                </div>

                {/* Main Price Card 2: Shoes (Blue/Dark in reference -> Emerald Dark here) */}
                <div className="lg:col-span-3">
                     <PriceCard 
                        title={t.pricing.main.shoes.title}
                        price={t.pricing.main.shoes.price}
                        unit={t.pricing.main.shoes.unit}
                        icon={Footprints}
                        desc={t.pricing.main.shoes.desc}
                        colorClass="bg-emerald-800 text-white"
                    />
                </div>
            </div>

            {/* Accordion for Full Price List */}
            <PriceListAccordion title={t.pricing.listTitle} categories={t.pricing.categories} />
            
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <FlashlightCard className="rounded-2xl p-8 h-full min-h-[220px] flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-emerald-800 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{feature.title}</h3>
                  <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
                </div>
              </FlashlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Before / After Gallery */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-emerald-950">{t.gallery.title}</h2>
              <p className="text-stone-500 text-sm">{t.gallery.hint}</p>
            </div>
          </div>
          <div className="relative -mx-6 md:-mx-4 lg:-mx-12">
            <div
              ref={galleryRef}
              className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar px-6 md:px-4 lg:px-12"
            >
              {GALLERY.map((src, idx) => (
                <div key={idx} className="snap-center">
                  <ToggleCard src={src} onOpen={(s) => setLightbox(s)} />
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center justify-between pointer-events-none absolute inset-y-0 left-0 right-0 px-3">
              <button
                type="button"
                onClick={() => scrollGallery(-1)}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-stone-200 text-stone-600 hover:text-emerald-800 transition"
                aria-label="Scroll left"
              >
                <ArrowRight className="rotate-180" size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollGallery(1)}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-stone-200 text-stone-600 hover:text-emerald-800 transition"
                aria-label="Scroll right"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox("")}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="relative max-w-4xl w-full max-h-[85vh]">
                <img
                  src={lightbox}
                  alt="Gallery preview"
                  className="w-full h-full object-contain rounded-2xl bg-white"
                />
                <button
                  type="button"
                  onClick={() => setLightbox("")}
                  className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white shadow-lg border border-stone-200 text-stone-700 hover:text-emerald-800 transition"
                  aria-label="Close image"
                >
                  <X size={18} className="mx-auto" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Marquee Trusted By */}
      <section className="py-8 bg-stone-100 border-y border-stone-200 overflow-hidden">
        <div className="max-w-6xl mx-auto mb-4 px-6">
          <p className="text-xs font-bold tracking-widest text-stone-400 uppercase text-center">{t.trusted}</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <motion.div
            className="flex gap-16 items-center whitespace-nowrap py-2"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-stone-400 font-bold text-xl opacity-50 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Star size={20} className="fill-stone-300 stroke-none" />
                <span>VILLA BALI {i + 1}</span>
                <span className="mx-8 text-stone-300">|</span>
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-stone-100 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-stone-100 to-transparent z-10" />
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-6">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/60 shadow-lg shadow-emerald-900/5">
          <div
            className="absolute inset-0 bg-[url('/images/serty.png')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/50 to-white/40 backdrop-blur-[0.5px]"
            aria-hidden="true"
          />
          <div className="relative px-6 py-12 sm:px-10 sm:py-16 text-center">
            <motion.span
              className="inline-block px-6 py-2.5 rounded-full border border-emerald-900/10 bg-white/80 text-emerald-800 text-base font-semibold mb-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t.about.title}
            </motion.span>
            <motion.h2
              className="text-2xl md:text-3xl leading-relaxed font-light text-emerald-950"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {t.about.desc}
            </motion.h2>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-stone-200 bg-stone-50 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 text-emerald-900 font-bold text-xl">
          <Leaf size={20} /> Green Lab
        </div>
        <div className="text-stone-400 text-sm">© 2024 Green Lab Laundry. {t.footer.rights}</div>
      </footer>
    </div>
  );
}
