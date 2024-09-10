
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; 
import User from '@/app/models/User'; 

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/login:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
