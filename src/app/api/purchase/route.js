// src/app/api/purchase/route.js
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;



export async function POST(request) {
    let client;
    
    try {
        const purchaseData = await request.json();
        
        if (!uri) {
            return NextResponse.json(
                { error: 'Database connection string is not configured' },
                { status: 500 }
            );
        }

        client = new MongoClient(uri);
        await client.connect();

        const db = client.db('ecommerce');
        const purchases = db.collection('purchases');

        // Add timestamp and format purchase data
        const purchase = {
            ...purchaseData,
            createdAt: new Date(),
            status: 'completed'
        };

        const result = await purchases.insertOne(purchase);

        return NextResponse.json({
            success: true,
            purchaseId: result.insertedId
        }, { status: 200 });

    } catch (error) {
        console.error('Purchase Error:', error);
        return NextResponse.json(
            { error: 'Failed to process purchase' },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}
