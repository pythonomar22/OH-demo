import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Sparkles } from "lucide-react";
import { AnimatedHandwriting, AnimatedCircles } from "../AnimatedHandwriting";
import type { TextLine } from "../AnimatedHandwriting";
import { PDFPageView } from "../PDFPageView";

// All coordinates are in PDF points (viewBox 0 0 612 792).
// Page 2 answer area starts at approximately y=220pt.

const USER_EXAMPLES: TextLine[] = [
  { id: "ex1", text: "1² = 1", x: 80, y: 255, color: "#1C1C1E", fontSize: 16, startDelay: 600, charSpeed: 32 },
  { id: "ex2", text: "3² = 9", x: 80, y: 280, color: "#1C1C1E", fontSize: 16, startDelay: 1600, charSpeed: 32 },
  { id: "ex3", text: "5² = 25  ...", x: 80, y: 305, color: "#1C1C1E", fontSize: 16, startDelay: 2600, charSpeed: 32 },
];

const AI_SIDE_NOTES: TextLine[] = [
  { id: "ai1", text: "1  =  2 × 0  +  1", x: 200, y: 255, color: "#6366F1", fontSize: 15, startDelay: 200, charSpeed: 20 },
  { id: "ai2", text: "3  =  2 × 1  +  1", x: 200, y: 280, color: "#6366F1", fontSize: 15, startDelay: 900, charSpeed: 20 },
  { id: "ai3", text: "5  =  2 × 2  +  1", x: 200, y: 305, color: "#6366F1", fontSize: 15, startDelay: 1600, charSpeed: 20 },
  { id: "aiq", text: "↳ can you generalise this to any odd n ?", x: 80, y: 345, color: "#6366F1", fontSize: 15, startDelay: 2500, charSpeed: 18 },
];

const USER_PROOF: TextLine[] = [
  { id: "p1", text: "Let n be any odd integer.", x: 80, y: 400, color: "#1C1C1E", fontSize: 16, startDelay: 0, charSpeed: 28 },
  { id: "p2", text: "Then  n = 2k + 1   for some integer  k.", x: 80, y: 425, color: "#1C1C1E", fontSize: 16, startDelay: 3800, charSpeed: 26 },
  { id: "p3", text: "  n² = (2k + 1)²  =  4k² + 4k + 1", x: 80, y: 460, color: "#1C1C1E", fontSize: 16, startDelay: 7900, charSpeed: 25 },
  { id: "p4", text: "        = 2(2k² + 2k) + 1", x: 80, y: 485, color: "#1C1C1E", fontSize: 16, startDelay: 11300, charSpeed: 25 },
  { id: "p5", text: "This has the form 2m + 1,  so  n²  is odd.", x: 80, y: 520, color: "#1C1C1E", fontSize: 16, startDelay: 14950, charSpeed: 26 },
  { id: "p6", text: "∴  n² is odd for every odd integer n.   ∎", x: 80, y: 555, color: "#1C1C1E", fontSize: 16, fontWeight: "600", startDelay: 18550, charSpeed: 25 },
];

interface SceneTwoProps {
  isActive: boolean;
}

export function SceneTwo({ isActive }: SceneTwoProps) {
  const [phase, setPhase] = useState(0);
  const [aiWriting, setAiWriting] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setAiWriting(false);
      return;
    }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const push = (fn: () => void, delay: number) => {
      timersRef.current.push(setTimeout(fn, delay));
    };

    push(() => setPhase(1), 400);
    push(() => setPhase(3), 5500);
    push(() => { setPhase(4); setAiWriting(true); }, 6500);
    push(() => setAiWriting(false), 12000);
    push(() => setPhase(6), 16000);
    push(() => setPhase(7), 38500);

    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  const circlesActive = phase >= 4;
  const aiTextActive = phase >= 4;
  const proofActive = phase >= 6;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F2F2F7]">
      <div className="flex-1 overflow-auto flex items-start justify-center py-5 px-4">
        <div className="relative">
          <PDFPageView
            pageNumber={2}
            width={700}
            className="rounded-lg shadow-xl"
          >
            {/* User examples */}
            {phase >= 1 && (
              <AnimatedHandwriting lines={USER_EXAMPLES} isActive={phase >= 1} />
            )}

            {/* AI circles around examples */}
            {circlesActive && (
              <AnimatedCircles
                isActive
                circles={[
                  { id: "c1", cx: 102, cy: 250, rx: 38, ry: 13, color: "#6366F1", startDelay: 0 },
                  { id: "c2", cx: 102, cy: 275, rx: 38, ry: 13, color: "#6366F1", startDelay: 850 },
                  { id: "c3", cx: 115, cy: 300, rx: 50, ry: 13, color: "#6366F1", startDelay: 1700 },
                ]}
              />
            )}

            {/* AI side-note text (purple) */}
            {aiTextActive && (
              <AnimatedHandwriting lines={AI_SIDE_NOTES} isActive={aiTextActive} />
            )}

            {/* Thin separator before proof */}
            {proofActive && (
              <line x1="80" y1="375" x2="480" y2="375" stroke="#E5E5EA" strokeWidth="0.8" />
            )}

            {/* User proof */}
            {proofActive && (
              <AnimatedHandwriting lines={USER_PROOF} isActive={proofActive} />
            )}

            {/* Done mark */}
            {phase >= 7 && (
              <text x="80" y="595" fontSize="15" fill="#10B981" fontFamily="Caveat, cursive" fontWeight="600">
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
          {phase === 3 && (
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-[#6366F1]"
            />
          )}
          {aiWriting && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 rounded-3xl border-2 border-transparent border-t-[#6366F1] border-r-[#8B5CF6]"
            />
          )}
          <button
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
              phase >= 4
                ? "bg-gradient-to-br from-[#5558E3] to-[#7C3AED]"
                : "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
            }`}
            style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}
          >
            <Sparkles size={20} color="white" />
          </button>
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
          <motion.button
            animate={{ backgroundColor: "#F2F2F7" }}
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <Mic size={20} className="text-[#6B7280]" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
