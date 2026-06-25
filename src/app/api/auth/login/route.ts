import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
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
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
