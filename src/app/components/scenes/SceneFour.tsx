import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface SceneFourProps {
  isActive: boolean;
}

export function SceneFour({ isActive: _isActive }: SceneFourProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#F2F2F7]">
        <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-lg border border-[#E5E5EA] px-10 py-8 flex flex-col items-center text-center max-w-md"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center mb-4">
          <CheckCircle2 size={28} color="white" />
                </div>
        <p
          className="text-xl font-semibold text-[#1C1C1E] mb-2"
          style={{ fontFamily: "Inter" }}
        >
          Learner Profile Updated
        </p>
        <p
          className="text-sm text-[#6B7280] max-w-sm"
            style={{ fontFamily: "Inter" }}
          >
          Your recent work and preferences have been saved. Future hints and
          practice problems will use this updated learner profile.
        </p>
        </motion.div>
    </div>
  );
}
