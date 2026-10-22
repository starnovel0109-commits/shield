/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType =
  | 'P2P'
  | 'P2M'
  | 'BillPayment'
  | 'QRCodeScan'
  | 'OnlineCheckout'
  | 'CryptoTransfer';

export type DeviceRisk =
  | 'trusted'
  | 'new_device'
  | 'vpn_proxy'
  | 'rooted_device'
  | 'sim_swap';

export type BehaviorRisk =
  | 'normal'
  | 'sudden_surge'
  | 'first_time_payee'
  | 'midnight_burst'
  | 'frequent_fails';

export type RiskLevel = 'LOW_RISK' | 'HIGH_RISK' | 'UNABLE_TO_ASSESS';

export type MLModelType =
  | 'gradient_boosting'
  | 'random_forest'
  | 'decision_tree'
  | 'logistic_regression';

export interface TransactionInput {
  transactionId?: string;
  amount: number;
  transactionHour: number;
  transactionType: TransactionType;
  senderTxCount: number;
  receiverTxCount: number;
  senderAccountAgeDays: number;
  deviceRisk: DeviceRisk;
  behaviorRisk: BehaviorRisk;
  notes?: string;
}

export interface RiskFactor {
  feature: string;
  label: string;
  contribution: number; // -1 to +1 or score contribution %
  impact: 'positive' | 'negative' | 'neutral'; // positive increases fraud risk, negative indicates legitimacy
  description: string;
}

export interface PredictionResult {
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100 percentage
  confidence: number; // 0 to 100 percentage
  modelUsed: MLModelType;
  modelDisplayName: string;
  riskFactors: RiskFactor[];
  recommendations: string[];
  analyzedAt: string;
}

export interface SavedTransaction extends TransactionInput {
  id: string;
  prediction: PredictionResult;
  createdAt: string;
}

export interface ConfusionMatrix {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface FeatureImportance {
  feature: string;
  label: string;
  importance: number; // 0 to 1
}

export interface ModelMetrics {
  id: MLModelType;
  name: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  falsePositiveRate: number;
  confusionMatrix: ConfusionMatrix;
  featureImportances: FeatureImportance[];
  description: string;
  recommendedFor: string;
}

export interface DatasetStatistics {
  totalRecords: number;
  fraudRecords: number;
  legitimateRecords: number;
  fraudRate: number;
  avgAmount: number;
  avgFraudAmount: number;
  avgLegitAmount: number;
}
