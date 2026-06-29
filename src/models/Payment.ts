import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  planKey: string;
  amount: number;
  currency: string;
  method: 'usdt' | 'binance_pay' | 'mobile_money' | 'other';
  /** Mobile-money fields (SebPay). */
  operator: string;
  phone: string;
  /** Our unique reference sent to SebPay as external_reference. */
  externalReference: string;
  /** SebPay transaction id (filled after initiation / webhook). */
  transactionId: string;
  mode: 'test' | 'live';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planKey: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'XOF' },
    method: { type: String, enum: ['usdt', 'binance_pay', 'mobile_money', 'other'], required: true },
    operator: { type: String, default: '' },
    phone: { type: String, default: '' },
    externalReference: { type: String, index: true, unique: true, sparse: true },
    transactionId: { type: String, default: '' },
    mode: { type: String, enum: ['test', 'live'], default: 'test' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
