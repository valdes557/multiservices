import mongoose, { Schema, Document } from 'mongoose';

/**
 * Global platform settings (single document). Controls the conditional Google
 * AdSense behavior: ads only ever run when `adsenseApproved` is true (i.e. once
 * Google has authorized ads on the site) and a client id is configured.
 */
export interface ISettings extends Document {
  /** Singleton discriminator — always 'global'. */
  scope: string;
  /** True once Google AdSense has approved the site for ads. */
  adsenseApproved: boolean;
  /** AdSense publisher id, e.g. 'ca-pub-XXXXXXXXXXXXXXXX'. */
  adsenseClientId: string;
  /** Default ad slot id used by the AdSense component. */
  adsenseSlotId: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    scope: { type: String, default: 'global', unique: true },
    adsenseApproved: { type: Boolean, default: false },
    adsenseClientId: { type: String, default: '' },
    adsenseSlotId: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

/** Fetch the singleton settings doc, creating it on first access. */
export async function getSettings() {
  const Model = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
  let doc = await Model.findOne({ scope: 'global' });
  if (!doc) doc = await Model.create({ scope: 'global' });
  return doc;
}
