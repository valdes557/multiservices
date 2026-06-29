import User, { type IUser } from '@/models/User';
import Plan, { type IPlan } from '@/models/Plan';
import { hasPremiumAccess } from '@/lib/entitlements';
import { syncSubscriptionStatus } from '@/lib/userSync';

export interface ForumAccess {
  user: IUser | null;
  plan: IPlan | null;
  isAdmin: boolean;
  /** Can read the forum (member with active entitlement on this plan, or admin). */
  canRead: boolean;
  /** Can post a new message (canRead AND forum open, or admin). */
  canPost: boolean;
  reason?: string;
}

/**
 * Resolve a user's access to a plan's forum. Membership is derived from the
 * live subscription: a trial/active user on `planKey` is a member; an expired
 * or disabled user is not (auto-excluded), regaining access after payment.
 */
export async function resolveForumAccess(userId: string, planKey: string): Promise<ForumAccess> {
  const [user, plan] = await Promise.all([
    User.findById(userId),
    Plan.findOne({ key: planKey }),
  ]);

  if (!user) return { user: null, plan, isAdmin: false, canRead: false, canPost: false, reason: 'not-authenticated' };
  if (user && syncSubscriptionStatus(user)) await user.save();

  const isAdmin = user.role === 'admin';
  if (!plan || plan.forumEnabled === false) {
    return { user, plan, isAdmin, canRead: isAdmin, canPost: isAdmin, reason: 'forum-disabled' };
  }

  const member = hasPremiumAccess(user.subscription as never) && user.subscription.planKey === planKey;
  const canRead = isAdmin || member;
  const open = plan.forumOpen !== false;
  const canPost = isAdmin || (member && open);

  return {
    user, plan, isAdmin, canRead, canPost,
    reason: canRead ? undefined : 'not-a-member',
  };
}
