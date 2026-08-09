require('dotenv').config();
const { sendEmail, sendWhatsApp, sendSMS } = require('../services/notifier');

(async () => {
  try {
    const email = await sendEmail({
      subject: 'Billboard Technology - Test Notification',
      text: 'This is a test email. Admin notifications are working.',
    });
    console.log('Email:', email);

    const whatsapp = await sendWhatsApp('Billboard Technology - Test WhatsApp notification');
    console.log('WhatsApp:', whatsapp);

    const sms = await sendSMS(process.env.ADMIN_WHATSAPP || '0794109388', 'Billboard Technology - Test SMS notification');
    console.log('SMS:', sms);

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
})();
