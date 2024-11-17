import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Transaction {
  transaction_id: string;
  amount: number;
  type: 'credit' | 'debit';
  timestamp: Date;
  description: string;
}

interface Wallet extends Document {
  wallet_id: string;
  role: string;
  current_balance: number;
  transactions: Transaction[];
}

const TransactionSchema: Schema = new Schema(
  {
    transaction_id: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    timestamp: { type: Date, default: Date.now },
    description: { type: String, required: false },
  },
  { _id: false } 
);

const WalletSchema: Schema = new Schema(
  {
    wallet_id: { type: String, unique: true, required: true },
    role: { type: String, required: true },
    current_balance: { type: Number, default:0 },
    transactions: { type: [TransactionSchema], default: [] },
  },
  { timestamps: true } 
);

const WalletModel: Model<Wallet> = mongoose.model<Wallet>('Wallet', WalletSchema);

export { WalletModel, Wallet };
