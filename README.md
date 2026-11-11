# Montessori-Inspired Learning Pod 🌿
## Parent Portal & Dashboard (Phase 2 Development)

A modern, responsive, multi-page frontend website and interactive Parent Portal for the **Montessori-Inspired Learning Pod**, communicating warmth, independence, natural curiosity, and authentic child-centered education.

---

### 🎨 1. Design System & Color Palette
- **Warm Cream**: `#FAF7F0`
- **Soft Beige**: `#EDE3D3`
- **Sage Green**: `#9CAF88`
- **Forest Green**: `#435B45`
- **Terracotta**: `#C98263`
- **Typography**: Combination of elegant serif headings (*Playfair Display*) and readable sans-serif body copy (*Plus Jakarta Sans*).
- **Design Aesthetic**: Warm, friendly, welcoming for parents; rounded cards, soft shadows, clear progress meters, and zero sterile corporate feel.

---

### 🔐 2. Split-Screen Parent Portal Login (`/login`)
- **Left Side**: Photographic classroom ambiance, inspirational quote on child-centered education, warm cream/sage gradients, and accreditation badges.
- **Right Side**: Logo, Parent Portal heading, email input, password input, show/hide password toggle (eye icon), Remember Me checkbox, Forgot Password link with modal recovery, Login button with loading spinner, and Back to Website link.
- **Demo Credentials**:
  - **Email**: `parent@example.com`
  - **Password**: `parent123`
  - *Includes an "Auto-Fill" button for instant demonstration access!*

---

### 📊 3. Complete Parent Dashboard (`/dashboard`)

| Section / Route | Features & Interactivity |
|---|---|
| **Main Dashboard** (`/dashboard`) | Personalized greeting ("Welcome Back, Sarah Jenkins!"), current date, 4 summary metric cards (Child Attendance 95.6%, Completed Works 36+, Upcoming Harvest Feast, Tuition Status Paid for Nov), recent daily log highlight, and quick message sender to Lead Guide. |
| **My Child Profile** (`/dashboard/child`) | Student profile photograph, name, age, enrolled program, classroom, assigned guides (Amina Al-Khatib & Mateo Rossi), attendance record summary (Total sessions, present days, streaks), and attractive progress meters for all 6 Montessori domains: Practical Life, Sensorial, Mathematics, Language, Creativity, and Social Development. |
| **Daily Learning Logs** (`/dashboard/logs`) | Classroom journal featuring realistic Montessori works: counting golden beads, sorting color tablets (Box III), planting heirloom sweet peas, cursive sandpaper tracing, water pouring, and Africa puzzle maps. Features **real-time search**, **category filters**, **date filters**, and a **detailed log modal** with skills developed and parent reflection comments. |
| **Teacher Reports** (`/dashboard/reports`) | Pedagogical evaluation reports featuring overall learning progress, demonstrated strengths, next developmental horizons, domain progress scores, and teacher reflections. Features a **View Report modal** and an official **Printable / Download Report format** with pod letterhead. |
| **Tuition & Payments** (`/dashboard/tuition`) | Financial overview: total annual tuition ($14,800), amount paid ($11,840), outstanding balance ($1,480), and next payment due date (Dec 1, 2026). Interactive **Pay Now modal** with simulated card checkout and instant confirmation, plus a **Download/Print Official Receipt modal**. |
| **Notifications** (`/dashboard/notifications`) | Alert center categorized by daily logs, teacher reports, tuition reminders, and school announcements. Includes unread badges, **Mark as Read**, **Mark All Read**, **Clear Alert**, and filtering. |
| **Settings & Profile** (`/dashboard/settings`) | Parent profile management: full name, email, phone, avatar selector, student care details (dietary preferences & emergency contacts), notification preferences toggles, and change password interface with validation. State persists to `localStorage`. |

---

### 🔐 4. Authentication, Social OAuth & Role-Based Dashboards (`/login`, `/register`, `/forgot-password`, `/reset-password`)
- **Backend & Database**: Built-in Node.js HTTP API & `node:sqlite` database (`server/data/montessori.sqlite`) using `scrypt` salted password hashing, SHA-256 single-use password reset tokens, and `HttpOnly` session cookies (`mlp_session`). Mounted automatically inside `npm run dev`, `npm run preview`, or standalone via `npm run server`.
- **Demo Accounts**:
  - **Parent / User (`parent`)**: `parent@example.com` / `parent123` → redirects to `/dashboard` (owns student Oliver Jenkins; blocked from `/admin/*`).
  - **Administrator (`admin`)**: `admin@montessorilearningpod.edu` / `admin123` → redirects to `/admin` (14 administrative management sections; kept strictly separate from `/dashboard` parent views).
- **Parent Self-Registration (`/register`)**: Captures parent details, child profile (`name`, `age`, `preferredProgram`), and strictly assigns the `parent` role (cannot self-promote to `admin`).
- **Google & Facebook OAuth 2.0 + SMTP Setup**:
  Copy `.env.example` to `.env` and populate credentials to enable live Google/Facebook social login and SMTP password recovery emails:
  ```env
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  FACEBOOK_APP_ID=...
  FACEBOOK_APP_SECRET=...
  SMTP_HOST=...
  SMTP_PORT=587
  SMTP_USER=...
  SMTP_PASS=...
  SMTP_FROM=no-reply@montessorilearningpod.edu
  ```

---

### 🏛️ 5. Admin Dashboard (`/admin`)
Dedicated administrative console covering 14 management sections:
- Admin Dashboard Overview, Student Management, Parent Management, Teacher & Staff Management, Programs & Curriculum Management, Attendance Management, Daily Learning Logs Management, Teacher Reports Management, Events Management, Tuition & Payments Management, Notifications Management, Website Content Management, Administrative Reports (with CSV export), and System Settings.

---

### 🌐 6. RTL / LTR Compatibility
- Full bidirectional support using the global swap button.
- Sidebar neatly switches from left to right in RTL mode.
- Tables, form inputs, modals, icons, and progress meters adjust alignment seamlessly.

---

### 🚀 7. How to Run & Verify

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run TypeScript compilation & production build
npm run build

# 3. Start local development server (includes /api backend + SQLite)
npm run dev

# 4. Preview production build or run standalone backend server
npm run preview
npm run server
```
