import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { verifyToken } from '@/lib/auth';

// GET - Get subscription status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authHeader.split(' ')[1]);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('subscription');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const payments = await Payment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      subscription: user.subscription,
      payments: payments.map((p) => ({
        id: p._id.toString(),
        amount: p.amount,
        currency: p.currency,
        method: p.paymentMethod,
        status: p.status,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create/upgrade subscription (initiate payment)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authHeader.split(' ')[1]);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const { paymentMethod, transactionId } = await request.json();

    if (!paymentMethod || !transactionId) {
      return NextResponse.json(
        { error: 'Payment method and transaction ID are required' },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create payment record
    const payment = await Payment.create({
      userId: user._id,
      amount: 9.99,
      currency: 'USD',
      paymentMethod,
      status: 'pending',
      transactionId,
      metadata: {
        plan: 'premium',
        duration: '1 month',
      },
    });

    // In production: verify the transaction with the payment provider
    // For now, we auto-confirm for demonstration
    payment.status = 'completed';
    await payment.save();

    // Upgrade user subscription
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    user.subscription.plan = 'premium';
    user.subscription.startDate = now;
    user.subscription.endDate = endDate;
    user.subscription.isActive = true;
    await user.save();

    return NextResponse.json({
      message: 'Subscription activated successfully',
      subscription: {
        plan: user.subscription.plan,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate,
        isActive: user.subscription.isActive,
      },
      payment: {
        id: payment._id.toString(),
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Subscription POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
