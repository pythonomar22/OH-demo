import { useState, useEffect, useRef } from "react";

export interface TextLine {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontWeight?: string;
  startDelay: number; // ms from when isActive becomes true
  charSpeed?: number; // ms per character, default 32
}

interface AnimatedHandwritingProps {
  lines: TextLine[];
  isActive: boolean;
  onComplete?: () => void;
}

export function AnimatedHandwriting({ lines, isActive, onComplete }: AnimatedHandwritingProps) {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    lines.forEach((line) => {
      const speed = line.charSpeed ?? 32;
      for (let i = 1; i <= line.text.length; i++) {
        const t = setTimeout(() => {
          setProgress((prev) => ({ ...prev, [line.id]: i }));
          if (i === line.text.length && onComplete) {
            // check if this is the last line
            const lastLine = lines[lines.length - 1];
            if (line.id === lastLine.id) {
              onComplete();
            }
          }
        }, line.startDelay + i * speed);
        timersRef.current.push(t);
      }
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  return (
    <>
      {lines.map((line) => {
        const revealed = progress[line.id] || 0;
        const showCursor = revealed > 0 && revealed < line.text.length;
        return (
          <text
            key={line.id}
            x={line.x}
            y={line.y}
            fill={line.color}
            fontSize={line.fontSize}
            fontFamily="Caveat, cursive"
            fontWeight={line.fontWeight || "normal"}
          >
            {line.text.slice(0, revealed)}
            {showCursor && (
              <tspan
                fill={line.color}
                opacity={0.6}
                style={{ animation: "blink 0.8s step-end infinite" }}
              >
                |
              </tspan>
            )}
          </text>
        );
      })}
    </>
  );
}

interface AICircleAnnotation {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  startDelay: number;
  color: string;
  rotation?: number;
}

interface AnimatedCirclesProps {
  circles: AICircleAnnotation[];
  isActive: boolean;
}

export function AnimatedCircles({ circles, isActive }: AnimatedCirclesProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    circles.forEach((c) => {
      const t = setTimeout(() => {
        setVisible((prev) => ({ ...prev, [c.id]: true }));
      }, c.startDelay);
      timersRef.current.push(t);
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  return (
    <>
      {circles.map((c) => {
        if (!visible[c.id]) return null;
        // Hand-drawn ellipse path using two arcs
        const d = `M ${c.cx - c.rx} ${c.cy} a ${c.rx} ${c.ry} 0 1 0 ${2 * c.rx} 0 a ${c.rx} ${c.ry} 0 1 0 ${-2 * c.rx} 0`;
        return (
          <path
            key={c.id}
            d={d}
            fill="none"
            stroke={c.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="0"
            style={{
              strokeDashoffset: "1000",
              animation: "drawPath 0.9s ease-out forwards",
            }}
          />
        );
      })}
      <style>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

interface AIUnderlineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startDelay: number;
  color: string;
  isActive: boolean;
}

export function AIUnderline({ x1, y1, x2, y2, startDelay, color, isActive }: AIUnderlineProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setVisible(true), startDelay);
    return () => clearTimeout(t);
  }, [isActive, startDelay]);

  if (!visible) return null;

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={length}
      strokeDashoffset={length}
      style={{ animation: "drawLine 0.6s ease-out forwards" }}
    />
  );
}
