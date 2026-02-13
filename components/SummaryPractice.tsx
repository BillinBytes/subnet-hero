
import React, { useState, useEffect } from 'react';
import { SummaryQuestion } from '../types';
import { generateSummaryQuestion } from '../utils/summaryCalc';

interface SummaryPracticeProps {
  onQuit: () => void;
}

const SummaryPractice: React.FC<SummaryPracticeProps> = ({ onQuit }) => {
  const [question, setQuestion] = useState<SummaryQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setQuestion(generateSummaryQuestion());
  }, []);

  const handleNext = () => {
    setQuestion(generateSummaryQuestion());
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    setTotal(prev => prev + 1);
    if (selectedOption === question?.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  if (!question) return null;

  return (
    <div className="animate-fadeIn w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onQuit}
          className="text-slate-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1"
        >
          <i className="fas fa-times-circle"></i>
          Quit Practice
        </button>
        <div className="text-sm font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
          Score: {score}/{total}
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
        <p className="text-slate-400 mb-6 uppercase text-xs font-bold tracking-widest">Topology Networks</p>
        
        <div className="flex flex-wrap gap-3 mb-10">
          {question.networks.map((net, i) => (
            <div key={i} className="bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl flex items-center gap-3">
              <i className="fas fa-network-wired text-blue-500 text-xs"></i>
              <span className="mono text-white font-bold">{net}</span>
            </div>
          ))}
        </div>

        <p className="text-slate-400 mb-6 uppercase text-xs font-bold tracking-widest">Select the best summary route</p>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = selectedOption === option;
            const userWasWrong = isSubmitted && selectedOption !== question.correctAnswer;
            
            let bgColor = "bg-slate-900/60 border-slate-700 hover:border-blue-500";
            
            if (isSubmitted) {
              if (isCorrect) {
                // Always highlight the correct answer in green after submission
                bgColor = "bg-green-500/20 border-green-500 text-green-400 ring-1 ring-green-500/50 shadow-lg shadow-green-900/20";
              } else if (isSelected) {
                // Highlight wrong choice in red
                bgColor = "bg-red-500/20 border-red-500 text-red-400";
              } else {
                // Dim other wrong choices
                bgColor = "bg-slate-900/60 border-slate-700 opacity-40";
              }
            } else if (isSelected) {
              bgColor = "bg-blue-600/20 border-blue-500 text-blue-400";
            }

            return (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(option)}
                className={`w-full p-4 rounded-xl border text-left transition-all mono font-bold ${bgColor} flex items-center justify-between group relative overflow-hidden`}
              >
                <div className="flex items-center gap-3">
                   <span>{option}</span>
                   {isSubmitted && isCorrect && userWasWrong && (
                     <span className="bg-green-500 text-white text-[9px] uppercase tracking-tighter px-2 py-0.5 rounded-md animate-pulse">
                       Correct Answer
                     </span>
                   )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isSubmitted && isCorrect && <i className="fas fa-check-circle text-green-400"></i>}
                  {isSubmitted && isSelected && !isCorrect && <i className="fas fa-times-circle text-red-400"></i>}
                  {!isSubmitted && <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}></div>}
                </div>
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mt-8 animate-slideUp">
            <div className={`p-4 rounded-xl mb-6 ${selectedOption === question.correctAnswer ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <h4 className={`font-bold mb-1 flex items-center gap-2 ${selectedOption === question.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                <i className={`fas ${selectedOption === question.correctAnswer ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                {selectedOption === question.correctAnswer ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mt-2">
                {question.explanation}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              Next Topology
            </button>
          </div>
        )}

        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`w-full mt-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
              selectedOption 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 active:scale-[0.98]' 
              : 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default SummaryPractice;
