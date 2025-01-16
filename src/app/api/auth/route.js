// src/app/api/auth/route.js
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  const client = new MongoClient(uri);
  
  try {
    const userData = await request.json();
    
    await client.connect();
    const database = client.db('your-database-name');
    const users = database.collection('users');
    
    // Check if user already exists
    const existingUser = await users.findOne({ email: userData.email });
    
    if (!existingUser) {
      // Add timestamp to user data
      const userWithTimestamp = {
        ...userData,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await users.insertOne(userWithTimestamp);
    } else {
      // Update last login time
      await users.updateOne(
        { email: userData.email },
        { $set: { lastLogin: new Date() }}
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}