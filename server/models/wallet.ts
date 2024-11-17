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
    head:{type:String,required:true},
    tail:{type:String,required:true},
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    description: { type: String, required: false,default:"" },
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
