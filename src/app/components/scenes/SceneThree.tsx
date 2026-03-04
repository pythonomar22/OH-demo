import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { AnimatedHandwriting, AnimatedCircles } from "../AnimatedHandwriting";
import type { TextLine } from "../AnimatedHandwriting";
import { PDFPageView } from "../PDFPageView";

// All coordinates are in PDF points (viewBox 0 0 612 792).
// Page 3 answer area starts at approximately y=220pt.

// User writes work including the wrong step — they don't realize the mistake.
const USER_ATTEMPT: TextLine[] = [
  { id: "a1", text: "Let  mn = 2k  and  m = 2p + 1   ( k, p ∈ ℤ )", x: 80, y: 255, color: "#1C1C1E", fontSize: 15, startDelay: 600, charSpeed: 26 },
  { id: "a2", text: "Then  2k  =  (2p + 1) · n", x: 80, y: 280, color: "#1C1C1E", fontSize: 15, startDelay: 3200, charSpeed: 26 },
  { id: "a3", text: "     n  =  2k / (2p + 1)", x: 80, y: 305, color: "#1C1C1E", fontSize: 15, startDelay: 5000, charSpeed: 26 },
  { id: "a4", text: "so  n  is even since  2k / (2p+1)  is...", x: 80, y: 335, color: "#1C1C1E", fontSize: 15, startDelay: 7200, charSpeed: 26 },
];

// AI annotation after circling — single short note
const AI_RECONSIDER: TextLine[] = [
  {
    id: "rc1",
    text: "reconsider this step",
    x: 340, y: 305,
    color: "#6366F1", fontSize: 14, startDelay: 800, charSpeed: 18,
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
  const [aiWriting, setAiWriting] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setMicActive(false);
      setAiWriting(false);
      setScrollOffset(0);
      return;
    }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const push = (fn: () => void, delay: number) => {
      timersRef.current.push(setTimeout(fn, delay));
    };

    // Phase 1: User writes attempt (including wrong step + continuation)
    push(() => setPhase(1), 400);

    // Phase 2: User gets stuck, hint button starts pulsing
    push(() => setPhase(2), 11000);

    // Phase 3: User clicks hint → AI circles the wrong line + writes "reconsider this step"
    push(() => { setPhase(3); setAiWriting(true); }, 13000);
    push(() => setAiWriting(false), 16000);

    // Phase 4-6: Voice conversation — back-and-forth mic toggling
    push(() => { setPhase(4); setMicActive(true); }, 17000);   // user speaks
    push(() => setMicActive(false), 20000);                     // user stops
    push(() => { setPhase(5); setMicActive(true); }, 21000);   // AI responds
    push(() => setMicActive(false), 24000);                     // AI stops
    push(() => { setPhase(6); setMicActive(true); }, 25000);   // user speaks again
    push(() => setMicActive(false), 27500);                     // user stops

    // Phase 8: User starts writing correct proof
    push(() => setPhase(8), 29000);

    // Scroll down midway through proof writing to reveal the final lines
    // pr5 starts at 29000 + 22000 = 51000ms, scroll just before that
    push(() => setScrollOffset(120), 48000);

    // Phase 9: Done
    push(() => setPhase(9), 62000);

    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  const hintPulsing = phase === 2;
  const showCircles = phase >= 3;
  const showReconsider = phase >= 3;
  const proofActive = phase >= 8;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F2F2F7]">
      <div className="flex-1 overflow-auto flex items-start justify-center py-5 px-4">
        <div className="relative">
          <PDFPageView
            pageNumber={3}
            width={700}
            className="rounded-lg shadow-xl"
            scrollOffset={scrollOffset}
          >
            {/* User attempt — no self-correction marks */}
            {phase >= 1 && (
              <AnimatedHandwriting lines={USER_ATTEMPT} isActive={phase >= 1} />
            )}

            {/* AI circles around the wrong line (a3) */}
            {showCircles && (
              <AnimatedCircles
                isActive
                circles={[
                  { id: "c1", cx: 200, cy: 300, rx: 135, ry: 14, color: "#6366F1", startDelay: 0 },
                ]}
              />
            )}

            {/* AI annotation: "reconsider this step" */}
            {showReconsider && (
              <AnimatedHandwriting lines={AI_RECONSIDER} isActive />
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
            {phase >= 9 && (
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
          {/* Pulsing ring when hint is available */}
          {hintPulsing && (
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-[#6366F1]"
            />
          )}
          {/* Spinning ring while AI is annotating */}
          {aiWriting && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 rounded-3xl border-2 border-transparent border-t-[#6366F1] border-r-[#8B5CF6]"
            />
          )}
          <button
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${phase >= 3
                ? "bg-gradient-to-br from-[#5558E3] to-[#7C3AED]"
                : "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
              }`}
            style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}
          >
            <Sparkles size={20} color="white" />
          </button>
          {/* "AI annotating" tooltip */}
          <AnimatePresence>
            {aiWriting && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-14 top-1/2 -translate-y-1/2 bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-[#E5E5EA] flex items-center gap-1.5 whitespace-nowrap"
              >
                {[0, 0.15, 0.3].map((d, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: d }}
                    className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"
                  />
                ))}
                <span
                  className="text-[11px] text-[#6366F1] font-medium"
                  style={{ fontFamily: "Inter" }}
                >
                  AI annotating
                </span>
              </motion.div>
            )}
          </AnimatePresence>
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
