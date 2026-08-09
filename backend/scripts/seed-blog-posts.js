const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onbillboard',
};

const IMG = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=60`;

const posts = [
  {
    title: "Rwanda's Tech Sector Is Growing Fast in 2026",
    slug: 'rwandas-tech-sector-is-growing-fast-in-2026',
    category: 'Latest Technology News',
    author: 'Billboard Tech Team',
    excerpt:
      'From digital payments to artificial intelligence, Rwanda keeps proving that innovation has no borders. Here is what is happening in 2026.',
    image: IMG('photo-1485827404703-89b55fcc595e'),
    content: `Rwanda has built a reputation as one of Africa's most tech-friendly countries, and 2026 is proving to be another exciting year. From Kigali's tech hubs to growing internet access across the country, more people are building, learning and selling technology than ever before.

Digital payments continue to lead the way. Mobile money is now part of everyday life, and more businesses are accepting cashless payments both online and in shops. This makes it easier for local companies to sell their products to customers anywhere in the world.

Artificial intelligence is also arriving fast. Schools, hospitals and small businesses are starting to use AI tools to work faster, save money and serve customers better. We are proud to be part of this journey by supplying the devices, networking equipment and training that make these tools possible.

At Billboard Technology, our mission is simple: make technology affordable and accessible to every Rwandan. Whether you are buying your first laptop, setting up an office network or learning to code, we are here to help.`,
  },
  {
    title: 'JavaScript for Absolute Beginners',
    slug: 'javascript-for-absolute-beginners',
    category: 'Programming Tutorials',
    author: 'Billboard Tech Team',
    excerpt:
      'JavaScript powers almost every modern website. Learn the basics step by step in this beginner-friendly guide.',
    image: IMG('photo-1461749280684-dccba630e2f6'),
    content: `JavaScript is the programming language of the web. If you open any website today, chances are JavaScript is running behind the scenes to make it interactive - buttons, forms, menus, animations and even games.

Why learn JavaScript?
First, it is easy to start. You do not need any special software. Just open your browser, press F12 and write your first line of code in the console. Try: console.log("Hello Rwanda");
Second, it is everywhere. JavaScript runs in the browser, on servers with Node.js, and even on mobile apps. One language, many possibilities.

Your first variables
Variables let you store information. In modern JavaScript you use let and const:
let name = "Aline";
const age = 22;
console.log(name + " is " + age + " years old.");

Functions make code reusable. They are blocks of instructions that run when you call them:
function greet(student) {
  return "Welcome, " + student + "!";
}
console.log(greet("Aline"));

The best way to learn is to build. Start with small projects: a calculator, a to-do list or a quiz. Each project teaches you something new. At Billboard Technology we teach JavaScript, HTML, CSS, React and Node.js in our 3-month Software Development course.`,
  },
  {
    title: 'Build Your First Web App with React',
    slug: 'build-your-first-web-app-with-react',
    category: 'Programming Tutorials',
    author: 'Billboard Tech Team',
    excerpt:
      'React is one of the most popular tools for building modern web apps. Here is how to create your first one.',
    image: IMG('photo-1633356122102-3fe601e05bd2'),
    content: `React is a JavaScript library created by Meta for building user interfaces. It is used by companies around the world because it makes apps fast, organized and easy to maintain. Once you know JavaScript, React is the natural next step.

What makes React special?
Instead of changing the whole page when something happens, React updates only the parts that changed. It works with components - small reusable pieces of the interface. A button, a card and a header are all components.

Your first component
A component is just a function that returns HTML-like code:
function ProductCard() {
  return <div>Hello from my first component</div>;
}
export default ProductCard;

You can pass information to components with props:
function ProductCard({ name, price }) {
  return <div>{name} - {price} RWF</div>;
}

State lets components remember things. The useState hook is the first hook every beginner meets:
const [count, setCount] = useState(0);

React works perfectly with everything we teach in our courses, and it is exactly what powers our own shop at Billboard Technology. Start with components, then learn props, state and hooks, and soon you will be building real apps.`,
  },
  {
    title: 'Computer Networking Basics Explained',
    slug: 'computer-networking-basics-explained',
    category: 'Networking Tips',
    author: 'Billboard Tech Team',
    excerpt:
      'Understand IP addresses, routers, switches and more in this simple introduction to computer networking.',
    image: IMG('photo-1558494949-ef010cbdcc31'),
    content: `Computer networking is how computers talk to each other and share information. Every time you send an email, stream a video or browse a website, a network is doing the work.

The basics of a network
A network connects devices so they can share resources like files, printers and internet access. The most common network in homes is a Local Area Network (LAN), where your phone, laptop and TV connect to one router.

IP addresses are like home addresses for devices. Every device on a network gets a unique IP address so data knows where to go. An example is 192.168.1.10.

Routers and switches
A router connects your home network to the internet and sends traffic to the right destination. A switch connects many devices inside the same network using cables, making wired connections fast and stable.

Subnetting and security
Subnetting divides a large network into smaller pieces, making it easier to manage. Security matters too - always protect your Wi-Fi with a strong password and use WPA2 or WPA3 encryption.

Networking is the foundation of everything digital. If you want to master it, our 3-month Networking course covers hardware, IP addressing, routing, switching and security - and we also supply every router, switch and cable you need.`,
  },
  {
    title: 'How to Set Up a Fast Home Wi-Fi Network',
    slug: 'how-to-set-up-a-fast-home-wifi-network',
    category: 'Networking Tips',
    author: 'Billboard Tech Team',
    excerpt:
      'Slow internet? These simple steps will make your home Wi-Fi faster and more reliable.',
    image: IMG('photo-1544197150-b99a580bb7a8'),
    content: `A slow or unstable connection is one of the most frustrating things at home. The good news is that most Wi-Fi problems have simple fixes. Follow these steps to enjoy faster internet.

1. Place your router in the center
Put your router in a central location, away from walls, metal objects and the floor. The higher you place it, the better the signal spreads. Avoid hiding it inside a cabinet.

2. Choose the right frequency
Most routers broadcast on two bands: 2.4GHz and 5GHz. The 2.4GHz band travels farther, while 5GHz is faster but shorter range. Connect devices that need speed - like phones and laptops - to 5GHz.

3. Use a Wi-Fi 6 router
If your router is old, consider upgrading. Wi-Fi 6 routers are faster, more secure and handle many devices at once without slowing down. We stock great Wi-Fi 6 options for homes and offices.

4. Cover dead zones with a mesh or repeater
If some rooms have no signal, add a mesh system or a Wi-Fi repeater. Mesh systems cover large homes with one seamless network.

5. Secure your network
Set a strong password and enable WPA2 or WPA3 encryption so neighbours cannot use your bandwidth.

With these steps, your home Wi-Fi will be faster, safer and more reliable. Need help choosing equipment? Visit Billboard Technology and we will find the right solution for your home.`,
  },
  {
    title: 'Top 5 Tools for Graphic Design Beginners',
    slug: 'top-5-tools-for-graphic-design-beginners',
    category: 'Graphic Design Ideas',
    author: 'Billboard Tech Team',
    excerpt:
      'Start your design career with these powerful yet easy-to-learn tools.',
    image: IMG('photo-1626785774573-4b799315345d'),
    content: `Graphic design is a skill that opens many doors - from social media posts to brand logos and business cards. The best part? You can start today with tools that are easy to learn and some are even free.

1. Canva
Canva is the fastest way to create beautiful designs. It has thousands of templates for posters, flyers, resumes and social media. No experience needed - just drag, drop and customize.

2. Adobe Photoshop
Photoshop is the industry standard for photo editing and digital art. It is powerful and used by professionals worldwide. Master it and you will be ready for real client work.

3. Adobe Illustrator
Illustrator is perfect for logos, icons and illustrations. It works with vector graphics, meaning your designs stay sharp no matter how much you zoom in or scale them.

4. CorelDRAW
CorelDRAW is a favorite for print design and sign making. It is widely used in Rwanda for business branding, posters and banners.

5. Figma
Figma is the go-to tool for UI and web design. It works in the browser and lets teams collaborate in real time - essential for app and website design.

Our advice: start with Canva to learn the basics, then grow into Photoshop and Illustrator. Our 3-month Graphic Design course teaches all of these with real projects, so you graduate with a strong portfolio.`,
  },
  {
    title: 'How to Design Your First Logo',
    slug: 'how-to-design-your-first-logo',
    category: 'Graphic Design Ideas',
    author: 'Billboard Tech Team',
    excerpt:
      'A great logo is simple, memorable and timeless. Follow this step-by-step process to create yours.',
    image: IMG('photo-1561070791-2526d30994b5'),
    content: `Your logo is the face of your brand. It is the first thing customers see, so it needs to be simple, memorable and professional. Here is how to design your first logo, step by step.

Step 1: Understand the brand
Before you open any software, ask questions. Who is the customer? What is the brand personality? A tech company feels different from a restaurant, and your logo should reflect that.

Step 2: Research and sketch
Look at logos in the same industry for inspiration. Then sketch ideas on paper. Start with simple shapes and letters. Aim for 10 to 20 rough sketches - your best idea is usually hidden among them.

Step 3: Choose your colors
Colors carry emotion. Blue feels trustworthy, green suggests growth, red is bold and energetic. Limit your palette to 2 or 3 colors so the logo stays clean.

Step 4: Pick the right fonts
Choose fonts that match the brand personality - bold sans-serifs feel modern, while script fonts feel elegant. Do not use more than two font styles in one logo.

Step 5: Digitize in Illustrator
Open Adobe Illustrator or CorelDRAW and turn your best sketch into vector art. Work with simple shapes, and always design in black and white first - a strong logo works without color.

Step 6: Test it
Scale your logo down to a small size and check it still reads clearly. Test it on a dark background, a light background and a photo. If it works everywhere, you are done.

Designing logos is a great first client service for beginners. Learn the full process in our Graphic Design course and add real projects to your portfolio.`,
  },
  {
    title: 'From Intern to Employee: Patrick\'s Story',
    slug: 'from-intern-to-employee-patricks-story',
    category: 'Student Success Stories',
    author: 'Billboard Tech Team',
    excerpt:
      'Patrick studied at CMS/UNILAK in Kigali and joined our internship as an L4 student with no real experience. He left with a job. Here is his journey.',
    image: IMG('photo-1507003211169-0a1dd7228f2d'),
    content: `Two years ago, Patrick was an L4 software development student at CMS/UNILAK in Kigali looking for practical experience. Like many students, he knew theory but had never built a real system for a real customer.

That changed when he joined the Billboard Technology internship program. From day one, he worked on actual projects: fixing bugs, adding features and writing code that other people would really use.

"I learned more in three months of internship than in a whole year of theory," Patrick says. "My mentor reviewed my code every day, showed me better ways to write it, and taught me how to work in a team."

The turning point came when Patrick was asked to build a small inventory system for a local shop. He designed the database, wrote the backend and built the frontend. The shop still uses his system today.

When the internship ended, we offered Patrick a full-time position as a junior developer. Today he mentors new interns - the same way someone once mentored him.

Patrick's advice to students: "Do not wait for experience to find you. Apply for internships, build small projects, and never stop asking questions."

Are you an L3, L4 or L5 software development student looking for real experience? Applications for our internship are always open. Your story could be next.`,
  },
  {
    title: 'How Internships Built My Career',
    slug: 'how-internships-built-my-career',
    category: 'Student Success Stories',
    author: 'Billboard Tech Team',
    excerpt:
      'Three students share how internships gave them confidence, skills and jobs.',
    image: IMG('photo-1522202176988-66273c2fd55f'),
    content: `Many students ask us: "How do I get my first job in tech?" Our answer is always the same - start with an internship. Here are three stories that prove it.

Diane, Networking intern
Diane studied networking but had never touched a real router until her internship. She helped set up networks for two small offices, configured switches and learned to troubleshoot problems under pressure. Six months later, she was hired as a network technician. "The internship gave me hands-on confidence that no classroom can give," she says.

Eric, Software development intern
Eric joined as an L5 student and was put straight onto an e-commerce project. He learned React, Node.js and MySQL by building real features. By the time he graduated, he had a portfolio of finished work and two job offers. "Employers do not ask what you studied. They ask what you have built," Eric says.

Chantal, Graphic design intern
Chantal designed posters, logos and social media content for our marketing team. Her portfolio of real designs impressed a local agency, which hired her as a junior designer. "I walked into the interview with samples of work I actually delivered," she says.

What all three have in common: they applied, they showed up, and they worked on real projects. Internships are your bridge between the classroom and the workplace.

Our internship program for L3, L4 and L5 software development students gives you a mentor, real projects and a team to learn with. And if you prefer structured learning, our 3-month courses in Software Development, Networking and Graphic Design cover everything from beginner to job-ready.`,
  },
];

async function main() {
  const pool = mysql.createPool(DB).promise();
  let inserted = 0;
  let skipped = 0;

  const esc = (s) => String(s).replace(/'/g, "''");
  const rows = [];

  for (const p of posts) {
    const [found] = await pool.execute('SELECT id FROM blog WHERE slug = ?', [p.slug]);
    if (found.length) {
      skipped += 1;
      continue;
    }
    await pool.execute(
      'INSERT INTO blog (title, slug, excerpt, content, category, image, author) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [p.title, p.slug, p.excerpt, p.content, p.category, p.image, p.author]
    );
    inserted += 1;
    rows.push(
      `  ('${esc(p.title)}', '${p.slug}', '${esc(p.excerpt)}', '${esc(p.content)}', '${esc(p.category)}', '${p.image}', '${esc(p.author)}')`
    );
  }

  console.log(`Blog posts inserted: ${inserted}`);
  console.log(`Blog posts skipped (already exist): ${skipped}`);

  if (rows.length) {
    const seedPath = path.join(__dirname, '..', 'database.sql');
    let sql = fs.readFileSync(seedPath, 'utf8');
    const block =
      `\n-- Blog posts for each category\n` +
      `INSERT IGNORE INTO blog (title, slug, excerpt, content, category, image, author) VALUES\n` +
      rows.join(',\n') +
      `;\n`;
    sql = sql.replace(/\s*$/, '') + '\n' + block;
    fs.writeFileSync(seedPath, sql, 'utf8');
    console.log('Seed file updated with blog posts.');
  }

  const [counts] = await pool.execute('SELECT category, COUNT(*) AS total FROM blog GROUP BY category ORDER BY category');
  console.log('\nPosts per category:');
  for (const r of counts) console.log(`  ${r.category}: ${r.total}`);

  await pool.end();
  process.exit(0);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
