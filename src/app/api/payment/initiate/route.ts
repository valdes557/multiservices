import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import { requireUser } from '@/lib/apiAuth';
import User from '@/models/User';
import Plan from '@/models/Plan';
import Payment from '@/models/Payment';
import { getSettings } from '@/lib/settings';
import { initiateCollection, normalizeStatus } from '@/lib/sebpay';

export const dynamic = 'force-dynamic';

function originOf(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host');
  return `${proto}://${host}`;
}

/**
 * POST /api/payment/initiate
 * Body: { planKey, phone, operator, otp_code? }
 * Starts a Mobile Money collection for the selected plan and returns the
 * reference to poll. The subscription is activated by the webhook on approval.
 */
export async function POST(request: NextRequest) {
  const guard = requireUser(request);
  if ('error' in guard) return guard.error;

  try {
    await dbConnect();
    const { planKey, phone, operator, otp_code } = await request.json();
    if (!planKey || !phone || !operator) {
      return NextResponse.json({ error: 'planKey, phone et operator requis' }, { status: 400 });
    }

    const user = await User.findById(guard.user.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.subscription.disabledByAdmin) {
      return NextResponse.json({ error: 'Votre plan a été désactivé par un administrateur' }, { status: 403 });
    }

    const plan = await Plan.findOne({ key: planKey, active: true });
    if (!plan) return NextResponse.json({ error: 'Plan introuvable ou inactif' }, { status: 404 });

    const settings = await getSettings();
    const externalReference = `MS-${String(user._id).slice(-6)}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const payment = await Payment.create({
      userId: user._id,
      planKey: plan.key,
      amount: plan.price,
      currency: plan.currency,
      method: 'mobile_money',
      operator: String(operator).toLowerCase(),
      phone: String(phone).replace(/[^0-9]/g, ''),
      externalReference,
      mode: settings.sebpay.mode,
      status: 'pending',
    });

    let result;
    try {
      result = await initiateCollection(settings, {
        amount: plan.price,
        currency: plan.currency,
        phone: payment.phone,
        operator: payment.operator,
        country: settings.sebpay.country,
        external_reference: externalReference,
        callback_url: `${originOf(request)}/api/webhooks/sebpay`,
        otp_code: otp_code || undefined,
      });
    } catch (e) {
      payment.status = 'failed';
      payment.metadata = { error: (e as Error).message };
      await payment.save();
      return NextResponse.json({ error: (e as Error).message }, { status: 502 });
    }

    payment.transactionId = result.transactionId || '';
    payment.status = normalizeStatus(result.status);
    payment.metadata = { initiation: result.raw };
    await payment.save();

    if (!result.ok) {
      return NextResponse.json({ error: result.message || 'Échec de l’initiation du paiement' }, { status: 502 });
    }

    return NextResponse.json({
      reference: externalReference,
      transactionId: result.transactionId,
      status: payment.status,
      providerLink: result.providerLink || null,
      message: result.message || 'Paiement initié. Validez sur votre téléphone.',
    });
  } catch (error) {
    console.error('payment/initiate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
