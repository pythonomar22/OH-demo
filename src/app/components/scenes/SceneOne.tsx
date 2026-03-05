import { PDFPageView } from "../PDFPageView";
import { motion } from "motion/react";

interface SceneOneProps {
  isActive: boolean;
}

export function SceneOne({ isActive }: SceneOneProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F7]">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
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
      </div>
    </div>
  );
}
