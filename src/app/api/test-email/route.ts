import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/mail';

export const runtime = 'edge';

export async function POST() {
  try {
    const settings = await getSettings();
    const config = settings.emailNotification;

    if (!config || !config.recipientEmail) {
      return NextResponse.json({
        success: false,
        error: 'Lütfen önce bildirimlerin gönderileceği bir e-posta adresi yazıp kaydedin.'
      }, { status: 400 });
    }

    if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
      return NextResponse.json({
        success: false,
        error: 'SMTP Ayarları Eksik! E-postanın gerçek bir gelen kutusuna ulaşabilmesi için Gönderici SMTP Sunucusu (örn: smtp.gmail.com), Kullanıcı Adı ve Şifresi girilmelidir.'
      }, { status: 400 });
    }

    const testMsg = {
      id: 'test-msg',
      name: 'Lumy Toys Test Kullanıcısı',
      company: 'Test Şirketi A.Ş.',
      email: 'test@lumytoys.com',
      phone: '+90 555 000 00 00',
      type: 'wholesale' as const,
      productInterest: '120 cm Dev Sarılma Ayısı',
      estimatedQty: '50 Adet',
      message: 'Bu bir test e-posta bildirimidir. Lumy Toys web sitesi e-posta entegrasyonu sorunsuz çalışmaktadır!',
      date: new Date().toLocaleString('tr-TR'),
      status: 'unread' as const
    };

    const result = await sendNotificationEmail(settings, testMsg);

    if (result.success && !result.simulated) {
      return NextResponse.json({
        success: true,
        message: `Test e-postası başarıyla ${config.recipientEmail} adresine iletildi!`
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'E-posta gönderilirken bir hata oluştu. Lütfen SMTP bilgilerinizi kontrol edin.'
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
