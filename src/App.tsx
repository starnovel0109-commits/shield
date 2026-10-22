/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { TransactionDetectionForm } from './components/TransactionDetectionForm';
import { PredictionResultCard } from './components/PredictionResultCard';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { PythonLabModal } from './components/PythonLabModal';
import { Footer } from './components/Footer';
import {
  MLModelType,
  PredictionResult,
  TransactionInput,
} from './types/fraud';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'detect' | 'analytics' | 'history' | 'pythonLab'
  >('home');
  const [activeModel, setActiveModel] = useState<MLModelType>('gradient_boosting');
  const [lastPrediction, setLastPrediction] = useState<{
    result: PredictionResult;
    input: TransactionInput;
  } | null>(null);

  const handleAnalyzeSuccess = (
    result: PredictionResult,
    input: TransactionInput
  ) => {
    setLastPrediction({ result, input });
    // Keep user on detect tab to see results clearly
    setActiveTab('detect');
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeModel={activeModel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-12">
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            <HeroSection
              onStartDetection={() => setActiveTab('detect')}
              onViewModelAnalytics={() => setActiveTab('analytics')}
              onOpenPythonLab={() => setActiveTab('pythonLab')}
            />
            <FeaturesSection />
          </div>
        )}

        {/* TAB 2: LIVE DETECTION PAGE */}
        {activeTab === 'detect' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div>
              <div className="text-xs font-semibold text-blue-400">
                Inference Console
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                UPI Transaction Fraud Detection
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter payment details or pick a pre-configured fraud test scenario to evaluate risk with machine learning.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <TransactionDetectionForm
                onAnalyzeSuccess={handleAnalyzeSuccess}
                activeModel={activeModel}
                setActiveModel={setActiveModel}
              />

              {/* Prediction Result Display */}
              {lastPrediction ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      Inference Diagnostic Report
                    </h3>
                    <button
                      onClick={() => setLastPrediction(null)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Analysis</span>
                    </button>
                  </div>
                  <PredictionResultCard
                    result={lastPrediction.result}
                    input={lastPrediction.input}
                  />
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Awaiting Transaction Input
                  </div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Fill out the form above or click one of the quick presets (e.g. "Tea/Snacks (Legit)" or "Midnight SIM Swap (Fraud)") and click Analyze Transaction.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MODEL ANALYTICS & DASHBOARD */}
        {activeTab === 'analytics' && (
          <DashboardAnalytics
            activeModel={activeModel}
            setActiveModel={setActiveModel}
          />
        )}

        {/* TAB 4: TRANSACTION AUDIT HISTORY */}
        {activeTab === 'history' && <TransactionHistoryView />}

        {/* TAB 5: PYTHON ML LAB */}
        {activeTab === 'pythonLab' && <PythonLabModal />}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
