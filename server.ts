/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  predictFraudRisk,
  computeModelBenchmarks,
  getModelDisplayName,
} from './src/ml/engine.ts';
import {
  BENCHMARK_DATASET,
  getDatasetStatistics,
  convertDatasetToCSV,
} from './src/ml/dataset.ts';
import {
  TransactionInput,
  MLModelType,
  SavedTransaction,
} from './src/types/fraud.ts';
import {
  PYTHON_TRAIN_SCRIPT,
  PYTHON_FLASK_APP,
  PYTHON_REQUIREMENTS,
  PROJECT_README,
} from './src/ml/pythonCompanion.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent history store (pre-seeded with realistic demonstration records)
let activeModel: MLModelType = 'gradient_boosting';

const INITIAL_DEMO_TRANSACTIONS: SavedTransaction[] = [
  {
    id: 'UPI/202610/084921',
    amount: 68500,
    transactionHour: 3,
    transactionType: 'P2P',
    senderTxCount: 19,
    receiverTxCount: 2,
    senderAccountAgeDays: 4,
    deviceRisk: 'sim_swap',
    behaviorRisk: 'midnight_burst',
    notes: 'Sudden high-value transfer following SIM change alert.',
    prediction: predictFraudRisk(
      {
        amount: 68500,
        transactionHour: 3,
        transactionType: 'P2P',
        senderTxCount: 19,
        receiverTxCount: 2,
        senderAccountAgeDays: 4,
        deviceRisk: 'sim_swap',
        behaviorRisk: 'midnight_burst',
      },
      'gradient_boosting'
    ),
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
  {
    id: 'UPI/202610/084918',
    amount: 450,
    transactionHour: 13,
    transactionType: 'P2M',
    senderTxCount: 3,
    receiverTxCount: 420,
    senderAccountAgeDays: 780,
    deviceRisk: 'trusted',
    behaviorRisk: 'normal',
    notes: 'Grocery store checkout via BharatQR scan.',
    prediction: predictFraudRisk(
      {
        amount: 450,
        transactionHour: 13,
        transactionType: 'P2M',
        senderTxCount: 3,
        receiverTxCount: 420,
        senderAccountAgeDays: 780,
        deviceRisk: 'trusted',
        behaviorRisk: 'normal',
      },
      'gradient_boosting'
    ),
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'UPI/202610/084902',
    amount: 32000,
    transactionHour: 16,
    transactionType: 'QRCodeScan',
    senderTxCount: 8,
    receiverTxCount: 1,
    senderAccountAgeDays: 45,
    deviceRisk: 'vpn_proxy',
    behaviorRisk: 'first_time_payee',
    notes: 'Unverified static QR payment with high amount.',
    prediction: predictFraudRisk(
      {
        amount: 32000,
        transactionHour: 16,
        transactionType: 'QRCodeScan',
        senderTxCount: 8,
        receiverTxCount: 1,
        senderAccountAgeDays: 45,
        deviceRisk: 'vpn_proxy',
        behaviorRisk: 'first_time_payee',
      },
      'gradient_boosting'
    ),
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'UPI/202610/084877',
    amount: 2200,
    transactionHour: 19,
    transactionType: 'BillPayment',
    senderTxCount: 2,
    receiverTxCount: 2500,
    senderAccountAgeDays: 520,
    deviceRisk: 'trusted',
    behaviorRisk: 'normal',
    notes: 'Electricity utility bill payment via BBPS.',
    prediction: predictFraudRisk(
      {
        amount: 2200,
        transactionHour: 19,
        transactionType: 'BillPayment',
        senderTxCount: 2,
        receiverTxCount: 2500,
        senderAccountAgeDays: 520,
        deviceRisk: 'trusted',
        behaviorRisk: 'normal',
      },
      'gradient_boosting'
    ),
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

let transactionHistory: SavedTransaction[] = [...INITIAL_DEMO_TRANSACTIONS];

async function bootstrapServer() {
  const app = express();
  app.use(express.json());

  // GET /api/health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'UPI Shield AI Fraud Detection Engine',
      activeModel,
      activeModelDisplayName: getModelDisplayName(activeModel),
      datasetRecords: BENCHMARK_DATASET.length,
      historyCount: transactionHistory.length,
      timestamp: new Date().toISOString(),
    });
  });

  // POST /api/predict
  app.post('/api/predict', (req: Request, res: Response) => {
    try {
      const body = req.body;
      const input: TransactionInput = {
        transactionId:
          body.transactionId ||
          `UPI/${new Date().getFullYear()}${String(
            new Date().getMonth() + 1
          ).padStart(2, '0')}/${Math.floor(100000 + Math.random() * 900000)}`,
        amount: Number(body.amount),
        transactionHour: Number(body.transactionHour ?? new Date().getHours()),
        transactionType: body.transactionType || 'P2P',
        senderTxCount: Number(body.senderTxCount ?? 1),
        receiverTxCount: Number(body.receiverTxCount ?? 50),
        senderAccountAgeDays: Number(body.senderAccountAgeDays ?? 365),
        deviceRisk: body.deviceRisk || 'trusted',
        behaviorRisk: body.behaviorRisk || 'normal',
        notes: body.notes,
      };

      const selectedModel: MLModelType = body.modelType || activeModel;
      const prediction = predictFraudRisk(input, selectedModel);

      // Save to history log
      const record: SavedTransaction = {
        id: input.transactionId!,
        ...input,
        prediction,
        createdAt: new Date().toISOString(),
      };

      // Keep recent 100 transactions
      transactionHistory.unshift(record);
      if (transactionHistory.length > 100) {
        transactionHistory = transactionHistory.slice(0, 100);
      }

      res.json({
        success: true,
        transaction: record,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Error processing transaction prediction',
      });
    }
  });

  // GET /api/metrics
  app.get('/api/metrics', (req: Request, res: Response) => {
    try {
      const models = computeModelBenchmarks();
      const datasetStats = getDatasetStatistics();

      res.json({
        activeModel,
        models,
        datasetStats,
        evaluationSplit: '80% Train / 20% Test (1,000 test transactions)',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/model/select
  app.post('/api/model/select', (req: Request, res: Response) => {
    const { modelType } = req.body;
    if (
      [
        'gradient_boosting',
        'random_forest',
        'decision_tree',
        'logistic_regression',
      ].includes(modelType)
    ) {
      activeModel = modelType;
      res.json({
        success: true,
        activeModel,
        displayName: getModelDisplayName(activeModel),
      });
    } else {
      res.status(400).json({ error: 'Invalid model identifier' });
    }
  });

  // GET /api/history
  app.get('/api/history', (req: Request, res: Response) => {
    const riskFilter = req.query.riskLevel as string;
    const search = ((req.query.search as string) || '').toLowerCase();

    let filtered = transactionHistory;

    if (riskFilter && riskFilter !== 'ALL') {
      filtered = filtered.filter(
        (t) => t.prediction.riskLevel === riskFilter
      );
    }

    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(search) ||
          t.transactionType.toLowerCase().includes(search) ||
          t.deviceRisk.toLowerCase().includes(search) ||
          (t.notes && t.notes.toLowerCase().includes(search))
      );
    }

    res.json({
      total: filtered.length,
      history: filtered,
    });
  });

  // DELETE /api/history (reset or clear)
  app.delete('/api/history', (req: Request, res: Response) => {
    const mode = req.query.mode;
    if (mode === 'clear') {
      transactionHistory = [];
    } else {
      transactionHistory = [...INITIAL_DEMO_TRANSACTIONS];
    }
    res.json({ success: true, count: transactionHistory.length });
  });

  // GET /api/dataset/sample
  app.get('/api/dataset/sample', (req: Request, res: Response) => {
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const sample = BENCHMARK_DATASET.slice(0, limit);
    const stats = getDatasetStatistics();
    res.json({ stats, sample });
  });

  // GET /api/dataset/csv
  app.get('/api/dataset/csv', (req: Request, res: Response) => {
    const csv = convertDatasetToCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="upi_fraud_dataset_5000.csv"'
    );
    res.send(csv);
  });

  // GET /api/export/python-code
  app.get('/api/export/python-code', (req: Request, res: Response) => {
    res.json({
      trainScript: PYTHON_TRAIN_SCRIPT,
      flaskApp: PYTHON_FLASK_APP,
      requirements: PYTHON_REQUIREMENTS,
      readme: PROJECT_README,
    });
  });

  // Dev server vs Production static serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UPI Shield AI server listening on http://0.0.0.0:${PORT}`);
  });
}

bootstrapServer().catch((err) => {
  console.error('Failed to start UPI Shield AI server:', err);
  process.exit(1);
});
