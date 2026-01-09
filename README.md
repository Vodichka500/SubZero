# ❄️ SubZero

> **Freeze unnecessary spending.**  
> A modern fullstack subscription management dashboard built as a code challenge solution.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![tRPC](https://img.shields.io/badge/tRPC-TypeSafe-blueviolet)
![Status](https://img.shields.io/badge/Status-Completed-success)

---

## 🚀 Live Demo

🔗 **Deployed application:**  
https://sub-zero-bice.vercel.app/dashboard

---

## 📌 Overview

**SubZero** is a fullstack CRUD application created as a solution for a **Fullstack Code Challenge**.  
The project demonstrates modern frontend and backend practices using **Next.js**, **Supabase**, **tRPC**, and **NextAuth**.

The application allows authenticated users to manage their subscriptions, track recurring expenses, and view analytics — while ensuring **strict user data isolation**.

The UI follows a dark **Ice / Cyber** aesthetic with electric cyan accents and is fully responsive.

---

### 🔐 Authentication Note

The application uses **NextAuth.js with Credentials Provider**. A full authentication flow (registration and login) is implemented, however a **test user** is provided for quick access:

**Email:** `test@example.com`  
**Password:** `password`

You may either use this account or create a new one via the registration form.

---

## ✨ Key Features

- **🔐 Authentication & Authorization**
    - NextAuth.js with Credentials Provider
    - Application is fully locked for unauthenticated users
    - Each user can access **only their own data**

- **🧩 CRUD Functionality**
    - Create, read, update, and delete subscriptions
    - Server-side access control enforced at API level

- **📊 Analytics Dashboard**
    - Monthly and yearly spending calculations
    - Visual overview of recurring expenses

- **🤖 AI-powered Auto-fill**
    - Enter a service name (e.g. “Netflix”)
    - Category, icon, and color are detected automatically using AI

- **📱 Mobile-first UI**
    - Fully responsive layout
    - Built with Shadcn UI and Tailwind CSS

- **⚡ End-to-End Type Safety**
    - Type-safe communication from database to UI using tRPC and Prisma

---

## 🏗 Tech Stack & Architecture

The project follows the **T3 Stack philosophy** with a managed backend.

### Stack

- **Framework:** Next.js 16
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **API Layer:** tRPC
- **Authentication:** NextAuth.js
- **UI:** Shadcn UI + Tailwind CSS
- **Forms & Validation:** React Hook Form + Zod
- **Schema Generation:** zod-prisma-types
- **AI Integration:** OpenAI API (via Vercel AI SDK)

---

## 🧠 Architecture Decisions

- **Supabase**  
  Chosen as a managed PostgreSQL backend with easy deployment and free-tier support.

- **tRPC instead of REST / GraphQL**  
  Enables full end-to-end type safety, faster development, and fewer runtime errors.

- **Prisma ORM**  
  Provides a clean schema definition and type-safe database queries without raw SQL.

- **Zod + React Hook Form**  
  Ensures reliable form validation and predictable data flow. Automatic schema generation with zod-prisma-types reduces boilerplate.

---

## 🖥 Rendering Strategies (Challenge Requirement)

The application intentionally demonstrates **three different rendering strategies**:

| Page | Strategy | Description |
|----|----|----|
| `/dashboard` | CSR | Client-side rendered dashboard with interactive data |
| `/faq` | SSG | Static page generated at build time |
| `/terms` | SSR | Server-side rendered page, always showing the latest Terms |

---

## ✅ Requirements Checklist

- [x] User authentication via NextAuth.js (Credentials Provider)
- [x] CRUD operations with strict user access control
- [x] Supabase as backend (PostgreSQL)
- [x] Prisma ORM + tRPC 
- [x] Next.js frontend
- [x] At least three rendering strategies (CSR, SSG, SSR)
- [x] Mobile-friendly responsive UI
- [x] Deployed application (Vercel)

---

## 🛠 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Vodichka500/SubZero
cd SubZero
```
### 2.  **Install dependencies:**
```bash
    npm install
```
### 3. Environment variables
Create a .env file and provide the following:
* Supabase database connection
* NextAuth secret
* OpenAI API key
### 4. Database setup
```bash
    npm prisma:push
    npm seed
```

### 5. Run the development server
```bash
    npm run dev
```
Open:
```
    http://localhost:3000
```
    
    
## 🖼 Screenshots

### Landing Page
Welcome users with a sleek introduction to SubZero's features.
<img width="1904" height="939" alt="image" src="https://github.com/user-attachments/assets/28413b8e-40b4-41cc-8af4-4604721d6ce8" />

### Auth page
Allows users to sign up and log in securely using credentials.
<img width="1920" height="929" alt="image" src="https://github.com/user-attachments/assets/773bed3a-1679-4c4d-9c14-044b5a3956d6" />

### Dashboard
Central hub for managing subscriptions, viewing analytics.
<img width="1920" height="934" alt="image" src="https://github.com/user-attachments/assets/3e3cb665-7b21-4a98-8c93-2d3c037f2316" />

### Add Subscription
Form to add new subscriptions with **_AI-powered_** auto-fill.
<img width="1920" height="933" alt="image" src="https://github.com/user-attachments/assets/a11d1b9b-5606-44c2-b2c2-409c01dac080" />

### Settings
User preferences and account management.
<img width="1899" height="933" alt="image" src="https://github.com/user-attachments/assets/1843049b-a4ff-4a05-886e-bd877ba552e0" />

### Mobile View Example (Dashboard - Calendar View)
Fully responsive design for seamless mobile experience.

<img width="387" height="844" alt="image" src="https://github.com/user-attachments/assets/5787f70a-6c75-4cd0-827b-df75ab9658fe" />

## 📄 License
This project is licensed under the MIT License.

## ‍💻 Author
- Uladzislau Kamisarau
- Created as part of a Fullstack Code Challenge.
