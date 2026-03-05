import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { AnimatedHandwriting, AnimatedCircles } from "./AnimatedHandwriting";
import type { TextLine } from "./AnimatedHandwriting";
import { PDFPageView } from "./PDFPageView";

/* =================================================================== */
/*  Scene 2 data — Problem 1: Odd² Proof (page 2)                      */
/* =================================================================== */
const S2_USER_EXAMPLES: TextLine[] = [
    { id: "ex1", text: "1² = 1", x: 80, y: 255, color: "#1C1C1E", fontSize: 16, startDelay: 600, charSpeed: 32 },
    { id: "ex2", text: "3² = 9", x: 80, y: 280, color: "#1C1C1E", fontSize: 16, startDelay: 1600, charSpeed: 32 },
    { id: "ex3", text: "5² = 25  ...", x: 80, y: 305, color: "#1C1C1E", fontSize: 16, startDelay: 2600, charSpeed: 32 },
];

const S2_AI_SIDE_NOTES: TextLine[] = [
    { id: "ai1", text: "1  =  2 × 0  +  1", x: 200, y: 255, color: "#6366F1", fontSize: 15, startDelay: 200, charSpeed: 20 },
    { id: "ai2", text: "3  =  2 × 1  +  1", x: 200, y: 280, color: "#6366F1", fontSize: 15, startDelay: 900, charSpeed: 20 },
    { id: "ai3", text: "5  =  2 × 2  +  1", x: 200, y: 305, color: "#6366F1", fontSize: 15, startDelay: 1600, charSpeed: 20 },
    { id: "aiq", text: "↳ can you generalise this to any odd n ?", x: 80, y: 345, color: "#6366F1", fontSize: 15, startDelay: 2500, charSpeed: 18 },
];

const S2_USER_PROOF: TextLine[] = [
    { id: "p1", text: "Let n be any odd integer.", x: 80, y: 400, color: "#1C1C1E", fontSize: 16, startDelay: 0, charSpeed: 28 },
    { id: "p2", text: "Then  n = 2k + 1   for some integer  k.", x: 80, y: 425, color: "#1C1C1E", fontSize: 16, startDelay: 3800, charSpeed: 26 },
    { id: "p3", text: "  n² = (2k + 1)²  =  4k² + 4k + 1", x: 80, y: 460, color: "#1C1C1E", fontSize: 16, startDelay: 7900, charSpeed: 25 },
    { id: "p4", text: "        = 2(2k² + 2k) + 1", x: 80, y: 485, color: "#1C1C1E", fontSize: 16, startDelay: 11300, charSpeed: 25 },
    { id: "p5", text: "This has the form 2m + 1,  so  n²  is odd.", x: 80, y: 520, color: "#1C1C1E", fontSize: 16, startDelay: 14950, charSpeed: 26 },
    { id: "p6", text: "∴  n² is odd for every odd integer n.   ∎", x: 80, y: 555, color: "#1C1C1E", fontSize: 16, fontWeight: "600", startDelay: 18550, charSpeed: 25 },
];

/* =================================================================== */
/*  Scene 3 data — Problem 2: Even Product (page 3)                     */
/* =================================================================== */
const S3_USER_ATTEMPT: TextLine[] = [
    { id: "a1", text: "Let  mn = 2k  and  m = 2p + 1   ( k, p ∈ ℤ )", x: 80, y: 255, color: "#1C1C1E", fontSize: 15, startDelay: 600, charSpeed: 26 },
    { id: "a2", text: "Then  2k  =  (2p + 1) · n", x: 80, y: 280, color: "#1C1C1E", fontSize: 15, startDelay: 3200, charSpeed: 26 },
    { id: "a3", text: "     n  =  2k / (2p + 1)", x: 80, y: 305, color: "#1C1C1E", fontSize: 15, startDelay: 5000, charSpeed: 26 },
    { id: "a4", text: "so  n  is even since  2k / (2p+1)  is...", x: 80, y: 335, color: "#1C1C1E", fontSize: 15, startDelay: 7200, charSpeed: 26 },
];

const S3_AI_RECONSIDER: TextLine[] = [
    { id: "rc1", text: "reconsider this step", x: 340, y: 305, color: "#6366F1", fontSize: 14, startDelay: 800, charSpeed: 18 },
];

const S3_USER_PROOF: TextLine[] = [
    { id: "pr0", text: "Proof by Contradiction:", x: 80, y: 420, color: "#1C1C1E", fontSize: 15, fontWeight: "600", startDelay: 0, charSpeed: 27 },
    { id: "pr1", text: "Assume for contradiction that n is odd.", x: 80, y: 445, color: "#1C1C1E", fontSize: 15, startDelay: 4000, charSpeed: 26 },
    { id: "pr2", text: "Then  n = 2q + 1   for some  q ∈ ℤ.", x: 80, y: 470, color: "#1C1C1E", fontSize: 15, startDelay: 8500, charSpeed: 26 },
    { id: "pr3", text: "mn = (2p+1)(2q+1) = 4pq + 2p + 2q + 1", x: 80, y: 505, color: "#1C1C1E", fontSize: 15, startDelay: 13500, charSpeed: 24 },
    { id: "pr4", text: "    = 2(2pq + p + q) + 1", x: 80, y: 530, color: "#1C1C1E", fontSize: 15, startDelay: 18000, charSpeed: 24 },
    { id: "pr5", text: "But mn is EVEN — Contradiction!  ↯", x: 80, y: 570, color: "#1C1C1E", fontSize: 15, startDelay: 22000, charSpeed: 24 },
    { id: "pr6", text: "∴  n must be even.   ∎", x: 80, y: 610, color: "#1C1C1E", fontSize: 15, fontWeight: "700", startDelay: 27000, charSpeed: 26 },
];

/* =================================================================== */
/*  Component                                                           */
/* =================================================================== */
interface PDFWorkspaceProps {
    activeScene: number; // 1, 2, or 3
}

export function PDFWorkspace({ activeScene }: PDFWorkspaceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const page2Ref = useRef<HTMLDivElement>(null);
    const page3Ref = useRef<HTMLDivElement>(null);

    // Scene 2 state
    const [s2Phase, setS2Phase] = useState(0);
    const [s2AiWriting, setS2AiWriting] = useState(false);

    // Scene 3 state
    const [s3Phase, setS3Phase] = useState(0);
    const [s3MicActive, setS3MicActive] = useState(false);
    const [s3AiWriting, setS3AiWriting] = useState(false);
    const [s3ScrollOffset, setS3ScrollOffset] = useState(0);

    const s2Timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const s3Timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    /* ---- Scroll to page when scene changes ---- */
    useEffect(() => {
        let attempts = 0;
        const tryScroll = () => {
            const container = scrollRef.current;
            if (!container) return;

            const target =
                activeScene === 2 ? page2Ref.current :
                    activeScene === 3 ? page3Ref.current : null;

            if (activeScene === 1) {
                container.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            if (target && target.offsetTop > 0) {
                container.scrollTo({ top: target.offsetTop - 20, behavior: "smooth" });
            } else if (attempts < 10) {
                attempts++;
                setTimeout(tryScroll, 200);
            }
        };

        const timer = setTimeout(tryScroll, 100);
        return () => clearTimeout(timer);
    }, [activeScene]);

    /* ---- Scene 2 animation timers ---- */
    useEffect(() => {
        s2Timers.current.forEach(clearTimeout);
        s2Timers.current = [];

        if (activeScene !== 2) {
            if (activeScene > 2) {
                // Keep scene 2 in finished state
                setS2Phase(7);
                setS2AiWriting(false);
            } else {
                setS2Phase(0);
                setS2AiWriting(false);
            }
            return;
        }

        const push = (fn: () => void, delay: number) => {
            s2Timers.current.push(setTimeout(fn, delay));
        };

        push(() => setS2Phase(1), 800);
        push(() => setS2Phase(3), 5500);
        push(() => { setS2Phase(4); setS2AiWriting(true); }, 6500);
        push(() => setS2AiWriting(false), 12000);
        push(() => setS2Phase(6), 16000);
        push(() => setS2Phase(7), 38500);

        return () => s2Timers.current.forEach(clearTimeout);
    }, [activeScene]);

    /* ---- Scene 3 animation timers ---- */
    useEffect(() => {
        s3Timers.current.forEach(clearTimeout);
        s3Timers.current = [];

        if (activeScene !== 3) {
            if (activeScene > 3) {
                setS3Phase(9);
                setS3MicActive(false);
                setS3AiWriting(false);
                setS3ScrollOffset(120);
            } else {
                setS3Phase(0);
                setS3MicActive(false);
                setS3AiWriting(false);
                setS3ScrollOffset(0);
            }
            return;
        }

        const push = (fn: () => void, delay: number) => {
            s3Timers.current.push(setTimeout(fn, delay));
        };

        push(() => setS3Phase(1), 400);
        push(() => setS3Phase(2), 11000);
        push(() => { setS3Phase(3); setS3AiWriting(true); }, 13000);
        push(() => setS3AiWriting(false), 16000);
        push(() => { setS3Phase(4); setS3MicActive(true); }, 17000);
        push(() => setS3MicActive(false), 20000);
        push(() => { setS3Phase(5); setS3MicActive(true); }, 21000);
        push(() => setS3MicActive(false), 24000);
        push(() => { setS3Phase(6); setS3MicActive(true); }, 25000);
        push(() => setS3MicActive(false), 27500);
        push(() => setS3Phase(8), 29000);
        push(() => setS3ScrollOffset(120), 48000);
        push(() => setS3Phase(9), 62000);

        return () => s3Timers.current.forEach(clearTimeout);
    }, [activeScene]);

    /* ---- Derived state ---- */
    const s2CirclesActive = s2Phase >= 4;
    const s2AiTextActive = s2Phase >= 4;
    const s2ProofActive = s2Phase >= 6;

    const s3HintPulsing = s3Phase === 2;
    const s3ShowCircles = s3Phase >= 3;
    const s3ShowReconsider = s3Phase >= 3;
    const s3ProofActive = s3Phase >= 8;

    // Show floating controls based on which scene is active
    const showS2Controls = activeScene === 2;
    const showS3Controls = activeScene === 3;

    return (
        <div className="h-full flex flex-col overflow-hidden relative bg-[#F2F2F7]">
            {/* Scrollable PDF container */}
            <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-auto relative flex flex-col items-center py-5 px-4 gap-6 pb-8"
            >
                {/* Page 1 */}
                <div className="shrink-0">
                    <PDFPageView pageNumber={1} width={700} className="rounded-lg shadow-xl" />
                </div>

                {/* Page 2 — Problem 1 */}
                <div ref={page2Ref} className="relative shrink-0">
                    <PDFPageView pageNumber={2} width={700} className="rounded-lg shadow-xl">
                        {s2Phase >= 1 && (
                            <AnimatedHandwriting lines={S2_USER_EXAMPLES} isActive={s2Phase >= 1} />
                        )}
                        {s2CirclesActive && (
                            <AnimatedCircles
                                isActive
                                circles={[
                                    { id: "c1", cx: 102, cy: 250, rx: 38, ry: 13, color: "#6366F1", startDelay: 0 },
                                    { id: "c2", cx: 102, cy: 275, rx: 38, ry: 13, color: "#6366F1", startDelay: 850 },
                                    { id: "c3", cx: 115, cy: 300, rx: 50, ry: 13, color: "#6366F1", startDelay: 1700 },
                                ]}
                            />
                        )}
                        {s2AiTextActive && (
                            <AnimatedHandwriting lines={S2_AI_SIDE_NOTES} isActive={s2AiTextActive} />
                        )}
                        {s2ProofActive && (
                            <line x1="80" y1="375" x2="480" y2="375" stroke="#E5E5EA" strokeWidth="0.8" />
                        )}
                        {s2ProofActive && (
                            <AnimatedHandwriting lines={S2_USER_PROOF} isActive={s2ProofActive} />
                        )}
                        {s2Phase >= 7 && (
                            <text x="80" y="595" fontSize="15" fill="#10B981" fontFamily="Caveat, cursive" fontWeight="600">
                                ✓ Proof complete!
                            </text>
                        )}
                    </PDFPageView>
                </div>

                {/* Page 3 — Problem 2 */}
                <div ref={page3Ref} className="relative shrink-0">
                    <PDFPageView
                        pageNumber={3}
                        width={700}
                        className="rounded-lg shadow-xl"
                        scrollOffset={s3ScrollOffset}
                    >
                        {s3Phase >= 1 && (
                            <AnimatedHandwriting lines={S3_USER_ATTEMPT} isActive={s3Phase >= 1} />
                        )}
                        {s3ShowCircles && (
                            <AnimatedCircles
                                isActive
                                circles={[
                                    { id: "c1", cx: 200, cy: 300, rx: 135, ry: 14, color: "#6366F1", startDelay: 0 },
                                ]}
                            />
                        )}
                        {s3ShowReconsider && (
                            <AnimatedHandwriting lines={S3_AI_RECONSIDER} isActive />
                        )}
                        {s3ProofActive && (
                            <line x1="80" y1="398" x2="480" y2="398" stroke="#E5E5EA" strokeWidth="0.8" />
                        )}
                        {s3ProofActive && (
                            <AnimatedHandwriting lines={S3_USER_PROOF} isActive={s3ProofActive} />
                        )}
                        {s3Phase >= 9 && (
                            <text x="80" y="655" fontSize="15" fill="#10B981" fontFamily="Caveat, cursive" fontWeight="600">
                                ✓ Proof complete!
                            </text>
                        )}
                    </PDFPageView>
                </div>
            </div>

            {/* ======== Floating Controls (fixed position, not scrollable) ======== */}
            {activeScene >= 1 && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
                    {/* AI hint button */}
                    <div className="relative">
                        {/* Pulsing ring when hint is available */}
                        {((activeScene === 2 && s2Phase === 3) || (activeScene === 3 && s3HintPulsing)) && (
                            <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 1.1, repeat: Infinity }}
                                className="absolute inset-0 rounded-2xl bg-[#6366F1]"
                            />
                        )}
                        {/* Spinning ring while AI is annotating */}
                        {((activeScene === 2 && s2AiWriting) || (activeScene === 3 && s3AiWriting)) && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-1.5 rounded-3xl border-2 border-transparent border-t-[#6366F1] border-r-[#8B5CF6]"
                            />
                        )}
                        <button
                            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${(activeScene === 2 && s2Phase >= 4) || (activeScene === 3 && s3Phase >= 3)
                                ? "bg-gradient-to-br from-[#5558E3] to-[#7C3AED]"
                                : "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
                                }`}
                            style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}
                        >
                            <Sparkles size={20} color="white" />
                        </button>
                        {/* "AI annotating" tooltip */}
                        <AnimatePresence>
                            {((activeScene === 2 && s2AiWriting) || (activeScene === 3 && s3AiWriting)) && (
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

                    {/* Mic button */}
                    <div className="relative">
                        {s3MicActive && activeScene === 3 && (
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
                                s3MicActive && activeScene === 3
                                    ? { backgroundColor: "#EF4444" }
                                    : { backgroundColor: "#F2F2F7" }
                            }
                            transition={{ duration: 0.2 }}
                            className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                            style={{
                                boxShadow: s3MicActive && activeScene === 3
                                    ? "0 4px 16px rgba(239,68,68,0.45)"
                                    : "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                        >
                            {s3MicActive && activeScene === 3 ? (
                                <MicOff size={20} color="white" />
                            ) : (
                                <Mic size={20} className="text-[#6B7280]" />
                            )}
                        </motion.button>

                        {/* Voice waveform tooltip */}
                        <AnimatePresence>
                            {s3MicActive && activeScene === 3 && (
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
            )}
        </div>
    );
}
