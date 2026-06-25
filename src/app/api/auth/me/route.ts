import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check trial expiration
    if (
      user.subscription.plan === 'premium' &&
      user.subscription.trialUsed &&
      user.subscription.trialEndDate &&
      new Date(user.subscription.trialEndDate) < new Date()
    ) {
      user.subscription.plan = 'free';
      user.subscription.isActive = false;
      await user.save();
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        locale: user.locale,
        subscription: {
          plan: user.subscription.plan,
          trialStartDate: user.subscription.trialStartDate,
          trialEndDate: user.subscription.trialEndDate,
          trialUsed: user.subscription.trialUsed,
          isActive: user.subscription.isActive,
        },
        usageCount: user.usageCount,
      },
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
