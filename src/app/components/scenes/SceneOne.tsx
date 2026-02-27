import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Upload, CheckCircle2, BookOpen } from "lucide-react";

interface SceneOneProps {
  isActive: boolean;
}

export function SceneOne({ isActive }: SceneOneProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) { setPhase(0); return; }
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F7]">
      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {phase < 3 ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              {/* Upload card */}
              <div className="bg-white rounded-3xl shadow-lg border border-[#E5E5EA] overflow-hidden">
                <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-6 py-4 flex items-center gap-3">
                  <BookOpen size={20} color="white" />
                  <span className="text-white font-semibold" style={{ fontFamily: "Inter" }}>
                    Office Hours — Upload Assignment
                  </span>
                </div>

                <div className="p-8">
                  <div className="text-center mb-6">
                    <p className="text-[#1C1C1E] font-semibold mb-1" style={{ fontFamily: "Inter", fontSize: 18 }}>
                      MATH 2200 — Discrete Mathematics
                    </p>
                    <p className="text-[#8E8E93] text-sm" style={{ fontFamily: "Inter" }}>
                      Upload your homework to get started
                    </p>
                  </div>

                  {/* Drop zone */}
                  <motion.div
                    animate={phase === 1 ? { borderColor: "#6366F1", backgroundColor: "#F0F0FF" } : {}}
                    className="border-2 border-dashed border-[#D1D1D6] rounded-2xl p-12 flex flex-col items-center gap-4 relative overflow-hidden transition-colors"
                  >
                    {/* File dropping animation */}
                    <AnimatePresence>
                      {phase === 0 && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-[#F2F2F7] flex items-center justify-center">
                            <Upload size={28} className="text-[#8E8E93]" />
                          </div>
                          <div className="text-center">
                            <p className="text-[#1C1C1E] font-medium" style={{ fontFamily: "Inter" }}>
                              Drop your PDF here or tap to browse
                            </p>
                            <p className="text-[#8E8E93] text-sm mt-1" style={{ fontFamily: "Inter" }}>
                              Supports PDF, images, and scanned documents
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {phase >= 1 && phase < 2 && (
                        <motion.div
                          key="dropping"
                          initial={{ y: -80, opacity: 0, rotate: -5 }}
                          animate={{ y: 0, opacity: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-20 bg-white rounded-xl border-2 border-[#6366F1] shadow-lg flex flex-col items-center justify-center gap-1">
                            <FileText size={24} className="text-[#6366F1]" />
                            <span className="text-[8px] text-[#6366F1] font-bold" style={{ fontFamily: "Inter" }}>PDF</span>
                          </div>
                          <p className="text-[#6366F1] text-sm font-medium" style={{ fontFamily: "Inter" }}>
                            HW3_MATH2200.pdf
                          </p>
                        </motion.div>
                      )}

                      {phase >= 2 && (
                        <motion.div
                          key="uploading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full flex flex-col items-center gap-4"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center">
                            <motion.div
                              animate={phase < 3 ? { rotate: 360 } : {}}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              {phase < 3 ? (
                                <Upload size={24} className="text-[#6366F1]" />
                              ) : (
                                <CheckCircle2 size={24} className="text-[#10B981]" />
                              )}
                            </motion.div>
                          </div>
                          <div className="w-full max-w-xs">
                            <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "Inter" }}>
                              <span className="text-[#6B7280]">HW3_MATH2200.pdf</span>
                              <span className="text-[#6366F1]">{phase < 3 ? "Uploading..." : "Done!"}</span>
                            </div>
                            <div className="h-2 bg-[#E5E5EA] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: phase >= 2 ? "100%" : "0%" }}
                                transition={{ duration: 1.0, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Document preview */
            <motion.div
              key="document"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-[#E5E5EA] overflow-hidden" style={{ minHeight: 480 }}>
                {/* Document header */}
                <div className="border-b border-[#F2F2F7] px-10 py-6 flex justify-between items-start">
                  <div>
                    <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-1" style={{ fontFamily: "Inter" }}>
                      MATH 2200 — Discrete Mathematics
                    </p>
                    <h2 className="text-[#1C1C1E]" style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700 }}>
                      Homework 3
                    </h2>
                    <p className="text-sm text-[#8E8E93] mt-1" style={{ fontFamily: "Inter" }}>
                      Due: March 1, 2026 &nbsp;·&nbsp; 50 Points Total
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#ECFDF5] px-3 py-1.5 rounded-xl">
                    <CheckCircle2 size={14} className="text-[#10B981]" />
                    <span className="text-xs text-[#10B981] font-medium" style={{ fontFamily: "Inter" }}>Uploaded</span>
                  </div>
                </div>

                <div className="px-10 py-8 space-y-8">
                  {/* Problem 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold" style={{ fontFamily: "Inter" }}>1</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-[#1C1C1E]" style={{ fontFamily: "Inter" }}>
                          Problem 1
                        </p>
                        <span className="text-xs bg-[#F2F2F7] text-[#6B7280] px-2 py-0.5 rounded-full" style={{ fontFamily: "Inter" }}>
                          25 pts
                        </span>
                      </div>
                      <p className="text-[#3C3C43] leading-relaxed" style={{ fontFamily: "Inter", fontSize: 15 }}>
                        Given an integer <em>n</em>, if <em>n</em> is odd, is <em>n</em>² odd?{" "}
                        <strong>Please write a formal proof or disproof.</strong>
                      </p>
                    </div>
                  </motion.div>

                  <div className="border-t border-[#F2F2F7]" />

                  {/* Problem 2 */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold" style={{ fontFamily: "Inter" }}>2</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-[#1C1C1E]" style={{ fontFamily: "Inter" }}>
                          Problem 2
                        </p>
                        <span className="text-xs bg-[#F2F2F7] text-[#6B7280] px-2 py-0.5 rounded-full" style={{ fontFamily: "Inter" }}>
                          25 pts
                        </span>
                      </div>
                      <p className="text-[#3C3C43] leading-relaxed" style={{ fontFamily: "Inter", fontSize: 15 }}>
                        For all integers <em>m</em> and <em>n</em>, if <em>mn</em> is even and <em>m</em> is odd,{" "}
                        <strong>prove that <em>n</em> is even.</strong>
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Open in notes button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="px-10 pb-8 flex gap-3"
                >
                  <button className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-2xl py-3 font-medium text-sm shadow-md" style={{ fontFamily: "Inter" }}>
                    Open in Note Editor →
                  </button>
                  <button className="px-5 py-3 rounded-2xl border border-[#E5E5EA] text-[#6B7280] text-sm" style={{ fontFamily: "Inter" }}>
                    Preview PDF
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
