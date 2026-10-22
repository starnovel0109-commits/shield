/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TransactionInput,
  TransactionType,
  DeviceRisk,
  BehaviorRisk,
  MLModelType,
  PredictionResult,
} from '../types/fraud';
import {
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Props {
  onAnalyzeSuccess: (result: PredictionResult, input: TransactionInput) => void;
  activeModel: MLModelType;
  setActiveModel: (m: MLModelType) => void;
}

export const TransactionDetectionForm: React.FC<Props> = ({
  onAnalyzeSuccess,
  activeModel,
  setActiveModel,
}) => {
  const [txId, setTxId] = useState<string>(
    () => `UPI/202610/${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [amount, setAmount] = useState<string>('4500');
  const [transactionHour, setTransactionHour] = useState<number>(14);
  const [transactionType, setTransactionType] = useState<TransactionType>('P2P');
  const [senderTxCount, setSenderTxCount] = useState<number>(3);
  const [receiverTxCount, setReceiverTxCount] = useState<number>(45);
  const [senderAccountAgeDays, setSenderAccountAgeDays] = useState<number>(320);
  const [deviceRisk, setDeviceRisk] = useState<DeviceRisk>('trusted');
  const [behaviorRisk, setBehaviorRisk] = useState<BehaviorRisk>('normal');
  const [notes, setNotes] = useState<string>('Standard UPI P2P transfer');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateNewId = () => {
    setTxId(`UPI/202610/${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const loadPreset = (presetName: string) => {
    generateNewId();
    setErrorMessage(null);
    switch (presetName) {
      case 'legit_chai':
        setAmount('150');
        setTransactionHour(10);
        setTransactionType('P2M');
        setSenderTxCount(2);
        setReceiverTxCount(850);
        setSenderAccountAgeDays(540);
        setDeviceRisk('trusted');
        setBehaviorRisk('normal');
        setNotes('Routine morning chai stall QR payment');
        break;
      case 'midnight_scam':
        setAmount('85000');
        setTransactionHour(3);
        setTransactionType('P2P');
        setSenderTxCount(24);
        setReceiverTxCount(2);
        setSenderAccountAgeDays(3);
        setDeviceRisk('sim_swap');
        setBehaviorRisk('midnight_burst');
        setNotes('Sudden high transfer following 2 AM telecom swap');
        break;
      case 'phishing_qr':
        setAmount('29500');
        setTransactionHour(15);
        setTransactionType('QRCodeScan');
        setSenderTxCount(9);
        setReceiverTxCount(1);
        setSenderAccountAgeDays(60);
        setDeviceRisk('vpn_proxy');
        setBehaviorRisk('first_time_payee');
        setNotes('Unverified marketplace seller static QR link');
        break;
      case 'utility_bill':
        setAmount('3200');
        setTransactionHour(18);
        setTransactionType('BillPayment');
        setSenderTxCount(1);
        setReceiverTxCount(3400);
        setSenderAccountAgeDays(720);
        setDeviceRisk('trusted');
        setBehaviorRisk('normal');
        setNotes('Monthly electricity bill via BBPS verified biller');
        break;
      case 'crypto_split':
        setAmount('49000');
        setTransactionHour(2);
        setTransactionType('CryptoTransfer');
        setSenderTxCount(18);
        setReceiverTxCount(1);
        setSenderAccountAgeDays(12);
        setDeviceRisk('rooted_device');
        setBehaviorRisk('sudden_surge');
        setNotes('P2P crypto arbitrage wallet drain attempt');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setErrorMessage('Please enter a valid, positive transaction amount in INR.');
      return;
    }

    if (transactionHour < 0 || transactionHour > 23) {
      setErrorMessage('Transaction hour must be between 0 and 23.');
      return;
    }

    if (senderAccountAgeDays < 0) {
      setErrorMessage('Sender account age cannot be negative.');
      return;
    }

    setIsLoading(true);

    const payload: TransactionInput = {
      transactionId: txId,
      amount: parsedAmount,
      transactionHour,
      transactionType,
      senderTxCount,
      receiverTxCount,
      senderAccountAgeDays,
      deviceRisk,
      behaviorRisk,
      notes,
    };

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          modelType: activeModel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Server rejected transaction prediction');
      }

      onAnalyzeSuccess(data.transaction.prediction, payload);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to ML prediction API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Transaction Risk Evaluation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter payment parameters to query the machine learning detection engine.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset('legit_chai')}
            className="px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 rounded-md transition-colors"
          >
            Tea/Snacks (Legit)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('midnight_scam')}
            className="px-2.5 py-1 text-xs font-medium text-red-400 bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 rounded-md transition-colors"
          >
            Midnight SIM Swap (Fraud)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('phishing_qr')}
            className="px-2.5 py-1 text-xs font-medium text-amber-400 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 rounded-md transition-colors"
          >
            Phishing QR
          </button>
          <button
            type="button"
            onClick={() => loadPreset('crypto_split')}
            className="px-2.5 py-1 text-xs font-medium text-purple-400 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 rounded-md transition-colors"
          >
            Crypto Drain
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Transaction ID & Active Model Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Transaction ID
              </label>
              <button
                type="button"
                onClick={generateNewId}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Generate ID</span>
              </button>
            </div>
            <input
              type="text"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Active Machine Learning Model
            </label>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value as MLModelType)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="gradient_boosting">
                Gradient Boosting Classifier (Ensemble, Top Recall)
              </option>
              <option value="random_forest">
                Random Forest Classifier (15 Bagged Trees)
              </option>
              <option value="decision_tree">
                Decision Tree Classifier (CART, Gini Splits)
              </option>
              <option value="logistic_regression">
                Logistic Regression (L2 Weighted Loss)
              </option>
            </select>
          </div>
        </div>

        {/* Row 2: Amount INR & Hour */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Transaction Amount (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="4500"
                className="w-full pl-8 pr-3 py-2 text-sm font-mono tabular-nums bg-slate-950 border border-slate-700/80 rounded-lg text-white font-medium focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex gap-1 mt-1.5">
              {[500, 2500, 15000, 50000].map((quickAmt) => (
                <button
                  key={quickAmt}
                  type="button"
                  onClick={() => setAmount(quickAmt.toString())}
                  className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 rounded border border-slate-700/50"
                >
                  ₹{quickAmt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Transaction Hour (0 - 23 hrs)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={transactionHour}
              onChange={(e) => setTransactionHour(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-950 border border-slate-700/80 rounded-lg text-white font-medium focus:outline-none focus:border-blue-500"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              {transactionHour >= 0 && transactionHour <= 4
                ? 'Midnight (Peak Risk Window)'
                : transactionHour >= 9 && transactionHour <= 19
                ? 'Standard daylight banking'
                : 'Evening / Early morning'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Payment Channel / Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as TransactionType)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="P2P">P2P (Peer-to-Peer)</option>
              <option value="P2M">P2M (Person-to-Merchant)</option>
              <option value="QRCodeScan">QR Code Scan</option>
              <option value="BillPayment">Bill Payment (BBPS)</option>
              <option value="OnlineCheckout">Online Web Checkout</option>
              <option value="CryptoTransfer">Crypto / Escrow Transfer</option>
            </select>
          </div>
        </div>

        {/* Row 3: Velocities & Account Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Sender 24h Tx Count
            </label>
            <input
              type="number"
              min="0"
              value={senderTxCount}
              onChange={(e) => setSenderTxCount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-950 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Normal range: 1–6 transactions/day
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Receiver Historical Count
            </label>
            <input
              type="number"
              min="0"
              value={receiverTxCount}
              onChange={(e) => setReceiverTxCount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-950 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Low count (1–3) on high amount = higher risk
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Sender Account Age (Days)
            </label>
            <input
              type="number"
              min="0"
              value={senderAccountAgeDays}
              onChange={(e) =>
                setSenderAccountAgeDays(parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-950 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              &lt;15 days = High incident potential
            </span>
          </div>
        </div>

        {/* Row 4: Device Risk & Behavior Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Device & Session Risk Indicator
            </label>
            <select
              value={deviceRisk}
              onChange={(e) => setDeviceRisk(e.target.value as DeviceRisk)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="trusted">Trusted Device (Registered Hardware IMEI/SIM)</option>
              <option value="new_device">New Device (First-Time Login)</option>
              <option value="vpn_proxy">Anonymized Network / Datacenter VPN</option>
              <option value="rooted_device">Rooted / Jailbroken Android OS</option>
              <option value="sim_swap">SIM Swap Detected Within 48 Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Previous Transaction Behavioral Pattern
            </label>
            <select
              value={behaviorRisk}
              onChange={(e) => setBehaviorRisk(e.target.value as BehaviorRisk)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="normal">Normal Spending Rhythm</option>
              <option value="first_time_payee">First-Time Payee / New VPA</option>
              <option value="sudden_surge">Sudden Velocity Surge (&gt;5x Hourly Baseline)</option>
              <option value="midnight_burst">Midnight Burst (Rapid Off-Peak Sequence)</option>
              <option value="frequent_fails">Multiple Prior Failed PIN Attempts</option>
            </select>
          </div>
        </div>

        {/* Row 5: Notes & Submit Button */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Audit Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Flight ticket booking on merchant portal"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-98 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Evaluating Transaction Features...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Analyze Transaction with ML</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
