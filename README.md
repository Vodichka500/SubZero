# ❄️ SubZero

> **Freeze unnecessary spending.**
> Take control of all your subscriptions in one cool place.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green) ![Prisma](https://img.shields.io/badge/Prisma-ORM-blue) ![tRPC](https://img.shields.io/badge/tRPC-TypeSafe-blueviolet) ![Status](https://img.shields.io/badge/Status-In%20Development-cyan)

## 📋 Overview

**SubZero** is a modern, responsive subscription management dashboard built to satisfy the requirements of a Fullstack Code Challenge. It helps users track recurring expenses, visualize their monthly spend, and categorize services automatically using AI.

The application features a distinct "Ice/Cyber" aesthetic using a dark mode UI with **Electric Cyan** accents.

## ✨ Key Features

-   **🔐 Secure Authentication:** User isolation via NextAuth.js (Credentials Provider).
-   **🤖 AI-Powered Auto-fill:** Enter a service name (e.g., "Netflix"), and the app automatically detects the category, color, and icon using generative AI models.
-   **📊 Dashboard Analytics:** Real-time calculation of monthly and yearly expenses.
-   **📱 Mobile First:** Fully responsive UI built with Shadcn UI and Tailwind CSS.
-   **⚡ End-to-End Type Safety:** Full typed communication from Database to UI using tRPC and Prisma.

## 🏗 Architecture & Tech Stack

This project uses the **T3 Stack** philosophy (Next.js + tRPC + Prisma) paired with Supabase.

### The Stack
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **ORM:** [Prisma](https://www.prisma.io/) (Schema management & Queries)
* **Data Fetching:** [tRPC](https://trpc.io/) (E2E type-safe APIs)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **UI Library:** [Shadcn UI](https://ui.shadcn.com/) + Tailwind CSS
* **Forms:** [React Hook Form](https://react-hook-form.com/)
* **AI Integration:** OpenAI API / Vercel AI SDK

### Architecture Decision: Why this stack?
1.  **NextAuth + Supabase:** While Supabase offers native auth, the requirements strictly requested **NextAuth**. I implemented a custom adapter pattern where NextAuth handles the session state, while Prisma secures data access by enforcing `userId` checks on every query.
2.  **tRPC:** Chosen over REST/GraphQL to provide seamless type safety between the backend functions and frontend components, speeding up development and reducing runtime errors.
3.  **Prisma:** Used to interact with the Supabase Postgres instance, allowing for clean schema definition and type-safe database queries without raw SQL.

## 🚀 Render Strategies (Requirement Implementation)

As per the technical requirements, the application utilizes three distinct rendering strategies:

1.  **CSR (Client-Side Rendering):**
    * *Location:* **Dashboard & Subscription List**.
    * *Reason:* Highly interactive user data, real-time updates, and AI interactions require client-side state management.
2.  **SSG (Static Site Generation):**
    * *Location:* **FAQ Page (`/faq`)**.
    * *Reason:* Static content that doesn't change between users. Prerendered at build time for maximum performance and SEO.
3.  **SSR (Server-Side Rendering):**
    * *Location:* **Terms of Service (`/terms`)**.
    * *Reason:* Fetches the latest legal document version from the database on every request, ensuring the user always sees the most up-to-date legal text without rebuilding the app.

## 🛠 Getting Started

