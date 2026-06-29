import mongoose, { Schema, Document } from 'mongoose';

/**
 * A message in a plan's forum. Membership is derived from entitlement (a user
 * can read/post only while on that plan with trial/active access), so there is
 * no separate membership table — trial users join automatically and lose access
 * when the trial ends, regaining it after payment (requirements #15, #16).
 */
export interface IForumMessage extends Document {
  planKey: string;
  userId: mongoose.Types.ObjectId;
  authorName: string;
  type: 'text' | 'image' | 'voice';
  /** Text content (caption for media). */
  content: string;
  /** Data URL for image / voice attachments (MVP storage). */
  attachmentUrl: string;
  deleted: boolean;
  createdAt: Date;
}

const ForumMessageSchema = new Schema<IForumMessage>(
  {
    planKey: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, default: '' },
    type: { type: String, enum: ['text', 'image', 'voice'], default: 'text' },
    content: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ForumMessageSchema.index({ planKey: 1, createdAt: 1 });

export default mongoose.models.ForumMessage ||
  mongoose.model<IForumMessage>('ForumMessage', ForumMessageSchema);
