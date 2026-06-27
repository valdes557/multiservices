import mongoose, { Schema, Document } from 'mongoose';

/**
 * A subscription plan fully configured by the administrator.
 * Plans are dynamic: the admin can create / edit / delete them, set the price,
 * the features shown to users, the usage limits, and the free-trial length.
 */

export interface LocalizedText {
  fr: string;
  en: string;
}

export interface IPlan extends Document {
  /** Stable slug used everywhere (subscription.planKey, tool.planKeys, forums). */
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Monthly price in `currency`. */
  price: number;
  currency: string;
  /** Free-trial length in days. 0 = no trial. */
  trialDays: number;
  /** Marketing feature bullets displayed on the pricing card. */
  features: LocalizedText[];
  /**
   * Flexible usage limits, e.g. { toolsPerDay: 50, exportsPerMonth: 100 }.
   * -1 (or absent) means unlimited.
   */
  limits: Record<string, number>;
  /** Whether tool executions end with a Google AdSense ad during the trial. */
  adsDuringTrial: boolean;
  /** Each plan owns a discussion forum for its subscribers. */
  forumEnabled: boolean;
  /** Inactive plans are hidden from users and cannot be subscribed to. */
  active: boolean;
  /** Display order on the pricing page (ascending). */
  order: number;
  /** System plans (the 3 defaults) are protected against accidental deletion. */
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedSchema = new Schema<LocalizedText>(
  {
    fr: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  { _id: false }
);

const PlanSchema = new Schema<IPlan>(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: LocalizedSchema, required: true },
    description: { type: LocalizedSchema, default: () => ({ fr: '', en: '' }) },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'XOF' },
    trialDays: { type: Number, default: 0, min: 0 },
    features: { type: [LocalizedSchema], default: [] },
    limits: { type: Schema.Types.Mixed, default: {} },
    adsDuringTrial: { type: Boolean, default: true },
    forumEnabled: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);
