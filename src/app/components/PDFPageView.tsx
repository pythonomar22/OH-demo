import { useRef, useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Cache the PDF document so we don't reload it for each page
let pdfDocPromise: ReturnType<typeof pdfjsLib.getDocument>["promise"] | null = null;

function getPdfDoc() {
  if (!pdfDocPromise) {
    pdfDocPromise = pdfjsLib.getDocument("/pdf.pdf").promise;
  }
  return pdfDocPromise;
}

interface PDFPageViewProps {
  pageNumber: number;
  width?: number;
  className?: string;
  children?: React.ReactNode;
}

export function PDFPageView({
  pageNumber,
  width = 700,
  className = "",
  children,
}: PDFPageViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = useState({
    cssWidth: 0,
    cssHeight: 0,
    pdfWidth: 612,
    pdfHeight: 792,
  });

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const pdf = await getPdfDoc();
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;

      const unscaledViewport = page.getViewport({ scale: 1 });
      const ratio = window.devicePixelRatio || 1;
      const cssScale = width / unscaledViewport.width;
      const renderScale = cssScale * ratio;
      const viewport = page.getViewport({ scale: renderScale });

      const canvas = canvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const cssHeight = Math.round(
        width * (unscaledViewport.height / unscaledViewport.width)
      );

      setDims({
        cssWidth: width,
        cssHeight,
        pdfWidth: unscaledViewport.width,
        pdfHeight: unscaledViewport.height,
      });

      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [pageNumber, width]);

  const estimatedHeight = dims.cssHeight || Math.round(width * 1.294);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: dims.cssWidth || width, height: estimatedHeight }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: dims.cssWidth || width,
          height: estimatedHeight,
          display: "block",
        }}
      />
      {children && dims.cssWidth > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: dims.cssWidth, height: dims.cssHeight }}
          viewBox={`0 0 ${dims.pdfWidth} ${dims.pdfHeight}`}
          preserveAspectRatio="xMinYMin meet"
        >
          {children}
        </svg>
      )}
    </div>
  );
}
