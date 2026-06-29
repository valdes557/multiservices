import mongoose, { Schema, Document } from 'mongoose';

/**
 * Global platform settings — a single document (`key: 'global'`).
 * Holds the AdSense approval flag (ads only ever show once the site is approved)
 * and the payment provider (SebPay) configuration. Secret keys are never sent to
 * the client (see lib/settings.ts `publicSettings` / `adminSettings`).
 */

export interface ISebPayConfig {
  /** 'test' uses the pk_test_/sk_test_ keys, 'live' uses the pk_live_/sk_live_ keys. */
  mode: 'test' | 'live';
  publicKeyTest: string;
  secretKeyTest: string;
  publicKeyLive: string;
  secretKeyLive: string;
  baseUrl: string;
  country: string;
  /** Operators offered to users, e.g. ['mtn','moov','orange','wave']. */
  operators: string[];
}

export interface ISettings extends Document {
  key: string;
  /** Google AdSense */
  adsenseApproved: boolean;
  adsenseClientId: string;
  adsenseSlotTrial: string;
  /** Payment provider */
  sebpay: ISebPayConfig;
  createdAt: Date;
  updatedAt: Date;
}

const SebPaySchema = new Schema<ISebPayConfig>(
  {
    mode: { type: String, enum: ['test', 'live'], default: 'test' },
    publicKeyTest: { type: String, default: '' },
    secretKeyTest: { type: String, default: '' },
    publicKeyLive: { type: String, default: '' },
    secretKeyLive: { type: String, default: '' },
    baseUrl: { type: String, default: 'https://newapi.sebpay.bj/api/v1' },
    country: { type: String, default: 'BJ' },
    operators: { type: [String], default: ['mtn', 'moov', 'orange', 'wave'] },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    adsenseApproved: { type: Boolean, default: false },
    adsenseClientId: { type: String, default: '' },
    adsenseSlotTrial: { type: String, default: '' },
    sebpay: { type: SebPaySchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
