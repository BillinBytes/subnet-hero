
import React, { useMemo } from 'react';
import { QuizResult, Difficulty } from '../types';

interface ResultsSummaryProps {
  results: QuizResult[];
  difficulty: Difficulty;
  duration: number;
  onReset: () => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results, difficulty, duration, onReset }) => {
  const stats = useMemo(() => {
    let totalCorrectFields = 0;
    let perfectQuestions = 0;
    const totalFields = results.length * 6;

    results.forEach(res => {
      const fieldCount = Object.values(res.isCorrect).filter(Boolean).length;
      totalCorrectFields += fieldCount;
      if (fieldCount === 6) perfectQuestions++;
    });

    const scorePercent = (totalCorrectFields / totalFields) * 100;
    
    return {
      scorePercent,
      perfectQuestions,
      avgTime: (duration / 1000 / results.length).toFixed(1),
      totalFields,
      totalCorrectFields
    };
  }, [results, duration]);

  const getPerformanceMessage = () => {
    if (stats.scorePercent >= 95) return "Networking God! You're ready for the enterprise.";
    if (stats.scorePercent >= 85) return "Outstanding Performance! High accuracy detected.";
    if (stats.scorePercent >= 70) return "Solid Skills. Keep practicing for perfection.";
    return "Keep Learning. Subnetting is a muscle—train it daily.";
  };

  return (
    <div className="animate-fadeIn pb-12">
      <div className="text-center mb-12">
        <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-6">
          <i className="fas fa-trophy text-5xl text-blue-500"></i>
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">Challenge Complete</h2>
        <p className="text-slate-400 text-lg">{getPerformanceMessage()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Accuracy" value={`${stats.scorePercent.toFixed(1)}%`} sub="Total Fields Correct" color="text-blue-400" />
        <StatCard label="Perfect" value={stats.perfectQuestions.toString()} sub="All Fields Correct" color="text-green-400" />
        <StatCard label="Efficiency" value={`${stats.avgTime}s`} sub="Avg. per question" color="text-yellow-400" />
        <StatCard label="Mode" value={difficulty} sub="Difficulty Level" color="text-purple-400" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">Question Breakdown</h3>
          <button 
            onClick={onReset}
            className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            New Quiz
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {results.map((res, idx) => (
            <div key={idx} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-sm">#{idx + 1}</span>
                  <span className="text-lg font-bold text-white mono">{res.question.ip}/{res.question.cidr}</span>
                </div>
                <div className="flex gap-1">
                  {Object.values(res.isCorrect).map((c, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${c ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <ResultRow label="Mask" correct={res.question.mask} user={res.userAnswers.mask} isCorrect={res.isCorrect.mask} />
                <ResultRow label="Subnet ID" correct={res.question.subnetId} user={res.userAnswers.subnetId} isCorrect={res.isCorrect.subnetId} />
                <ResultRow label="First Host" correct={res.question.firstHost} user={res.userAnswers.firstHost} isCorrect={res.isCorrect.firstHost} />
                <ResultRow label="Last Host" correct={res.question.lastHost} user={res.userAnswers.lastHost} isCorrect={res.isCorrect.lastHost} />
                <ResultRow label="Broadcast" correct={res.question.broadcast} user={res.userAnswers.broadcast} isCorrect={res.isCorrect.broadcast} />
                <ResultRow label="CIDR" correct={res.question.cidr.toString()} user={res.userAnswers.cidr} isCorrect={res.isCorrect.cidr} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, sub: string, color: string }> = ({ label, value, sub, color }) => (
  <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 text-center">
    <span className="text-slate-400 text-xs font-bold uppercase block mb-1">{label}</span>
    <span className={`text-3xl font-black block mb-1 ${color}`}>{value}</span>
    <span className="text-slate-500 text-[10px] font-medium uppercase">{sub}</span>
  </div>
);

const ResultRow: React.FC<{ label: string, correct: string, user: string, isCorrect: boolean }> = ({ label, correct, user, isCorrect }) => (
  <div className="flex flex-col gap-1">
    <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">{label}</span>
    <div className={`p-2 rounded-lg border flex flex-col ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
      <span className="text-white mono font-medium truncate" title={`Correct: ${correct}`}>{user || 'No answer'}</span>
      {!isCorrect && (
        <span className="text-green-500 mono mt-1 pt-1 border-t border-red-500/10">Exp: {correct}</span>
      )}
    </div>
  </div>
);

export default ResultsSummary;
