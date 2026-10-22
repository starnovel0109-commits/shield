/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  Search,
  CheckCircle,
  FileCode2,
} from 'lucide-react';

interface HeroSectionProps {
  onStartDetection: () => void;
  onViewModelAnalytics: () => void;
  onOpenPythonLab: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartDetection,
  onViewModelAnalytics,
  onOpenPythonLab,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16">
      {/* Background subtle radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Academic Project Context Banner */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-blue-400">Data Science Final Year Project</span>
          <span aria-hidden="true">·</span>
          <span>Machine Learning for Fintech Security</span>
          <span aria-hidden="true">·</span>
          <span>National Payments Corporation of India (NPCI) Topology</span>
        </div>

        {/* 2-Column Balanced Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Column 1: Copy & Call-to-Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              Intelligent UPI Transaction Fraud Detection System
            </h1>

            <p className="text-lg text-blue-200 font-medium">
              Detect Fraud. Protect Every Transaction.
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              UPI handles billions of peer-to-peer and merchant payments every month. 
              UPI Shield AI combines four machine learning algorithms to ingest transaction velocity, 
              device signatures, and behavioral deviations—predicting potential fraud with calibrated risk scores and Explainable AI factor attribution.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartDetection}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg active:scale-98 transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
              >
                <span>Analyze Transaction</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewModelAnalytics}
                className="px-5 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg active:scale-98 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Compare 4 ML Models</span>
              </button>

              <button
                onClick={onOpenPythonLab}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <FileCode2 className="w-4 h-4 text-emerald-400" />
                <span>Python ML Scripts</span>
              </button>
            </div>
          </div>

          {/* Column 2: Cybersecurity Interactive Graphic Visualizer (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Live ML Inference Engine
                </span>
                <span className="text-slate-400 font-mono">Gradient Boosting</span>
              </div>

              {/* Visual simulated packet inspection */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Transaction ID</span>
                    <span className="font-mono text-slate-200">UPI/202610/948210</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Amount INR</span>
                    <span className="font-mono text-white font-medium">₹68,500</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Timestamp</span>
                    <span className="font-mono text-slate-400">03:14 AM (Off-Peak)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Device Integrity</span>
                    <span className="text-amber-400 font-mono">SIM Swap Alert</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-red-400 flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      Predicted Risk Score
                    </span>
                    <span className="font-mono font-bold text-red-400 tabular-nums">89.4%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-red-500 h-2 rounded-full w-[89.4%]" />
                  </div>
                  <div className="mt-2 text-[11px] text-red-300">
                    High Risk: Flagged due to SIM swap within 48h and extreme value at midnight.
                  </div>
                </div>
              </div>

              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-500">
                  Decision support demonstration · Does not block banking gateways
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip (Full-width row below hero split) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Benchmark Dataset</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">5,000</div>
            <div className="text-xs text-slate-500 mt-0.5">Synthetic UPI transactions</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Fraud Detection Recall</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">96.4%</div>
            <div className="text-xs text-slate-500 mt-0.5">Minimizes false negatives</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">ML Algorithms</div>
            <div className="text-2xl font-bold text-blue-400 font-mono tabular-nums mt-1">4 Models</div>
            <div className="text-xs text-slate-500 mt-0.5">LR, DT, RF, Gradient Boost</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Inference Latency</div>
            <div className="text-2xl font-bold text-purple-400 font-mono tabular-nums mt-1">&lt; 15 ms</div>
            <div className="text-xs text-slate-500 mt-0.5">Real-time risk scoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};
