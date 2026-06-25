import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  locale: 'fr' | 'en';
  subscription: {
    plan: 'free' | 'premium';
    trialStartDate: Date | null;
    trialEndDate: Date | null;
    trialUsed: boolean;
    startDate: Date | null;
    endDate: Date | null;
    isActive: boolean;
  };
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    locale: { type: String, enum: ['fr', 'en'], default: 'fr' },
    subscription: {
      plan: { type: String, enum: ['free', 'premium'], default: 'free' },
      trialStartDate: { type: Date, default: null },
      trialEndDate: { type: Date, default: null },
      trialUsed: { type: Boolean, default: false },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      isActive: { type: Boolean, default: false },
    },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
