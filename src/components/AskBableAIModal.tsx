import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import livePricesData from '../data/livePrices.json';

interface AskBableAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: (category?: string, product?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    action: () => void;
  };
}

export const AskBableAIModal: React.FC<AskBableAIModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Namaste! I'm Bable AI, your 24/7 industrial procurement specialist. Ask me about live commodity benchmark prices, mill specifications, freight estimates, or working capital credit lines.",
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "Today's TMT Bar price in Delhi?",
    "How does 60-day credit work?",
    "Specs for US Gulf Petcoke?",
    "Bitumen VG30 bulk tanker rates?",
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // AI Response Generation based on knowledge base
    setTimeout(() => {
      let replyText = '';
      let actionLabel = '';
      let actionFn = () => {};

      const lower = userText.toLowerCase();

      if (lower.includes('tmt') || lower.includes('steel')) {
        const tmt = livePricesData.prices.find((p) => p.id === 'tmt-bar');
        replyText = `Today's Fe 550D TMT Bar benchmark is ${tmt?.price || '₹54,500'}/MT EX-Delhi NCR (+0.83% day change). All supplies carry ISI 1786 and factory MTR test certificates with traceable heat numbers. Would you like a delivered FOR quote for your pin code?`;
        actionLabel = 'Get TMT Bar Quote';
        actionFn = () => {
          onClose();
          onOpenQuote('Metals', 'Long Steel');
        };
      } else if (lower.includes('credit') || lower.includes('financing') || lower.includes('capital')) {
        replyText = `Bable Smart Financing provides unsecured trade credit lines up to ₹10 Crore with 30, 60, or 90-day tenors. Interest is calculated strictly per day of utilization (typical rates 0.8% - 1.2% per month) with 0% advance payment on dispatch.`;
        actionLabel = 'Check Credit Eligibility';
        actionFn = () => {
          onClose();
          onOpenQuote();
        };
      } else if (lower.includes('petcoke') || lower.includes('coal') || lower.includes('energy')) {
        replyText = `Our imported US Gulf Petcoke features GCV >8200 kcal/kg with 0.5% - 4.5% sulfur options discharged at Kandla & Mundra ports. We also stock Indonesian Thermal Coal (3800 - 5800 GAR) ready for bulk rake loading.`;
        actionLabel = 'Get Energy & Minerals Quote';
        actionFn = () => {
          onClose();
          onOpenQuote('Energy & Minerals', 'Petcoke');
        };
      } else if (lower.includes('bitumen') || lower.includes('chemical') || lower.includes('methanol')) {
        replyText = `Bitumen VG-30 is quoted at ₹155/KG EX-Delhi in sealed packed drums, also available in bulk insulated tanker loads directly from refinery terminals complying with IS 73:2013 standards.`;
        actionLabel = 'Get Chemicals Quote';
        actionFn = () => {
          onClose();
          onOpenQuote('Chemicals', 'Bitumen');
        };
      } else {
        replyText = `Thank you for your inquiry regarding "${userText}". Bable Minerals and Energy connects over 15,000 buyers to 8,000+ mills and refineries with real-time transparent spot pricing and multimodal logistics. You can submit an RFQ or request an immediate call back from our trading desk.`;
        actionLabel = 'Request Custom RFQ';
        actionFn = () => {
          onClose();
          onOpenQuote();
        };
      }

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: actionLabel ? { label: actionLabel, action: actionFn } : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="pointer-events-auto w-full sm:w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] sm:h-[620px] max-h-[90vh] z-50 animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="brand-gradient text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center p-1.5 backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Bable AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs text-teal-100 font-medium">Commodity Trading & Specs Specialist</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[88%]">
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs shrink-0 mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional embedded button */}
                  {msg.suggestedAction && (
                    <button
                      type="button"
                      onClick={msg.suggestedAction.action}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-bold text-xs transition"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0 mb-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-white rounded-2xl w-fit border border-slate-200">
              <Bot className="w-4 h-4 text-teal-500 animate-spin" />
              <span>Analyzing market index & specification database...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-200/70"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about prices, freight, specs..."
              className="flex-1 py-2 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-10 h-10 rounded-full brand-gradient text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-95 transition shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            AI quotes are indicative. Connect with desk for contract lock-in.
          </p>
        </div>

      </div>
    </div>
  );
};
