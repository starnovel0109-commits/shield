/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SavedTransaction } from '../types/fraud';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  RotateCcw,
  Eye,
  AlertTriangle,
  ShieldCheck,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const TransactionHistoryView: React.FC = () => {
  const [transactions, setTransactions] = useState<SavedTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH_RISK' | 'LOW_RISK'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'riskScore'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTx, setSelectedTx] = useState<SavedTransaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHistory = () => {
    setIsLoading(true);
    let url = `/api/history?riskLevel=${riskFilter}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.history || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch history:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, [riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const resetHistory = async () => {
    await fetch('/api/history', { method: 'DELETE' });
    fetchHistory();
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === 'amount') {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
    if (sortBy === 'riskScore') {
      return sortOrder === 'desc'
        ? b.prediction.riskScore - a.prediction.riskScore
        : a.prediction.riskScore - b.prediction.riskScore;
    }
    // Default date
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const exportCSV = () => {
    window.location.href = '/api/dataset/csv';
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Transaction Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstration prediction logs with full feature attributions and risk scores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 5,000 CSV</span>
          </button>
          <button
            onClick={resetHistory}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Logs</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Transaction ID, Type, or Notes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />
        </form>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setRiskFilter('ALL')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              riskFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs ({transactions.length})
          </button>
          <button
            onClick={() => setRiskFilter('HIGH_RISK')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              riskFilter === 'HIGH_RISK'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Risk Only
          </button>
          <button
            onClick={() => setRiskFilter('LOW_RISK')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              riskFilter === 'LOW_RISK'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Low Risk
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="riskScore">Sort by Risk Score</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 hover:text-white"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                <th className="py-3 px-4 font-semibold">Channel</th>
                <th className="py-3 px-4 font-semibold text-right">Amount (INR)</th>
                <th className="py-3 px-4 font-semibold text-center">Timing</th>
                <th className="py-3 px-4 font-semibold">Device Status</th>
                <th className="py-3 px-4 font-semibold text-center">Risk Assessment</th>
                <th className="py-3 px-4 font-semibold text-right">Risk Score</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    Loading audit records...
                  </td>
                </tr>
              ) : sortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No matching transactions found in audit trail.
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((tx) => {
                  const isHigh = tx.prediction.riskLevel === 'HIGH_RISK';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedTx(tx)}
                    >
                      <td className="py-3 px-4 font-bold text-white">
                        {tx.id}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        {tx.transactionType}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-white font-medium">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center tabular-nums text-slate-400">
                        {String(tx.transactionHour).padStart(2, '0')}:00 hrs
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        {tx.deviceRisk.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isHigh
                              ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          }`}
                        >
                          {isHigh ? (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>HIGH RISK</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              <span>LOW RISK</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right tabular-nums font-bold ${
                          isHigh ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {tx.prediction.riskScore.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="px-2.5 py-1 text-xs text-blue-400 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Transaction Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-blue-400">
                  {selectedTx.id}
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400">
                  {new Date(selectedTx.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Risk Header */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                selectedTx.prediction.riskLevel === 'HIGH_RISK'
                  ? 'bg-red-950/40 border-red-800/80 text-red-300'
                  : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
              }`}
            >
              <div>
                <div className="text-xs uppercase font-bold tracking-wider">
                  {selectedTx.prediction.riskLevel.replace('_', ' ')}
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Model: {selectedTx.prediction.modelDisplayName}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold tabular-nums">
                  {selectedTx.prediction.riskScore.toFixed(1)}%
                </div>
                <div className="text-[11px] text-slate-400">
                  Confidence: {selectedTx.prediction.confidence}%
                </div>
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Amount</div>
                <div className="font-mono text-white text-sm font-bold mt-0.5">
                  ₹{selectedTx.amount.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Transaction Hour</div>
                <div className="font-mono text-white text-sm font-bold mt-0.5">
                  {String(selectedTx.transactionHour).padStart(2, '0')}:00 hrs
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Payment Channel</div>
                <div className="font-sans text-white text-sm font-bold mt-0.5">
                  {selectedTx.transactionType}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Device Risk</div>
                <div className="font-sans text-white font-medium mt-0.5">
                  {selectedTx.deviceRisk.replace('_', ' ')}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Behavior Profile</div>
                <div className="font-sans text-white font-medium mt-0.5">
                  {selectedTx.behaviorRisk.replace('_', ' ')}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Account Age</div>
                <div className="font-mono text-white font-medium mt-0.5">
                  {selectedTx.senderAccountAgeDays} days
                </div>
              </div>
            </div>

            {/* Explainable AI Factors */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-white">
                Explainable AI (XAI) Contributing Factors:
              </div>
              <div className="space-y-2">
                {selectedTx.prediction.riskFactors.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{f.label}</div>
                      <div className="text-slate-400 mt-0.5">{f.description}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                        f.impact === 'positive'
                          ? 'bg-red-950/80 text-red-300'
                          : 'bg-emerald-950/80 text-emerald-300'
                      }`}
                    >
                      {f.impact === 'positive' ? '+ Risk' : '✓ Safe'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close button */}
            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
