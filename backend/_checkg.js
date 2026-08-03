const db = require('./config/db');
(async () => {
  const [r] = await db.query("SELECT name, gallery, features FROM products WHERE slug = 'gaming-desktop-rtx-4070'");
  console.log(JSON.stringify(r[0], null, 2));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
