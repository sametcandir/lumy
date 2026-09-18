import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Dosya seçilmedi' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const mimeType = file.type || 'image/jpeg';
    
    // Cloudflare Edge / Serverless: convert to base64 Data URL
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
