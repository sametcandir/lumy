import { NextResponse } from 'next/server';
import { markMessageStatus, deleteMessage } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const status = body.status === 'unread' ? 'unread' : 'read';
    const success = markMessageStatus(params.id, status);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Mesaj bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Mesaj durumu güncellendi' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteMessage(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Mesaj bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Mesaj silindi' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
