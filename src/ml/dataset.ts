/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TransactionType,
  DeviceRisk,
  BehaviorRisk,
  DatasetStatistics,
} from '../types/fraud';

export interface DatasetRow {
  transaction_id: string;
  timestamp: string;
  amount: number;
  transaction_hour: number;
  transaction_type: TransactionType;
  sender_transaction_count: number;
  receiver_transaction_count: number;
  sender_account_age_days: number;
  device_risk: DeviceRisk;
  behavior_risk: BehaviorRisk;
  is_fraud: number;
}

// Pseudo-random generator with fixed seed for reproducibility across runs
function createSeededRandom(seed: number = 42) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generate synthetic UPI transaction dataset with realistic class imbalance and behavioural patterns.
 * Clearly labeled as synthetic data generated for educational demonstration and model benchmarking.
 */
export function generateSyntheticDataset(count: number = 5000): DatasetRow[] {
  const rand = createSeededRandom(1337);
  const rows: DatasetRow[] = [];

  const types: TransactionType[] = [
    'P2P',
    'P2M',
    'BillPayment',
    'QRCodeScan',
    'OnlineCheckout',
    'CryptoTransfer',
  ];

  // We target ~3.8% fraud rate (approx 190 fraud cases out of 5000)
  for (let i = 1; i <= count; i++) {
    const paddedId = String(i).padStart(6, '0');
    const txId = `UPI/202610/${paddedId}`;

    const isFraudCandidate = rand() < 0.038;

    let amount: number;
    let transaction_hour: number;
    let transaction_type: TransactionType;
    let sender_transaction_count: number;
    let receiver_transaction_count: number;
    let sender_account_age_days: number;
    let device_risk: DeviceRisk;
    let behavior_risk: BehaviorRisk;
    let is_fraud = 0;

    if (isFraudCandidate) {
      is_fraud = 1;
      // High-value sudden spikes or high velocity at unusual hours
      const fraudPattern = rand();
      if (fraudPattern < 0.4) {
        // Pattern 1: SIM Swap / Account Takeover - Midnight high amount
        amount = Math.round(35000 + rand() * 62000);
        transaction_hour = Math.floor(rand() * 5); // 00:00 to 04:59 AM
        transaction_type = rand() > 0.3 ? 'P2P' : 'CryptoTransfer';
        sender_transaction_count = Math.floor(12 + rand() * 25);
        receiver_transaction_count = Math.floor(1 + rand() * 4);
        sender_account_age_days = Math.floor(1 + rand() * 20);
        device_risk = rand() > 0.4 ? 'sim_swap' : 'new_device';
        behavior_risk = 'midnight_burst';
      } else if (fraudPattern < 0.7) {
        // Pattern 2: Phishing QR Code / Sudden Surge Scam
        amount = Math.round(18000 + rand() * 45000);
        transaction_hour = Math.floor(11 + rand() * 11); // Daytime or evening
        transaction_type = 'QRCodeScan';
        sender_transaction_count = Math.floor(8 + rand() * 18);
        receiver_transaction_count = Math.floor(1 + rand() * 3);
        sender_account_age_days = Math.floor(30 + rand() * 300);
        device_risk = rand() > 0.5 ? 'vpn_proxy' : 'trusted';
        behavior_risk = 'first_time_payee';
      } else {
        // Pattern 3: Rapid Velocity Split Fraud
        amount = Math.round(8000 + rand() * 22000);
        transaction_hour = Math.floor(rand() * 24);
        transaction_type = rand() > 0.5 ? 'OnlineCheckout' : 'P2P';
        sender_transaction_count = Math.floor(22 + rand() * 35);
        receiver_transaction_count = 1;
        sender_account_age_days = Math.floor(3 + rand() * 15);
        device_risk = 'rooted_device';
        behavior_risk = 'sudden_surge';
      }
    } else {
      // Normal legitimate UPI transaction
      is_fraud = 0;
      const normalProfile = rand();

      if (normalProfile < 0.55) {
        // Everyday micropayments (Groceries, food, tea, small P2M/P2P)
        amount = Math.round(15 + rand() * 1200);
        transaction_type = rand() > 0.4 ? 'P2M' : 'QRCodeScan';
      } else if (normalProfile < 0.85) {
        // Moderate P2P or regular bill payments
        amount = Math.round(1000 + rand() * 6500);
        transaction_type = rand() > 0.5 ? 'P2P' : 'BillPayment';
      } else {
        // Occasional legitimate large purchase (e.g. flight, electronics)
        amount = Math.round(12000 + rand() * 32000);
        transaction_type = rand() > 0.5 ? 'OnlineCheckout' : 'P2P';
      }

      // Legitimate hour distribution (peaking during 08:00 to 22:00)
      const hourRand = rand();
      if (hourRand < 0.90) {
        transaction_hour = Math.floor(8 + rand() * 14); // 8 AM to 10 PM
      } else {
        transaction_hour = Math.floor(rand() * 8); // rare midnight legit tx
      }

      sender_transaction_count = Math.floor(1 + rand() * 8);
      receiver_transaction_count = Math.floor(25 + rand() * 300); // merchants or active peers
      sender_account_age_days = Math.floor(60 + rand() * 1400); // mature account
      device_risk = rand() < 0.92 ? 'trusted' : 'new_device';
      behavior_risk = rand() < 0.88 ? 'normal' : 'first_time_payee';
    }

    // Realistic timestamp in current month
    const day = Math.floor(1 + (i % 28));
    const paddedDay = String(day).padStart(2, '0');
    const minute = Math.floor(rand() * 60);
    const paddedMinute = String(minute).padStart(2, '0');
    const paddedHour = String(transaction_hour).padStart(2, '0');
    const timestamp = `2026-10-${paddedDay}T${paddedHour}:${paddedMinute}:00.000Z`;

    rows.push({
      transaction_id: txId,
      timestamp,
      amount,
      transaction_hour,
      transaction_type,
      sender_transaction_count,
      receiver_transaction_count,
      sender_account_age_days,
      device_risk,
      behavior_risk,
      is_fraud,
    });
  }

  return rows;
}

// Global cached dataset for the application lifetime
export const BENCHMARK_DATASET: DatasetRow[] = generateSyntheticDataset(5000);

export function getDatasetStatistics(rows: DatasetRow[] = BENCHMARK_DATASET): DatasetStatistics {
  const totalRecords = rows.length;
  const fraudRecords = rows.filter((r) => r.is_fraud === 1).length;
  const legitimateRecords = totalRecords - fraudRecords;
  const fraudRate = Number(((fraudRecords / totalRecords) * 100).toFixed(2));

  const totalAmount = rows.reduce((acc, r) => acc + r.amount, 0);
  const avgAmount = Math.round(totalAmount / totalRecords);

  const fraudAmount = rows.filter((r) => r.is_fraud === 1).reduce((acc, r) => acc + r.amount, 0);
  const avgFraudAmount = fraudRecords > 0 ? Math.round(fraudAmount / fraudRecords) : 0;

  const legitAmount = rows.filter((r) => r.is_fraud === 0).reduce((acc, r) => acc + r.amount, 0);
  const avgLegitAmount = legitimateRecords > 0 ? Math.round(legitAmount / legitimateRecords) : 0;

  return {
    totalRecords,
    fraudRecords,
    legitimateRecords,
    fraudRate,
    avgAmount,
    avgFraudAmount,
    avgLegitAmount,
  };
}

export function convertDatasetToCSV(rows: DatasetRow[] = BENCHMARK_DATASET): string {
  const headers = [
    'transaction_id',
    'timestamp',
    'amount',
    'transaction_hour',
    'transaction_type',
    'sender_transaction_count',
    'receiver_transaction_count',
    'sender_account_age_days',
    'device_risk',
    'behavior_risk',
    'is_fraud',
  ];

  const csvRows = [headers.join(',')];

  for (const row of rows) {
    csvRows.push(
      [
        row.transaction_id,
        row.timestamp,
        row.amount,
        row.transaction_hour,
        row.transaction_type,
        row.sender_transaction_count,
        row.receiver_transaction_count,
        row.sender_account_age_days,
        row.device_risk,
        row.behavior_risk,
        row.is_fraud,
      ].join(',')
    );
  }

  return csvRows.join('\n');
}
