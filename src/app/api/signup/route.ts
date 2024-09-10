import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; 
import User from '@/app/models/User'; 

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
console.log('name:', username);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/signup:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
