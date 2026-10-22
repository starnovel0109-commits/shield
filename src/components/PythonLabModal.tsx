/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Download,
  Terminal,
  BookOpen,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import {
  PYTHON_TRAIN_SCRIPT,
  PYTHON_FLASK_APP,
  PYTHON_REQUIREMENTS,
  PROJECT_README,
} from '../ml/pythonCompanion';

export const PythonLabModal: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'train' | 'app' | 'requirements' | 'readme'>('train');
  const [copied, setCopied] = useState<boolean>(false);

  const getActiveCode = () => {
    switch (activeFile) {
      case 'train':
        return PYTHON_TRAIN_SCRIPT;
      case 'app':
        return PYTHON_FLASK_APP;
      case 'requirements':
        return PYTHON_REQUIREMENTS;
      case 'readme':
        return PROJECT_README;
      default:
        return PYTHON_TRAIN_SCRIPT;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDataset = () => {
    window.location.href = '/api/dataset/csv';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-400">
            College Data Science Project Companion
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Python, Scikit-Learn & Flask Code Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ready-to-run Python machine learning scripts, data preprocessing, joblib model dumps, and local Flask REST API.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadDataset}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dataset CSV</span>
          </button>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Layers className="w-4 h-4" />
            <span>Class Imbalance Strategy</span>
          </div>
          <p className="text-xs text-slate-300">
            Addresses the ~3.8% rare fraud distribution using <code className="text-blue-300">class_weight='balanced'</code> and stratified train-test splits.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <Database className="w-4 h-4" />
            <span>Data Leakage Prevention</span>
          </div>
          <p className="text-xs text-slate-300">
            <code className="text-blue-300">StandardScaler</code> is fitted strictly on <code className="text-blue-300">X_train</code> and only transforms <code className="text-blue-300">X_test</code> and live inputs.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
            <Terminal className="w-4 h-4" />
            <span>Model Serialization</span>
          </div>
          <p className="text-xs text-slate-300">
            Saves fitted estimator and scaler via <code className="text-blue-300">joblib.dump()</code> for low-latency production serving via Flask.
          </p>
        </div>
      </div>

      {/* Code Browser */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* File Tabs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFile('train')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                activeFile === 'train'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              train_model.py
            </button>
            <button
              onClick={() => setActiveFile('app')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                activeFile === 'app'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              app.py (Flask)
            </button>
            <button
              onClick={() => setActiveFile('requirements')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                activeFile === 'requirements'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              requirements.txt
            </button>
            <button
              onClick={() => setActiveFile('readme')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                activeFile === 'readme'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              README.md
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code View Area */}
        <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0b1120]">
          <pre>{getActiveCode()}</pre>
        </div>
      </div>
    </div>
  );
};
