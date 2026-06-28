import mongoose, { Schema, Document } from 'mongoose';

/**
 * One-time confirmation code emailed to the platform owner before a sensitive
 * change is applied (e.g. adding / modifying / deleting payment API keys).
 * The pending change is stored in `payload` and only applied once the code is
 * confirmed. Codes are single-use and expire quickly.
 */
export interface IConfirmationCode extends Document {
  code: string;
  purpose: 'payment-keys';
  /** The change to apply once confirmed (e.g. the new SebPay keys). */
  payload: Record<string, unknown>;
  /** Where the code was sent. */
  email: string;
  /** Admin user id who requested the change. */
  requestedBy: mongoose.Types.ObjectId | null;
  used: boolean;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

const ConfirmationCodeSchema = new Schema<IConfirmationCode>(
  {
    code: { type: String, required: true },
    purpose: { type: String, enum: ['payment-keys'], required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    email: { type: String, required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    used: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL index: documents auto-delete once expired.
ConfirmationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.ConfirmationCode ||
  mongoose.model<IConfirmationCode>('ConfirmationCode', ConfirmationCodeSchema);
