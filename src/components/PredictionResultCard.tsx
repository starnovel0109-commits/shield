/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  PredictionResult,
  TransactionInput,
  RiskFactor,
} from '../types/fraud';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  TrendingUp,
  PhoneCall,
  CheckCircle,
  ExternalLink,
  Info,
} from 'lucide-react';

interface Props {
  result: PredictionResult;
  input: TransactionInput;
}

export const PredictionResultCard: React.FC<Props> = ({ result, input }) => {
  const isHighRisk = result.riskLevel === 'HIGH_RISK';
  const isLowRisk = result.riskLevel === 'LOW_RISK';
  const isUnableToAssess = result.riskLevel === 'UNABLE_TO_ASSESS';

  return (
    <div className="space-y-6">
      {/* Primary Result Banner */}
      <div
        className={`p-6 rounded-2xl border shadow-xl transition-all ${
          isHighRisk
            ? 'bg-red-950/40 border-red-800/80 shadow-red-950/20'
            : isLowRisk
            ? 'bg-emerald-950/30 border-emerald-800/80 shadow-emerald-950/20'
            : 'bg-amber-950/30 border-amber-800/80 shadow-amber-950/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isHighRisk
                  ? 'bg-red-600/20 border border-red-500/40 text-red-400'
                  : isLowRisk
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-600/20 border border-amber-500/40 text-amber-400'
              }`}
            >
              {isHighRisk && <AlertOctagon className="w-6 h-6" />}
              {isLowRisk && <ShieldCheck className="w-6 h-6" />}
              {isUnableToAssess && <HelpCircle className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isHighRisk
                      ? 'text-red-400'
                      : isLowRisk
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {isHighRisk
                    ? 'High Risk Assessment'
                    : isLowRisk
                    ? 'Low Risk Assessment'
                    : 'Unable to Assess'}
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400 font-mono">
                  {result.modelDisplayName}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {isHighRisk
                  ? 'Suspicious Transaction Patterns Identified'
                  : isLowRisk
                  ? 'Transaction Appears Legitimate'
                  : 'Incomplete or Boundary Failure'}
              </h3>
            </div>
          </div>

          {/* Calibrated Risk Score Pill */}
          {!isUnableToAssess && (
            <div className="text-left sm:text-right shrink-0">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                Predicted Fraud Probability
              </div>
              <div
                className={`text-3xl font-extrabold font-mono tabular-nums ${
                  isHighRisk ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {result.riskScore.toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-500">
                Confidence: <span className="font-mono">{result.confidence}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Score Bar */}
        {!isUnableToAssess && (
          <div className="pt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>0% (Legitimate Baseline)</span>
              <span className="text-slate-300 font-medium font-mono">
                Threshold: 50.0%
              </span>
              <span>100% (Critical Risk)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  isHighRisk
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(2, result.riskScore))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 italic pt-1">
              Note: A statistical risk score represents anomaly likelihood estimated by the model. It is not an absolute legal determination of fraud.
            </p>
          </div>
        )}
      </div>

      {/* Prominent High-Risk Alert System & Safe Next Steps */}
      {isHighRisk && (
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/60 space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Fraud Alert: Immediate Protective Precautions Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-white">
                Recommended Verification Steps:
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Double check the recipient's verified account name in your bank application.</li>
                <li>Call the recipient via a known, trusted phone number to verify payment authenticity.</li>
                <li>Never share SMS OTPs, UPI PINs, or accept incoming collect requests from strangers.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-white">
                Official Incident Escalation Channels:
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">National Cyber Crime Helpline</span>
                  <a
                    href="tel:1930"
                    className="font-mono text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial 1930</span>
                  </a>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">National Reporting Portal</span>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>cybercrime.gov.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <strong className="text-slate-300">Regulatory Disclaimer:</strong> This system is a decision-support demonstration tool designed for academic research. It does not automatically block, hold, or execute actual transactions on live payment rails.
          </div>
        </div>
      )}

      {/* Explainable AI (XAI) Attribution Waterfall */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div>
          <h4 className="text-base font-bold text-white tracking-tight">
            Explainable AI (XAI) — Feature Attribution Analysis
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent breakdown of statistical factors influencing this prediction.
          </p>
        </div>

        {result.riskFactors.length > 0 ? (
          <div className="space-y-3">
            {result.riskFactors.map((factor, idx) => {
              const isFlag = factor.impact === 'positive';
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isFlag ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {factor.label}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        ({factor.feature})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {factor.description}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isFlag
                          ? 'bg-red-950/60 text-red-300 border border-red-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      {isFlag ? '+ Risk Factor' : '✓ Protective Factor'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
            No specific anomalous factors flagged for this transaction.
          </div>
        )}
      </div>

      {/* Recommended Next Steps */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          System Guidance & Recommendations
        </div>
        <ul className="text-xs text-slate-300 space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">·</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
