import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FolderOpen,
    FileText,
    Plus,
    Upload,
    ChevronRight,
    Search,
    Star,
    Clock,
    GraduationCap,
    BookOpen,
    Calculator,
    Atom,
    Cpu,
    X,
    Home,
    Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sidebar data                                                       */
/* ------------------------------------------------------------------ */
const SUBJECTS = [
    { id: "math51", name: "Math 51", subtitle: "Linear Algebra", icon: Calculator, color: "#F59E0B" },
    { id: "cs103", name: "CS 103", subtitle: "Mathematical Foundations", icon: GraduationCap, color: "#6366F1" },
    { id: "phys41", name: "Physics 41", subtitle: "Mechanics", icon: Atom, color: "#10B981" },
    { id: "engr40m", name: "ENGR 40M", subtitle: "Intro to EE", icon: Cpu, color: "#EF4444" },
];

/* ------------------------------------------------------------------ */
/*  File-picker data                                                   */
/* ------------------------------------------------------------------ */
const FILE_PICKER_FILES = [
    { id: "f1", name: "Lecture_Notes_Week5.pdf", size: "2.1 MB", date: "Feb 28" },
    { id: "f2", name: "CS103_ProblemSet1.pdf", size: "1.4 MB", date: "Mar 1", isTarget: true },
    { id: "f3", name: "Reading_Ch7.pdf", size: "3.2 MB", date: "Feb 25" },
    { id: "f4", name: "Study_Guide_Midterm.pdf", size: "890 KB", date: "Feb 20" },
];

interface SceneZeroProps {
    isActive: boolean;
    onComplete: () => void;
}

export function SceneZero({ isActive, onComplete }: SceneZeroProps) {
    const [phase, setPhase] = useState(0);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        if (!isActive) {
            setPhase(0);
            return;
        }
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];

        const push = (fn: () => void, delay: number) => {
            timersRef.current.push(setTimeout(fn, delay));
        };

        // Phase 0: Landing (sidebar visible, nothing selected)
        // Phase 1: CS 103 clicked (highlighted, main area transitions)
        push(() => setPhase(1), 2000);
        // Phase 2: Upload button clicked (file picker appears)
        push(() => setPhase(2), 4000);
        // Phase 3: File picker opens
        push(() => setPhase(3), 4600);
        // Phase 4: File selected (highlight CS103_ProblemSet1.pdf)
        push(() => setPhase(4), 6800);
        // Phase 5: File confirmed → close picker
        push(() => setPhase(5), 8200);
        // Advance to Scene 1 after picker fully closes
        push(() => onComplete(), 9000);

        return () => timersRef.current.forEach(clearTimeout);
    }, [isActive, onComplete]);

    const selectedSubject = phase >= 1 ? "cs103" : null;
    const showFilePicker = phase >= 3 && phase < 5;
    const fileSelected = phase >= 4;

    return (
        <div className="h-full flex overflow-hidden bg-[#F2F2F7]" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* ---- Sidebar ---- */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-56 bg-white border-r border-[#E5E5EA] flex flex-col shrink-0"
            >
                {/* Sidebar header */}
                <div className="px-4 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-bold text-[#1C1C1E]">My Notes</span>
                        <button className="w-7 h-7 rounded-lg bg-[#F2F2F7] flex items-center justify-center hover:bg-[#E8E8ED] transition-colors">
                            <Plus size={15} className="text-[#6B7280]" />
                        </button>
                    </div>
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-[#F2F2F7] rounded-xl px-3 py-2 mb-3">
                        <Search size={13} className="text-[#8E8E93]" />
                        <span className="text-xs text-[#8E8E93]">Search notes...</span>
                    </div>
                </div>

                {/* Quick links */}
                <div className="px-3 pb-2 space-y-0.5">
                    {[
                        { icon: Clock, label: "Recents", count: 4 },
                        { icon: Star, label: "Favorites", count: 2 },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#6B7280] hover:bg-[#F2F2F7] transition-colors cursor-pointer">
                            <item.icon size={14} />
                            <span className="text-xs font-medium flex-1">{item.label}</span>
                            <span className="text-[10px] text-[#C7C7CC] bg-[#F2F2F7] rounded-full px-1.5 py-0.5">{item.count}</span>
                        </div>
                    ))}
                </div>

                <div className="h-px bg-[#E5E5EA] mx-3 my-1" />

                {/* Subjects */}
                <div className="px-3 pt-1 pb-1">
                    <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider px-2.5">Courses</span>
                </div>
                <div className="px-3 space-y-0.5 flex-1">
                    {SUBJECTS.map((subject) => {
                        const isSelected = selectedSubject === subject.id;
                        return (
                            <motion.div
                                key={subject.id}
                                animate={isSelected ? { backgroundColor: "#F0F0FF" } : { backgroundColor: "transparent" }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-colors ${isSelected ? "ring-1 ring-[#6366F1]/20" : "hover:bg-[#F2F2F7]"
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${subject.color}15` }}
                                >
                                    <subject.icon size={15} style={{ color: subject.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold truncate ${isSelected ? "text-[#6366F1]" : "text-[#1C1C1E]"}`}>
                                        {subject.name}
                                    </p>
                                    <p className="text-[10px] text-[#8E8E93] truncate">{subject.subtitle}</p>
                                </div>
                                <ChevronRight size={12} className={isSelected ? "text-[#6366F1]" : "text-[#D1D1D6]"} />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Sidebar footer */}
                <div className="px-3 py-3 border-t border-[#E5E5EA]">
                    <div className="flex items-center gap-2.5 px-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">ZL</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-[#1C1C1E]">Zijian Luo</p>
                            <p className="text-[9px] text-[#8E8E93]">Stanford University</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ---- Main Content Area ---- */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {phase < 1 ? (
                        /* Welcome / Empty state */
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col items-center justify-center gap-4"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 flex items-center justify-center">
                                <BookOpen size={36} className="text-[#6366F1]" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-[#1C1C1E]">Welcome back!</p>
                                <p className="text-sm text-[#8E8E93] mt-1">Select a course to get started</p>
                            </div>
                        </motion.div>
                    ) : (
                        /* CS 103 folder view */
                        <motion.div
                            key="cs103"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="flex-1 flex flex-col overflow-hidden"
                        >
                            {/* Course header bar */}
                            <div className="px-6 py-4 bg-white border-b border-[#E5E5EA] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
                                        <GraduationCap size={20} className="text-[#6366F1]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1C1C1E]">CS 103</p>
                                        <p className="text-xs text-[#8E8E93]">Mathematical Foundations of Computing</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Upload / Import button */}
                                    <motion.button
                                        animate={phase === 1 ? { scale: [1, 1.05, 1] } : {}}
                                        transition={phase === 1 ? { duration: 0.8, repeat: Infinity } : {}}
                                        className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl px-4 py-2.5 transition-colors shadow-sm"
                                    >
                                        <Upload size={14} />
                                        <span className="text-xs font-semibold">Import Assignment</span>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Assignments list (empty state with hint) */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
                                <div className="w-16 h-16 rounded-2xl bg-[#F2F2F7] flex items-center justify-center">
                                    <FolderOpen size={28} className="text-[#C7C7CC]" />
                                </div>
                                <p className="text-sm font-semibold text-[#1C1C1E]">No assignments yet</p>
                                <p className="text-xs text-[#8E8E93] text-center max-w-xs">
                                    Import a problem set to start your AI-guided study session
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ---- File Picker Modal ---- */}
                <AnimatePresence>
                    {showFilePicker && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 z-50 flex items-center justify-center"
                            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                                className="bg-white rounded-2xl shadow-2xl border border-[#E5E5EA] overflow-hidden"
                                style={{ width: 480, maxHeight: 420 }}
                            >
                                {/* Picker header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5EA] bg-[#FAFAFA]">
                                    <div className="flex items-center gap-2">
                                        <Home size={14} className="text-[#8E8E93]" />
                                        <ChevronRight size={10} className="text-[#D1D1D6]" />
                                        <span className="text-xs font-medium text-[#8E8E93]">Documents</span>
                                        <ChevronRight size={10} className="text-[#D1D1D6]" />
                                        <span className="text-xs font-semibold text-[#1C1C1E]">CS 103</span>
                                    </div>
                                    <button className="w-6 h-6 rounded-full bg-[#E5E5EA] flex items-center justify-center hover:bg-[#D1D1D6] transition-colors">
                                        <X size={11} className="text-[#6B7280]" />
                                    </button>
                                </div>

                                {/* File list */}
                                <div className="px-2 py-2 space-y-0.5 overflow-y-auto" style={{ maxHeight: 300 }}>
                                    {FILE_PICKER_FILES.map((file) => {
                                        const isTarget = !!file.isTarget;
                                        const isHighlighted = isTarget && fileSelected;
                                        return (
                                            <motion.div
                                                key={file.id}
                                                animate={isHighlighted ? { backgroundColor: "#EEF2FF" } : { backgroundColor: "transparent" }}
                                                transition={{ duration: 0.3 }}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors ${isHighlighted ? "ring-1 ring-[#6366F1]/30" : "hover:bg-[#F9F9F9]"
                                                    }`}
                                            >
                                                <div className={`w-10 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 ${isHighlighted ? "bg-[#6366F1]/10 border border-[#6366F1]/20" : "bg-[#F2F2F7]"
                                                    }`}>
                                                    <FileText size={16} className={isHighlighted ? "text-[#6366F1]" : "text-[#8E8E93]"} />
                                                    <span className={`text-[7px] font-bold mt-0.5 ${isHighlighted ? "text-[#6366F1]" : "text-[#C7C7CC]"}`}>PDF</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-semibold truncate ${isHighlighted ? "text-[#6366F1]" : "text-[#1C1C1E]"}`}>
                                                        {file.name}
                                                    </p>
                                                    <p className="text-[10px] text-[#8E8E93] mt-0.5">{file.size} · {file.date}</p>
                                                </div>
                                                {isHighlighted && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                                        className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center shrink-0"
                                                    >
                                                        <Check size={12} color="white" />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Picker footer */}
                                <div className="px-4 py-3 border-t border-[#E5E5EA] bg-[#FAFAFA] flex items-center justify-end gap-2">
                                    <button className="text-xs text-[#8E8E93] font-medium px-3 py-2 rounded-lg hover:bg-[#F2F2F7] transition-colors">
                                        Cancel
                                    </button>
                                    <motion.button
                                        animate={fileSelected ? { opacity: 1 } : { opacity: 0.4 }}
                                        className="text-xs text-white font-semibold bg-[#6366F1] px-4 py-2 rounded-xl shadow-sm"
                                    >
                                        Open
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
