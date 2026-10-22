/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ModelMetrics,
  DatasetStatistics,
  MLModelType,
} from '../types/fraud';
import {
  TrendingUp,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  Layers,
  Activity,
  Cpu,
  Info,
  ChevronRight,
} from 'lucide-react';

interface Props {
  activeModel: MLModelType;
  setActiveModel: (m: MLModelType) => void;
}

export const DashboardAnalytics: React.FC<Props> = ({
  activeModel,
  setActiveModel,
}) => {
  const [metrics, setMetrics] = useState<ModelMetrics[]>([]);
  const [datasetStats, setDatasetStats] = useState<DatasetStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedChartTab, setSelectedChartTab] = useState<'hourly' | 'amount' | 'confusion' | 'features'>('hourly');

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data.models || []);
        setDatasetStats(data.datasetStats || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load metrics:', err);
        setIsLoading(false);
      });
  }, []);

  const currentModelMetrics = metrics.find((m) => m.id === activeModel) || metrics[0];

  // Distribution data for Hourly Fraud Patterns (24 hours)
  const hourlyFraudData = [
    { hour: 0, fraudRate: 14.2, legitCount: 140 },
    { hour: 1, fraudRate: 18.5, legitCount: 95 },
    { hour: 2, fraudRate: 23.8, legitCount: 65 },
    { hour: 3, fraudRate: 28.1, legitCount: 42 },
    { hour: 4, fraudRate: 19.4, legitCount: 58 },
    { hour: 5, fraudRate: 8.2, legitCount: 110 },
    { hour: 6, fraudRate: 3.1, legitCount: 190 },
    { hour: 7, fraudRate: 1.8, legitCount: 280 },
    { hour: 8, fraudRate: 1.2, legitCount: 390 },
    { hour: 9, fraudRate: 0.9, legitCount: 460 },
    { hour: 10, fraudRate: 1.1, legitCount: 520 },
    { hour: 11, fraudRate: 1.4, legitCount: 560 },
    { hour: 12, fraudRate: 1.6, legitCount: 580 },
    { hour: 13, fraudRate: 1.5, legitCount: 550 },
    { hour: 14, fraudRate: 1.7, legitCount: 530 },
    { hour: 15, fraudRate: 2.1, legitCount: 510 },
    { hour: 16, fraudRate: 2.4, legitCount: 520 },
    { hour: 17, fraudRate: 2.2, legitCount: 540 },
    { hour: 18, fraudRate: 1.9, legitCount: 580 },
    { hour: 19, fraudRate: 2.5, legitCount: 610 },
    { hour: 20, fraudRate: 3.2, legitCount: 590 },
    { hour: 21, fraudRate: 4.8, legitCount: 480 },
    { hour: 22, fraudRate: 7.9, legitCount: 350 },
    { hour: 23, fraudRate: 11.6, legitCount: 220 },
  ];

  // Amount buckets distribution
  const amountBuckets = [
    { range: '< ₹500', legitShare: 42, fraudShare: 2 },
    { range: '₹500 - ₹2k', legitShare: 31, fraudShare: 6 },
    { range: '₹2k - ₹10k', legitShare: 18, fraudShare: 14 },
    { range: '₹10k - ₹30k', legitShare: 7, fraudShare: 32 },
    { range: '₹30k - ₹75k', legitShare: 1.8, fraudShare: 36 },
    { range: '> ₹75k', legitShare: 0.2, fraudShare: 10 },
  ];

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-slate-400">
        Loading machine learning analytics and model benchmarks...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Banner & KPI Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Model Performance & Dataset Analytics
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Held-out test set evaluation (80/20 train-test partition on 5,000 synthetic UPI records).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Evaluation Dataset Fraud Rate:</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {datasetStats?.fraudRate || '3.80'}%
            </span>
            <span className="text-slate-500 font-mono">
              ({datasetStats?.fraudRecords || 190} / {datasetStats?.totalRecords || 5000})
            </span>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Dataset Total Size</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {datasetStats?.totalRecords.toLocaleString() || '5,000'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              4,000 Train · 1,000 Test (Stratified)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Active Model Accuracy</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
              {currentModelMetrics?.accuracy}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across all binary classes
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Active Fraud Recall (Sensitivity)</div>
            <div className="text-2xl font-bold text-blue-400 font-mono tabular-nums mt-1">
              {currentModelMetrics?.recall}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Catches 96+ out of 100 fraudulent attempts
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">ROC-AUC Score</div>
            <div className="text-2xl font-bold text-purple-400 font-mono tabular-nums mt-1">
              {currentModelMetrics?.rocAuc}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Area under Receiver Operating Characteristic
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Leaderboard & Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Algorithm Comparison Leaderboard
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any model to update real-time inference and inspect its parameters.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Class Weighting Enabled · 80/20 Test Split
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Status / Algorithm</th>
                <th className="py-2.5 px-3 font-semibold text-right">Accuracy</th>
                <th className="py-2.5 px-3 font-semibold text-right">Precision</th>
                <th className="py-2.5 px-3 font-semibold text-right">Recall (Fraud)</th>
                <th className="py-2.5 px-3 font-semibold text-right">F1-Score</th>
                <th className="py-2.5 px-3 font-semibold text-right">ROC-AUC</th>
                <th className="py-2.5 px-3 font-semibold text-right">False Pos. Rate</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {metrics.map((m) => {
                const isSelected = m.id === activeModel;
                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-950/30 text-white'
                        : 'hover:bg-slate-800/30 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-blue-400' : 'bg-slate-600'
                          }`}
                        />
                        <span className="font-medium text-white">{m.name}</span>
                        {m.id === 'gradient_boosting' && (
                          <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.2 bg-emerald-950/60 border border-emerald-800/60 rounded">
                            Best Recall
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">{m.accuracy}%</td>
                    <td className="py-3 px-3 text-right tabular-nums text-amber-300">
                      {m.precision}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-emerald-400 font-bold">
                      {m.recall}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">{m.f1Score}%</td>
                    <td className="py-3 px-3 text-right tabular-nums text-purple-300">
                      {m.rocAuc}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-400">
                      {m.falsePositiveRate}%
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={() => setActiveModel(m.id)}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Active Model' : 'Switch Model'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Model Description */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">
              {currentModelMetrics?.name}:
            </span>{' '}
            {currentModelMetrics?.description}{' '}
            <span className="text-blue-400 font-medium">
              ({currentModelMetrics?.recommendedFor})
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Segmented Section */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Data Science Visualizations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore behavioral patterns, confusion matrices, and feature importance.
            </p>
          </div>

          {/* Interactive tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedChartTab('hourly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedChartTab === 'hourly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hourly Patterns
            </button>
            <button
              onClick={() => setSelectedChartTab('amount')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedChartTab === 'amount'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Amount Distribution
            </button>
            <button
              onClick={() => setSelectedChartTab('confusion')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedChartTab === 'confusion'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Confusion Matrix
            </button>
            <button
              onClick={() => setSelectedChartTab('features')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedChartTab === 'features'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Feature Importance
            </button>
          </div>
        </div>

        {/* Tab 1: Hourly Patterns (Fraud spikes at midnight) */}
        {selectedChartTab === 'hourly' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Hourly Fraud Attempt Rate (% of transactions at that hour)</span>
              <span className="text-red-400 font-medium font-mono">
                Peak Attack Window: 01:00 AM – 04:00 AM (28.1% max)
              </span>
            </div>

            <div className="h-64 flex items-end gap-1.5 sm:gap-2 pt-6 px-2 bg-slate-950/60 rounded-xl border border-slate-800">
              {hourlyFraudData.map((d) => {
                const heightPct = Math.min(100, (d.fraudRate / 30) * 100);
                const isNight = d.hour >= 0 && d.hour <= 4;
                return (
                  <div
                    key={d.hour}
                    className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-10">
                      {String(d.hour).padStart(2, '0')}:00 hrs · {d.fraudRate}% fraud
                    </div>

                    <div
                      className={`w-full rounded-t transition-all ${
                        isNight
                          ? 'bg-gradient-to-t from-red-600 to-amber-500'
                          : 'bg-blue-600/70 group-hover:bg-blue-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />

                    <span className="text-[10px] font-mono text-slate-500">
                      {d.hour % 3 === 0 ? `${d.hour}h` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400">
              Observation: Fraudsters concentrate unauthorized transactions during late night hours when account holders are asleep and unlikely to notice SMS alerts immediately.
            </p>
          </div>
        )}

        {/* Tab 2: Amount Distribution */}
        {selectedChartTab === 'amount' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Comparison: Legitimate Volume Share vs. Fraudulent Volume Share</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                  Legit Transactions
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2.5 h-2.5 rounded bg-red-500" />
                  Fraud Transactions
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {amountBuckets.map((bucket, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium font-mono">
                    <span>{bucket.range}</span>
                    <span className="text-slate-400 text-[11px]">
                      Legit: {bucket.legitShare}% · Fraud: {bucket.fraudShare}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-4">
                    {/* Legit bar */}
                    <div className="bg-slate-950 rounded overflow-hidden flex items-center justify-end pr-1 border border-slate-800">
                      <div
                        className="bg-blue-600 h-full rounded"
                        style={{ width: `${bucket.legitShare}%` }}
                      />
                    </div>
                    {/* Fraud bar */}
                    <div className="bg-slate-950 rounded overflow-hidden flex items-center border border-slate-800">
                      <div
                        className="bg-red-500 h-full rounded"
                        style={{ width: `${bucket.fraudShare}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400">
              Observation: Legitimate UPI payments are heavily clustered under ₹2,000 (groceries, small merchants), whereas fraud attempts concentrate in higher brackets (₹10,000 to ₹75,000) to maximize extraction.
            </p>
          </div>
        )}

        {/* Tab 3: Interactive Confusion Matrix */}
        {selectedChartTab === 'confusion' && (
          <div className="space-y-6">
            <div className="text-xs text-slate-400">
              Confusion Matrix on Held-Out Test Set (1,000 transactions) for{' '}
              <strong className="text-white">{currentModelMetrics?.name}</strong>:
            </div>

            <div className="max-w-xl mx-auto grid grid-cols-2 gap-4">
              {/* True Positive */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 space-y-1">
                <div className="text-xs font-semibold text-emerald-400">
                  True Positives (TP)
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {currentModelMetrics?.confusionMatrix.tp}
                </div>
                <div className="text-[11px] text-emerald-300">
                  Actual Frauds correctly detected by the model.
                </div>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800 space-y-1">
                <div className="text-xs font-semibold text-amber-400">
                  False Positives (FP)
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {currentModelMetrics?.confusionMatrix.fp}
                </div>
                <div className="text-[11px] text-amber-300">
                  Legitimate transactions incorrectly flagged (false alarms).
                </div>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800 space-y-1">
                <div className="text-xs font-semibold text-red-400">
                  False Negatives (FN)
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {currentModelMetrics?.confusionMatrix.fn}
                </div>
                <div className="text-[11px] text-red-300">
                  Undetected Frauds. Critical metric to minimize in fintech.
                </div>
              </div>

              {/* True Negative */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-slate-400">
                  True Negatives (TN)
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {currentModelMetrics?.confusionMatrix.tn}
                </div>
                <div className="text-[11px] text-slate-400">
                  Legitimate transactions correctly permitted.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white">Evaluation Synthesis:</div>
              <div>
                With <span className="font-mono text-emerald-400 font-bold">{currentModelMetrics?.confusionMatrix.tp}</span> TP and only{' '}
                <span className="font-mono text-red-400 font-bold">{currentModelMetrics?.confusionMatrix.fn}</span> FN, the model delivers a fraud recall of{' '}
                <span className="font-mono text-blue-400 font-bold">{currentModelMetrics?.recall}%</span> while keeping false alarm rate at{' '}
                <span className="font-mono text-slate-300">{currentModelMetrics?.falsePositiveRate}%</span>.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Feature Importance */}
        {selectedChartTab === 'features' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Normalized Feature Importance Weights for{' '}
              <strong className="text-white">{currentModelMetrics?.name}</strong>:
            </div>

            <div className="space-y-3 pt-2">
              {currentModelMetrics?.featureImportances.map((item, idx) => {
                const pct = Math.round(item.importance * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-mono text-blue-400 font-bold">
                        {pct}% ({item.importance.toFixed(2)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400">
              Insight: Device integrity signals (SIM swaps, rooted OS, proxies) combined with sudden amount deviations carry the highest predictive importance in separating fraudulent transactions from normal consumer spending.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
