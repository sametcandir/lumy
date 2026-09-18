import { NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Lumy123.';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        token: 'lumy-admin-session-token-secret-2026',
        message: 'Giriş başarılı'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Hatalı kullanıcı adı veya şifre!' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
