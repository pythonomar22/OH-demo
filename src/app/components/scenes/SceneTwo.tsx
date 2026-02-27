import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { AnimatedHandwriting, AnimatedCircles } from "../AnimatedHandwriting";
import type { TextLine } from "../AnimatedHandwriting";

// ── User examples (black, NO checkmarks) ─────────────────────
const USER_EXAMPLES: TextLine[] = [
  { id: "ex1", text: "1² = 1", x: 90, y: 185, color: "#1C1C1E", fontSize: 22, startDelay: 600, charSpeed: 32 },
  { id: "ex2", text: "3² = 9", x: 90, y: 217, color: "#1C1C1E", fontSize: 22, startDelay: 1600, charSpeed: 32 },
  { id: "ex3", text: "5² = 25  ...", x: 90, y: 249, color: "#1C1C1E", fontSize: 22, startDelay: 2600, charSpeed: 32 },
  // no thought text — leave space for voiceover pause
];

// ── AI annotations written on canvas (purple) ────────────────
// These are activated once phase >= 5 (AI writes after hint clicked)
const AI_SIDE_NOTES: TextLine[] = [
  { id: "ai1", text: "1  =  2 × 0  +  1", x: 225, y: 185, color: "#6366F1", fontSize: 20, startDelay: 200,  charSpeed: 20 },
  { id: "ai2", text: "3  =  2 × 1  +  1", x: 225, y: 217, color: "#6366F1", fontSize: 20, startDelay: 900,  charSpeed: 20 },
  { id: "ai3", text: "5  =  2 × 2  +  1", x: 225, y: 249, color: "#6366F1", fontSize: 20, startDelay: 1600, charSpeed: 20 },
  { id: "aiq", text: "↳ can you generalise this to any odd n ?", x: 90, y: 310, color: "#6366F1", fontSize: 20, startDelay: 2500, charSpeed: 18 },
];

// ── User proof lines (black) — written with pauses baked into startDelay ──
// Phase offset = 0 when proofActive fires; pauses added between lines
const USER_PROOF: TextLine[] = [
  // "Let n be any odd integer." — pause 0
  { id: "p1", text: "Let n be any odd integer.", x: 90, y: 390,  color: "#1C1C1E", fontSize: 22, startDelay: 0,     charSpeed: 28 },
  // pause ~3s after p1 starts + ~700ms write time → next starts at 3800
  { id: "p2", text: "Then  n = 2k + 1   for some integer  k.", x: 90, y: 422,  color: "#1C1C1E", fontSize: 22, startDelay: 3800, charSpeed: 26 },
  // pause ~3s → 3800 + 1100ms write + 3000 pause = 7900
  { id: "p3", text: "  n² = (2k + 1)²  =  4k² + 4k + 1", x: 90, y: 470,  color: "#1C1C1E", fontSize: 22, startDelay: 7900, charSpeed: 25 },
  // pause ~2.5s → 7900 + 900ms + 2500 = 11300
  { id: "p4", text: "        = 2(2k² + 2k) + 1", x: 90, y: 502,  color: "#1C1C1E", fontSize: 22, startDelay: 11300, charSpeed: 25 },
  // pause ~3s → 11300 + 650ms + 3000 = 14950
  { id: "p5", text: "This has the form 2m + 1,  so  n²  is odd.", x: 90, y: 550,  color: "#1C1C1E", fontSize: 22, startDelay: 14950, charSpeed: 26 },
  // pause ~2.5s → 14950 + 1100ms + 2500 = 18550
  { id: "p6", text: "∴  n² is odd for every odd integer n.   ∎",   x: 90, y: 598,  color: "#1C1C1E", fontSize: 22, fontWeight: "600", startDelay: 18550, charSpeed: 25 },
];

// Phase map:
// 0 → blank paper + problem header
// 1 → user examples animating
// 2 → (pause — voiceover space)
// 3 → hint button pulses
// 4 → AI circles + annotations appear on canvas
// 5 → (pause — voiceover space after AI annotation)
// 6 → user writes proof (with internal pauses)
// 7 → done

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

    // t=400  → examples start
    push(() => setPhase(1), 400);

    // t=5500 → hint button pulses (after examples + ~3s pause for voiceover)
    push(() => setPhase(3), 5500);

    // t=6500 → AI "clicks" hint, starts writing on canvas
    push(() => { setPhase(4); setAiWriting(true); }, 6500);

    // t=12000 → AI writing done; brief flash off
    push(() => setAiWriting(false), 12000);

    // t=16000 → user begins proof (after ~4s pause voiceover)
    push(() => setPhase(6), 16000);

    // t=38000 → done (16000 + last proof delay ~18550 + ~2s writing)
    push(() => setPhase(7), 38500);

    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  const circlesActive  = phase >= 4;
  const aiTextActive   = phase >= 4;
  const proofActive    = phase >= 6;
  const micActive = false;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F2F2F7]">
      <div className="flex-1 overflow-auto flex items-start justify-center py-5 px-4">
        <div className="relative w-full max-w-4xl">

          {/* Paper */}
          <div
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
            style={{ height: 720 }}
          >
            {/* Red margin line */}
            <div className="absolute top-0 bottom-0 left-[72px] w-px bg-[#FECACA] z-10 pointer-events-none" />

            {/* Ruled lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #E8EEFE 31px, #E8EEFE 32px)",
                backgroundSize: "100% 32px",
                backgroundPosition: "0 40px",
              }}
            />

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Problem header — always visible */}
              <text x="90" y="58" fontSize="22" fill="#6366F1" fontWeight="700" fontFamily="Inter, sans-serif">
                Problem 1
              </text>
              <line x1="90" y1="65" x2="220" y2="65" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <text x="90" y="95" fontSize="17" fill="#3C3C43" fontFamily="Caveat, cursive">
                Given integer n, if n is odd, is n² odd? Write a formal proof or disproof.
              </text>
              <text x="90" y="133" fontSize="17" fill="#C7C7CC" fontFamily="Caveat, cursive">
                — — —
              </text>

              {/* User examples */}
              {phase >= 1 && (
                <AnimatedHandwriting lines={USER_EXAMPLES} isActive={phase >= 1} />
              )}

              {/* AI circles around examples */}
              {circlesActive && (
                <AnimatedCircles
                  isActive
                  circles={[
                    { id: "c1", cx: 116, cy: 183, rx: 42, ry: 16, color: "#6366F1", startDelay: 0   },
                    { id: "c2", cx: 116, cy: 215, rx: 42, ry: 16, color: "#6366F1", startDelay: 850  },
                    { id: "c3", cx: 130, cy: 247, rx: 55, ry: 16, color: "#6366F1", startDelay: 1700 },
                  ]}
                />
              )}

              {/* AI side-note text (purple) */}
              {aiTextActive && (
                <AnimatedHandwriting lines={AI_SIDE_NOTES} isActive={aiTextActive} />
              )}

              {/* Thin separator before proof */}
              {proofActive && (
                <line x1="90" y1="372" x2="560" y2="372" stroke="#E5E5EA" strokeWidth="1" />
              )}

              {/* User proof */}
              {proofActive && (
                <AnimatedHandwriting lines={USER_PROOF} isActive={proofActive} />
              )}

              {/* Done mark */}
              {phase >= 7 && (
                <text x="90" y="650" fontSize="20" fill="#10B981" fontFamily="Caveat, cursive" fontWeight="600">
                  ✓ Proof complete!
                </text>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* ── Floating right-side: sparkles + mic ── */}
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
                <span className="text-[11px] text-[#6366F1] font-medium" style={{ fontFamily: "Inter" }}>
                  AI annotating
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mic button — visual only */}
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
