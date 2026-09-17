import { NextResponse } from 'next/server';
import { getMessages, createMessage, getSettings } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/mail';

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Ad Soyad, Telefon ve Mesaj alanları zorunludur' },
        { status: 400 }
      );
    }

    const newMessage = await createMessage({
      name: body.name,
      company: body.company || '',
      email: body.email || '',
      phone: body.phone,
      type: body.type === 'wholesale' ? 'wholesale' : 'customer',
      productInterest: body.productInterest || '',
      estimatedQty: body.estimatedQty || '',
      message: body.message,
    });

    // Send email notification to configured email asynchronously
    try {
      const settings = await getSettings();
      sendNotificationEmail(settings, newMessage).catch(err => {
        console.error('Async mail sending error:', err);
      });
    } catch (mailErr) {
      console.error('Mail trigger error:', mailErr);
    }

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
