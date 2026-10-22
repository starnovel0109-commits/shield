/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  Smartphone,
  QrCode,
  Lock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <div className="space-y-16 py-12">
      {/* Section 1: Core System Features */}
      <div>
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-semibold text-blue-400">
            System Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Modern Indian Digital Payments
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive data science architecture bridging payment telemetry with statistical machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">4-Algorithm Pipeline</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trains and benchmarks Logistic Regression, CART Decision Trees, Random Forests, and Gradient Boosted Decision Trees on standardized feature vectors.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Class Imbalance Handling</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In real-world UPI data, fraud is a rare event (&lt;4%). The models leverage class-weighted loss and SMOTE principles to prevent majority-class bias.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Explainable AI (XAI)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No black-box decisions. Each prediction provides clear local attribution explaining why amount, device, timing, or velocity influenced the risk score.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Advisory Alert Workflow</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When suspicious patterns are identified, the system suggests immediate consumer verification steps and links directly to official NPCI/1930 channels.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: How It Works — 4-Step Interactive Pipeline */}
      <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-8">
        <div>
          <div className="text-xs font-semibold text-blue-400">Architecture Workflow</div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            How the Detection Pipeline Operates
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            From transaction ingress to risk scoring and actionable customer safety advisories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-blue-400">01. Feature Ingestion</div>
            <div className="font-semibold text-sm text-white">Data Parsing & Boundary Checks</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validates transaction amount, hour of day, sender/receiver transaction velocities, device telemetry, and account age in days.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-blue-400">02. Scaling & Encoding</div>
            <div className="font-semibold text-sm text-white">Preventing Data Leakage</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Normalizes numerical features with parameters derived strictly from the training split. Encodes device integrity and payment channel categories.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-blue-400">03. Model Inference</div>
            <div className="font-semibold text-sm text-white">Probability Calibration</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Selected classifier computes likelihood score (0-100%). Gradient Boosting prioritizes recall to maximize caught fraudulent patterns.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-blue-400">04. XAI & Consumer Protection</div>
            <div className="font-semibold text-sm text-white">Attribution & Recommendations</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes feature contribution waterfall and triggers contextual safety prompts without blocking live financial settlements.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: UPI Fraud Prevention Tips (RBI & NPCI Guidelines) */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-amber-400">Consumer Security Guide</div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Recognizing Common UPI Scams
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Crucial safety awareness based on Reserve Bank of India (RBI) and NPCI circulars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
              <QrCode className="w-4 h-4" />
              <span>Fake QR Code / "Receive Money" Scam</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fraudsters claim you need to scan a QR code or enter your UPI PIN to receive lottery rewards, cashback, or OLX buyer deposits.
            </p>
            <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-amber-300 font-medium">
              Golden Rule: Entering your UPI PIN always DEBITS money. You NEVER enter a PIN to receive payments.
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
              <Smartphone className="w-4 h-4" />
              <span>Remote Screen Sharing APKs</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attackers impersonate bank executives asking you to download apps like AnyDesk, TeamViewer, or malicious APKs under the pretext of KYC updates.
            </p>
            <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-amber-300 font-medium">
              Golden Rule: Never grant screen-sharing permission or install third-party APKs sent via SMS or WhatsApp.
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
              <PhoneCall className="w-4 h-4" />
              <span>SIM Swap & Midnight Velocity</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attackers clone SIM cards to intercept SMS OTPs, executing rapid automated transfers during early morning hours while victims sleep.
            </p>
            <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-amber-300 font-medium">
              Emergency Action: Call 1930 (National Cyber Crime Reporting) immediately if your mobile SIM suddenly loses network.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
