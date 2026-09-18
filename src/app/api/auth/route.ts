import { NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lumy123';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    return NextResponse.json({
      success: true,
      token: 'lumy-admin-session-token-secret-2026',
      message: 'Giriş başarılı'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
