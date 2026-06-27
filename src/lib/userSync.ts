import type { IUser } from '@/models/User';
import { effectiveStatus, trialDaysLeft } from '@/lib/entitlements';

/**
 * Recompute the stored subscription.status from the live dates/flags so that an
 * expired trial or paid period is persisted (e.g. trial -> expired). Returns true
 * if the status changed (caller should save).
 */
export function syncSubscriptionStatus(user: IUser, now: Date = new Date()): boolean {
  const resolved = effectiveStatus(user.subscription as never, now);
  if (resolved !== user.subscription.status) {
    user.subscription.status = resolved;
    // When access lapses, ads must stop too.
    if (resolved === 'expired' || resolved === 'disabled') {
      user.subscription.adsEnabled = false;
    }
    return true;
  }
  return false;
}

/** Public, client-safe shape of a user (no password). */
export function serializeUser(user: IUser, now: Date = new Date()) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    locale: user.locale,
    usageCount: user.usageCount,
    subscription: {
      planKey: user.subscription.planKey,
      status: user.subscription.status,
      effectiveStatus: effectiveStatus(user.subscription as never, now),
      trialStartDate: user.subscription.trialStartDate,
      trialEndDate: user.subscription.trialEndDate,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      adsEnabled: user.subscription.adsEnabled,
      activatedByAdmin: user.subscription.activatedByAdmin,
      disabledByAdmin: user.subscription.disabledByAdmin,
      trialDaysLeft: trialDaysLeft(user.subscription as never, now),
    },
  };
}
