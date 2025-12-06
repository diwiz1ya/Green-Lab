import React, { useEffect, useRef, useState } from "react";
import { X, Bot, User, MapPin, Clock, Check, DollarSign, Shirt, Send, Zap, AlertCircle } from "lucide-react";

// --- КОНФИГУРАЦИЯ ---
const ENDPOINT = "https://script.google.com/macros/s/AKfycbyABVf0rP_or6K3ase1TbjjrkIKqCJx4hqPjylDeKKAf4hNVfX6Wrd1sQC-bh-dLSE/exec";
const MANAGER_PHONE = "6281234567890"; // <--- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ НОМЕР БЕЗ ПЛЮСА

const TEXTS = {
  en: {
    welcome: "Hi! I can place your laundry order. Tap a quick option to begin.",
    attached: "Attached:",
    area_ask: "Choose your area (Canggu/Ubud):",
    service_ask: "Select service type:",
    weight_ask: "Select weight/volume:",
    phone_ask: "Share your phone (WhatsApp) to contact you.",
    phone_error: "Please enter a valid phone number (digits only).",
    time_ask: "Pick a pickup time:",
    address_ask: "Share the address (text or geolocation).",
    notes_ask: "Any notes? (optional)",
    confirm_ask: "Send the request?",
    sending: "Sending request...",
    success: "Got it! We’ll reply soon.",
    error: "Could not send automatically.",
    wa_fallback: "Click here to send via WhatsApp",
    menu_order: "Order laundry",
    menu_prices: "Prices",
    menu_terms: "Timings",
    prices_reply: "Wash & Fold: 15k/kg. Ironing: 10k/kg. Express +50%.",
    terms_reply: "Standard ~24h. Express 6-8h. Pickup/delivery free from 5kg.",
    express_on: "Express on (+50%)",
    express_off: "Express off",
    geo_sent: "Sent location.",
    geo_fail: "Geolocation not supported or denied. Please type address.",
    btn_send: "Send",
    btn_cancel: "Cancel",
    ph_phone: "Eg: +62 812 3456 7890",
    ph_addr: "Enter address or villa...",
    ph_notes: "Gate code, stains...",
    ph_weight: "Approx. weight (e.g., 5 kg)",
    ph_msg: "Message...",
    bot_sub: "Replies instantly"
  },
  ru: {
    welcome: "Привет! Я помогу оформить заказ стирки. Выберите вариант, чтобы начать.",
    attached: "Прикреплено:",
    area_ask: "Выберите район (Чангу/Убуд):",
    service_ask: "Выберите тип услуги:",
    weight_ask: "Выберите вес/объём:",
    phone_ask: "Теперь номер телефона (WhatsApp), чтобы мы связались.",
    phone_error: "Пожалуйста, введите корректный номер (минимум 7 цифр).",
    time_ask: "Выберите время забора:",
    address_ask: "Укажите адрес (текстом или геолокацию).",
    notes_ask: "Пожелания? (по желанию)",
    confirm_ask: "Отправляем заявку?",
    sending: "Отправляю заявку...",
    success: "Приняли! Свяжемся скоро.",
    error: "Не удалось отправить автоматически.",
    wa_fallback: "Нажмите, чтобы отправить в WhatsApp",
    menu_order: "Заказать стирку",
    menu_prices: "Цены",
    menu_terms: "Сроки",
    prices_reply: "Стирка: 15k/кг. Глажка: 10k/кг. Экспресс +50%.",
    terms_reply: "Обычная ~24ч. Экспресс 6-8ч. Забор/доставка бесплатно от 5 кг.",
    express_on: "Экспресс (+50%)",
    express_off: "Экспресс выключен",
    geo_sent: "Отправил геолокацию.",
    geo_fail: "Геолокация недоступна. Введите адрес вручную.",
    btn_send: "Отправить",
    btn_cancel: "Отмена",
    ph_phone: "Например: +62 812 3456 7890",
    ph_addr: "Введите адрес или отель...",
    ph_notes: "Код домофона, пятна...",
    ph_weight: "Примерный вес (например, 5 кг)",
    ph_msg: "Сообщение...",
    bot_sub: "Отвечает быстро"
  }
};

const STEPS_ORDER = ["MENU", "AREA", "SERVICE", "WEIGHT", "PHONE", "TIME", "ADDRESS", "NOTES", "CONFIRM", "DONE"];

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const getProgress = (step) => {
  const idx = STEPS_ORDER.indexOf(step);
  return idx === -1 ? 0 : Math.round(((idx) / (STEPS_ORDER.length - 1)) * 100);
};

// Генерация умных слотов времени
const getSmartTimeSlots = (isEn) => {
  const now = new Date();
  const hour = now.getHours();
  const slots = [];

  const todayLabel = isEn ? "Today" : "Сегодня";
  const tmrwLabel = isEn ? "Tomorrow" : "Завтра";

  // Слоты сегодня (показываем только будущие)
  if (hour < 12) slots.push(`${todayLabel} 12:00-14:00`);
  if (hour < 14) slots.push(`${todayLabel} 14:00-16:00`);
  if (hour < 16) slots.push(`${todayLabel} 16:00-18:00`);
  
  // Слоты завтра (всегда)
  slots.push(`${tmrwLabel} 10:00-12:00`);
  slots.push(`${tmrwLabel} 12:00-14:00`);

  return slots.slice(0, 4); // Берем первые 4 доступных
};

// --- КОМПОНЕНТЫ ---
const ChatBubble = ({ sender, time, children, isError }) => {
  const isBot = sender === "bot";
  return (
    <div className={`flex w-full mb-4 ${isBot ? "justify-start" : "justify-end"}`}>
      <div className={`flex max-w-[85%] ${isBot ? "flex-row" : "flex-row-reverse"} gap-2`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isBot ? (isError ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700") : "bg-gray-200 text-gray-600"
          }`}
        >
          {isBot ? (isError ? <AlertCircle size={18} /> : <Bot size={18} />) : <User size={18} />}
        </div>
        <div className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}>
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-line leading-relaxed ${
              isBot
                ? `bg-white border ${isError ? "border-red-200 text-red-800" : "border-emerald-50 text-emerald-950"} rounded-tl-none`
                : "bg-emerald-700 text-white rounded-tr-none"
            }`}
          >
            {children}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 px-1">{time}</span>
        </div>
      </div>
    </div>
  );
};

const QuickReply = ({ label, onClick, icon: Icon, isSecondary }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-emerald-100 active:scale-95 transition-all border whitespace-nowrap ${
      isSecondary 
        ? "bg-white text-gray-600 border-gray-200" 
        : "bg-emerald-50 text-emerald-800 border-emerald-200"
    }`}
  >
    {Icon && <Icon size={12} />}
    {label}
  </button>
);

export default function OrderLaundryChatModal({ open, onClose, isEn = true }) {
  const t = isEn ? TEXTS.en : TEXTS.ru;
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("INIT");
  const [orderData, setOrderData] = useState({ files: [], express: false });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper to add message
  const addMessage = (text, sender = "bot", isError = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        sender,
        isError,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Init
  useEffect(() => {
    if (open) {
      // Можно добавить логику загрузки из localStorage здесь
      setMessages([]);
      setStep("MENU");
      setTimeout(() => {
        addMessage(t.welcome);
      }, 50);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open, isEn]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return undefined;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []).map((f) => ({ name: f.name, size: f.size }));
    if (!files.length) return;
    setOrderData((prev) => ({ ...prev, files: [...(prev.files || []), ...files] }));
    addMessage(`${t.attached} ${files.map((f) => f.name).join(", ")}`, "user");
    e.target.value = "";
  };

  const getSummaryText = (notesText) => {
    const svc = orderData.service || (isEn ? "Standard" : "Стандарт");
    const weight = orderData.weight || "—";
    const area = orderData.area || "—";
    const expressLabel = orderData.express ? (isEn ? "(Express)" : "(Экспресс)") : "";
    
    return isEn
      ? `Check details:\n📍 Area: ${area}\n🧺 Service: ${svc} ${expressLabel}\n⚖️ Weight: ${weight}\n📞 ${orderData.phone}\n⏰ ${orderData.slot}\n🏠 ${orderData.address}\n📝 ${notesText || "None"}`
      : `Проверьте данные:\n📍 Район: ${area}\n🧺 Услуга: ${svc} ${expressLabel}\n⚖️ Вес: ${weight}\n📞 ${orderData.phone}\n⏰ ${orderData.slot}\n🏠 ${orderData.address}\n📝 ${notesText || "Нет"}`;
  };

  const submitLead = async (notesText) => {
    const finalNotes = notesText || orderData.notes || "";
    const payload = {
      lang: isEn ? "en" : "ru",
      area: orderData.area,
      service: orderData.service,
      weight: orderData.weight,
      express: !!orderData.express,
      phone: orderData.phone,
      slot: orderData.slot,
      address: orderData.address,
      notes: finalNotes,
      timestamp: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      addMessage(t.success, "bot");
      setStep("DONE");
    } catch (e) {
      // Fallback to WhatsApp logic
      const text = encodeURIComponent(`New Order:\n${getSummaryText(finalNotes)}`);
      const waLink = `https://wa.me/${MANAGER_PHONE}?text=${text}`;
      
      addMessage(t.error, "bot", true);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: <a href={waLink} target="_blank" rel="noreferrer" className="underline font-bold">{t.wa_fallback}</a>,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
      setStep("DONE");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSend = (text = inputText) => {
    if (!text.trim() || submitting) return;
    const msg = text.trim();
    addMessage(msg, "user");
    setInputText("");

    // --- State Machine ---
    if (step === "AREA") {
      setOrderData((prev) => ({ ...prev, area: msg }));
      addMessage(t.service_ask);
      setStep("SERVICE");
    } else if (step === "SERVICE") {
      setOrderData((prev) => ({ ...prev, service: msg }));
      addMessage(t.weight_ask);
      setStep("WEIGHT");
    } else if (step === "WEIGHT") {
      setOrderData((prev) => ({ ...prev, weight: msg }));
      addMessage(t.phone_ask);
      setStep("PHONE");
    } else if (step === "PHONE") {
      // VALIDATION
      const cleanPhone = msg.replace(/\D/g, "");
      if (cleanPhone.length < 7) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(t.phone_error, "bot", true);
        }, 600);
        return; // Stay on same step
      }
      setOrderData((prev) => ({ ...prev, phone: msg }));
      addMessage(t.time_ask);
      setStep("TIME");
    } else if (step === "ADDRESS") {
      setOrderData((prev) => ({ ...prev, address: msg }));
      addMessage(t.notes_ask);
      setStep("NOTES");
    } else if (step === "NOTES") {
      setOrderData((prev) => ({ ...prev, notes: msg }));
      addMessage(getSummaryText(msg));
      setTimeout(() => addMessage(t.confirm_ask), 400);
      setStep("CONFIRM");
    } else {
      // Fallback for unexpected text
      addMessage(t.bot_sub, "bot");
    }
  };

  const handleGeo = () => {
    if (!navigator.geolocation) {
      addMessage(t.geo_fail, "bot", true);
      return;
    }
    setIsTyping(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsTyping(false);
        const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setOrderData((prev) => ({ ...prev, address: link }));
        addMessage(t.geo_sent, "user");
        addMessage(t.notes_ask);
        setStep("NOTES");
      },
      () => {
        setIsTyping(false);
        addMessage(t.geo_fail, "bot", true);
      }
    );
  };

  const handleQuick = (action, value) => {
    if (submitting) return;

    // Navigation Logic
    const actions = {
      "MENU_ORDER": () => {
        addMessage(t.menu_order, "user");
        addMessage(t.area_ask);
        setStep("AREA");
      },
      "MENU_PRICES": () => {
        addMessage(t.menu_prices, "user");
        addMessage(t.prices_reply);
      },
      "MENU_TERMS": () => {
        addMessage(t.menu_terms, "user");
        addMessage(t.terms_reply);
      },
      "SET_AREA": () => {
        setOrderData(prev => ({ ...prev, area: value }));
        addMessage(value, "user");
        addMessage(t.service_ask);
        setStep("SERVICE");
      },
      "SET_SERVICE": () => {
        setOrderData(prev => ({ ...prev, service: value }));
        addMessage(value, "user");
        addMessage(t.weight_ask);
        setStep("WEIGHT");
      },
      "SET_WEIGHT": () => {
        setOrderData(prev => ({ ...prev, weight: value }));
        addMessage(value, "user");
        addMessage(t.phone_ask);
        setStep("PHONE");
      },
      "TOGGLE_EXPRESS": () => {
        setOrderData(prev => {
          const next = !prev.express;
          addMessage(next ? t.express_on : t.express_off, "user");
          return { ...prev, express: next };
        });
      },
      "SELECT_TIME": () => {
        setOrderData(prev => ({ ...prev, slot: value }));
        addMessage(value, "user");
        addMessage(t.address_ask);
        setStep("ADDRESS");
      },
      "SEND_GEO": handleGeo,
      "CONFIRM_YES": () => {
        addMessage(t.sending, "user");
        submitLead(orderData.notes);
      },
      "CONFIRM_NO": () => {
        addMessage(t.btn_cancel, "user");
        setStep("MENU");
        setOrderData({ files: [], express: false }); // Reset
        addMessage(t.welcome);
      }
    };

    if (actions[action]) actions[action]();
  };

  const getPlaceholder = () => {
    switch (step) {
      case "PHONE": return t.ph_phone;
      case "ADDRESS": return t.ph_addr;
      case "NOTES": return t.ph_notes;
      case "WEIGHT": return t.ph_weight;
      default: return t.ph_msg;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:py-8">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="bg-white/98 w-full max-w-md h-[85vh] sm:h-[600px] sm:max-h-[88vh] sm:rounded-[28px] shadow-[0_30px_120px_-40px_rgba(16,185,129,0.35)] relative flex flex-col animate-modal-pop overflow-hidden border border-emerald-100">
        
        {/* Header */}
        <div className="flex flex-col border-b border-emerald-50 bg-white/95 backdrop-blur z-10 sm:rounded-t-[28px]">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Bot size={24} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 leading-tight">Green Lab bot</h2>
                <p className="text-xs text-emerald-600 font-medium">{t.bot_sub}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-emerald-50 rounded-full hover:text-red-500 transition-colors"
              type="button"
            >
              <X size={24} />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="h-1 w-full bg-emerald-50">
             <div 
               className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
               style={{ width: `${getProgress(step)}%` }} 
             />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-emerald-50/60 via-white to-white custom-scrollbar scroll-smooth">
          <div className="text-center text-xs text-gray-400 my-4 uppercase tracking-widest font-semibold">
            {isEn ? "Today" : "Сегодня"}
          </div>
          
          {messages.map((msg) => (
            <ChatBubble key={msg.id} sender={msg.sender} time={msg.time} isError={msg.isError}>
              {msg.text}
            </ChatBubble>
          ))}
          
          {isTyping && (
            <div className="flex w-full mb-4 justify-start">
              <div className="flex items-center gap-2 ml-10">
                <div className="bg-emerald-50 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-emerald-50 pb-safe sm:rounded-b-[28px]">
          {/* Quick Replies */}
          <div className="flex gap-2 overflow-x-auto pb-2 px-4 pt-3 custom-scrollbar">
             {step === "MENU" && (
                <>
                  <QuickReply icon={Shirt} label={t.menu_order} onClick={() => handleQuick("MENU_ORDER")} />
                  <QuickReply icon={DollarSign} label={t.menu_prices} onClick={() => handleQuick("MENU_PRICES")} isSecondary />
                  <QuickReply icon={Clock} label={t.menu_terms} onClick={() => handleQuick("MENU_TERMS")} isSecondary />
                </>
             )}
             {step === "AREA" && (
                <>
                  <QuickReply icon={MapPin} label="Canggu" onClick={() => handleQuick("SET_AREA", "Canggu")} />
                  <QuickReply icon={MapPin} label="Ubud" onClick={() => handleQuick("SET_AREA", "Ubud")} />
                </>
             )}
             {step === "SERVICE" && (
                ["Standard", "Hand wash", "Shoes"].map(s => (
                  <QuickReply key={s} label={s} onClick={() => handleQuick("SET_SERVICE", s)} />
                ))
             )}
             {step === "WEIGHT" && (
                <>
                  {["3-5 kg", "5-10 kg", ">10 kg"].map(w => (
                     <QuickReply key={w} label={w} onClick={() => handleQuick("SET_WEIGHT", w)} />
                  ))}
                  <QuickReply icon={Zap} label={orderData.express ? t.express_off : t.express_on} onClick={() => handleQuick("TOGGLE_EXPRESS")} isSecondary={!orderData.express} />
                </>
             )}
             {step === "TIME" && getSmartTimeSlots(isEn).map(slot => (
                <QuickReply key={slot} label={slot} onClick={() => handleQuick("SELECT_TIME", slot)} />
             ))}
             {step === "ADDRESS" && (
                <QuickReply icon={MapPin} label={isEn ? "Send my location" : "Отправить геопозицию"} onClick={() => handleQuick("SEND_GEO")} />
             )}
             {step === "CONFIRM" && (
                <>
                  <QuickReply icon={Check} label={t.btn_send} onClick={() => handleQuick("CONFIRM_YES")} />
                  <QuickReply icon={X} label={t.btn_cancel} onClick={() => handleQuick("CONFIRM_NO")} isSecondary />
                </>
             )}
          </div>

          {/* Files Preview */}
          {orderData.files?.length > 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 text-xs text-emerald-900">
              {orderData.files.map((f, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1">
                  📎 {f.name}
                </span>
              ))}
            </div>
          )}

          {/* Text Input */}
          <div className="p-3 pt-1 flex items-end gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition-colors"
            >
              📎
            </button>
            <div className="flex-1 bg-emerald-50 rounded-2xl flex items-center px-4 py-2 border border-transparent focus-within:border-emerald-300 focus-within:bg-white transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={getPlaceholder()}
                disabled={step === "DONE" || isTyping || submitting}
                className="w-full bg-transparent outline-none text-base py-1 max-h-24"
                autoComplete="off"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping || submitting}
              className="w-11 h-11 bg-emerald-700 text-white rounded-full flex items-center justify-center hover:bg-emerald-800 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-md flex-shrink-0"
              type="button"
            >
              <Send size={20} className={inputText.trim() ? "ml-0.5" : ""} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-pop {
          from { transform: translateY(20px) scale(0.94); opacity: 0; filter: blur(4px); }
          to { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); }
        }
        .animate-modal-pop { animation: modal-pop 0.32s cubic-bezier(0.18, 0.89, 0.35, 1); }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; height: 0px; }
      `}</style>
    </div>
  );
}