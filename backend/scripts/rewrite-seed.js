const fs = require('fs');
const path = require('path');
const { corrections, newProducts } = require('./fix-products');

const seedPath = path.join(__dirname, '..', 'database.sql');
let sql = fs.readFileSync(seedPath, 'utf8');

const lines = sql.split(/\r?\n/);
let replaced = 0;
let kept = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/^UPDATE products SET gallery = '.*', features = '((?:[^']|'')*)' WHERE slug = '([^']+)';$/);
  if (!m) continue;
  const [, oldFeatures, slug] = m;
  if (corrections[slug]) {
    const newFeatures = JSON.stringify(corrections[slug]);
    lines[i] = line.replace(m[1], newFeatures.replace(/\$/g, '$$$$'));
    replaced += 1;
  } else {
    kept += 1;
  }
}

sql = lines.join('\r\n');

const esc = (s) => String(s).replace(/'/g, "''");

const rows = newProducts.map((p) => {
  const features = JSON.stringify(p.features);
  return `  (${p.category_id}, '${esc(p.name)}', '${p.slug}', '${esc(p.description)}', ${p.price}, ${p.quantity}, '${p.image}', '${features}', ${p.featured})`;
});

const insertBlock =
  `\n-- New matching products per category\n` +
  `INSERT IGNORE INTO products (category_id, name, slug, description, price, quantity, image, features, featured) VALUES\n` +
  rows.join(',\n') +
  `;\n`;

sql = sql.replace(/\s*$/, '') + '\n' + insertBlock;

fs.writeFileSync(seedPath, sql, 'utf8');
console.log(`Seed updated: ${replaced} feature fixes applied, ${kept} features kept, ${newProducts.length} new products added.`);
