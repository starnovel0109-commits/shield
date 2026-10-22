/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Cpu, Activity, History, BookOpen, AlertTriangle } from 'lucide-react';
import { MLModelType } from '../types/fraud';

interface NavbarProps {
  activeTab: 'home' | 'detect' | 'analytics' | 'history' | 'pythonLab';
  setActiveTab: (tab: 'home' | 'detect' | 'analytics' | 'history' | 'pythonLab') => void;
  activeModel: MLModelType;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeModel,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:border-blue-400/50 transition-colors">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <span>UPI Shield AI</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'home'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('detect')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'detect'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Live Detection
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'analytics'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Model Analytics
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'history'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Audit History
          </button>
          <button
            onClick={() => setActiveTab('pythonLab')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'pythonLab'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Python ML Suite
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('detect')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-98 transition-all shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0"
          >
            Start Detection
          </button>
        </div>
      </div>
    </header>
  );
};
