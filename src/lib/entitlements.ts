import type { SubscriptionStatus } from '@/models/User';

/**
 * Pure, framework-agnostic access logic shared by the server (API guards) and
 * the client (UI gating). Operates on plain serializable objects so it works
 * with both Mongoose docs and JSON sent to the browser.
 */

export interface SubscriptionView {
  planKey: string | null;
  status: SubscriptionStatus;
  trialStartDate?: string | Date | null;
  trialEndDate?: string | Date | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  adsEnabled: boolean;
  activatedByAdmin: boolean;
  disabledByAdmin: boolean;
}

export interface ToolView {
  key: string;
  planKeys: string[];
  isPremium: boolean;
  active?: boolean;
}

export interface PlanView {
  key: string;
  adsDuringTrial: boolean;
  active?: boolean;
}

function toDate(v: string | Date | null | undefined): Date | null {
  if (!v) return null;
  return v instanceof Date ? v : new Date(v);
}

function isFuture(v: string | Date | null | undefined, now: Date): boolean {
  const d = toDate(v);
  return !!d && d.getTime() > now.getTime();
}

/**
 * Resolve the *effective* subscription status at `now`, honoring admin overrides
 * and expiry of the trial / paid period (the stored status may be stale).
 */
export function effectiveStatus(sub: SubscriptionView | null | undefined, now: Date = new Date()): SubscriptionStatus {
  if (!sub) return 'none';
  if (sub.disabledByAdmin) return 'disabled';

  // Admin-activated paid plan, or a normally active paid period.
  if (sub.activatedByAdmin || sub.status === 'active') {
    if (!sub.endDate || isFuture(sub.endDate, now)) return 'active';
    return 'expired';
  }

  if (sub.status === 'trial') {
    if (isFuture(sub.trialEndDate, now)) return 'trial';
    return 'expired';
  }

  if (sub.status === 'expired' || sub.status === 'disabled') return sub.status;
  return sub.planKey ? 'expired' : 'none';
}

/** True when the user currently has premium access (trial OR paid). */
export function hasPremiumAccess(sub: SubscriptionView | null | undefined, now: Date = new Date()): boolean {
  const s = effectiveStatus(sub, now);
  return s === 'trial' || s === 'active';
}

/**
 * Whether a Google AdSense ad should run after a tool execution for this user.
 * Ads only ever show: during the trial, when the plan enables trial ads, when
 * the user's ads flag is on, AND only if AdSense has approved the site.
 * Paid/active users never see ads.
 */
export function shouldShowAds(
  sub: SubscriptionView | null | undefined,
  plan: PlanView | null | undefined,
  adsenseApproved: boolean,
  now: Date = new Date()
): boolean {
  if (!adsenseApproved) return false;
  if (!sub || !sub.adsEnabled) return false;
  if (effectiveStatus(sub, now) !== 'trial') return false;
  if (plan && plan.adsDuringTrial === false) return false;
  return true;
}

/**
 * Can the user run a given tool right now?
 * Free (non-premium) tools are always allowed. Premium tools require an active
 * entitlement (trial/paid) AND the tool to be mapped to the user's plan.
 */
export function canAccessTool(
  sub: SubscriptionView | null | undefined,
  tool: ToolView,
  now: Date = new Date()
): boolean {
  if (tool.active === false) return false;
  if (!tool.isPremium) return true;
  if (!hasPremiumAccess(sub, now)) return false;
  if (!sub?.planKey) return false;
  return tool.planKeys.includes(sub.planKey);
}

/** Days (rounded up) left in the trial, or 0 if not on trial. */
export function trialDaysLeft(sub: SubscriptionView | null | undefined, now: Date = new Date()): number {
  if (!sub || effectiveStatus(sub, now) !== 'trial') return 0;
  const end = toDate(sub.trialEndDate);
  if (!end) return 0;
  const ms = end.getTime() - now.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}
