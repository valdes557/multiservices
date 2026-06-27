import mongoose, { Schema, Document } from 'mongoose';
import type { LocalizedText } from './Plan';

/**
 * A tool/feature of the platform (e.g. PDF merge, flyer generator).
 * The administrator assigns each tool to one or more plans via `planKeys`,
 * which drives access control (entitlements).
 */

export interface ITool extends Document {
  /** Stable slug, e.g. 'flyer-generator'. */
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Service category slug: translation | learning | documents | conversion | professional | content | business. */
  category: string;
  /** App route, e.g. '/services/content/flyer'. */
  href: string;
  /** lucide-react icon name, e.g. 'Image'. */
  icon: string;
  /** Plans that grant access to this tool (the tool↔plan mapping). */
  planKeys: string[];
  /**
   * Premium tools require an entitled plan (trial or paid). Non-premium tools
   * are always accessible, even without a subscription.
   */
  isPremium: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedSchema = new Schema(
  {
    fr: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  { _id: false }
);

const ToolSchema = new Schema<ITool>(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: LocalizedSchema, required: true },
    description: { type: LocalizedSchema, default: () => ({ fr: '', en: '' }) },
    category: { type: String, required: true, index: true },
    href: { type: String, default: '' },
    icon: { type: String, default: 'Wrench' },
    planKeys: { type: [String], default: [] },
    isPremium: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);
