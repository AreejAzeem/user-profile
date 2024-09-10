import { NextResponse } from 'next/server';
import  dbConnect  from '@/lib/mongodb'; 
import User from '@/app/models/User'; 
import mongoose from 'mongoose';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    dbConnect(); 
    const { userId } = params;
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId), 
    }).select('username email'); 

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
