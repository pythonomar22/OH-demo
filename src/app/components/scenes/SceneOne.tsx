import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Upload, CheckCircle2, BookOpen } from "lucide-react";
import { PDFPageView } from "../PDFPageView";

interface SceneOneProps {
  isActive: boolean;
}

export function SceneOne({ isActive }: SceneOneProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F7]">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
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
                  <span
                    className="text-white font-semibold"
                    style={{ fontFamily: "Inter" }}
                  >
                    Office Hours — Upload Assignment
                  </span>
                </div>

                <div className="p-8">
                  <div className="text-center mb-6">
                    <p
                      className="text-[#1C1C1E] font-semibold mb-1"
                      style={{ fontFamily: "Inter", fontSize: 18 }}
                    >
                      CS 103 — Mathematical Foundations of Computing
                    </p>
                    <p
                      className="text-[#8E8E93] text-sm"
                      style={{ fontFamily: "Inter" }}
                    >
                      Upload your homework to get started
                    </p>
                  </div>

                  {/* Drop zone */}
                  <motion.div
                    animate={
                      phase === 1
                        ? {
                            borderColor: "#6366F1",
                            backgroundColor: "#F0F0FF",
                          }
                        : {}
                    }
                    className="border-2 border-dashed border-[#D1D1D6] rounded-2xl p-12 flex flex-col items-center gap-4 relative overflow-hidden transition-colors"
                  >
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
                            <p
                              className="text-[#1C1C1E] font-medium"
                              style={{ fontFamily: "Inter" }}
                            >
                              Drop your PDF here or tap to browse
                            </p>
                            <p
                              className="text-[#8E8E93] text-sm mt-1"
                              style={{ fontFamily: "Inter" }}
                            >
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
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-20 bg-white rounded-xl border-2 border-[#6366F1] shadow-lg flex flex-col items-center justify-center gap-1">
                            <FileText size={24} className="text-[#6366F1]" />
                            <span
                              className="text-[8px] text-[#6366F1] font-bold"
                              style={{ fontFamily: "Inter" }}
                            >
                              PDF
                            </span>
                          </div>
                          <p
                            className="text-[#6366F1] text-sm font-medium"
                            style={{ fontFamily: "Inter" }}
                          >
                            CS103_ProblemSet1.pdf
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
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              {phase < 3 ? (
                                <Upload
                                  size={24}
                                  className="text-[#6366F1]"
                                />
                              ) : (
                                <CheckCircle2
                                  size={24}
                                  className="text-[#10B981]"
                                />
                              )}
                            </motion.div>
                          </div>
                          <div className="w-full max-w-xs">
                            <div
                              className="flex justify-between text-xs mb-1"
                              style={{ fontFamily: "Inter" }}
                            >
                              <span className="text-[#6B7280]">
                                CS103_ProblemSet1.pdf
                              </span>
                              <span className="text-[#6366F1]">
                                {phase < 3 ? "Uploading..." : "Done!"}
                              </span>
                            </div>
                            <div className="h-2 bg-[#E5E5EA] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: "0%" }}
                                animate={{
                                  width: phase >= 2 ? "100%" : "0%",
                                }}
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
            /* PDF document view — render all pages */
            <motion.div
              key="pdf-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 pb-8"
            >
              {[1, 2, 3].map((pageNum) => (
                <PDFPageView
                  key={pageNum}
                  pageNumber={pageNum}
                  width={680}
                  className="rounded-lg shadow-xl"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
