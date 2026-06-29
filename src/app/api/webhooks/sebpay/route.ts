import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { getSettings } from '@/lib/settings';
import { verifyWebhookSignature, normalizeStatus } from '@/lib/sebpay';
import { applyPaidSubscription } from '@/lib/billing';

export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/sebpay
 * Final-status notification from SebPay. We verify the HMAC signature, then
 * (idempotently) update the payment and, on approval, activate the user's paid
 * subscription and block ads. Must respond 200 fast.
 */
export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    const signature = request.headers.get('x-sebpay-signature');

    await dbConnect();
    const settings = await getSettings();

    if (!verifyWebhookSignature(settings, raw, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(raw || '{}');
    const ref = body.external_reference;
    const txId = body.transaction_id;
    const status = normalizeStatus(body.status);

    const payment = await Payment.findOne(
      ref ? { externalReference: ref } : { transactionId: txId }
    );
    if (!payment) return NextResponse.json({ received: true }); // unknown ref: ack to stop retries

    // Idempotent: ignore if already finalized.
    if (payment.status !== 'pending') return NextResponse.json({ received: true });

    payment.status = status;
    if (txId) payment.transactionId = txId;
    payment.metadata = { ...(payment.metadata || {}), webhook: body };
    await payment.save();

    if (status === 'completed') {
      const user = await User.findById(payment.userId);
      if (user) {
        applyPaidSubscription(user, payment.planKey, 1);
        await user.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('sebpay webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
