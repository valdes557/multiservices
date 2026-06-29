import type { IUser } from '@/models/User';

const DAY = 24 * 60 * 60 * 1000;

/**
 * Activate a genuinely PAID monthly subscription for a user (after a confirmed
 * Mobile Money payment). Sets the plan active, extends the paid period and BLOCKS
 * ads (requirements #9, #10). Unlike the admin "activateMonthly", this is a real
 * payment so `activatedByAdmin` stays false.
 *
 * If the user already has an active paid period, the new months are appended.
 */
export function applyPaidSubscription(user: IUser, planKey: string, months = 1, now: Date = new Date()): void {
  const sub = user.subscription;
  const base = sub.endDate && sub.endDate.getTime() > now.getTime() && sub.planKey === planKey
    ? sub.endDate.getTime()
    : now.getTime();

  sub.planKey = planKey;
  sub.status = 'active';
  sub.disabledByAdmin = false;
  sub.startDate = sub.startDate && sub.status === 'active' ? sub.startDate : now;
  sub.endDate = new Date(base + months * 30 * DAY);
  sub.adsEnabled = false; // paid -> ads blocked
}
