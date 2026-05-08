import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SyllabusView from "./components/SyllabusView";
import StudyPlan from "./components/StudyPlan";
import Timetable from "./components/Timetable";
import ProgressTracker from "./components/ProgressTracker";
import Checklist from "./components/Checklist";
import Resources from "./components/Resources";
import ExamTips from "./components/ExamTips";
import GradeCalculator from "./components/GradeCalculator";
import {
  combinedMathsTopics,
  physicsTopics,
  ictTopics,
} from "./data/syllabusData";

// Safe localStorage
const safeGet = (key: string) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key: string, val: string) => {
  try { localStorage.setItem(key, val); } catch { /* ignore */ }
};

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [completedWeeks, setCompletedWeeks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const t = safeGet("al_topics");
    const w = safeGet("al_weeks");
    if (t) setCompletedTopics(JSON.parse(t));
    if (w) setCompletedWeeks(JSON.parse(w));
  }, []);

  useEffect(() => {
    safeSet("al_topics", JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    safeSet("al_weeks", JSON.stringify(completedWeeks));
  }, [completedWeeks]);

  const toggleTopic = (id: string) => {
    setCompletedTopics(p => ({ ...p, [id]: !p[id] }));
  };

  const toggleWeek = (w: number) => {
    setCompletedWeeks(p => ({ ...p, [w]: !p[w] }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const totalTopics = {
    cm: combinedMathsTopics.length,
    ph: physicsTopics.length,
    ict: ictTopics.length,
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard completedTopics={completedTopics} totalTopics={totalTopics} onNavigate={setActiveSection} />;
      case "syllabus-cm":
        return <SyllabusView subject="Combined Maths" subjectSi="සංයුක්ත ගණිතය" topics={combinedMathsTopics} completedTopics={completedTopics} onToggleTopic={toggleTopic} color="blue" gradient="from-blue-500 to-blue-600" />;
      case "syllabus-ph":
        return <SyllabusView subject="Physics" subjectSi="භෞතික විද්‍යාව" topics={physicsTopics} completedTopics={completedTopics} onToggleTopic={toggleTopic} color="purple" gradient="from-purple-500 to-purple-600" />;
      case "syllabus-ict":
        return <SyllabusView subject="ICT" subjectSi="තොරතුරු හා සන්නිවේදන තාක්ෂණය" topics={ictTopics} completedTopics={completedTopics} onToggleTopic={toggleTopic} color="emerald" gradient="from-emerald-500 to-emerald-600" />;
      case "study-plan":
        return <StudyPlan completedWeeks={completedWeeks} onToggleWeek={toggleWeek} />;
      case "timetable":
        return <Timetable />;
      case "progress":
        return <ProgressTracker />;
      case "checklist":
        return <Checklist />;
      case "resources":
        return <Resources />;
      case "tips":
        return <ExamTips />;
      case "grades":
        return <GradeCalculator />;
      default:
        return <Dashboard completedTopics={completedTopics} totalTopics={totalTopics} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8 lg:py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
