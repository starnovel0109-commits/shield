/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Lock, PhoneCall, ExternalLink } from 'lucide-react';

interface Props {
  onNavigate: (tab: 'home' | 'detect' | 'analytics' | 'history' | 'pythonLab') => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-6 h-6 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>UPI Shield AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Detect Fraud. Protect Every Transaction. An intelligent decision-support system benchmarking supervised machine learning algorithms.
            </p>
            <div className="text-[11px] text-slate-500">
              College Data Science Final Year Project
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">
              System Modules
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Overview & Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('detect')}
                  className="hover:text-white transition-colors"
                >
                  Live Transaction Detection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-white transition-colors"
                >
                  Model Benchmarks & Charts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-white transition-colors"
                >
                  Transaction Audit History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pythonLab')}
                  className="hover:text-white transition-colors"
                >
                  Python & Flask ML Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: ML Algorithms */}
          <div className="space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">
              Evaluated Algorithms
            </div>
            <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
              <li>Gradient Boosting (GBDT)</li>
              <li>Random Forest Ensemble</li>
              <li>CART Decision Tree</li>
              <li>Regularized Logistic Regression</li>
              <li>Class-Weighted Log-Loss</li>
            </ul>
          </div>

          {/* Col 4: Cyber Safety Emergency */}
          <div className="space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">
              Cyber Fraud Assistance
            </div>
            <p className="text-slate-400 leading-relaxed">
              If you have experienced unauthorized payment debits:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Helpline: 1930</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Citizen Financial Cyber Fraud Reporting System
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 UPI Shield AI. Built for Academic Demonstration & Fintech Education.
          </div>
          <div>
            Synthetic dataset modeled for educational evaluation · Not affiliated with NPCI or RBI.
          </div>
        </div>
      </div>
    </footer>
  );
};
