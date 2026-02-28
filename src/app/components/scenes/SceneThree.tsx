import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { AnimatedHandwriting } from "../AnimatedHandwriting";
import type { TextLine } from "../AnimatedHandwriting";
import { PDFPageView } from "../PDFPageView";

// All coordinates are in PDF points (viewBox 0 0 612 792).
// Page 3 answer area starts at approximately y=220pt.

const USER_ATTEMPT: TextLine[] = [
  { id: "a1", text: "Let  mn = 2k  and  m = 2p + 1   ( k, p ∈ ℤ )", x: 80, y: 255, color: "#1C1C1E", fontSize: 15, startDelay: 600, charSpeed: 26 },
  { id: "a2", text: "Then  2k  =  (2p + 1) · n", x: 80, y: 280, color: "#1C1C1E", fontSize: 15, startDelay: 3200, charSpeed: 26 },
  { id: "a3", text: "     n  =  2k / (2p + 1)  ← ✗", x: 80, y: 305, color: "#1C1C1E", fontSize: 15, startDelay: 5000, charSpeed: 26 },
];

const AI_HINT_1: TextLine[] = [
  {
    id: "h1",
    text: "consider: proof by contradiction?",
    x: 80, y: 350,
    color: "#6366F1", fontSize: 14, startDelay: 0, charSpeed: 18,
  },
];

const AI_HINT_2: TextLine[] = [
  {
    id: "h2",
    text: "  assume n is odd  →  find contradiction",
    x: 80, y: 375,
    color: "#6366F1", fontSize: 14, startDelay: 0, charSpeed: 18,
  },
];

const USER_PROOF: TextLine[] = [
  { id: "pr0", text: "Proof by Contradiction:", x: 80, y: 420, color: "#1C1C1E", fontSize: 15, fontWeight: "600", startDelay: 0, charSpeed: 27 },
  { id: "pr1", text: "Assume for contradiction that n is odd.", x: 80, y: 445, color: "#1C1C1E", fontSize: 15, startDelay: 4000, charSpeed: 26 },
  { id: "pr2", text: "Then  n = 2q + 1   for some  q ∈ ℤ.", x: 80, y: 470, color: "#1C1C1E", fontSize: 15, startDelay: 8500, charSpeed: 26 },
  { id: "pr3", text: "mn = (2p+1)(2q+1) = 4pq + 2p + 2q + 1", x: 80, y: 505, color: "#1C1C1E", fontSize: 15, startDelay: 13500, charSpeed: 24 },
  { id: "pr4", text: "    = 2(2pq + p + q) + 1", x: 80, y: 530, color: "#1C1C1E", fontSize: 15, startDelay: 18000, charSpeed: 24 },
  { id: "pr5", text: "But mn is EVEN — Contradiction!  ↯", x: 80, y: 570, color: "#EF4444", fontSize: 15, fontWeight: "600", startDelay: 22000, charSpeed: 24 },
  { id: "pr6", text: "∴  n must be even.   ∎", x: 80, y: 610, color: "#1C1C1E", fontSize: 15, fontWeight: "700", startDelay: 27000, charSpeed: 26 },
];

interface SceneThreeProps {
  isActive: boolean;
}

export function SceneThree({ isActive }: SceneThreeProps) {
  const [phase, setPhase] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setMicActive(false);
      return;
    }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const push = (fn: () => void, delay: number) => {
      timersRef.current.push(setTimeout(fn, delay));
    };

    push(() => setPhase(1), 400);
    push(() => setPhase(2), 8000);
    push(() => { setPhase(3); setMicActive(true); }, 11500);
    push(() => { setPhase(4); setMicActive(false); }, 15000);
    push(() => setPhase(5), 17000);
    push(() => { setPhase(6); setMicActive(true); }, 21000);
    push(() => { setPhase(7); setMicActive(false); }, 24500);
    push(() => setPhase(8), 26500);
    push(() => setPhase(9), 30500);
    push(() => setPhase(10), 63000);

    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  const showStrike = phase >= 2;
  const showHint1 = phase >= 5;
  const showHint2 = phase >= 8;
  const proofActive = phase >= 9;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F2F2F7]">
      <div className="flex-1 overflow-auto flex items-start justify-center py-5 px-4">
        <div className="relative">
          <PDFPageView
            pageNumber={3}
            width={700}
            className="rounded-lg shadow-xl"
          >
            {/* User attempt */}
            {phase >= 1 && (
              <AnimatedHandwriting lines={USER_ATTEMPT} isActive={phase >= 1} />
            )}

            {/* Red strikethrough on bad line */}
            {showStrike && (
              <line
                x1="78" y1="301" x2="330" y2="309"
                stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.7"
                strokeDasharray="320"
                style={{
                  strokeDashoffset: "320",
                  animation: "drawPath 0.45s ease-out forwards",
                }}
              />
            )}

            {/* AI hint 1 */}
            {showHint1 && (
              <AnimatedHandwriting lines={AI_HINT_1} isActive />
            )}

            {/* AI hint 2 */}
            {showHint2 && (
              <AnimatedHandwriting lines={AI_HINT_2} isActive />
            )}

            {/* Thin separator before proof */}
            {proofActive && (
              <line x1="80" y1="398" x2="480" y2="398" stroke="#E5E5EA" strokeWidth="0.8" />
            )}

            {/* User proof */}
            {proofActive && (
              <AnimatedHandwriting lines={USER_PROOF} isActive={proofActive} />
            )}

            {/* Done */}
            {phase >= 10 && (
              <text x="80" y="655" fontSize="15" fill="#10B981" fontFamily="Caveat, cursive" fontWeight="600">
                ✓ Proof complete!
              </text>
            )}
          </PDFPageView>
        </div>
      </div>

      {/* Floating right-side: sparkles + mic */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
        {/* AI hint button */}
        <div className="relative">
          {phase === 2 && (
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-[#6366F1]"
            />
          )}
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
            style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
          >
            <Sparkles size={20} color="white" />
          </button>
        </div>

        {/* Mic button */}
        <div className="relative">
          {micActive && (
            <>
              <motion.div
                animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.0, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-[#EF4444]"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 1.0, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-2xl bg-[#EF4444]"
              />
            </>
          )}

          <motion.button
            animate={
              micActive
                ? { backgroundColor: "#EF4444" }
                : { backgroundColor: "#F2F2F7" }
            }
            transition={{ duration: 0.2 }}
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{
              boxShadow: micActive
                ? "0 4px 16px rgba(239,68,68,0.45)"
                : "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {micActive ? (
              <MicOff size={20} color="white" />
            ) : (
              <Mic size={20} className="text-[#6B7280]" />
            )}
          </motion.button>

          <AnimatePresence>
            {micActive && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-14 top-1/2 -translate-y-1/2 bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-[#FEE2E2] flex items-center gap-0.5"
              >
                {[2, 4, 3, 5, 3, 4, 2, 5, 3, 4].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, h / 3, 1] }}
                    transition={{
                      duration: 0.35,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                    className="w-1 bg-[#EF4444] rounded-full origin-center"
                    style={{ height: 18 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
