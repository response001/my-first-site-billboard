# Billboard Technology (onBillBoard.com)

Full-stack website for **Billboard Technology** — a company that sells tech devices (computers, laptops, smart watches, phones, tablets, printers, networking devices, accessories), offers **internships** for software development students (L3, L4, L5) and **3-month short courses** (Software Development, Networking, Graphic Design).

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS v4 + React Router
- **Backend:** Node.js + Express + MySQL (mysql2)
- **Auth:** JWT + bcrypt

## Project Structure

```
onbillboard/
├── frontend/                 # React + Vite + Tailwind
│   └── src/
│       ├── pages/            # Home, About, Products, ProductDetails, Cart, Checkout,
│       │                     # Services, Internship, Courses, CourseDetails, Blog,
│       │                     # BlogPost, Contact, Login, Register
│       ├── admin/            # Login, Layout, Dashboard, Products, Orders,
│       │                     # Internship, Courses, Messages, Reports
│       ├── components/       # Navbar, Footer, ProductCard, CourseCard, Hero
│       └── services/         # api.js, CartContext.jsx
├── backend/                  # Node + Express
│   ├── config/db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/              # CVs, recommendation letters, product images
│   ├── server.js
│   └── database.sql          # full schema + seed data
└── README.md
```

## Database Tables

`users`, `admins`, `categories`, `products`, `orders`, `order_items`, `payments`, `internships`, `courses`, `course_registrations`, `messages`, `blog`, `reviews`

## Setup (Windows / PowerShell)

### 1. Database

Make sure MySQL/MariaDB is running, then create the database and seed data:

```powershell
cd backend
mysql -u root -p < database.sql
```

### 2. Backend

```powershell
cd backend
copy .env.example .env        # edit DB credentials / JWT secret if needed
npm install
npm start                     # runs on http://localhost:5000
```

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev                   # runs on http://localhost:3000
```

The frontend proxies `/api` and `/uploads` to the backend on port 5000.

## Default Admin Account

- Username: `admin`
- Password: `admin123`
- Login page: http://localhost:3000/admin/login

## Main Features

- **Shop:** product categories, product details, add to cart, checkout, order tracking (status update in admin)
- **Internship:** application form with CV + recommendation letter upload for L3/L4/L5 software development students
- **Short Courses:** Software Development, Networking, Graphic Design (3 months each) with registration forms
- **Contact:** contact form stored in DB, viewed in admin
- **Blog:** posts stored in DB, visible on the blog page
- **Admin dashboard:** stats, products CRUD, orders + status updates, internship applications, course registrations, messages, reports

## Next Steps / Ideas to Add

- Online payment (Mobile Money, bank cards) — the `payments` table is already there
- Inventory management is built in (stock decreases automatically when an order is placed)
- Order tracking for customers via the order number
- Student portal (lessons, assignments, grades, certificates)
- Intern portal to track progress
- Certificates with QR codes
- Reviews & ratings on products and courses (`reviews` table exists)
- Email/SMS notifications
