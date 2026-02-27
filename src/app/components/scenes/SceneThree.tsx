import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { AnimatedHandwriting } from "../AnimatedHandwriting";
import type { TextLine } from "../AnimatedHandwriting";

// ── User's initial (failed) attempt — black ───────────────────
// No "Hmm..." thought text — all internal monologue is voiceover only
const USER_ATTEMPT: TextLine[] = [
  { id: "a1", text: "Let  mn = 2k  and  m = 2p + 1   ( k, p ∈ ℤ )", x: 90, y: 185, color: "#1C1C1E", fontSize: 21, startDelay: 600,  charSpeed: 26 },
  { id: "a2", text: "Then  2k  =  (2p + 1) · n",                      x: 90, y: 217, color: "#1C1C1E", fontSize: 21, startDelay: 3200, charSpeed: 26 },
  { id: "a3", text: "     n  =  2k / (2p + 1)  ← ✗",                  x: 90, y: 249, color: "#1C1C1E", fontSize: 21, startDelay: 5000, charSpeed: 26 },
];

// ── Minimal AI canvas hints (purple, written after mic exchanges) ─
// Hint 1 — after first mic interaction: gentle nudge about strategy
const AI_HINT_1: TextLine[] = [
  {
    id: "h1",
    text: "consider: proof by contradiction?",
    x: 90, y: 308,
    color: "#6366F1", fontSize: 19, startDelay: 0, charSpeed: 18,
  },
];

// Hint 2 — after second mic interaction: directs thinking, nothing more
const AI_HINT_2: TextLine[] = [
  {
    id: "h2",
    text: "  assume n is odd  →  find contradiction",
    x: 90, y: 340,
    color: "#6366F1", fontSize: 19, startDelay: 0, charSpeed: 18,
  },
];

// ── User's formal proof — ALL black, user writes everything ───
// Rich pauses baked into startDelay for voiceover breathing room
const USER_PROOF: TextLine[] = [
  { id: "pr0", text: "Proof by Contradiction:", x: 90, y: 400, color: "#1C1C1E", fontSize: 21, fontWeight: "600", startDelay: 0,     charSpeed: 27 },
  // ~3.5s pause after header
  { id: "pr1", text: "Assume for contradiction that n is odd.",     x: 90, y: 432, color: "#1C1C1E", fontSize: 21, startDelay: 4000,  charSpeed: 26 },
  // ~3s pause
  { id: "pr2", text: "Then  n = 2q + 1   for some  q ∈ ℤ.",        x: 90, y: 464, color: "#1C1C1E", fontSize: 21, startDelay: 8500,  charSpeed: 26 },
  // ~3s pause
  { id: "pr3", text: "mn = (2p+1)(2q+1) = 4pq + 2p + 2q + 1",     x: 90, y: 512, color: "#1C1C1E", fontSize: 21, startDelay: 13500, charSpeed: 24 },
  // ~2.5s pause
  { id: "pr4", text: "    = 2(2pq + p + q) + 1",                   x: 90, y: 544, color: "#1C1C1E", fontSize: 21, startDelay: 18000, charSpeed: 24 },
  // ~3s pause
  { id: "pr5", text: "But mn is EVEN — Contradiction!  ↯",          x: 90, y: 592, color: "#EF4444", fontSize: 21, fontWeight: "600", startDelay: 22000, charSpeed: 24 },
  // ~3s pause
  { id: "pr6", text: "∴  n must be even.   ∎",                     x: 90, y: 648, color: "#1C1C1E", fontSize: 21, fontWeight: "700", startDelay: 27000, charSpeed: 26 },
];

// Phase map:
// 0  → blank paper + problem header
// 1  → user writes failed attempt
// 2  → strikethrough on bad line (after attempt written)
//       [pause here — voiceover: "this doesn't work"]
// 3  → mic 1 activates  (voiceover: "I'm stuck...")
// 4  → mic 1 deactivates (AI spoken: "when direct proofs fail, what alternatives do you know?")
//       [pause]
// 5  → AI writes hint 1 on canvas: "consider: proof by contradiction?"
//       [pause — voiceover: student "I've forgotten how..."]
// 6  → mic 2 activates  (student voice)
// 7  → mic 2 deactivates (AI spoken: "assume the opposite of what you want to prove")
// 8  → AI writes hint 2 on canvas
//       [pause — student thinking]
// 9  → user writes proof
// 10 → done

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

    // Attempt phase
    push(() => setPhase(1), 400);

    // Strikethrough appears after attempt lines done (~7s writing + buffer)
    push(() => setPhase(2), 8000);

    // Pause (voiceover), then mic 1 activates
    push(() => { setPhase(3); setMicActive(true); }, 11500);

    // Mic 1 off — AI spoken response
    push(() => { setPhase(4); setMicActive(false); }, 15000);

    // AI writes hint 1 on canvas
    push(() => setPhase(5), 17000);

    // Pause, then mic 2 activates (student: "I've forgotten how to do contradiction...")
    push(() => { setPhase(6); setMicActive(true); }, 21000);

    // Mic 2 off — AI spoken response
    push(() => { setPhase(7); setMicActive(false); }, 24500);

    // AI writes hint 2
    push(() => setPhase(8), 26500);

    // Pause, then user writes proof
    push(() => setPhase(9), 30500);

    // Done
    push(() => setPhase(10), 63000);

    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  const showStrike    = phase >= 2;
  const showHint1     = phase >= 5;
  const showHint2     = phase >= 8;
  const proofActive   = phase >= 9;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F2F2F7]">
      <div className="flex-1 overflow-auto flex items-start justify-center py-5 px-4">
        <div className="relative w-full max-w-4xl">

          {/* Paper */}
          <div
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
            style={{ height: 720 }}
          >
            {/* Red margin */}
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
              {/* Problem header */}
              <text x="90" y="58" fontSize="22" fill="#6366F1" fontWeight="700" fontFamily="Inter, sans-serif">
                Problem 2
              </text>
              <line x1="90" y1="65" x2="220" y2="65" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <text x="90" y="95" fontSize="17" fill="#3C3C43" fontFamily="Caveat, cursive">
                For all integers m, n: if mn is even and m is odd, prove n is even.
              </text>
              <text x="90" y="133" fontSize="17" fill="#C7C7CC" fontFamily="Caveat, cursive">
                — — —
              </text>

              {/* User attempt */}
              {phase >= 1 && (
                <AnimatedHandwriting lines={USER_ATTEMPT} isActive={phase >= 1} />
              )}

              {/* Red strikethrough on bad line */}
              {showStrike && (
                <line
                  x1="88" y1="243" x2="390" y2="255"
                  stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"
                  strokeDasharray="320"
                  style={{
                    strokeDashoffset: 320,
                    animation: "drawPath 0.45s ease-out forwards",
                  }}
                />
              )}

              {/* AI hint 1 — minimal, Socratic */}
              {showHint1 && (
                <AnimatedHandwriting lines={AI_HINT_1} isActive />
              )}

              {/* AI hint 2 — still minimal */}
              {showHint2 && (
                <AnimatedHandwriting lines={AI_HINT_2} isActive />
              )}

              {/* Thin separator before proof */}
              {proofActive && (
                <line x1="90" y1="376" x2="560" y2="376" stroke="#E5E5EA" strokeWidth="1" />
              )}

              {/* User proof — all black, all written by student */}
              {proofActive && (
                <AnimatedHandwriting lines={USER_PROOF} isActive={proofActive} />
              )}

              {/* Done */}
              {phase >= 10 && (
                <text x="90" y="698" fontSize="20" fill="#10B981" fontFamily="Caveat, cursive" fontWeight="600">
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

        {/* Mic button — activates/deactivates */}
        <div className="relative">
          {/* Pulse ring when active */}
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
            animate={micActive ? { backgroundColor: "#EF4444" } : { backgroundColor: "#F2F2F7" }}
            transition={{ duration: 0.2 }}
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ boxShadow: micActive ? "0 4px 16px rgba(239,68,68,0.45)" : "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            {micActive ? (
              <MicOff size={20} color="white" />
            ) : (
              <Mic size={20} className="text-[#6B7280]" />
            )}
          </motion.button>

          {/* Waveform beside mic when active */}
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
                    transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.05 }}
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
