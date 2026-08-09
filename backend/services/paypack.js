const crypto = require('crypto');

let tokenCache = { access: null, refresh: null, expiresAt: 0 };

function baseURL() {
  return process.env.PAYPACK_BASE_URL || 'https://payments.paypack.rw/api';
}

function mode() {
  return process.env.PAYPACK_MODE || 'development';
}

function isConfigured() {
  return !!(process.env.PAYPACK_CLIENT_ID && process.env.PAYPACK_CLIENT_SECRET);
}

function expiryFrom(data) {
  const fallback = Date.now() + 15 * 60 * 1000;
  if (!data.expires) return fallback;
  if (typeof data.expires === 'string' && isNaN(Number(data.expires))) {
    const parsed = Date.parse(data.expires);
    return isNaN(parsed) ? fallback : parsed;
  }
  return Date.now() + Number(data.expires) * 1000;
}

async function authorize() {
  const res = await fetch(`${baseURL()}/auth/agents/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PAYPACK_CLIENT_ID,
      client_secret: process.env.PAYPACK_CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Paypack authorize failed: ${res.status} ${JSON.stringify(data)}`);
  tokenCache = { access: data.access, refresh: data.refresh, expiresAt: expiryFrom(data) };
  return data;
}

async function getToken() {
  if (tokenCache.access && Date.now() < tokenCache.expiresAt - 60000) return tokenCache.access;
  if (tokenCache.refresh) {
    try {
      const res = await fetch(`${baseURL()}/auth/agents/refresh/${tokenCache.refresh}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        tokenCache = { access: data.access, refresh: data.refresh, expiresAt: expiryFrom(data) };
        return data.access;
      }
    } catch (err) {
      // fall through to a fresh authorize
    }
  }
  const data = await authorize();
  return data.access;
}

async function cashin({ amount, number }) {
  const token = await getToken();
  const res = await fetch(`${baseURL()}/transactions/cashin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Webhook-Mode': mode(),
    },
    body: JSON.stringify({ amount, number }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Paypack cashin failed: ${res.status} ${JSON.stringify(data)}`);
  if (data.status === 'failed') throw new Error('Paypack cashin was rejected');
  return { ref: data.ref, status: data.status };
}

async function findTransaction(ref) {
  const token = await getToken();
  const res = await fetch(`${baseURL()}/transactions/find/${encodeURIComponent(ref)}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Paypack find failed: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

function verifyWebhook(rawBody, signature) {
  const secret = process.env.PAYPACK_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[paypack] Webhook signature skipped: PAYPACK_WEBHOOK_SECRET missing in .env');
    return true;
  }
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody || '')
    .digest('hex');
  const provided = String(signature).trim();
  return provided === expected || provided === expected.toUpperCase();
}

module.exports = { isConfigured, cashin, findTransaction, verifyWebhook };
