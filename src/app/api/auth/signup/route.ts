import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const trialStart = new Date();
    const trialEnd = new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      subscription: {
        plan: 'premium',
        trialStartDate: trialStart,
        trialEndDate: trialEnd,
        trialUsed: true,
        startDate: trialStart,
        endDate: trialEnd,
        isActive: true,
      },
    });

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
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
