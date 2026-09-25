import { NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Lumy123.';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputUser = (body.username || '').trim().toLowerCase();
    const inputPass = (body.password || '').trim();

    const envUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase().replace(/^["']|["']$/g, '');
    const envPass = (process.env.ADMIN_PASSWORD || 'Lumy123.').trim().replace(/^["']|["']$/g, '');

    // Allow configured password, or standard Lumy passwords (with/without dot or case)
    const validPasswords = [
      envPass,
      'Lumy123.',
      'lumy123.',
      'Lumy123',
      'lumy123'
    ];

    const isUserValid = inputUser === envUser || inputUser === 'admin';
    const isPassValid = validPasswords.includes(inputPass);

    if (isUserValid && isPassValid) {
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
