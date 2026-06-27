import mongoose, { Schema, Document } from 'mongoose';

/**
 * subscription.status lifecycle:
 *  - none     : no plan selected yet
 *  - trial    : within the free-trial window (tools end with ads unless ads are disabled)
 *  - active   : paid & active monthly subscription (ads disabled)
 *  - expired  : trial or paid period ended -> premium tools locked until payment
 *  - disabled : administrator manually deactivated this user's plan (no access)
 */
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired' | 'disabled';

export interface IUserSubscription {
  /** Slug of the Plan the user is on (null = no plan). */
  planKey: string | null;
  status: SubscriptionStatus;
  trialStartDate: Date | null;
  trialEndDate: Date | null;
  /** Paid period. */
  startDate: Date | null;
  endDate: Date | null;
  /**
   * Whether Google AdSense ads are shown after this user's tool executions.
   * Set to false once the subscription is paid, or when the admin blocks ads.
   */
  adsEnabled: boolean;
  /** Admin manually activated a paid plan for this user (even during trial). */
  activatedByAdmin: boolean;
  /** Admin manually disabled this user's plan (overrides everything). */
  disabledByAdmin: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  locale: 'fr' | 'en';
  subscription: IUserSubscription;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<IUserSubscription>(
  {
    planKey: { type: String, default: null },
    status: {
      type: String,
      enum: ['none', 'trial', 'active', 'expired', 'disabled'],
      default: 'none',
    },
    trialStartDate: { type: Date, default: null },
    trialEndDate: { type: Date, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    adsEnabled: { type: Boolean, default: false },
    activatedByAdmin: { type: Boolean, default: false },
    disabledByAdmin: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    locale: { type: String, enum: ['fr', 'en'], default: 'fr' },
    subscription: {
      type: SubscriptionSchema,
      default: () => ({
        planKey: null,
        status: 'none',
        adsEnabled: false,
        activatedByAdmin: false,
        disabledByAdmin: false,
      }),
    },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
