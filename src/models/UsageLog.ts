import mongoose, { Schema, Document } from 'mongoose';

export interface IUsageLog extends Document {
  userId: mongoose.Types.ObjectId;
  service: string;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const UsageLogSchema = new Schema<IUsageLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: String, required: true },
    action: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.UsageLog || mongoose.model<IUsageLog>('UsageLog', UsageLogSchema);
