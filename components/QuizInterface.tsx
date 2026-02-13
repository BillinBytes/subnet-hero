
import React, { useState, useEffect } from 'react';
import { SubnetQuestion, UserAnswers } from '../types';

interface QuizInterfaceProps {
  question: SubnetQuestion;
  onNext: (answers: UserAnswers) => void;
  onQuit: () => void;
  progress: number;
  currentIndex: number;
  totalQuestions: number;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ 
  question, 
  onNext, 
  onQuit,
  progress,
  currentIndex,
  totalQuestions
}) => {
  const [answers, setAnswers] = useState<UserAnswers>({
    mask: '',
    subnetId: '',
    firstHost: '',
    lastHost: '',
    broadcast: '',
    cidr: ''
  });

  useEffect(() => {
    setAnswers({
      mask: '',
      subnetId: '',
      firstHost: '',
      lastHost: '',
      broadcast: '',
      cidr: ''
    });
  }, [question]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(answers);
  };

  return (
    <div className="animate-fadeIn w-full">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={onQuit}
          className="text-slate-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1"
        >
          <i className="fas fa-times-circle"></i>
          Quit Quiz
        </button>
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Session Active
        </span>
      </div>
      
      <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-1 block">CHALLENGE IP</span>
            <div className="flex items-baseline gap-3">
              <h3 className="text-4xl md:text-5xl font-black text-white mono tracking-tight">
                {question.ip}
              </h3>
              <span className="text-3xl text-slate-500 mono">/{question.cidr}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-slate-700/50 px-4 py-2 rounded-xl text-center min-w-[80px]">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Class</span>
              <span className="text-xl font-bold text-white">{question.classType}</span>
            </div>
            <div className="bg-slate-700/50 px-4 py-2 rounded-xl text-center min-w-[80px]">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Type</span>
              <span className="text-xl font-bold text-white">IPv4</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InputGroup 
            label="Subnet Mask" 
            name="mask" 
            value={answers.mask} 
            onChange={handleChange} 
            placeholder="255.255.255.0"
            icon="fa-shield-halved"
          />
          <InputGroup 
            label="Subnet ID" 
            name="subnetId" 
            value={answers.subnetId} 
            onChange={handleChange} 
            placeholder="192.168.1.0"
            icon="fa-map-pin"
          />
          <InputGroup 
            label="First Host Address" 
            name="firstHost" 
            value={answers.firstHost} 
            onChange={handleChange} 
            placeholder="192.168.1.1"
            icon="fa-play"
          />
          <InputGroup 
            label="Last Host Address" 
            name="lastHost" 
            value={answers.lastHost} 
            onChange={handleChange} 
            placeholder="192.168.1.254"
            icon="fa-stop"
          />
          <InputGroup 
            label="Broadcast Address" 
            name="broadcast" 
            value={answers.broadcast} 
            onChange={handleChange} 
            placeholder="192.168.1.255"
            icon="fa-tower-broadcast"
          />
          <InputGroup 
            label="CIDR Slash Value" 
            name="cidr" 
            value={answers.cidr} 
            onChange={handleChange} 
            placeholder="24"
            icon="fa-hashtag"
          />

          <div className="md:col-span-2 pt-6">
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              Submit Answer
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{
  label: string;
  name: string;
  value: string;
  placeholder: string;
  icon: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, value, placeholder, icon, onChange }) => (
  <div className="flex flex-col gap-2 group">
    <label className="text-slate-400 text-xs font-bold uppercase tracking-wide px-1 flex items-center gap-2">
      <i className={`fas ${icon} text-blue-500/60`}></i>
      {label}
    </label>
    <input
      autoComplete="off"
      name={name}
      value={value}
      onChange={onChange}
      className="bg-slate-900/60 border border-slate-700 text-white mono px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
      placeholder={placeholder}
      required
    />
  </div>
);

export default QuizInterface;
