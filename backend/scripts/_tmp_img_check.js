const https = require('https');

const candidates = {
  'photo-1507003211169-0a1dd7228f2d': 'young black man portrait',
  'photo-1560250097-0b93528c311a': 'black businessman in suit',
  'photo-1573496359142-b8d87734a5a2': 'smiling black professional woman',
  'photo-1531384441138-2736e62e0919': 'young black man smiling',
  'photo-1544723795-3fb6469f5b39': 'black man portrait',
  'photo-1595152772835-219674b2a8a6': 'young black man',
};

function check(id) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=60`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ id, status: res.statusCode, url });
      res.resume();
    });
    req.on('error', (e) => resolve({ id, status: 'ERR ' + e.message, url }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ id, status: 'TIMEOUT', url });
    });
  });
}

(async () => {
  const results = await Promise.all(
    Object.entries(candidates).map(([id, label]) => check(id).then((r) => ({ ...r, label })))
  );
  for (const r of results) console.log(`${r.status}\t${r.id}\t${r.label}\t${r.url}`);
  process.exit(0);
})();
