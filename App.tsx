
import React, { useState, useCallback } from 'react';
import { Difficulty, SubnetQuestion, UserAnswers, QuizResult } from './types';
import { generateQuestion } from './utils/subnetCalc';
import Dashboard from './components/Dashboard';
import QuizInterface from './components/QuizInterface';
import ResultsSummary from './components/ResultsSummary';
import SummaryPractice from './components/SummaryPractice';

type AppView = 'home' | 'quiz' | 'results' | 'summary_practice';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [questions, setQuestions] = useState<SubnetQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const startQuiz = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    let count = 20;
    if (diff === Difficulty.PROFESSIONAL) count = 50;
    if (diff === Difficulty.MASTER) count = 100;

    const qSet: SubnetQuestion[] = [];
    for (let i = 0; i < count; i++) {
      qSet.push(generateQuestion(diff));
    }
    
    setQuestions(qSet);
    setCurrentIndex(0);
    setResults([]);
    setStartTime(Date.now());
    setView('quiz');
  }, []);

  const handleNext = useCallback((answers: UserAnswers) => {
    const currentQ = questions[currentIndex];
    const isCorrect = {
      mask: answers.mask.trim() === currentQ.mask,
      subnetId: answers.subnetId.trim() === currentQ.subnetId,
      firstHost: answers.firstHost.trim() === currentQ.firstHost,
      lastHost: answers.lastHost.trim() === currentQ.lastHost,
      broadcast: answers.broadcast.trim() === currentQ.broadcast,
      cidr: answers.cidr.trim() === currentQ.cidr.toString() || answers.cidr.trim() === `/${currentQ.cidr}`
    };

    const result: QuizResult = {
      question: currentQ,
      userAnswers: answers,
      isCorrect
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setEndTime(Date.now());
      setView('results');
    }
  }, [currentIndex, questions, results]);

  const resetQuiz = () => {
    if (view === 'quiz' || view === 'summary_practice') {
      const type = view === 'quiz' ? 'quiz' : 'practice session';
      const confirmQuit = window.confirm(`Are you sure you want to quit the current ${type}? Your progress will be lost.`);
      if (!confirmQuit) return;
    }
    setView('home');
    setQuestions([]);
    setCurrentIndex(0);
    setResults([]);
  };

  const navigateTo = (newView: AppView) => {
    if (view === 'quiz' || view === 'summary_practice') {
      const type = view === 'quiz' ? 'quiz' : 'practice session';
      const confirmQuit = window.confirm(`Quit active ${type}?`);
      if (!confirmQuit) return;
    }
    setView(newView);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0f172a]">
      {/* Navigation Header */}
      <nav className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigateTo('home')}
          >
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20 group-hover:bg-blue-500 transition-colors">
              <i className="fas fa-network-wired text-xl text-white"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">SubnetHero</h1>
              <p className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">Mastering Binary</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigateTo('home')}
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${view === 'home' || view === 'quiz' || view === 'results' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              Subnetting Quiz
            </button>
            <button 
              onClick={() => navigateTo('summary_practice')}
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${view === 'summary_practice' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              Summary Routes
            </button>
          </div>

          <button 
            className="md:hidden text-slate-400 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-4 animate-fadeIn">
            <button 
              onClick={() => navigateTo('home')}
              className="block w-full text-left text-sm font-bold uppercase tracking-wider text-slate-400 py-2"
            >
              Subnetting Quiz
            </button>
            <button 
              onClick={() => navigateTo('summary_practice')}
              className="block w-full text-left text-sm font-bold uppercase tracking-wider text-slate-400 py-2"
            >
              Summary Routes
            </button>
          </div>
        )}
      </nav>

      <main className="w-full max-w-4xl flex-grow flex flex-col p-4 md:p-8">
        {view === 'quiz' && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-bold uppercase">Subnetting Challenge</span>
              <span className="text-lg font-bold text-white mono">Level: {difficulty}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 font-bold uppercase">Progress</span>
              <div className="text-lg font-bold text-white mono">
                {currentIndex + 1} <span className="text-slate-500">/</span> {questions.length}
              </div>
            </div>
          </div>
        )}

        {view === 'home' && <Dashboard onStart={startQuiz} />}
        {view === 'quiz' && (
          <QuizInterface 
            question={questions[currentIndex]} 
            onNext={handleNext}
            onQuit={resetQuiz}
            progress={(currentIndex / questions.length) * 100}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
          />
        )}
        {view === 'results' && (
          <ResultsSummary 
            results={results} 
            difficulty={difficulty} 
            duration={endTime - startTime}
            onReset={resetQuiz} 
          />
        )}
        {view === 'summary_practice' && <SummaryPractice onQuit={resetQuiz} />}
      </main>

      <footer className="mt-auto text-slate-500 text-sm py-8 border-t border-slate-800 w-full max-w-4xl text-center">
        &copy; {new Date().getFullYear()} SubnetHero. Engineered for high-speed binary proficiency.
      </footer>
    </div>
  );
};

export default App;
