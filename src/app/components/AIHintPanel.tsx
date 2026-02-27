import { useState, useRef, useEffect } from "react";
import {
  X,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Loader2,
  Volume2,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const INITIAL_HINTS: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "I can see you're working on **integration problems**. I notice you have a question mark on Problem 1 — let me help! 🔍",
    timestamp: new Date(),
  },
];

const HINT_SEQUENCES: Message[][] = [
  [
    {
      id: "h1",
      role: "assistant",
      content: "For **∫(3x² + 2x - 1)dx**, you're missing the integral of the last term. The Power Rule says: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. What's the integral of -1 dx?",
      timestamp: new Date(),
    },
  ],
  [
    {
      id: "h2",
      role: "assistant",
      content: "Exactly! ∫1 dx = x. So your full answer should be:\n\n**x³ + x² - x + C** ✅\n\nDon't forget the constant of integration C!",
      timestamp: new Date(),
    },
  ],
  [
    {
      id: "h3",
      role: "assistant",
      content: "For **Problem 2** (the definite integral), you're on the right track! After evaluating [x³/3 + x]₀²:\n\n• At x=2: 8/3 + 2 = 8/3 + 6/3 = **14/3**\n• At x=0: 0\n\nSo the answer is **14/3 ≈ 4.67** 🎯",
      timestamp: new Date(),
    },
  ],
];

const VOICE_RESPONSES: Record<string, string> = {
  default: "Great question! The key insight here is that integration is the reverse of differentiation. Think about what function, when differentiated, would give you the integrand. Would you like me to walk through it step by step?",
  steps: "Sure! Let me break it down:\n\n**Step 1:** Apply the Power Rule to each term separately.\n**Step 2:** For 3x², integrate to get 3·(x³/3) = x³\n**Step 3:** For 2x, integrate to get 2·(x²/2) = x²\n**Step 4:** For -1, remember ∫1dx = x, so -∫1dx = -x\n**Step 5:** Add the constant C\n\nFinal: **x³ + x² - x + C** ✅",
  hint: "Think about using the Power Rule! For any term axⁿ, the integral is a·xⁿ⁺¹/(n+1). Apply this to each term one at a time.",
};

interface AIHintPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIHintPanel({ isOpen, onClose }: AIHintPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [hintIndex, setHintIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [voiceText, setVoiceText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setIsAnalyzing(true);
      setHintIndex(0);

      // Simulate analyzing phase
      const analyzeTimer = setTimeout(() => {
        setIsAnalyzing(false);
        setMessages(INITIAL_HINTS);

        // Then add first hint
        setTimeout(() => {
          addHint(0);
        }, 800);
      }, 2200);

      return () => clearTimeout(analyzeTimer);
    }
  }, [isOpen]);

  const addHint = (idx: number) => {
    if (idx < HINT_SEQUENCES.length) {
      HINT_SEQUENCES[idx].forEach((msg, i) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { ...msg, id: `hint-${Date.now()}-${i}` }]);
        }, i * 300);
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);

      const lower = text.toLowerCase();
      let responseContent = VOICE_RESPONSES.default;
      if (lower.includes("step") || lower.includes("break") || lower.includes("how")) {
        responseContent = VOICE_RESPONSES.steps;
      } else if (lower.includes("hint") || lower.includes("clue") || lower.includes("help")) {
        responseContent = VOICE_RESPONSES.hint;
      } else if (hintIndex < HINT_SEQUENCES.length) {
        addHint(hintIndex);
        setHintIndex((i) => i + 1);
        return;
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1400);
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceText("");
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
      if (pulseTimerRef.current) clearInterval(pulseTimerRef.current);
    } else {
      setIsListening(true);
      const phrases = [
        "Can you show me the steps...",
        "How do I solve the integral...",
        "What's the power rule again...",
        "Help me with problem two...",
      ];
      let charIdx = 0;
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      setVoiceText("");

      const typeInterval = setInterval(() => {
        if (charIdx < phrase.length) {
          setVoiceText(phrase.slice(0, charIdx + 1));
          charIdx++;
        } else {
          clearInterval(typeInterval);
          voiceTimerRef.current = setTimeout(() => {
            setIsListening(false);
            sendMessage(phrase);
            setVoiceText("");
          }, 800);
        }
      }, 50);
    }
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < content.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="absolute bottom-6 right-5 z-50"
          style={{ width: 340 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15), 0 4px 20px rgba(0,0,0,0.1)" }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles size={16} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm" style={{ fontFamily: "Inter" }}>
                  AI Hint Assistant
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <p className="text-white/70 text-xs" style={{ fontFamily: "Inter" }}>
                    {isAnalyzing ? "Analyzing your notes..." : "Active"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isExpanded ? <ChevronDown size={14} color="white" /> : <ChevronUp size={14} color="white" />}
                </button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={14} color="white" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {/* Analyzing overlay */}
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10 px-6 gap-4"
                      >
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                            <Sparkles size={24} color="white" />
                          </div>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-2 rounded-3xl border-2 border-[#6366F1]/30 border-t-[#6366F1]"
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-[#1C1C1E]" style={{ fontFamily: "Inter" }}>
                            Analyzing your handwriting...
                          </p>
                          <p className="text-xs text-[#8E8E93] mt-1" style={{ fontFamily: "Inter" }}>
                            Identifying problems & concepts
                          </p>
                        </div>
                        {/* Scanning bars */}
                        <div className="w-full space-y-2">
                          {["Reading problem structure", "Identifying equations", "Generating hints"].map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: "0%" }}
                                  animate={{ width: i === 0 ? "100%" : i === 1 ? "75%" : "40%" }}
                                  transition={{ delay: i * 0.3, duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full"
                                />
                              </div>
                              <span className="text-[10px] text-[#8E8E93] w-20 text-right" style={{ fontFamily: "Inter" }}>
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages */}
                  {!isAnalyzing && (
                    <>
                      <div className="h-64 overflow-y-auto px-3 py-3 space-y-3">
                        <AnimatePresence mode="popLayout">
                          {messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.25 }}
                              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                              {/* Avatar */}
                              {msg.role === "assistant" ? (
                                <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Sparkles size={11} color="white" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-xl bg-[#E5E5EA] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <User size={11} className="text-[#6B7280]" />
                                </div>
                              )}

                              <div className={`flex-1 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                                <div
                                  className={`rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-[90%] ${
                                    msg.role === "assistant"
                                      ? "bg-[#F2F2F7] text-[#1C1C1E] rounded-tl-sm"
                                      : "bg-[#6366F1] text-white rounded-tr-sm"
                                  }`}
                                  style={{ fontFamily: "Inter" }}
                                >
                                  {formatContent(msg.content)}
                                </div>
                                {msg.role === "assistant" && (
                                  <div className="flex items-center gap-1 mt-1 ml-1">
                                    <button className="text-[#D1D1D6] hover:text-[#8E8E93] transition-colors">
                                      <ThumbsUp size={10} />
                                    </button>
                                    <button className="text-[#D1D1D6] hover:text-[#8E8E93] transition-colors">
                                      <ThumbsDown size={10} />
                                    </button>
                                    <button className="text-[#D1D1D6] hover:text-[#8E8E93] transition-colors">
                                      <Copy size={10} />
                                    </button>
                                    <button className="text-[#D1D1D6] hover:text-[#8E8E93] transition-colors">
                                      <Volume2 size={10} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Thinking indicator */}
                        {isThinking && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2 items-center"
                          >
                            <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                              <Sparkles size={11} color="white" />
                            </div>
                            <div className="bg-[#F2F2F7] rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1">
                              {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay }}
                                  className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Quick hints */}
                      <div className="px-3 pb-2">
                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                          {["Give me a hint", "Show steps", "Next problem"].map((q) => (
                            <button
                              key={q}
                              onClick={() => sendMessage(q)}
                              className="flex-shrink-0 text-xs bg-[#F2F2F7] hover:bg-[#E8E8FF] text-[#6366F1] px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-[#6366F1]/20"
                              style={{ fontFamily: "Inter" }}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Voice input display */}
                      <AnimatePresence>
                        {isListening && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mx-3 mb-2 bg-[#FEF3FF] border border-[#E879F9]/30 rounded-2xl px-3 py-2 flex items-center gap-2"
                          >
                            <div className="flex items-center gap-0.5">
                              {[1, 3, 2, 4, 2, 3, 1].map((h, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ scaleY: [1, h, 1] }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }}
                                  className="w-0.5 bg-[#8B5CF6] rounded-full origin-center"
                                  style={{ height: 16 }}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-[#6B7280] flex-1 italic" style={{ fontFamily: "Inter" }}>
                              {voiceText || "Listening..."}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Input area */}
                      <div className="px-3 pb-3 flex items-center gap-2">
                        {/* Mic button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleVoice}
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                            isListening
                              ? "bg-[#EF4444] shadow-lg shadow-red-200"
                              : "bg-[#F2F2F7] hover:bg-[#E8E8FF]"
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            {isListening ? (
                              <motion.div key="listening" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <MicOff size={15} color="white" />
                              </motion.div>
                            ) : (
                              <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Mic size={15} className="text-[#6366F1]" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {isListening && (
                            <motion.div
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute w-9 h-9 rounded-2xl bg-[#EF4444]"
                            />
                          )}
                        </motion.button>

                        {/* Text input */}
                        <div className="flex-1 relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={isListening ? voiceText : inputText}
                            onChange={(e) => !isListening && setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
                            placeholder="Ask about your notes..."
                            className="w-full bg-[#F2F2F7] rounded-2xl px-3 py-2 text-xs text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none focus:ring-1 focus:ring-[#6366F1]/40 transition-all"
                            style={{ fontFamily: "Inter" }}
                          />
                        </div>

                        {/* Send button */}
                        <button
                          onClick={() => sendMessage(inputText)}
                          disabled={!inputText.trim() && !voiceText}
                          className="w-9 h-9 rounded-2xl bg-[#6366F1] flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-[#5558E3] transition-colors shadow-sm"
                        >
                          <Send size={14} color="white" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
