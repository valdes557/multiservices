import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireUser } from '@/lib/apiAuth';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { getSettings } from '@/lib/settings';
import { getCollectionStatus, normalizeStatus } from '@/lib/sebpay';
import { applyPaidSubscription } from '@/lib/billing';
import { serializeUser } from '@/lib/userSync';

export const dynamic = 'force-dynamic';

/**
 * GET /api/payment/status/:ref
 * Returns the payment status for the current user. If still pending, re-checks
 * SebPay directly (fallback when the webhook is delayed) and activates the
 * subscription on approval.
 */
export async function GET(request: NextRequest, { params }: { params: { ref: string } }) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const payment = await Payment.findOne({ externalReference: params.ref, userId: guard.user.userId });
    if (!payment) return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 });

    if (payment.status === 'pending') {
      const settings = await getSettings();
      try {
        const r = await getCollectionStatus(settings, payment.transactionId || payment.externalReference);
        const ns = normalizeStatus(r.status);
        if (ns !== 'pending') {
          payment.status = ns;
          await payment.save();
          if (ns === 'completed') {
            const user = await User.findById(payment.userId);
            if (user) { applyPaidSubscription(user, payment.planKey, 1); await user.save(); }
          }
        }
      } catch { /* keep pending on transient errors */ }
    }

    const user = await User.findById(guard.user.userId);
    return NextResponse.json({
      status: payment.status,
      reference: payment.externalReference,
      subscription: user ? serializeUser(user).subscription : null,
    });
  } catch (error) {
    console.error('payment/status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
