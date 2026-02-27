import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  ChevronLeft,
  Wifi,
  Signal,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { NotesSidebar } from "./components/NotesSidebar";
import { DrawingToolbar, DrawingTool } from "./components/DrawingToolbar";
import { TranscriptModal } from "./components/TranscriptModal";
import { SceneOne } from "./components/scenes/SceneOne";
import { SceneTwo } from "./components/scenes/SceneTwo";
import { SceneThree } from "./components/scenes/SceneThree";
import { SceneFour } from "./components/scenes/SceneFour";

const SCENE_LABELS = [
  "Upload Assignment",
  "Problem 1: Odd² Proof",
  "Problem 2: Even Product",
  "Session Complete",
];

const SCENE_NOTES = [
  "Homework 3",
  "Problem 1 — Direct Proof",
  "Problem 2 — Contradiction",
  "Session Review",
];

export default function App() {
  const [scene, setScene] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTool, setCurrentTool] = useState<DrawingTool>("pen");
  const [currentColor, setCurrentColor] = useState("#1C1C1E");
  const [strokeSize, setStrokeSize] = useState(2);
  const [showTranscript, setShowTranscript] = useState(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const goNext = () => setScene((s) => Math.min(4, s + 1));
  const goPrev = () => setScene((s) => Math.max(1, s - 1));

  return (
    <div
      className="w-full h-screen bg-[#111118] flex flex-col items-center justify-center overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* iPad Frame */}
      <div
        className="relative bg-[#F2F2F7] overflow-hidden flex flex-col"
        style={{
          width: "min(100vw, 1180px)",
          height: "min(100vh, 820px)",
          borderRadius: "min(2.5vw, 26px)",
          boxShadow: "0 0 0 2px #2A2A35, 0 0 0 4px #1A1A25, 0 40px 120px rgba(0,0,0,0.8)",
        }}
      >
        {/* Status Bar */}
        <div className="h-10 bg-white flex items-center justify-between px-6 shrink-0 border-b border-[#E5E5EA] z-20">
          <span className="text-xs font-semibold text-[#1C1C1E]" style={{ fontFamily: "Inter", minWidth: 50 }}>
            {timeStr}
          </span>
          {/* Center: App name */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
              <Sparkles size={11} color="white" />
            </div>
            <span className="text-xs font-bold text-[#1C1C1E]" style={{ fontFamily: "Inter" }}>
              Office Hours
            </span>
          </div>
          {/* Right: system icons */}
          <div className="flex items-center gap-2">
            <Signal size={13} className="text-[#1C1C1E]" />
            <Wifi size={13} className="text-[#1C1C1E]" />
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 rounded-sm border border-[#1C1C1E] relative flex items-center px-0.5">
                <div className="h-2 rounded-sm bg-[#34D399]" style={{ width: "78%" }} />
              </div>
              <div className="w-0.5 h-1.5 rounded-r-sm bg-[#1C1C1E]" />
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (hidden for Scenes 2 & 3) */}
          {(scene === 1) && (
            <NotesSidebar isOpen={sidebarOpen} activeScene={scene} />
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Toolbar row */}
            <div className="flex items-center h-14 bg-white border-b border-[#E5E5EA] shrink-0 z-10">
              {/* Sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-14 h-14 flex items-center justify-center hover:bg-[#F2F2F7] transition-colors shrink-0 border-r border-[#E5E5EA]"
              >
                <AnimatePresence mode="wait">
                  {sidebarOpen ? (
                    <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                      <ChevronLeft size={19} className="text-[#6B7280]" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                      <Menu size={19} className="text-[#6B7280]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <div className="flex-1 overflow-hidden">
                <DrawingToolbar
                  currentTool={currentTool}
                  currentColor={currentColor}
                  strokeSize={strokeSize}
                  onToolChange={setCurrentTool}
                  onColorChange={setCurrentColor}
                  onStrokeSizeChange={setStrokeSize}
                  onUndo={() => {}}
                  onRedo={() => {}}
                  onClear={() => {}}
                  noteTitle={SCENE_NOTES[scene - 1]}
                  activeScene={scene}
                  onTranscript={() => setShowTranscript(true)}
                />
              </div>
            </div>

            {/* Scene canvas area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Transcript modal rendered inside the content area */}
              <TranscriptModal
                isOpen={showTranscript}
                onClose={() => setShowTranscript(false)}
                scene={scene}
              />
              <AnimatePresence mode="wait">
                {scene === 1 && (
                  <motion.div key="s1" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <SceneOne isActive={scene === 1} />
                  </motion.div>
                )}
                {scene === 2 && (
                  <motion.div key="s2" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <SceneTwo isActive={scene === 2} />
                  </motion.div>
                )}
                {scene === 3 && (
                  <motion.div key="s3" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <SceneThree isActive={scene === 3} />
                  </motion.div>
                )}
                {scene === 4 && (
                  <motion.div key="s4" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <SceneFour isActive={scene === 4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Home bar */}
        <div className="h-7 bg-white border-t border-[#E5E5EA] flex items-center justify-center shrink-0">
          <div className="w-24 h-1 bg-[#C7C7CC] rounded-full" />
        </div>
      </div>

      {/* Scene Navigation Controls — below iPad */}
      <div className="mt-5 flex items-center gap-4 z-50">
        {/* Prev */}
        <button
          onClick={goPrev}
          disabled={scene === 1}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={16} color="white" />
        </button>

        {/* Scene dots */}
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur rounded-2xl px-4 py-2.5 border border-white/10">
          {SCENE_LABELS.map((label, i) => {
            const idx = i + 1;
            const isActive = scene === idx;
            const isDone = scene > idx;
            return (
              <button
                key={idx}
                onClick={() => setScene(idx)}
                className="flex items-center gap-2 transition-all"
              >
                <motion.div
                  animate={{
                    width: isActive ? "auto" : 8,
                    backgroundColor: isDone ? "#10B981" : isActive ? "#6366F1" : "#ffffff40",
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full overflow-hidden flex items-center"
                  style={{ minWidth: 8 }}
                >
                  {isActive && (
                    <span className="text-white text-xs px-2 whitespace-nowrap" style={{ fontFamily: "Inter", fontSize: 11 }}>
                      Scene {idx}: {label}
                    </span>
                  )}
                </motion.div>
              </button>
            );
          })}
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goNext}
          disabled={scene === 4}
          className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-2xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/40"
          style={{ fontFamily: "Inter" }}
        >
          Next Scene
          <ArrowRight size={15} />
        </motion.button>
      </div>
    </div>
  );
}