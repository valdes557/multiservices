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
  /** Admin per-plan ads master switch (default true). */
  showAds?: boolean;
  /** Monthly price; 0 means a free plan (ads can run while active). */
  price?: number;
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
  // Per-plan master switch (admin can turn ads off for a whole plan).
  if (plan && plan.showAds === false) return false;
  const status = effectiveStatus(sub, now);
  // Ads run during the trial...
  if (status === 'trial') {
    if (plan && plan.adsDuringTrial === false) return false;
    return true;
  }
  // ...and for active users of a FREE plan (price 0), e.g. the "gratuit" plan.
  if (status === 'active' && plan && (plan.price ?? 0) === 0) return true;
  return false;
}

/**
 * Does the user's *selected plan* grant a given tool, regardless of trial expiry?
 * Per product choice: any user who has chosen a plan can use the tools mapped to
 * that plan. Non-premium tools are always allowed. A tool with no plan mapping is
 * treated as available to every plan.
 */
export function planAllowsTool(
  sub: SubscriptionView | null | undefined,
  tool: ToolView
): boolean {
  if (tool.active === false) return false;
  if (!tool.isPremium) return true;
  if (!sub?.planKey) return false;
  if (sub.disabledByAdmin) return false;
  if (!tool.planKeys || tool.planKeys.length === 0) return true;
  return tool.planKeys.includes(sub.planKey);
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
