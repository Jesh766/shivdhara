import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  User,
  PhoneCall,
  Minimize2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { useToast } from '../../context/ToastContext';
import { trackSearchQuery } from '../../lib/analytics';
import { SHIV_DHARA_LOGO } from '../../lib/assets';

interface DharaChatbotProps {
  currentPage?: string;
  onOpenConsultation: () => void;
  onNavigate: (path: string) => void;
}

const quickChips = [
  'Explore Numerology',
  'Explore Vastu',
  'Meditation Sanctuary',
  'Upcoming Workshops',
  'Shop Bracelets',
  'Book Consultation',
  'Talk to the Team',
];

export const DharaChatbot: React.FC<DharaChatbotProps> = ({
  currentPage = '/',
  onOpenConsultation,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Namaste. I am Dhara, your trusted intelligence guide at SHIV DHARA by Falgun Thakkr.\n\nI can assist you with personal numerology calculations, spatial Vastu audits, breath meditation practices, masterclass seats, or connect you directly with Falgun Thakkr.\n\nHow may I illuminate your journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Human Handoff Modal State
  const [showHumanModal, setShowHumanModal] = useState(false);
  const [humanName, setHumanName] = useState('');
  const [humanPhone, setHumanPhone] = useState('');
  const [humanEmail, setHumanEmail] = useState('');
  const [humanReason, setHumanReason] = useState('');
  const [humanSubmitting, setHumanSubmitting] = useState(false);
  const [humanSubmitted, setHumanSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Handle user submit
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    trackSearchQuery(text, 'ai_concierge');

    const lower = text.toLowerCase();
    const wantsHuman = [
      'talk to a human',
      'speak to someone',
      'talk to your team',
      'connect me with falgun',
      'call me',
      'talk to a real person',
      'talk to the team',
      'real person',
      'human',
    ].some((w) => lower.includes(w));

    if (wantsHuman) {
      setShowHumanModal(true);
    }

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: history,
          currentPage,
          customerDetails: humanName ? { name: humanName, phone: humanPhone, email: humanEmail } : undefined,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Namaste. How else may I assist you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isToolCall: data.toolCalls && data.toolCalls.length > 0,
        toolName: data.toolCalls?.[0],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          'Namaste. I am currently connecting with Falgun Thakkr’s sanctuary archives. You may also click "Book Consultation" or message our team directly on WhatsApp (+91 6359666315).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit human handoff request
  const handleHumanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanName.trim() || (!humanPhone.trim() && !humanEmail.trim())) {
      showToast('Required Details', 'Please provide your name and phone or email.', 'error');
      return;
    }

    setHumanSubmitting(true);
    try {
      const lastContext = messages
        .slice(-4)
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');

      const response = await fetch('/api/human-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: humanName.trim(),
          phone: humanPhone.trim(),
          email: humanEmail.trim(),
          reason: humanReason.trim() || 'Requested human callback from Dhara AI',
          currentPage,
          conversationSummary: lastContext || 'Customer requested direct callback.',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setHumanSubmitted(true);
        showToast('Request Shared', 'Falgun Thakkr & team have received your request.', 'success');

        const confirmMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `Thank you, ${humanName}. Your request has been shared with Falgun Thakkr and our senior advisory team. We will reach out to you at ${humanPhone || humanEmail} promptly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, confirmMsg]);
      } else {
        showToast('Request Error', data.error || 'Failed to send request.', 'error');
      }
    } catch {
      showToast('Connection Error', 'Could not record request.', 'error');
    } finally {
      setHumanSubmitting(false);
    }
  };

  const handleChipClick = (chip: string) => {
    if (chip === 'Book Consultation') {
      onOpenConsultation();
      return;
    }
    if (chip === 'Talk to the Team') {
      setShowHumanModal(true);
      return;
    }
    if (chip === 'Explore Numerology') {
      onNavigate('/numerology');
      handleSendMessage('Can you explain how Numerology works at Shiv Dhara?');
      return;
    }
    if (chip === 'Explore Vastu') {
      onNavigate('/vastu');
      handleSendMessage('What is non-destructive Vastu alignment?');
      return;
    }
    if (chip === 'Meditation Sanctuary') {
      onNavigate('/meditation');
      handleSendMessage('How does Shiv Dhara meditation work?');
      return;
    }
    if (chip === 'Upcoming Workshops') {
      onNavigate('/workshops');
      handleSendMessage('Which live workshops are currently scheduled?');
      return;
    }
    if (chip === 'Shop Bracelets') {
      onNavigate('/products');
      handleSendMessage('Can you help me choose a numerology gemstone bracelet?');
      return;
    }

    handleSendMessage(chip);
  };

  return (
    <>
      {/* Floating Collapsed Assistant Button */}
      {!isOpen && (
        <div id="dhara-chat-trigger" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Subtle speech teaser */}
          {hasUnread && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="bg-[#0E2623] text-[#FAF4EA] text-xs font-medium py-3 px-4.5 rounded-2xl shadow-2xl border border-[#E6B55A]/50 max-w-[240px] hidden sm:block relative cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setIsOpen(true);
                setHasUnread(false);
              }}
            >
              <div className="flex items-center gap-1.5 text-[#E6B55A] font-serif font-bold text-xs mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DHARA AI Concierge</span>
              </div>
              <p className="text-[11px] text-[#E6D5B8]/90 leading-tight font-sans">
                Namaste. Ask any question on Numerology, Vastu, or Bookings.
              </p>
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0E2623] border-t border-r border-[#E6B55A]/50 transform rotate-45" />
            </motion.div>
          )}

          {/* Luxury Floating Avatar Button */}
          <button
            onClick={() => {
              setIsOpen(true);
              setHasUnread(false);
            }}
            className="relative w-15 h-15 rounded-full bg-gradient-to-tr from-[#0E2623] to-[#163A36] text-[#FAF4EA] border-2 border-[#E6B55A] shadow-2xl flex items-center justify-center group hover:scale-110 transition-all duration-300 cursor-pointer"
            aria-label="Open Dhara AI Assistant"
          >
            <div className="absolute -inset-1 rounded-full border border-[#E6B55A]/40 animate-pulse pointer-events-none" />
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-[#E6B55A] group-hover:rotate-12 transition-transform" />
            </div>

            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0E2623] rounded-full shadow-sm" />
          </button>
        </div>
      )}

      {/* Expanded Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="dhara-chat-window"
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className={`fixed bottom-6 right-6 z-50 bg-[#FAF6EE] text-[#163A36] rounded-[2rem] shadow-2xl border border-[#E6D5B8] flex flex-col overflow-hidden transition-all ${
              isMinimized
                ? 'w-80 h-16'
                : 'w-[94vw] sm:w-[430px] h-[600px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0E2623] via-[#163A36] to-[#0E2623] text-[#F7F1E6] px-5 py-4 flex items-center justify-between border-b border-[#E6B55A]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-[#E6B55A] flex items-center justify-center shadow-md">
                    <img src={SHIV_DHARA_LOGO} alt="DHARA" className="h-full w-full object-contain" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0E2623] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-serif font-bold tracking-wider text-[#F7F1E6]">
                      DHARA
                    </h3>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#E6B55A] text-[#0E2623]">
                      Dhara AI
                    </span>
                  </div>
                  <p className="text-[10px] text-[#E6D5B8]/80 font-sans">
                    SHIV DHARA • By Falgun Thakkr
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#E6D5B8]/80">
                <button
                  onClick={() => setShowHumanModal(true)}
                  className="px-2.5 py-1 hover:text-white hover:bg-white/10 rounded-xl transition-all text-xs flex items-center gap-1 mr-1 cursor-pointer border border-white/10"
                  title="Request Human Handoff / Talk to Team"
                >
                  <PhoneCall className="w-3 h-3 text-[#E6B55A]" />
                  <span className="text-[10px] font-bold">Team Callback</span>
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <>
                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-5 space-y-4 bg-[#FAF6EE]"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-xl bg-[#163A36] text-[#E6B55A] border border-[#E6B55A]/50 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[84%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-sm font-sans ${
                          msg.role === 'user'
                            ? 'bg-[#163A36] text-[#F7F1E6] rounded-tr-none'
                            : 'bg-white text-[#163A36] border border-[#E6D5B8] rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.content}</div>

                        {msg.isToolCall && (
                          <div className="mt-2 pt-2 border-t border-[#E6D5B8] flex items-center gap-1.5 text-[10px] text-[#C56A45] font-mono">
                            <Sparkles className="w-3 h-3" />
                            <span>Sanctuary Intelligence</span>
                          </div>
                        )}

                        <span
                          className={`block text-[9px] mt-1 text-right font-mono ${
                            msg.role === 'user' ? 'text-[#E6D5B8]/60' : 'text-gray-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#C56A45] to-[#E6B55A] text-[#0E2623] flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-bold text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2.5 items-center">
                      <div className="w-7 h-7 rounded-xl bg-[#163A36] text-[#E6B55A] border border-[#E6B55A]/50 flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      </div>
                      <div className="bg-white border border-[#E6D5B8] rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C56A45] animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C56A45] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C56A45] animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[11px] text-[#163A36] font-medium font-sans">Dhara is reflecting...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="px-4 py-2.5 bg-white border-t border-[#E6D5B8] overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#163A36] text-[#163A36] hover:text-[#F7F1E6] border border-[#E6D5B8] text-[11px] font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer hover:scale-105"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-[#E6D5B8] shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Ask Dhara about Numerology, Vastu, or Bookings..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E6D5B8] text-xs sm:text-sm text-[#163A36] focus:outline-none focus:border-[#C56A45] focus:ring-2 focus:ring-[#C56A45]/20 shadow-inner transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="p-3 rounded-2xl bg-[#163A36] hover:bg-[#0E2623] text-[#E6B55A] disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Human Handoff Request Modal */}
      <AnimatePresence>
        {showHumanModal && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF6EE] text-[#163A36] w-full max-w-md rounded-[2.5rem] p-7 shadow-2xl border border-[#E6D5B8] relative space-y-5"
            >
              <button
                onClick={() => {
                  setShowHumanModal(false);
                  setHumanSubmitted(false);
                }}
                className="absolute right-5 top-5 p-2 rounded-full bg-white text-gray-500 hover:text-black border border-[#E6D5B8] cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#163A36] text-[#E6B55A] flex items-center justify-center mx-auto shadow-md border border-[#E6B55A]/50">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#163A36]">
                  Connect with Falgun Thakkr & Team
                </h3>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  Leave your contact details and our senior advisory coordinators will reach out to you directly via WhatsApp/Call.
                </p>
              </div>

              {humanSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-gray-900">Request Transmitted Successfully!</p>
                  <button
                    onClick={() => {
                      setShowHumanModal(false);
                      setHumanSubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#163A36] text-[#F7F1E6] text-xs font-bold uppercase"
                  >
                    Return to Chat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleHumanSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-[#163A36] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jayshil Thakkar"
                      value={humanName}
                      onChange={(e) => setHumanName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-[#163A36] mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={humanPhone}
                      onChange={(e) => setHumanPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-[#163A36] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@example.com"
                      value={humanEmail}
                      onChange={(e) => setHumanEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-[#163A36] mb-1">
                      Inquiry Subject / Topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Personal Numerology or Vastu Audit"
                      value={humanReason}
                      onChange={(e) => setHumanReason(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={humanSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C56A45] to-[#E6B55A] text-[#0E2623] text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all cursor-pointer mt-2"
                  >
                    {humanSubmitting ? 'Transmitting Request...' : 'Send Callback Request'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};