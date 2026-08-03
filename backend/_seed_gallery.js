const db = require('./config/db');

const U = 'https://images.unsplash.com/photo-';
const Q = '?auto=format&fit=crop&w=800&q=60';

const POOLS = {
  Computers: [
    '1593640408182-31c70c8268f5', '1587202372775-e229f172b9d7',
    '1591488320449-011701bb6704', '1603487742131-4160ec999306',
  ],
  Laptops: [
    '1496181133206-80ce9b88a853', '1517336714731-489689fd1ca8',
    '1593642632823-8f785ba67e45', '1603302576837-37561b2e2302',
  ],
  'Smart Watches': [
    '1546868871-7041f2a55e12', '1523275335684-37898b6baf30',
    '1508685096489-7aacd43bd3b1', '1579586337278-3befd40fd17a',
  ],
  Smartphones: [
    '1511707171634-5f897ff02aa9', '1592750475338-74b7b21085ab',
    '1510557880182-3d4d3cba35a5', '1512499617640-c74ae3a79d37',
  ],
  Tablets: [
    '1544244015-0df4b3ffc6b0', '1561154464-82e9adf32764',
    '1585790050230-5dd28404ccb9', '1526045478516-99145907023c',
  ],
  Printers: [
    '1612815154858-60aa4c59eaa6', '1585232004423-244e0e6904e5',
    '1544376798-89aa6b82c6cd', '1612372606404-0ab33e7187ee',
  ],
  'Networking Devices': [
    '1563986768609-322da13575f3', '1558494949-ef010cbdcc31',
    '1544197150-b99a580bb7a8', '1606765962248-7ff407b51667',
  ],
  Accessories: [
    '1491472253230-a044054ca35f', '1587829741301-dc798b83add3',
    '1505740420928-5e560c06d30e', '1572569511254-d8f925fe2cbb',
  ],
};

const FEATURES = {
  Computers: [
    ['CPU', ['Intel Core i5-13400', 'Intel Core i7-13700K', 'AMD Ryzen 7 7800X3D', 'Intel Core i9-13900K']],
    ['GPU', ['Intel Integrated UHD', 'NVIDIA RTX 4060 8GB', 'NVIDIA RTX 4070 12GB', 'NVIDIA RTX 4080 16GB']],
    ['RAM', ['8GB DDR4', '16GB DDR4', '32GB DDR5', '64GB DDR5']],
    ['Storage', ['256GB SSD', '512GB NVMe SSD', '1TB NVMe SSD', '2TB NVMe SSD']],
    ['Operating System', ['Windows 11 Pro', 'Windows 11 Home', 'Windows 11 Pro', 'Windows 11 Pro']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '2 Years Warranty', '1 Year Warranty']],
  ],
  Laptops: [
    ['CPU', ['Intel Core i5', 'Intel Core i7', 'Apple M3', 'AMD Ryzen 7']],
    ['RAM', ['8GB', '16GB', '16GB LPDDR5', '32GB']],
    ['Storage', ['256GB SSD', '512GB SSD', '1TB SSD', '512GB NVMe SSD']],
    ['Screen', ['13.3-inch FHD', '14-inch FHD', '15.6-inch FHD', '16-inch 4K OLED']],
    ['Battery', ['Up to 8 hours', 'Up to 10 hours', 'Up to 12 hours', 'Up to 14 hours']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '1 Year Warranty', '2 Years Warranty']],
  ],
  'Smart Watches': [
    ['Display', ['1.4-inch AMOLED', '1.7-inch AMOLED', '1.9-inch AMOLED', '2.0-inch AMOLED']],
    ['Battery Life', ['7 days', '10 days', '14 days', '5 days']],
    ['Water Resistance', ['5ATM', 'IP68', '3ATM', 'IP67']],
    ['Connectivity', ['Bluetooth 5.3', 'Bluetooth 5.3 + Wi-Fi', 'GPS + Bluetooth', 'GPS + LTE']],
    ['Health Tracking', ['Heart rate & SpO2', 'Heart rate, SpO2 & ECG', 'Full health suite', 'Heart rate, SpO2, ECG & GPS']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '1 Year Warranty', '1 Year Warranty']],
  ],
  Smartphones: [
    ['Display', ['6.1-inch OLED 120Hz', '6.5-inch AMOLED 120Hz', '6.7-inch LTPO 120Hz', '6.8-inch QHD+ AMOLED']],
    ['Camera', ['Dual 50MP', 'Triple 108MP', '50MP + 48MP + 48MP', '108MP Periscope']],
    ['Battery', ['4000mAh', '4500mAh', '5000mAh', '5500mAh']],
    ['Charging', ['33W Fast Charge', '67W Fast Charge', '45W Fast Charge', '100W Fast Charge']],
    ['Operating System', ['Android 14', 'Android 14', 'Android 14', 'Android 14']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '1 Year Warranty', '1 Year Warranty']],
  ],
  Tablets: [
    ['Display', ['10.4-inch LCD', '11-inch 2K', '12.4-inch AMOLED', '10.9-inch Retina']],
    ['Storage', ['64GB', '128GB', '256GB', '512GB']],
    ['RAM', ['4GB', '6GB', '8GB', '8GB']],
    ['Battery', ['Up to 10 hours', 'Up to 12 hours', 'Up to 14 hours', 'Up to 13 hours']],
    ['Connectivity', ['Wi-Fi only', 'Wi-Fi + 4G', 'Wi-Fi only', 'Wi-Fi + 4G']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '1 Year Warranty', '1 Year Warranty']],
  ],
  Printers: [
    ['Technology', ['Inkjet', 'Laser', 'Inkjet All-in-One', 'Laser All-in-One']],
    ['Print Speed', ['Up to 8 ppm', 'Up to 18 ppm', 'Up to 22 ppm', 'Up to 28 ppm']],
    ['Connectivity', ['USB', 'USB + Wi-Fi', 'USB + Wi-Fi + AirPrint', 'USB + Ethernet + Wi-Fi']],
    ['Paper Size', ['A4 & Letter', 'A4 & Letter', 'A4, Legal & Letter', 'A4, A5 & B5']],
    ['Duty Cycle', ['Up to 1,000 pages/month', 'Up to 8,000 pages/month', 'Up to 5,000 pages/month', 'Up to 10,000 pages/month']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '1 Year Warranty', '1 Year Warranty']],
  ],
  'Networking Devices': [
    ['Type', ['Wi-Fi 6 Router', 'Gigabit Network Switch', 'Mesh Wi-Fi System', 'HD Security Camera']],
    ['Speed', ['Up to 1200 Mbps', 'Up to 1 Gbps', 'Up to 3000 Mbps', 'HD 1080p Video']],
    ['Ports', ['4 x Gigabit LAN', '8 x Gigabit LAN', '4 x Gigabit LAN', 'Wi-Fi only']],
    ['Security', ['WPA3 Encryption', 'WPA2 + VLAN Support', 'WPA3 + Parental Controls', 'Motion Detection Alerts']],
    ['Coverage', ['Up to 1,500 sq ft', 'Whole building', 'Up to 4,500 sq ft', 'Night Vision']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '1 Year Warranty', '1 Year Warranty']],
  ],
  Accessories: [
    ['Connectivity', ['USB wired', 'USB-C', 'Bluetooth 5.3', 'Wireless 2.4GHz']],
    ['Compatibility', ['Works with Windows, Mac & Linux', 'Universal compatibility', 'Works with smartphones & tablets', 'PC & Console compatible']],
    ['Design', ['Ergonomic & lightweight', 'Compact & portable', 'Premium finish', 'RGB illuminated']],
    ['Condition', ['Brand New', 'Brand New', 'Brand New', 'Brand New']],
    ['Warranty', ['1 Year Warranty', '1 Year Warranty', '1 Year Warranty', '1 Year Warranty']],
  ],
};

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

async function main() {
  await db.execute('ALTER TABLE products ADD COLUMN gallery TEXT NULL AFTER image');
  await db.execute('ALTER TABLE products ADD COLUMN features TEXT NULL AFTER gallery');

  const [rows] = await db.execute(
    'SELECT p.id, p.name, p.slug, p.category_id, p.image, c.name AS cat FROM products p LEFT JOIN categories c ON c.id = p.category_id'
  );

  const statements = [];
  for (let i = 0; i < rows.length; i++) {
    const p = rows[i];
    const pool = POOLS[p.cat] || POOLS.Accessories;
    const gallery = [p.image, ...pool.map((id) => U + id + Q)]
      .filter((u) => u && !u.includes('undefined'))
      .filter((u, idx, arr) => arr.indexOf(u) === idx)
      .slice(0, 4);

    const tpl = FEATURES[p.cat] || FEATURES.Accessories;
    const features = tpl.map(([label, opts]) => `${label}: ${opts[i % opts.length]}`);

    const g = JSON.stringify(gallery);
    const f = JSON.stringify(features);
    await db.execute('UPDATE products SET gallery = ?, features = ? WHERE id = ?', [g, f, p.id]);
    statements.push(`UPDATE products SET gallery = '${esc(g)}', features = '${esc(f)}' WHERE slug = '${esc(p.slug)}';`);
  }

  const fs = require('fs');
  fs.writeFileSync('_gallery_seed.sql', '-- Product gallery + features seed (generated)\n' + statements.join('\n') + '\n');
  console.log('Seeded', rows.length, 'products');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
