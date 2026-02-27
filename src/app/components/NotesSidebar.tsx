import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Star,
  Clock,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Circle,
  Sparkles,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotesSidebarProps {
  isOpen: boolean;
  activeScene: number;
}

const COURSES = [
  {
    id: "math",
    name: "MATH 2200",
    subtitle: "Discrete Mathematics",
    color: "#6366F1",
    assignments: [
      {
        id: "hw3",
        title: "Homework 3",
        due: "Mar 1",
        problems: [
          { id: "p1", title: "Odd² Proof", status: "done" },
          { id: "p2", title: "Even Product", status: "in-progress" },
        ],
      },
      { id: "hw2", title: "Homework 2", due: "Feb 22", problems: [] },
      { id: "hw1", title: "Homework 1", due: "Feb 15", problems: [] },
    ],
  },
  {
    id: "cs",
    name: "CS 3110",
    subtitle: "Data Structures",
    color: "#10B981",
    assignments: [
      { id: "ps1", title: "Problem Set 1", due: "Mar 3", problems: [] },
    ],
  },
];

export function NotesSidebar({ isOpen, activeScene }: NotesSidebarProps) {
  const [expandedCourses, setExpandedCourses] = useState(["math"]);
  const [expandedAssignments, setExpandedAssignments] = useState(["hw3"]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCourse = (id: string) => {
    setExpandedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAssignment = (id: string) => {
    setExpandedAssignments((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const getProblemStatus = (pid: string, baseStatus: string) => {
    if (activeScene >= 4) return "done";
    if (pid === "p1" && activeScene >= 3) return "done";
    if (pid === "p1" && activeScene === 2) return "in-progress";
    if (pid === "p2" && activeScene >= 3) return "in-progress";
    return baseStatus === "done" ? "done" : "todo";
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 258 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full bg-[#F7F7FB] border-r border-[#E5E5EA] flex flex-col overflow-hidden shrink-0"
    >
      <div className="w-[258px] flex flex-col h-full">
        {/* App header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
              <Sparkles size={16} color="white" />
            </div>
            <div>
              <p className="font-bold text-[#1C1C1E]" style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 1.2 }}>
                Office Hours
              </p>
              <p className="text-[#8E8E93]" style={{ fontFamily: "Inter", fontSize: 10 }}>
                
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-xl pl-8 pr-3 py-2 text-xs text-[#1C1C1E] placeholder:text-[#8E8E93] border border-[#E5E5EA] outline-none focus:border-[#6366F1]"
              style={{ fontFamily: "Inter" }}
            />
          </div>
        </div>

        {/* Quick links */}
        <div className="px-3 mb-2">
          <div className="flex gap-1.5">
            <button className="flex-1 flex items-center gap-1 bg-white rounded-xl px-2.5 py-2 text-xs text-[#6366F1] border border-[#E5E5EA]" style={{ fontFamily: "Inter" }}>
              <Clock size={11} className="text-[#F59E0B]" />
              Recent
            </button>
            <button className="flex-1 flex items-center gap-1 bg-white rounded-xl px-2.5 py-2 text-xs text-[#6B7280] border border-[#E5E5EA]" style={{ fontFamily: "Inter" }}>
              <Star size={11} className="text-[#F59E0B]" />
              Starred
            </button>
          </div>
        </div>

        {/* Courses list */}
        <div className="flex-1 overflow-y-auto px-3">
          <p className="text-[10px] text-[#8E8E93] uppercase tracking-wider mb-2 pl-1 font-medium" style={{ fontFamily: "Inter" }}>
            My Courses
          </p>
          <div className="space-y-1">
            {COURSES.map((course) => (
              <div key={course.id}>
                {/* Course row */}
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/70 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: course.color + "20" }}>
                    <GraduationCap size={13} style={{ color: course.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-semibold text-[#1C1C1E]" style={{ fontFamily: "Inter" }}>
                      {course.name}
                    </p>
                    <p className="text-[10px] text-[#8E8E93]" style={{ fontFamily: "Inter" }}>
                      {course.subtitle}
                    </p>
                  </div>
                  {expandedCourses.includes(course.id) ? (
                    <ChevronDown size={13} className="text-[#8E8E93]" />
                  ) : (
                    <ChevronRight size={13} className="text-[#8E8E93]" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedCourses.includes(course.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-3"
                    >
                      <div className="border-l-2 pl-3 ml-1 py-1 space-y-0.5" style={{ borderColor: course.color + "40" }}>
                        {course.assignments.map((asgn) => (
                          <div key={asgn.id}>
                            <button
                              onClick={() => toggleAssignment(asgn.id)}
                              className={`w-full text-left rounded-xl px-2.5 py-2 transition-all ${
                                asgn.id === "hw3" && activeScene >= 2
                                  ? "bg-white shadow-sm border border-[#E5E5EA]"
                                  : "hover:bg-white/50"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <BookOpen size={11} style={{ color: course.color }} />
                                <span className="text-xs font-medium text-[#1C1C1E] flex-1 text-left" style={{ fontFamily: "Inter" }}>
                                  {asgn.title}
                                </span>
                                <span className="text-[10px] text-[#8E8E93]" style={{ fontFamily: "Inter" }}>
                                  {asgn.due}
                                </span>
                              </div>
                            </button>

                            {/* Problems within assignment */}
                            <AnimatePresence>
                              {expandedAssignments.includes(asgn.id) && asgn.problems.length > 0 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="overflow-hidden ml-3 mt-0.5 space-y-0.5"
                                >
                                  {asgn.problems.map((prob) => {
                                    const status = getProblemStatus(prob.id, prob.status);
                                    const isActive =
                                      (prob.id === "p1" && activeScene === 2) ||
                                      (prob.id === "p2" && activeScene === 3);
                                    return (
                                      <div
                                        key={prob.id}
                                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${
                                          isActive ? "bg-[#6366F1]/8 border border-[#6366F1]/20" : ""
                                        }`}
                                      >
                                        {status === "done" ? (
                                          <CheckCircle2 size={12} className="text-[#10B981]" />
                                        ) : status === "in-progress" ? (
                                          <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                          >
                                            <Circle size={12} className="text-[#6366F1]" strokeDasharray="3 2" />
                                          </motion.div>
                                        ) : (
                                          <Circle size={12} className="text-[#D1D1D6]" />
                                        )}
                                        <span
                                          className={`text-[11px] ${isActive ? "text-[#6366F1] font-medium" : status === "done" ? "text-[#8E8E93] line-through" : "text-[#3C3C43]"}`}
                                          style={{ fontFamily: "Inter" }}
                                        >
                                          {prob.title}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* User profile */}
        <div className="px-4 py-3 border-t border-[#E5E5EA] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
            <User size={14} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1C1C1E] truncate" style={{ fontFamily: "Inter" }}>
              Zijian Luo
            </p>
            <p className="text-[10px] text-[#8E8E93] truncate" style={{ fontFamily: "Inter" }}>
              zijian@officehours.ai
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
      </div>
    </motion.div>
  );
}
