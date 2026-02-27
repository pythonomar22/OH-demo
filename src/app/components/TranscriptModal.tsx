import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquareText, Mic, Sparkles } from "lucide-react";

interface TranscriptEntry {
  role: "student" | "ai";
  text: string;
}

const SCENE_TRANSCRIPTS: Record<number, { title: string; entries: TranscriptEntry[] }> = {
  2: {
    title: "Scene 2 — Problem 1 Voiceover Script",
    entries: [
      { role: "student", text: "Let me try some examples first... 1 squared is 1, 3 squared is 9, 5 squared is 25... they all seem to be odd. It looks like it's always true, but I don't know how to formally prove this." },
      { role: "ai", text: "Take a look at what I've written next to your examples — do you notice a pattern in how each of those odd numbers is expressed?" },
      { role: "student", text: "Oh — they all fit the form 2k plus 1... so any odd number can be written as 2k plus 1 for some integer k." },
      { role: "ai", text: "Exactly. Can you use that representation to construct a general proof?" },
      { role: "student", text: "So... let n be any odd integer. Then n equals 2k plus 1. Squaring it gives 4k squared plus 4k plus 1, which I can factor as 2 times 2k squared plus 2k, plus 1. That's of the form 2m plus 1, so n squared is odd!" },
      { role: "ai", text: "Perfect — you've shown that for any odd integer n, n squared must also be odd. That's a complete direct proof!" },
    ],
  },
  3: {
    title: "Scene 3 — Problem 2 Voiceover Script",
    entries: [
      { role: "student", text: "Okay, mn is even so mn equals 2k, and m is odd so m equals 2p plus 1. Let me solve for n... n equals 2k divided by 2p plus 1. Hmm, that doesn't simplify to an integer. I'm stuck." },
      { role: "ai", text: "Good observation — you noticed that this direct approach isn't working. When direct proofs get complicated like this, what other proof strategies do you know of?" },
      { role: "student", text: "I know there's proof by contradiction, but I've kind of forgotten how it works exactly." },
      { role: "ai", text: "With proof by contradiction, you start by assuming the opposite of what you want to prove, and show that leads to something impossible. Here, what are you trying to prove?" },
      { role: "student", text: "That n is even... so I'd assume n is odd. Then n equals 2q plus 1. Let me multiply mn out..." },
      { role: "ai", text: "Keep going — expand that product all the way and see what you can conclude about its parity." },
      { role: "student", text: "So mn equals 2p plus 1 times 2q plus 1, which expands to 4pq plus 2p plus 2q plus 1, equals 2 times 2pq plus p plus q, plus 1. That's odd! But mn is supposed to be EVEN — contradiction! So n can't be odd, therefore n must be even!" },
      { role: "ai", text: "Excellent! You've completed the proof by contradiction. You assumed n was odd, derived that mn would have to be odd, but that contradicts the given that mn is even. Therefore n must be even." },
    ],
  },
};

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: number;
}

export function TranscriptModal({ isOpen, onClose, scene }: TranscriptModalProps) {
  const transcript = SCENE_TRANSCRIPTS[scene];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="absolute top-16 right-4 z-[101] w-96 bg-white rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden"
            style={{ maxHeight: "calc(100% - 100px)" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageSquareText size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm" style={{ fontFamily: "Inter" }}>
                  {transcript ? transcript.title : "Session Transcript"}
                </p>
                <p className="text-white/60 text-xs" style={{ fontFamily: "Inter" }}>
                  Voiceover reference script
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X size={14} color="white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 420 }}>
              {!transcript ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[#8E8E93]" style={{ fontFamily: "Inter" }}>
                    No transcript available for this scene.
                  </p>
                </div>
              ) : (
                transcript.entries.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${entry.role === "student" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        entry.role === "ai"
                          ? "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
                          : "bg-[#F2F2F7] border border-[#E5E5EA]"
                      }`}
                    >
                      {entry.role === "ai" ? (
                        <Sparkles size={11} color="white" />
                      ) : (
                        <Mic size={11} className="text-[#6B7280]" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-[82%] ${
                        entry.role === "ai"
                          ? "bg-[#F2F2F7] text-[#1C1C1E] rounded-tl-sm"
                          : "bg-[#EEF2FF] text-[#3730A3] rounded-tr-sm border border-[#C7D2FE]"
                      }`}
                      style={{ fontFamily: "Inter" }}
                    >
                      <span className={`font-semibold text-[10px] block mb-1 ${entry.role === "ai" ? "text-[#6366F1]" : "text-[#4338CA]"}`}>
                        {entry.role === "ai" ? "AI Tutor" : "Student"}
                      </span>
                      {entry.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[#F2F2F7] flex items-center justify-between">
              <p className="text-[10px] text-[#8E8E93]" style={{ fontFamily: "Inter" }}>
                {transcript ? `${transcript.entries.length} exchanges` : "–"}
              </p>
              <p className="text-[10px] text-[#8E8E93]" style={{ fontFamily: "Inter" }}>
                Use as voiceover reference
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
