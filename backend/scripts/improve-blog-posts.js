const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onbillboard',
};

const posts = {
  'welcome-to-billboard-technology': {
    title: 'Welcome to Billboard Technology',
    excerpt:
      'Discover your one-stop shop for the latest devices, professional short courses and real internship opportunities in Rwanda.',
    content: `Welcome to Billboard Technology, your trusted partner for technology in Rwanda. Whether you want to buy a reliable device, learn a new skill or start your career in tech, we are here to support you every step of the way.

WHAT WE DO
We sell quality technology products - computers, laptops, smartphones, tablets, printers, smart watches, networking equipment and accessories - all with honest prices and a warranty. Every product is carefully chosen so you get the best value for your money.

WE TRAIN
Not everyone can afford a university degree, and that is why we offer practical 3-month short courses:
- Software Development: learn HTML, CSS, JavaScript, React, Node.js, Express and MySQL by building real projects.
- Networking: master hardware, IP addressing, routing, switching and security, and prepare for Cisco certification.
- Graphic Design: become a professional designer with Photoshop, Illustrator, Canva and CorelDRAW.

WE HIRE
For software development students in L3, L4 and L5, we run an internship program where you work on real projects with a mentor, build a portfolio and gain the confidence employers look for.

WHY CHOOSE US?
- Genuine products with warranty and after-sales support
- Practical, project-based training
- A real path from learning to employment
- Friendly support in Kinyarwanda, English and French

Ready to get started? Browse our shop, visit our courses page or contact us today. The future of technology in Rwanda starts with you.`,
  },
  'rwandas-tech-sector-is-growing-fast-in-2026': {
    title: "Rwanda's Tech Sector Is Growing Fast in 2026",
    excerpt:
      'From digital payments to artificial intelligence, Rwanda keeps proving that innovation has no borders. Here is what is happening in 2026.',
    content: `Rwanda has earned a reputation as one of Africa's most tech-friendly countries, and 2026 is shaping up to be another milestone year. From Kigali's buzzing innovation hubs to new fibre connections reaching more districts, the digital revolution is touching every corner of the country.

THE RISE OF DIGITAL PAYMENTS
Mobile money is already part of everyday life in Rwanda, and the next step is seamless online payments. More businesses - from small shops to large companies - now accept cashless payments on their websites and in stores. This makes it easier for Rwandan entrepreneurs to sell to customers in Kigali, in the diaspora and across the world. Technologies like Paypack and other local payment solutions are removing the barriers that once held back online commerce.

ARTIFICIAL INTELLIGENCE IS HERE TO STAY
Artificial intelligence is moving from headlines to real life. Clinics use AI to read scans faster, farmers use smart tools to predict weather, and schools use AI tutors to help students learn at their own pace. For small businesses, AI tools can handle customer questions, write marketing content and manage inventory - saving time and money.

THE SKILLS GAP AND THE OPPORTUNITY
The biggest challenge in Africa's tech boom is not hardware - it is skills. Thousands of young Rwandans are eager to work in technology, but many lack practical training. This is why programs like our short courses and internships matter. When students learn by building real projects, they graduate ready to contribute immediately.

WHAT THIS MEANS FOR YOU
If you are a student, now is the best time to learn to code, configure networks or design brands. If you are a business owner, now is the best time to go digital. If you are looking for quality devices at honest prices, we are here to help you every step of the way.

At Billboard Technology, our mission is simple: make technology affordable and accessible to every Rwandan. Whether you are buying your first laptop, setting up an office network or learning to code, you are always welcome.`,
  },
  'javascript-for-absolute-beginners': {
    title: 'JavaScript for Absolute Beginners',
    excerpt:
      'JavaScript powers almost every modern website. Learn the basics step by step in this beginner-friendly guide with examples you can try today.',
    content: `JavaScript is the programming language of the web. Almost every website you visit - from news sites to online shops - uses JavaScript to make pages interactive. Buttons, forms, menus, animations, games, even the calculator on your phone app are all powered by JavaScript.

WHY LEARN JAVASCRIPT?
First, it is one of the easiest languages to start. You do not need to install anything. Open your browser, press F12, click on "Console" and write your first program:
console.log("Hello Rwanda!");
Press Enter and you will see the message appear. Congratulations - you have written your first JavaScript code.

Second, JavaScript is everywhere. It runs in the browser, on servers with Node.js, on mobile phones and even on smart devices. Once you learn it, you can build websites, apps, games and backend systems with one language.

VARIABLES AND DATA
Variables store information so you can reuse it. In modern JavaScript, we use let for values that change and const for values that never change.
let name = "Aline";
const school = "KIST";
name = "Aline Claire"; // we can change a let value
console.log(name + " studies at " + school);
JavaScript has several data types: numbers (age = 22), strings ("hello"), booleans (true or false), arrays ([1, 2, 3]) and objects ({ name: "Aline", age: 22 }).

CONDITIONS
Conditions let your program make decisions:
let score = 75;
if (score >= 70) {
  console.log("Passed - congratulations!");
} else {
  console.log("Try again - you are close!");
}

LOOPS
Loops repeat an action. To print numbers from 1 to 5:
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

FUNCTIONS
Functions are reusable blocks of code:
function greet(name) {
  return "Welcome, " + name + "!";
}
console.log(greet("Eric"));
console.log(greet("Diane"));

ARRAYS AND OBJECTS IN REAL LIFE
Think of a product list in an online shop:
const products = [
  { name: "Laptop", price: 780000 },
  { name: "Router", price: 55000 },
  { name: "Printer", price: 180000 }
];
for (const product of products) {
  console.log(product.name + " costs " + product.price + " RWF");
}

YOUR LEARNING PATH
1. Master variables, data types and operators.
2. Practice with conditions and loops.
3. Learn functions and arrays.
4. Build small projects: a calculator, a to-do list or a simple quiz.
5. Then move to the Document Object Model (DOM) to make websites interactive.

The best way to learn JavaScript is to build. Write code every single day, even if it is only for fifteen minutes. When you get stuck - and you will - use the browser console to test small pieces of code.

Want a complete, guided journey? Our 3-month Software Development course teaches JavaScript, HTML, CSS, React, Node.js, Express, MySQL and Git through real projects. You will finish with a portfolio that proves what you can do.`,
  },
  'build-your-first-web-app-with-react': {
    title: 'Build Your First Web App with React',
    excerpt:
      'React is one of the most popular tools for building modern web apps. Follow this guide to create and understand your first React application.',
    content: `React is a JavaScript library created by Meta (Facebook) for building user interfaces. It is used by some of the biggest companies in the world because it makes applications fast, organized and easy to maintain. Once you understand JavaScript, React is the natural next step on your developer journey.

WHY REACT?
Before React, websites updated the whole page when something changed - slow and wasteful. React updates only the parts that changed, which makes apps feel instant. It is also built around components: small, reusable pieces of the interface. A button, a card, a header and a whole page are all components.

SETTING UP YOUR FIRST PROJECT
The fastest way to start is with Vite. Open your terminal and run:
npm create vite@latest my-app
cd my-app
npm install
npm run dev
Your browser will open on http://localhost:3000 with a starter page. Now open src/App.jsx - this is your main component.

YOUR FIRST COMPONENT
A component is a JavaScript function that returns JSX, which looks like HTML:
function ProductCard() {
  return (
    <div className="card">
      <h3>Billboard Pro Laptop</h3>
      <p>780,000 RWF</p>
    </div>
  );
}
export default ProductCard;

PROPS - PASSING DATA
Props let you reuse one component with different data:
function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{price} RWF</p>
    </div>
  );
}
export default function App() {
  return (
    <div>
      <ProductCard name="Laptop" price={780000} />
      <ProductCard name="Printer" price={180000} />
    </div>
  );
}

STATE - MAKING COMPONENTS REMEMBER
State lets a component remember information that changes. The useState hook is the first one every beginner learns:
import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

HANDLING LISTS
Rendering lists is one of the most common tasks:
const products = ["Laptop", "Printer", "Router"];
return (
  <ul>
    {products.map((item) => <li key={item}>{item}</li>)}
  </ul>
);

WHAT TO LEARN NEXT
After the basics, explore:
- Forms and controlled inputs
- useEffect for loading data from an API
- React Router for multiple pages
- Fetching data with fetch or axios
- Styling with CSS or Tailwind CSS

OUR OWN STORE IS BUILT WITH REACT
The site you are reading right now is a React application. When you learn React, you are learning the same technology that powers real shops, banks and social networks.

Join our 3-month Software Development course to go from "Hello World" to building full websites with React, Node.js, Express and MySQL - guided by mentors who work on real projects every day.`,
  },
  'computer-networking-basics-explained': {
    title: 'Computer Networking Basics Explained',
    excerpt:
      'Understand IP addresses, routers, switches, subnetting and more in this simple, practical introduction to computer networking.',
    content: `Computer networking is how computers talk to each other and share information. Every time you send an email, stream a video, print a document or browse a website, a network is doing the work behind the scenes. If you want to work in IT, networking is a skill you cannot avoid - and it is easier to understand than most people think.

WHAT IS A NETWORK?
A network is a group of connected devices that share resources such as files, printers and internet access. The most common type is the Local Area Network (LAN) - the network inside your home or office, where your phone, laptop, TV and printer all connect to one router.

IP ADDRESSES - THE ADDRESSES OF THE INTERNET
Every device on a network needs a unique address so data knows where to go. This is called an IP (Internet Protocol) address, for example 192.168.1.10. Just as a letter needs a home address, data packets need IP addresses to reach the right device. You also have a public IP address - the address the rest of the internet uses to reach your connection.

ROUTERS AND SWITCHES
A router connects your local network to the internet. It decides the best path for data and sends it to the right destination. A switch, on the other hand, connects many devices inside the same network using cables. Think of a router as the post office sorting mail to other towns, and a switch as the person delivering mail inside your building.

SUBNETTING - SPLITTING THE NETWORK
Subnetting divides one large network into smaller, manageable pieces. This makes networks faster, more secure and easier to organize. When you see an address like 192.168.1.0/24, the /24 tells you how many addresses belong to that network.

DNS - THE PHONEBOOK OF THE INTERNET
You type www.google.com, but computers understand numbers. The Domain Name System (DNS) translates human-friendly names into IP addresses. Without DNS, you would have to remember numbers for every website you visit.

WHY SECURITY MATTERS
An unsecured network is an open door. Always:
- Use WPA2 or WPA3 encryption on Wi-Fi
- Set strong passwords on routers and switches
- Change default usernames and passwords
- Keep firmware updated
- Use a firewall

THE OSI MODEL - HOW NETWORKS WORK IN LAYERS
Network professionals understand communication through the OSI model, which divides networking into seven layers, from the physical cable (Layer 1) to the applications you use (Layer 7). You do not need to memorize everything at first, but understanding the layers helps you troubleshoot problems faster.

ARE YOU READY TO GO DEEPER?
Networking is the foundation of everything digital, and professionals with networking skills are in high demand. Our 3-month Networking course covers computer hardware, network basics, IP addressing, subnetting, Cisco, routing, switching and security - with real equipment, so you practice on the same routers and switches used in offices. We also stock all the routers, switches, cables and tools you need to build your own home lab.`,
  },
  'how-to-set-up-a-fast-home-wifi-network': {
    title: 'How to Set Up a Fast Home Wi-Fi Network',
    excerpt:
      'Slow internet or dead zones? These simple, practical steps will make your home Wi-Fi faster, safer and more reliable.',
    content: `A slow or unstable Wi-Fi connection is one of the most frustrating problems at home, especially when you are working, studying or streaming. The good news is that most Wi-Fi problems have simple fixes. Follow these steps and enjoy noticeably faster internet.

1. PLACE YOUR ROUTER IN THE CENTER
Wi-Fi signals spread out like a ball, so your router should be as central as possible. Place it at eye level, away from walls, metal objects, aquariums and the floor. Never hide it inside a cabinet or behind the TV - that blocks the signal.

2. ELEVATE IT
The higher the router, the better the coverage. A router on a high shelf or mounted on a wall covers much more space than one sitting on the floor behind a sofa.

3. CHOOSE THE RIGHT BAND
Most routers broadcast two bands: 2.4GHz and 5GHz. The 2.4GHz band travels farther and passes through walls better, while 5GHz is faster but has a shorter range. Connect devices that need speed - phones, laptops, streaming boxes - to 5GHz, and keep older or distant devices on 2.4GHz.

4. AVOID CROWDED CHANNELS
Neighbouring routers can use the same channel and slow you down. In your router settings, try changing the channel to one that is less crowded, or simply set it to "auto" and let the router pick the best one.

5. UPGRADE TO WI-FI 6
If your router is more than five years old, consider upgrading. Wi-Fi 6 routers are faster, more secure and handle many devices at once without slowing down. They are especially useful when everyone in the family has a phone, laptop and tablet connected at the same time.

6. KILL DEAD ZONES WITH MESH OR A REPEATER
If some rooms have no signal, do not buy another internet line - extend the one you have. A mesh system covers large homes with one seamless network, while a Wi-Fi repeater is a cheaper way to extend coverage to a single room.

7. SECURE YOUR NETWORK
A fast network is useless if it is not safe. Set a strong password, enable WPA2 or WPA3 encryption, and change the default router name and password. Also turn on the router firewall and keep the firmware updated.

8. RESTART IT REGULARLY
Routers work hard. If your internet becomes slow or devices drop off, a simple restart - unplug for 30 seconds, then plug back in - often fixes everything.

WHEN TO ASK FOR HELP
If you have tried all of the above and your internet is still slow, the problem may be with your internet provider or with an old router that cannot handle your speed. Come to Billboard Technology and we will test your equipment and recommend the right router, mesh system or repeater for your home and budget - with installation advice included.`,
  },
  'top-5-tools-for-graphic-design-beginners': {
    title: 'Top 5 Tools for Graphic Design Beginners',
    excerpt:
      'Start your design career with these five powerful yet easy-to-learn tools - including free options that produce professional results.',
    content: `Graphic design is a skill that opens many doors: social media posts, logos, posters, business cards, websites and more. The best part is that you can start today, and some of the best tools are free or very affordable. Here are the five tools every beginner should know.

1. CANVA - THE FASTEST WAY TO DESIGN
Canva is perfect for beginners. It has thousands of ready-made templates for posters, flyers, resumes, Instagram posts and presentations. You simply pick a template, change the text and colors, and download. No experience is needed. Canva is also great for quick client work while you are still learning.

2. ADOBE PHOTOSHOP - THE INDUSTRY STANDARD
Photoshop is the most famous design software in the world. It is used for photo editing, digital art, web graphics and more. It takes time to master, but once you do, you can edit photos professionally, remove backgrounds, create banners and retouch images. Every serious designer learns Photoshop.

3. ADOBE ILLUSTRATOR - FOR LOGOS AND ILLUSTRATIONS
Illustrator is designed for vector graphics. Unlike photos, vector images can be resized to any size without becoming blurry - that is why logos are always made in Illustrator. It is the tool to learn for logos, icons, lettering and illustrations.

4. CORELDRAW - POPULAR FOR PRINT
CorelDRAW is a favorite in Africa for print design: business cards, banners, signboards and magazines. It is powerful, affordable and widely used by printing shops in Rwanda. If you want to design for print, CorelDRAW is a valuable skill.

5. FIGMA - THE TOOL FOR MODERN UI DESIGN
Figma is the go-to tool for web and app design. It runs in the browser, which means you and your team can work on the same design at the same time. Figma is essential if you want to design websites, mobile apps or dashboards.

HOW TO LEARN THEM IN THE RIGHT ORDER
- Start with Canva to learn design basics quickly.
- Move to Photoshop to master image editing.
- Learn Illustrator for logos and vector art.
- Add CorelDRAW if you want to work in print.
- Use Figma to step into web and app design.

Our advice is to master one tool at a time instead of jumping between all five. Each tool builds on the same design principles - color, contrast, spacing and typography - so the second tool is always easier than the first.

READY TO BECOME A PROFESSIONAL?
Our 3-month Graphic Design course teaches Canva, Photoshop, Illustrator, CorelDRAW and branding through real projects. You will design logos, posters and social media content for real clients, and graduate with a portfolio that gets you hired.`,
  },
  'how-to-design-your-first-logo': {
    title: 'How to Design Your First Logo',
    excerpt:
      'A great logo is simple, memorable and timeless. Follow this complete step-by-step process - from research to final file - to create yours.',
    content: `Your logo is the face of your brand. It appears on your products, your website, your business cards and your shop sign. A great logo is simple, memorable and timeless - think of famous brands you recognize at a glance. Here is the complete process to design your first professional logo.

STEP 1: UNDERSTAND THE BRAND
Do not open any software yet. First, understand who the brand is for. Ask questions: Who are the customers? What does the brand stand for? Is it modern or traditional? Bold or elegant? A logo for a tech company should feel different from a logo for a restaurant, and your design must match the brand personality.

STEP 2: RESEARCH FOR INSPIRATION
Look at logos in the same industry - not to copy, but to understand what works. Notice colors, shapes and fonts. Save examples you like. This research tells you what your design needs to compete with.

STEP 3: SKETCH ON PAPER
This is the step most beginners skip, and it is the most important. Draw at least 10 to 20 rough ideas on paper. Start with simple shapes and letters. Do not worry about beauty at this stage - your best idea is usually hiding among the first ugly sketches.

STEP 4: CHOOSE YOUR COLORS
Colors carry emotion. Blue feels trustworthy, green suggests growth and nature, red is bold and energetic, yellow feels friendly. Use only two or three colors so the logo stays clean. Also design a version in black and white - a strong logo must work without color.

STEP 5: PICK THE RIGHT FONTS
Typography is half of logo design. Bold sans-serif fonts feel modern and confident. Serif fonts feel classic and trustworthy. Script fonts feel elegant and personal. Use at most two font styles in one logo, and make sure the name is easy to read at any size.

STEP 6: DIGITIZE IN ILLUSTRATOR OR CORELDRAW
Turn your best sketch into vector art using Adobe Illustrator or CorelDRAW. Work with simple shapes and clean curves. Vector format means your logo stays sharp from a business card to a billboard.

STEP 7: TEST IT EVERYWHERE
Scale the logo down to a tiny size and make sure it is still readable. Test it on a white background, a black background and a photo. Show it to friends and ask what it makes them think of. If it works everywhere, your design is done.

STEP 8: DELIVER THE RIGHT FILES
A professional logo should be delivered in several formats: .ai or .cdr (the original editable file), .svg (for the web), .pdf (for printing) and .png with a transparent background. Always give the client the editable files - they belong to the client.

Designing logos is one of the best first services for a new designer, because every business needs one. Learn the complete process - including branding and social media design - in our 3-month Graphic Design course. You will design real logos for real businesses and build the portfolio that gets you your first clients.`,
  },
  "from-intern-to-employee-patricks-story": {
    title: "From Intern to Employee: Patrick's Story",
    excerpt:
      "Patrick studied at CMS/UNILAK in Kigali, then joined our internship with no real experience - only school knowledge and a lot of determination. Here is how he built his career - one real project at a time.",
    content: `Two years ago, Patrick was an L4 software development student at CMS/UNILAK in Kigali. He had attended classes, passed exams and memorized theory - but he had never built a real system that real people would use. Like many students, he knew that passing tests was not the same as building real software.

That feeling pushed him to apply for the Billboard Technology internship program. "I knew I needed something more than the classroom," Patrick remembers. "I needed proof that I could actually build software."

THE FIRST MONTH - LEARNING BY DOING
From day one, Patrick worked on real projects. He started by fixing small bugs in an existing system, then moved on to adding features. His mentor reviewed his code every day, showed him cleaner ways to write it, and taught him how to use Git and to work in a team.

"I learned more in three months of internship than in two years of classroom learning," Patrick says. "Every day I was solving problems that no lecture can cover."

THE TURNING POINT
The turning point came when Patrick was asked to build an inventory system for a local shop. He designed the MySQL database, wrote the backend with Node.js and Express, and built the frontend with React. Two weeks later, the shop was using his system - and it still is today.

"I will never forget the feeling the first time I saw someone using software I had built," Patrick says. "That is when I knew this is my career."

THE RESULT
When the internship ended, we offered Patrick a full-time position as a junior developer. Today, he mentors new interns - the same way someone once mentored him. "The cycle is beautiful," he laughs. "One day you are the student, and before you know it, you are the one teaching."

PATRICK'S ADVICE TO STUDENTS
- Apply early. Do not wait until you graduate to look for experience.
- Build small projects on your own, even if nobody asks you to.
- Never be afraid to ask questions - that is how you learn fast.
- Show up every day, because consistency beats talent.

ARE YOU NEXT?
If you are an L3, L4 or L5 software development student looking for real experience, our internship program is always open. You will get a mentor, real projects and a team that believes in you. Patrick's story proves that with the right opportunity and hard work, your story could be next.`,
  },
  'how-internships-built-my-career': {
    title: 'How Internships Built My Career',
    excerpt:
      'Diane, Eric and Chantal all left the classroom with doubts - and walked into jobs after real internships. Here are their stories.',
    content: `"How do I get my first job in tech?" is the question we hear most from students. Our answer is always the same: start with an internship. Internships turn knowledge into experience, and experience into opportunities. Here are three stories that prove it.

DIANE - FROM THEORY TO NETWORK TECHNICIAN
Diane studied networking and could explain the OSI model perfectly, but she had never touched a real router until her internship. At Billboard Technology, she helped set up the networks of two small offices: running cables, configuring switches, setting up Wi-Fi and troubleshooting real problems under pressure.

"I was nervous the first time I held a switch," Diane says. "By the end, I could configure a network on my own in an afternoon."

Six months after her internship, Diane was hired as a network technician. "The internship gave me the hands-on confidence that no classroom can give," she says.

ERIC - BUILDING A PORTFOLIO THAT GETS HIRED
Eric joined as an L5 student and was placed directly onto an e-commerce project. He learned React, Node.js and MySQL by building real features: product listings, a shopping cart and payment integration. By the time he graduated, he had a portfolio of finished work - and two job offers.

"Employers do not ask what you studied. They ask what you have built," Eric says. "My internship gave me something to show and something to talk about in interviews."

CHANTAL - FROM TEMPLATES TO REAL CLIENT WORK
Chantal designed posters, logos and social media content for our marketing team. She started with Canva templates and quickly moved to Photoshop and Illustrator. Her portfolio of real designs impressed a local agency, which hired her as a junior designer.

"I walked into the interview with samples of work I actually delivered," Chantal says. "That changed everything."

WHAT ALL THREE HAVE IN COMMON
They applied, they showed up, and they worked on real projects. Internships are the bridge between the classroom and the workplace - the place where you learn teamwork, deadlines, client expectations and professional habits.

HOW TO START YOUR OWN JOURNEY
- Apply to internships early, not after graduation.
- Prepare: learn the basics of your field before you start.
- Ask for feedback and act on it.
- Treat every task - even small ones - as a chance to grow.

Our internship program for L3, L4 and L5 software development students gives you a mentor, real projects and a team to learn with. If you prefer structured learning first, our 3-month courses in Software Development, Networking and Graphic Design take you from beginner to job-ready. Whichever path you choose, remember Diane, Eric and Chantal: the opportunity is out there - go and take it.`,
  },
};

const META = {
  'welcome-to-billboard-technology': ['Latest Technology News', 'Billboard Tech Team'],
  'rwandas-tech-sector-is-growing-fast-in-2026': ['Latest Technology News', 'Billboard Tech Team'],
  'javascript-for-absolute-beginners': ['Programming Tutorials', 'Billboard Tech Team'],
  'build-your-first-web-app-with-react': ['Programming Tutorials', 'Billboard Tech Team'],
  'computer-networking-basics-explained': ['Networking Tips', 'Billboard Tech Team'],
  'how-to-set-up-a-fast-home-wifi-network': ['Networking Tips', 'Billboard Tech Team'],
  'top-5-tools-for-graphic-design-beginners': ['Graphic Design Ideas', 'Billboard Tech Team'],
  'how-to-design-your-first-logo': ['Graphic Design Ideas', 'Billboard Tech Team'],
  "from-intern-to-employee-patricks-story": ['Student Success Stories', 'Billboard Tech Team'],
  'how-internships-built-my-career': ['Student Success Stories', 'Billboard Tech Team'],
};

const POST_IMAGES = {
  'rwandas-tech-sector-is-growing-fast-in-2026': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=60',
  'javascript-for-absolute-beginners': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=60',
  'build-your-first-web-app-with-react': 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=1200&q=60',
  'computer-networking-basics-explained': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=60',
  'how-to-set-up-a-fast-home-wifi-network': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=60',
  'top-5-tools-for-graphic-design-beginners': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=60',
  'how-to-design-your-first-logo': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=60',
  "from-intern-to-employee-patricks-story": 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=60',
  'how-internships-built-my-career': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60',
};

async function main() {
  const pool = mysql.createPool(DB).promise();
  let updated = 0;
  let missing = [];

  const esc = (s) => String(s).replace(/'/g, "''");

  for (const [slug, p] of Object.entries(posts)) {
    const [res] = await pool.execute('UPDATE blog SET title = ?, excerpt = ?, content = ?, image = ? WHERE slug = ?', [
      p.title,
      p.excerpt,
      p.content,
      POST_IMAGES[slug] || null,
      slug,
    ]);
    if (res.affectedRows > 0) {
      updated += 1;
    } else {
      missing.push(slug);
    }
  }

  console.log(`Blog posts improved: ${updated}`);
  if (missing.length) console.log('Not found in DB:', missing.join(', '));

  const seedPath = path.join(__dirname, '..', 'database.sql');
  let sql = fs.readFileSync(seedPath, 'utf8');

  // Replace the original "Welcome" blog INSERT line with the improved one.
  const welcome = posts['welcome-to-billboard-technology'];
  const oldWelcomeRegex = /INSERT IGNORE INTO blog \(title, slug, excerpt, content, category, author\) VALUES\r?\n\s*\([^;]*\);/;
  if (oldWelcomeRegex.test(sql)) {
    const newWelcome =
      `INSERT IGNORE INTO blog (title, slug, excerpt, content, category, author) VALUES\n` +
      `  ('${esc(welcome.title)}', 'welcome-to-billboard-technology', '${esc(welcome.excerpt)}', '${esc(welcome.content)}', 'Latest Technology News', 'Billboard Tech Team');`;
    sql = sql.replace(oldWelcomeRegex, newWelcome);
  }

  // Replace the whole appended "Blog posts for each category" block with improved posts.
  const marker = '-- Blog posts for each category';
  const idx = sql.indexOf(marker);
  if (idx !== -1) {
    const header = sql.slice(0, idx);
    const improvedRows = Object.entries(posts)
      .filter(([slug]) => slug !== 'welcome-to-billboard-technology')
      .map(([slug, p]) => {
        const [category, author] = META[slug];
        const img = POST_IMAGES[slug] || null;
        return `  ('${esc(p.title)}', '${esc(slug)}', '${esc(p.excerpt)}', '${esc(p.content)}', '${esc(category)}', '${img}', '${esc(author)}')`;
      });
    const block =
      `\n-- Blog posts for each category\n` +
      `INSERT IGNORE INTO blog (title, slug, excerpt, content, category, image, author) VALUES\n` +
      improvedRows.join(',\n') +
      `;\n`;
    sql = header.replace(/\s*$/, '') + '\n' + block;
    fs.writeFileSync(seedPath, sql, 'utf8');
    console.log('Seed file updated with improved blog posts.');
  } else {
    console.log('WARNING: blog marker not found in seed file.');
  }

  await pool.end();
  process.exit(0);
}

if (require.main === module) {
  main().catch((e) => {
    console.error('ERROR:', e.message);
    process.exit(1);
  });
}

module.exports = { posts, META, POST_IMAGES };
