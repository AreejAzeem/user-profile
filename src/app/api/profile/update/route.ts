import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/app/models/User';
import dbConnect from '@/lib/mongodb';
import { jwtDecode } from 'jwt-decode';

export async function POST(request: Request) {
    var userId = '';
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (token) {
            const decoded: any = jwtDecode(token);
            userId = decoded.userId;
        } else {
            return NextResponse.json({ message: 'No token found' }, { status: 401 });
        }
        const body = await request.json();
        const { username, email } = body;

        if (!username || !email) {
            return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
        }
        dbConnect();
        var updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        updatedUser = {
            username: updatedUser.username,
            email: updatedUser.email
        }
        return NextResponse.json({ message: 'Profile updated successfully', data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
