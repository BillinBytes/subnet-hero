
import React from 'react';
import { Difficulty } from '../types';

interface DashboardProps {
  onStart: (diff: Difficulty) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Master IP Subnetting</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Test your skills across all address classes. Calculate masks, ranges, and identifiers 
          with precision under our randomized engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DifficultyCard 
          title="Beginner" 
          count={20} 
          icon="fa-seedling"
          color="border-green-500/30 hover:border-green-500"
          btnColor="bg-green-600 hover:bg-green-500"
          description="Perfect for CCNA students. Focuses primarily on Class C subnets and common CIDR masks."
          onSelect={() => onStart(Difficulty.BEGINNER)}
        />
        <DifficultyCard 
          title="Professional" 
          count={50} 
          icon="fa-user-tie"
          color="border-blue-500/30 hover:border-blue-500"
          btnColor="bg-blue-600 hover:bg-blue-500"
          description="For advanced technicians. Covers Class B and C ranges with non-standard subnet boundaries."
          onSelect={() => onStart(Difficulty.PROFESSIONAL)}
        />
        <DifficultyCard 
          title="Master" 
          count={100} 
          icon="fa-crown"
          color="border-purple-500/30 hover:border-purple-500"
          btnColor="bg-purple-600 hover:bg-purple-500"
          description="Full spectrum mastery. Includes Class A, B, and C with complex, variable-length subnet masks."
          onSelect={() => onStart(Difficulty.MASTER)}
        />
      </div>

      <div className="mt-12 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-info-circle text-blue-400"></i>
          Instructions
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            Calculate the subnet details based on the provided IP and CIDR.
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            Inputs must be valid dotted-decimal IPs or integer CIDRs.
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            First and Last host should be "N/A" for /31 or /32 subnets if applicable.
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            Your progress and score are tracked in real-time.
          </li>
        </ul>
      </div>
    </div>
  );
};

const DifficultyCard: React.FC<{
  title: string;
  count: number;
  icon: string;
  color: string;
  btnColor: string;
  description: string;
  onSelect: () => void;
}> = ({ title, count, icon, color, btnColor, description, onSelect }) => (
  <div className={`bg-slate-800/40 rounded-2xl border ${color} p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between group`}>
    <div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-slate-700 group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon} text-xl text-white`}></i>
      </div>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md font-mono">{count} QUESTIONS</span>
      </div>
      <p className="text-slate-400 text-sm mb-8 leading-relaxed">
        {description}
      </p>
    </div>
    <button 
      onClick={onSelect}
      className={`w-full py-3 rounded-xl text-white font-bold transition-colors ${btnColor} shadow-lg shadow-black/20`}
    >
      Start Challenge
    </button>
  </div>
);

export default Dashboard;
