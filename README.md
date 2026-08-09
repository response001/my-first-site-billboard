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

## Admin Notifications (New Order + Internship Application)

When a customer places an order or applies for an internship, automatic notifications are sent:

- **Admin** — email + SMS (+ WhatsApp when configured):
  - Email: `reponseimanirabizi@gmail.com`
  - SMS/WhatsApp: `+250 794 109 388`
- **Customer** — confirmation email + SMS to their own email / phone.

Configure in `backend/.env`:

```
ADMIN_EMAIL=reponseimanirabizi@gmail.com
ADMIN_WHATSAPP=+250794109388
SITE_URL=http://localhost:5000

# Email - Gmail app password recommended
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password

# SMS - Africa's Talking (admin + customer)
AT_USERNAME=sandbox            # use your live username when ready, and AT_SANDBOX=false
AT_API_KEY=your-africastalking-api-key
AT_SENDER_ID=your-approved-sender-id
AT_SANDBOX=true

# WhatsApp - Meta WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN=your-meta-access-token
WHATSAPP_PHONE_ID=your-whatsapp-phone-number-id
WHATSAPP_API_VERSION=v19.0
```

> Notes:
> - `ADMIN_WHATSAPP` is the number that receives SMS and WhatsApp messages.
> - Notifications are skipped (with a console warning) if credentials are missing, so the order/internship flow is never blocked.
> - Test all channels with `cd backend && npm run test-notify`.
> - Meta WhatsApp Cloud API only delivers free-form text inside the 24h customer-service window or via an approved template.

## Mobile Money Payments (Paypack)

When a customer picks **"Mobile Money (MTN MoMo / Airtel Money)"** at checkout:

1. The order is saved as pending, then the backend asks **Paypack** to send a payment prompt to the customer's phone.
2. The customer enters their Mobile Money PIN on their phone.
3. The frontend polls `GET /api/payments/paypack/status/:ref` (and a webhook at `POST /api/payments/paypack/webhook` can also confirm in production).
4. On success: stock is deducted, the order is confirmed, and the admin + customer emails/SMS are sent. On failure the order is cancelled automatically.

Configure in `backend/.env`:

```
PAYPACK_CLIENT_ID=your-client-id
PAYPACK_CLIENT_SECRET=your-client-secret
PAYPACK_MODE=development
PAYPACK_WEBHOOK_SECRET=your-webhook-secret
PAYPACK_BASE_URL=https://payments.paypack.rw/api
```

> Notes:
> - Get credentials by creating an **application** in your Paypack dashboard (`payments.paypack.rw`).
> - In `PAYPACK_MODE=development` (sandbox) payments are simulated; switch to `production` when going live.
> - Webhooks need a public URL (e.g. ngrok); the checkout polling works even without one.

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
- Email/SMS notifications to customers
