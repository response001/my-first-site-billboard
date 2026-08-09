const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'reponseimanirabizi@gmail.com';
const ADMIN_WHATSAPP = normalizePhones(process.env.ADMIN_WHATSAPP || '0794109388');
const ADMIN_NUMBERS = ADMIN_WHATSAPP.split(',').filter(Boolean);
const SITE_URL = process.env.SITE_URL || 'http://localhost:5000';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || '';
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v19.0';

let transporter = null;

function normalizePhone(number) {
  let digits = String(number || '').replace(/\D/g, '');
  if (digits.length === 9 && digits.startsWith('7')) digits = '250' + digits;
  if (digits.length === 10 && digits.startsWith('0')) digits = '250' + digits.slice(1);
  return digits ? '+' + digits : digits;
}

function normalizePhones(value) {
  return String(value || '')
    .split(',')
    .map((p) => normalizePhone(p))
    .filter(Boolean)
    .join(',');
}

function getTransporter() {
  if (!transporter && process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE) === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[notify] Email skipped: SMTP_HOST not configured in .env');
    return { skipped: true };
  }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[notify] Email skipped: SMTP_USER / SMTP_PASS missing in .env');
    return { skipped: true };
  }
  await transport.sendMail({
    from: `"Billboard Technology" <${process.env.SMTP_USER}>`,
    to: to || ADMIN_EMAIL,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>'),
  });
  return { ok: true };
}

function smsNumber(number) {
  return String(number || '')
    .split(',')
    .map((n) => normalizePhone(n).replace('+', ''))
    .filter(Boolean)
    .join(',');
}

function getSMSBaseURL() {
  return String(process.env.AT_SANDBOX) === 'false'
    ? 'https://api.africastalking.com/version1/messaging'
    : 'https://api.sandbox.africastalking.com/version1/messaging';
}

async function sendSMS(to, message) {
  if (!process.env.AT_USERNAME || !process.env.AT_API_KEY) {
    console.warn('[notify] SMS skipped: AT_USERNAME / AT_API_KEY missing in .env');
    return { skipped: true };
  }
  const body = new URLSearchParams({
    username: process.env.AT_USERNAME,
    to: smsNumber(to),
    message,
  });
  if (process.env.AT_SENDER_ID) body.set('from', process.env.AT_SENDER_ID);
  const res = await fetch(getSMSBaseURL(), {
    method: 'POST',
    headers: {
      apiKey: process.env.AT_API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`SMS API error ${res.status}: ${JSON.stringify(data)}`);
  const recipients = (data.SMSMessageData && data.SMSMessageData.Recipients) || [];
  const failed = recipients.filter((r) => String(r.statusCode) !== '101');
  if (recipients.length && failed.length) {
    throw new Error('SMS delivery failed: ' + JSON.stringify(failed));
  }
  return { ok: true, data };
}

async function sendWhatsApp(text) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn('[notify] WhatsApp skipped: WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_ID missing in .env');
    return { skipped: true };
  }
  if (ADMIN_NUMBERS.length === 0) {
    console.warn('[notify] WhatsApp skipped: no admin numbers configured');
    return { skipped: true };
  }
  const errors = [];
  for (const number of ADMIN_NUMBERS) {
    const res = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: number,
          type: 'text',
          text: { body: text },
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      errors.push(`[${number}] WhatsApp API error ${res.status}: ${body}`);
    }
  }
  if (errors.length) {
    throw new Error(errors.join(' | '));
  }
  return { ok: true };
}

function buildOrderMessage(order, items) {
  const lines = items.map((i) => `  - ${i.product_name} x${i.quantity} = ${Number(i.price) * Number(i.quantity)} RWF`).join('\n');
  const details =
    `New Order ${order.order_number}\n` +
    `Customer: ${order.customer_name}\n` +
    `Email: ${order.customer_email}\n` +
    `Phone: ${order.customer_phone || 'N/A'}\n` +
    `Address: ${order.address || 'N/A'}\n\n` +
    `Items:\n${lines}\n\n` +
    `Payment: ${order.payment_method || 'Cash on Delivery'}\n` +
    `Total: ${order.total} RWF`;

  const emailHtml =
    `<h2 style="color:#2563eb;">New Order ${order.order_number}</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;">` +
    `<tr><td><b>Customer</b></td><td>${esc(order.customer_name)}</td></tr>` +
    `<tr><td><b>Email</b></td><td>${esc(order.customer_email)}</td></tr>` +
    `<tr><td><b>Phone</b></td><td>${esc(order.customer_phone || 'N/A')}</td></tr>` +
    `<tr><td><b>Address</b></td><td>${esc(order.address || 'N/A')}</td></tr>` +
    `<tr><td><b>Payment</b></td><td>${esc(order.payment_method || 'Cash on Delivery')}</td></tr>` +
    `<tr><td><b>Total</b></td><td><b>${esc(String(order.total))} RWF</b></td></tr>` +
    `</table><h3>Items</h3><ul>` +
    items.map((i) => `<li>${esc(i.product_name)} x${i.quantity} = ${Number(i.price) * Number(i.quantity)} RWF</li>`).join('') +
    `</ul><p>Check it in the admin dashboard.</p>`;

  return { text: details, html: emailHtml, subject: `New Order ${order.order_number} - ${order.customer_name}` };
}

function buildInternshipMessage(app, id) {
  const details =
    `New Internship Application #${id}\n` +
    `Name: ${app.full_name}\n` +
    `School: ${app.school || 'N/A'}\n` +
    `Level: ${app.level}\n` +
    `Email: ${app.email}\n` +
    `Phone: ${app.phone || 'N/A'}\n` +
    `CV: ${SITE_URL}${app.cv_file || ''}\n` +
    `Recommendation: ${SITE_URL}${app.recommendation_file || 'N/A'}`;

  const emailHtml =
    `<h2 style="color:#2563eb;">New Internship Application #${id}</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;">` +
    `<tr><td><b>Name</b></td><td>${esc(app.full_name)}</td></tr>` +
    `<tr><td><b>School</b></td><td>${esc(app.school || 'N/A')}</td></tr>` +
    `<tr><td><b>Level</b></td><td>${esc(app.level)}</td></tr>` +
    `<tr><td><b>Email</b></td><td>${esc(app.email)}</td></tr>` +
    `<tr><td><b>Phone</b></td><td>${esc(app.phone || 'N/A')}</td></tr>` +
    (app.cv_file ? `<tr><td><b>CV</b></td><td><a href="${SITE_URL}${app.cv_file}">Download</a></td></tr>` : '') +
    (app.recommendation_file ? `<tr><td><b>Recommendation</b></td><td><a href="${SITE_URL}${app.recommendation_file}">Download</a></td></tr>` : '') +
    `</table><p>Check it in the admin dashboard.</p>`;

  return { text: details, html: emailHtml, subject: `New Internship Application - ${app.full_name}` };
}

function buildCourseRegistrationMessage(reg, id) {
  const details =
    `New Course Registration #${id}\n` +
    `Name: ${reg.full_name}\n` +
    `Course: ${reg.course_name || 'N/A'}\n` +
    `Education Level: ${reg.education_level || 'N/A'}\n` +
    `Email: ${reg.email}\n` +
    `Phone: ${reg.phone || 'N/A'}`;

  const emailHtml =
    `<h2 style="color:#2563eb;">New Course Registration #${id}</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;">` +
    `<tr><td><b>Name</b></td><td>${esc(reg.full_name)}</td></tr>` +
    `<tr><td><b>Course</b></td><td>${esc(reg.course_name || 'N/A')}</td></tr>` +
    `<tr><td><b>Education Level</b></td><td>${esc(reg.education_level || 'N/A')}</td></tr>` +
    `<tr><td><b>Email</b></td><td>${esc(reg.email)}</td></tr>` +
    `<tr><td><b>Phone</b></td><td>${esc(reg.phone || 'N/A')}</td></tr>` +
    `</table><p>Check it in the admin dashboard.</p>`;

  return { text: details, html: emailHtml, subject: `New Course Registration - ${reg.full_name}` };
}

function buildContactMessage(msg, id) {
  const details =
    `New Contact Message #${id}\n` +
    `Name: ${msg.name}\n` +
    `Email: ${msg.email}\n` +
    `Subject: ${msg.subject || 'N/A'}\n` +
    `Message: ${msg.message}`;

  const emailHtml =
    `<h2 style="color:#2563eb;">New Contact Message #${id}</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;">` +
    `<tr><td><b>Name</b></td><td>${esc(msg.name)}</td></tr>` +
    `<tr><td><b>Email</b></td><td>${esc(msg.email)}</td></tr>` +
    `<tr><td><b>Subject</b></td><td>${esc(msg.subject || 'N/A')}</td></tr>` +
    `<tr><td><b>Message</b></td><td>${esc(msg.message)}</td></tr>` +
    `</table><p>Check it in the admin dashboard.</p>`;

  return { text: details, html: emailHtml, subject: `New Contact Message - ${msg.name}` };
}

function buildCustomerOrderMessage(order, items) {
  const lines = items.map((i) => `- ${i.product_name} x${i.quantity}`).join('\n');
  const details =
    `Thank you for ordering from OnBillboard.\n` +
    `Order ${order.order_number} received successfully.\n\n` +
    `Items:\n${lines}\n` +
    `Total: ${order.total} RWF\n` +
    `We will contact you soon for delivery.`;

  const emailHtml =
    `<h2 style="color:#2563eb;">Thank you, ${esc(order.customer_name)}!</h2>` +
    `<p>Your order <b>${esc(order.order_number)}</b> has been received successfully.</p>` +
    `<h3>Order summary</h3><ul>` +
    items.map((i) => `<li>${esc(i.product_name)} x${i.quantity} = ${Number(i.price) * Number(i.quantity)} RWF</li>`).join('') +
    `</ul><p><b>Total: ${esc(String(order.total))} RWF</b></p>` +
    `<p>We will contact you soon for delivery.</p>` +
    `<p>Best regards,<br/>Billboard Technology</p>`;

  return { text: details, html: emailHtml, subject: `Order Confirmation ${order.order_number}` };
}

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function notify({ subject, text, html }) {
  const results = await Promise.allSettled([
    sendEmail({ subject, text, html }),
    sendSMS(ADMIN_WHATSAPP, text),
    sendWhatsApp(text),
  ]);
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[notify] Notification failed:', result.reason.message);
    }
  }
}

async function notifyCustomer(message, order) {
  const results = await Promise.allSettled([
    sendEmail({ to: order.customer_email, ...message }),
    sendSMS(order.customer_phone, message.text),
  ]);
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[notify] Customer notification failed:', result.reason.message);
    }
  }
}

async function notifyOrderPlaced(order, items) {
  await notify(buildOrderMessage(order, items));
  await notifyCustomer(buildCustomerOrderMessage(order, items), order);
}

async function notifyInternshipApplication(app, id) {
  const message = buildInternshipMessage(app, id);
  await notify(message);
}

async function notifyCourseRegistration(reg, id) {
  const message = buildCourseRegistrationMessage(reg, id);
  await notify(message);
}

async function notifyContactMessage(msg, id) {
  const message = buildContactMessage(msg, id);
  await notify(message);
}

module.exports = { notifyOrderPlaced, notifyInternshipApplication, notifyCourseRegistration, notifyContactMessage, sendEmail, sendSMS, sendWhatsApp };
