import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DrawingTool } from "./DrawingToolbar";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  tool: DrawingTool;
}

interface DrawingCanvasProps {
  currentTool: DrawingTool;
  currentColor: string;
  strokeSize: number;
  clearTrigger: number;
  undoTrigger: number;
  redoTrigger: number;
}

// Sample pre-drawn handwriting content as SVG paths (simulated math notes)
const SampleContent = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    style={{ fontFamily: "Caveat, cursive" }}
  >
    {/* Title */}
    <text x="80" y="52" fontSize="26" fill="#1C1C1E" fontWeight="600" fontFamily="Caveat, cursive">
      Chapter 4: Integration
    </text>

    {/* Underline */}
    <line x1="80" y1="60" x2="340" y2="60" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

    {/* Date */}
    <text x="80" y="98" fontSize="16" fill="#8E8E93" fontFamily="Caveat, cursive">
      February 27, 2026
    </text>

    {/* Problem 1 label */}
    <text x="80" y="140" fontSize="18" fill="#6366F1" fontWeight="600" fontFamily="Caveat, cursive">
      Problem 1:
    </text>
    <text x="80" y="168" fontSize="20" fill="#1C1C1E" fontFamily="Caveat, cursive">
      Find  ∫ (3x² + 2x - 1) dx
    </text>

    {/* Work */}
    <text x="80" y="208" fontSize="19" fill="#1C1C1E" fontFamily="Caveat, cursive">
      = ∫3x² dx  +  ∫2x dx  -  ∫1 dx
    </text>

    {/* Partial solution with question mark */}
    <text x="80" y="248" fontSize="19" fill="#1C1C1E" fontFamily="Caveat, cursive">
      = x³ + x²  -  ?  +  C
    </text>

    {/* Scribble / question mark emphasis */}
    <text x="240" y="248" fontSize="24" fill="#EF4444" fontFamily="Caveat, cursive">
      ?
    </text>

    {/* Circle around the question area */}
    <ellipse cx="255" cy="240" rx="28" ry="18" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />

    {/* Separator */}
    <line x1="80" y1="278" x2="460" y2="278" stroke="#E5E5EA" strokeWidth="1" />

    {/* Problem 2 */}
    <text x="80" y="312" fontSize="18" fill="#6366F1" fontWeight="600" fontFamily="Caveat, cursive">
      Problem 2:
    </text>
    <text x="80" y="340" fontSize="19" fill="#1C1C1E" fontFamily="Caveat, cursive">
      Evaluate ∫₀² (x² + 1) dx
    </text>

    {/* Work for problem 2 */}
    <text x="80" y="376" fontSize="18" fill="#1C1C1E" fontFamily="Caveat, cursive">
      =  [ x³/3 + x ]₀²
    </text>

    <text x="80" y="412" fontSize="18" fill="#1C1C1E" fontFamily="Caveat, cursive">
      =  (8/3 + 2) - (0)
    </text>

    <text x="80" y="448" fontSize="18" fill="#1C1C1E" fontFamily="Caveat, cursive">
      =  ??? 
    </text>

    {/* Scribble marks */}
    <text x="128" y="448" fontSize="22" fill="#3B82F6" fontFamily="Caveat, cursive">
      ← stuck here
    </text>

    {/* Highlighter effect over problem 1 */}
    <rect x="76" y="153" width="295" height="24" fill="#FEF08A" opacity="0.35" rx="3" />

    {/* Margin note */}
    <text x="520" y="180" fontSize="15" fill="#10B981" fontFamily="Caveat, cursive" transform="rotate(-3, 520, 180)">
      power rule!
    </text>
    <text x="520" y="200" fontSize="15" fill="#10B981" fontFamily="Caveat, cursive" transform="rotate(-3, 520, 200)">
      xⁿ → xⁿ⁺¹/n+1
    </text>

    {/* Arrow from margin note to problem */}
    <path d="M 518 195 Q 490 195 478 200" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow)" opacity="0.7" />

    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 z" fill="#10B981" />
      </marker>
    </defs>

    {/* Star mark */}
    <text x="52" y="172" fontSize="18" fill="#F59E0B" fontFamily="Caveat, cursive">
      ★
    </text>

    {/* Bottom note */}
    <text x="80" y="500" fontSize="15" fill="#8E8E93" fontFamily="Caveat, cursive">
      * Don't forget the constant of integration C !!
    </text>
  </svg>
);

export function DrawingCanvas({
  currentTool,
  currentColor,
  strokeSize,
  clearTrigger,
  undoTrigger,
  redoTrigger,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const drawAllStrokes = useCallback((ctx: CanvasRenderingContext2D, strokeList: Stroke[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    strokeList.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.tool === "highlighter") {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = stroke.size * 6;
      } else if (stroke.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = stroke.size * 8;
        ctx.globalAlpha = 1;
      } else if (stroke.tool === "pencil") {
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = stroke.size;
      } else {
        ctx.globalAlpha = 1;
        ctx.lineWidth = stroke.size;
      }

      ctx.strokeStyle = stroke.tool === "eraser" ? "rgba(0,0,0,1)" : stroke.color;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length - 1; i++) {
        const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
        const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, midX, midY);
      }

      const last = stroke.points[stroke.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    drawAllStrokes(ctx, strokes);
  }, [strokes, drawAllStrokes]);

  useEffect(() => {
    if (clearTrigger > 0) setStrokes([]);
  }, [clearTrigger]);

  useEffect(() => {
    if (undoTrigger > 0 && strokes.length > 0) {
      const last = strokes[strokes.length - 1];
      setRedoStack((prev) => [...prev, last]);
      setStrokes((prev) => prev.slice(0, -1));
    }
  }, [undoTrigger]);

  useEffect(() => {
    if (redoTrigger > 0 && redoStack.length > 0) {
      const last = redoStack[redoStack.length - 1];
      setStrokes((prev) => [...prev, last]);
      setRedoStack((prev) => prev.slice(0, -1));
    }
  }, [redoTrigger]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (currentTool === "select" || currentTool === "text") return;
    e.preventDefault();
    const pos = getPos(e);
    currentStrokeRef.current = {
      points: [pos],
      color: currentColor,
      size: strokeSize,
      tool: currentTool,
    };
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();
    const pos = getPos(e);
    currentStrokeRef.current.points.push(pos);

    // Draw live preview
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    drawAllStrokes(ctx, strokes);

    // Draw current stroke
    const stroke = currentStrokeRef.current;
    if (stroke.points.length < 2) return;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (stroke.tool === "highlighter") {
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = stroke.size * 6;
    } else if (stroke.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = stroke.size * 8;
      ctx.globalAlpha = 1;
    } else if (stroke.tool === "pencil") {
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = stroke.size;
    } else {
      ctx.globalAlpha = 1;
      ctx.lineWidth = stroke.size;
    }

    ctx.strokeStyle = stroke.tool === "eraser" ? "rgba(0,0,0,1)" : stroke.color;
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length - 1; i++) {
      const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
      const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, midX, midY);
    }

    const last = stroke.points[stroke.points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  const endDrawing = () => {
    if (!isDrawing || !currentStrokeRef.current) return;
    setStrokes((prev) => [...prev, currentStrokeRef.current!]);
    setRedoStack([]);
    currentStrokeRef.current = null;
    setIsDrawing(false);
  };

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const observer = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      drawAllStrokes(ctx, strokes);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [strokes, drawAllStrokes]);

  const getCursor = () => {
    switch (currentTool) {
      case "eraser": return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='8' fill='white' stroke='%23ccc' stroke-width='1.5'/%3E%3C/svg%3E\") 10 10, auto";
      case "text": return "text";
      case "select": return "default";
      default: return "crosshair";
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F7]">
      {/* Page area */}
      <div className="flex-1 overflow-auto flex items-start justify-center py-6 px-4">
        <div className="relative w-full max-w-4xl">
          {/* Paper */}
          <div
            ref={containerRef}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
            style={{ minHeight: "calc(100vh - 200px)", height: "780px" }}
          >
            {/* Red margin line */}
            <div className="absolute top-0 bottom-0 left-[72px] w-px bg-[#FECACA] z-10 pointer-events-none" />

            {/* Ruled lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 31px, #E8EEFE 31px, #E8EEFE 32px)",
                backgroundSize: "100% 32px",
                backgroundPosition: "0 40px",
              }}
            />

            {/* Sample handwriting content */}
            <div className="absolute inset-0 pointer-events-none">
              <SampleContent />
            </div>

            {/* Drawing canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ cursor: getCursor(), touchAction: "none" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />

            {/* Page number */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-full bg-white/80 backdrop-blur border border-[#E5E5EA] flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors shadow-sm"
              >
                <ChevronLeft size={14} className="text-[#6B7280]" />
              </button>
              <span className="text-sm text-[#8E8E93] bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-[#E5E5EA] shadow-sm" style={{ fontFamily: "Inter" }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-full bg-white/80 backdrop-blur border border-[#E5E5EA] flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors shadow-sm"
              >
                <ChevronRight size={14} className="text-[#6B7280]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
