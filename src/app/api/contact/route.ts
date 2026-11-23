import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    db.insert(schema.contactMessages)
      .values({
        id,
        name,
        email,
        phone: phone || '',
        message,
        createdAt,
      })
      .run();

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
