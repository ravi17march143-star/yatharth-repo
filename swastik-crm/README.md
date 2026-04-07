# Swastik CRM

A professional, full-featured CRM built with **Next.js 14** (App Router), **MongoDB** (Mongoose), and **Tailwind CSS** — converted from Perfex CRM (CodeIgniter 3).

## Features

- **Clients & Contacts** — full client management with billing/shipping addresses
- **Invoicing** — invoices, payments, credit notes, recurring invoices
- **Expenses** — track expenses by category, client, or project
- **Projects** — project management with tasks, milestones, Kanban, Gantt
- **Tasks** — task management with checklist, timers, followers
- **Leads** — lead pipeline with Kanban and conversion to client
- **Estimates & Proposals** — pipeline view with acceptance workflow
- **Contracts** — with e-signature support
- **Subscriptions** — recurring billing via Stripe
- **Support Tickets** — email threading, priorities, departments
- **Knowledge Base** — articles with search
- **Reports** — income, expense, leads, tickets
- **Staff & Roles** — role-based permissions
- **Settings** — company, email, invoice, payment gateway config
- **GDPR** — consent management
- **10 Payment Gateways** — Stripe, PayPal, etc.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 14 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (JWT) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Email | Nodemailer |
| Payments | Stripe, PayPal |

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 2. Install
```bash
cd swastik-crm
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and other settings
```

Minimum required in `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/swastik_crm
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. First Login
The database auto-initializes on first visit with:
- **Email:** `admin@swastikcrm.com`
- **Password:** `Admin@123`

> Change these in `.env.local` via `ADMIN_EMAIL` and `ADMIN_PASSWORD` before first run.

## Database

- MongoDB collections are **automatically created** on first run
- No manual setup needed — just provide `MONGODB_URI` and start
- All default data seeded: currencies, taxes, payment modes, ticket statuses, lead statuses, email templates, etc.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── (dashboard)/         # All protected pages
│   │   ├── dashboard/       # Dashboard overview
│   │   ├── clients/         # Client management
│   │   ├── invoices/        # Invoice management
│   │   ├── expenses/        # Expense tracking
│   │   ├── projects/        # Project management
│   │   ├── tasks/           # Task management
│   │   ├── leads/           # Lead pipeline
│   │   ├── estimates/       # Estimates
│   │   ├── proposals/       # Proposals
│   │   ├── contracts/       # Contracts
│   │   ├── subscriptions/   # Subscriptions
│   │   ├── tickets/         # Support tickets
│   │   ├── knowledge-base/  # KB articles
│   │   ├── reports/         # Reports
│   │   ├── staff/           # Staff management
│   │   ├── roles/           # Roles & permissions
│   │   └── settings/        # App settings
│   └── api/                 # All API routes
├── models/                  # Mongoose models (30+ models)
├── lib/
│   ├── mongodb.ts           # DB connection
│   ├── auth.ts              # NextAuth config
│   ├── dbInit.ts            # Auto DB initialization
│   └── utils.ts             # Utility functions
└── components/
    ├── layout/              # Sidebar, Header
    └── ui/                  # Modal, Badge, etc.
```

## Deployment

### Vercel
1. Connect your GitHub repo
2. Add environment variables in Vercel dashboard
3. Deploy — MongoDB Atlas recommended for production

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License
Private - All rights reserved by Swastik CRM
