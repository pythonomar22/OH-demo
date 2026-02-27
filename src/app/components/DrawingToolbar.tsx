import { useState } from "react";
import {
  Pen,
  Pencil,
  Highlighter,
  Eraser,
  Type,
  Minus,
  Circle,
  Square,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Lasso,
  Grid3x3,
  MessageSquareText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type DrawingTool = "select" | "pen" | "pencil" | "highlighter" | "eraser" | "text" | "line" | "circle" | "rect";

const COLORS = ["#1C1C1E", "#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#6B7280"];
const STROKE_SIZES = [{ label: "XS", value: 1 }, { label: "S", value: 2 }, { label: "M", value: 4 }, { label: "L", value: 8 }];

interface DrawingToolbarProps {
  currentTool: DrawingTool;
  currentColor: string;
  strokeSize: number;
  onToolChange: (tool: DrawingTool) => void;
  onColorChange: (color: string) => void;
  onStrokeSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  noteTitle: string;
  activeScene: number;
  onTranscript: () => void;
}

export function DrawingToolbar({
  currentTool,
  currentColor,
  strokeSize,
  onToolChange,
  onColorChange,
  onStrokeSizeChange,
  onUndo,
  onRedo,
  onClear,
  noteTitle,
  activeScene,
  onTranscript,
}: DrawingToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const tools = [
    { id: "select" as DrawingTool, icon: Lasso, label: "Select" },
    { id: "pen" as DrawingTool, icon: Pen, label: "Pen" },
    { id: "pencil" as DrawingTool, icon: Pencil, label: "Pencil" },
    { id: "highlighter" as DrawingTool, icon: Highlighter, label: "Highlighter" },
    { id: "eraser" as DrawingTool, icon: Eraser, label: "Eraser" },
    { id: "text" as DrawingTool, icon: Type, label: "Text" },
  ];

  const sceneLabel = activeScene === 1 ? "Upload" : activeScene === 4 ? "Session Review" : noteTitle;

  return (
    <div className="h-14 bg-white border-b border-[#E5E5EA] flex items-center px-3 gap-2 relative z-10 shadow-sm">
      {/* Note title */}
      <div className="flex items-center gap-2 mr-2 min-w-0">
        <span className="text-[#1C1C1E] font-semibold truncate max-w-[180px]" style={{ fontFamily: "Inter", fontSize: 14 }}>
          {sceneLabel}
        </span>
        <ChevronDown size={13} className="text-[#8E8E93] flex-shrink-0" />
      </div>

      <div className="w-px h-8 bg-[#E5E5EA] flex-shrink-0" />

      {/* Drawing Tools */}
      <div className="flex items-center gap-0.5 bg-[#F2F2F7] rounded-xl p-1 flex-shrink-0">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              currentTool === tool.id ? "bg-white shadow-sm" : "hover:bg-white/60"
            }`}
          >
            <tool.icon
              size={15}
              style={{ color: currentTool === tool.id ? (tool.id === "eraser" ? "#6366F1" : currentColor) : "#6B7280" }}
            />
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-[#E5E5EA] flex-shrink-0" />

      {/* Shape tools */}
      <div className="flex items-center gap-0.5 bg-[#F2F2F7] rounded-xl p-1 flex-shrink-0">
        {[{ id: "line" as DrawingTool, icon: Minus }, { id: "circle" as DrawingTool, icon: Circle }, { id: "rect" as DrawingTool, icon: Square }].map((s) => (
          <button key={s.id} onClick={() => onToolChange(s.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${currentTool === s.id ? "bg-white shadow-sm" : "hover:bg-white/50"}`}>
            <s.icon size={14} style={{ color: currentTool === s.id ? currentColor : "#6B7280" }} />
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-[#E5E5EA] flex-shrink-0" />

      {/* Color */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-1.5 bg-[#F2F2F7] rounded-xl px-2.5 py-1.5 hover:bg-[#E5E5EA] transition-colors"
        >
          <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: currentColor }} />
          <ChevronDown size={11} className="text-[#8E8E93]" />
        </button>
        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-xl border border-[#E5E5EA] p-3 z-50"
            >
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => { onColorChange(c); setShowColorPicker(false); }}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stroke sizes */}
      <div className="flex items-center gap-0.5 bg-[#F2F2F7] rounded-xl px-1.5 py-1 flex-shrink-0">
        {STROKE_SIZES.map((s) => (
          <button
            key={s.value}
            onClick={() => onStrokeSizeChange(s.value)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${strokeSize === s.value ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
          >
            <div className="rounded-full" style={{ width: s.value + 1, height: s.value + 1, backgroundColor: strokeSize === s.value ? currentColor : "#9CA3AF" }} />
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-[#E5E5EA] flex-shrink-0" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5 bg-[#F2F2F7] rounded-xl p-1 flex-shrink-0">
        <button onClick={onUndo} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/60">
          <Undo2 size={15} className="text-[#6B7280]" />
        </button>
        <button onClick={onRedo} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/60">
          <Redo2 size={15} className="text-[#6B7280]" />
        </button>
      </div>

      <div className="w-px h-8 bg-[#E5E5EA] flex-shrink-0" />

      {/* Grid + Clear */}
      <button className="flex items-center gap-1 bg-[#F2F2F7] rounded-xl px-2.5 py-1.5 hover:bg-[#E5E5EA] flex-shrink-0">
        <Grid3x3 size={13} className="text-[#6B7280]" />
      </button>
      <button onClick={onClear} className="flex items-center gap-1 bg-[#F2F2F7] rounded-xl px-2.5 py-1.5 hover:bg-red-50 transition-colors text-xs text-[#6B7280] hover:text-[#EF4444] flex-shrink-0" style={{ fontFamily: "Inter" }}>
        Clear
      </button>

      <div className="flex-1" />

      {/* Zoom */}
      <div className="flex items-center gap-0.5 bg-[#F2F2F7] rounded-xl p-1 flex-shrink-0">
        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/60"><ZoomOut size={13} className="text-[#6B7280]" /></button>
        <span className="text-xs text-[#8E8E93] px-1" style={{ fontFamily: "Inter" }}>100%</span>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/60"><ZoomIn size={13} className="text-[#6B7280]" /></button>
      </div>

      {/* Transcript button */}
      {(activeScene === 2 || activeScene === 3) && (
        <button
          onClick={onTranscript}
          className="flex items-center gap-1.5 bg-[#F2F2F7] hover:bg-[#EEF2FF] border border-transparent hover:border-[#C7D2FE] rounded-xl px-3 py-1.5 transition-all text-xs text-[#6B7280] hover:text-[#6366F1] font-medium flex-shrink-0"
          style={{ fontFamily: "Inter" }}
        >
          <MessageSquareText size={13} />
          Transcript
        </button>
      )}
    </div>
  );
}