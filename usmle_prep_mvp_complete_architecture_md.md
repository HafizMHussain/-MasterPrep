# USMLE Prep Platform MVP Architecture
## Complete Technical Architecture Document
### Stack: Next.js + Supabase + Tailwind + ShadCN

---

# 1. PROJECT OVERVIEW

## Goal
Build a modern USMLE preparation platform MVP similar to DedicatedPrep.

The platform will include:
- Premium landing page
- Authentication system
- Student dashboard
- Question bank engine
- Mock exams
- Analytics dashboard
- Bookmarks/review system
- Study planner
- Admin panel
- Consultation booking system

---

# 2. MVP FEATURES

# INCLUDED IN MVP

## Public Website
- Landing page
- Pricing
- Features
- Testimonials
- Blog
- Contact page
- Login/Register
- Book Consultation

## Student Features
- Authentication
- Dashboard
- Question bank
- Timed mock exams
- Analytics
- Bookmark system
- Study planner
- Profile management

## Admin Features
- Manage questions
- Manage users
- Manage exams
- Blog management
- Announcements
- Consultation leads

---

# NOT INCLUDED YET

- AI tutor
- Payments
- Video calling
- Mobile apps
- Live classes
- Voice assistant

These will be added later as full stack features but for now add them as static pages with dummy data.

---

# 3. FINAL TECH STACK

## FRONTEND

```yaml
Framework: Next.js 15
Language: TypeScript
Styling: Tailwind CSS
UI Components: ShadCN UI
Animations: Framer Motion
Charts: Recharts
State Management: Zustand
Forms: React Hook Form + Zod
```

---

## BACKEND

```yaml
Backend: Next.js Server Actions
Database: Supabase PostgreSQL
Authentication: Supabase Auth
Storage: Supabase Storage
ORM: Prisma (optional later)
```

---

## DEPLOYMENT

```yaml
Frontend Hosting: Vercel
Database Hosting: Supabase
Domain/CDN: Cloudflare
Monitoring: Sentry
```

---

# 4. SYSTEM ARCHITECTURE

```text
                    ┌────────────────────┐
                    │    Next.js App     │
                    │  Frontend + APIs   │
                    └─────────┬──────────┘
                              │
                              │
                    ┌─────────▼──────────┐
                    │    Supabase Auth   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ PostgreSQL Database│
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Supabase Storage   │
                    └────────────────────┘
```

---

# 5. APPLICATION STRUCTURE

```bash
src/
│
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── exams/
│   ├── consultation/
│   └── landing/
│
├── features/
│   ├── auth/
│   ├── question-bank/
│   ├── exams/
│   ├── analytics/
│   ├── planner/
│   ├── consultations/
│   └── bookmarks/
│
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── utils/
└── styles/
```

---

# 6. ROUTING ARCHITECTURE

## PUBLIC ROUTES

```bash
/
├── /about
├── /pricing
├── /features
├── /blog
├── /contact
├── /book-consultation
├── /login
└── /register
```

---

## STUDENT ROUTES

```bash
/dashboard
├── /dashboard
├── /dashboard/questions
├── /dashboard/exams
├── /dashboard/analytics
├── /dashboard/bookmarks
├── /dashboard/planner
├── /dashboard/profile
└── /dashboard/settings
```

---

## ADMIN ROUTES

```bash
/admin
├── /admin/questions
├── /admin/users
├── /admin/exams
├── /admin/blog
├── /admin/consultations
└── /admin/announcements
```

---

# 7. DATABASE ARCHITECTURE

## DATABASE: SUPABASE POSTGRESQL

---

## TABLE: profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  avatar_url text,
  role text default 'student',
  target_exam_date date,
  created_at timestamp default now()
);
```

---

## TABLE: questions

```sql
create table questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  explanation text,
  difficulty text,
  system text,
  topic text,
  image_url text,
  created_at timestamp default now()
);
```

---

## TABLE: question_options

```sql
create table question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  option_text text,
  is_correct boolean default false
);
```

---

## TABLE: attempts

```sql
create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  question_id uuid references questions(id),
  selected_option uuid,
  correct boolean,
  time_taken integer,
  created_at timestamp default now()
);
```

---

## TABLE: bookmarks

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  question_id uuid references questions(id),
  created_at timestamp default now()
);
```

---

## TABLE: mock_exams

```sql
create table mock_exams (
  id uuid primary key default gen_random_uuid(),
  title text,
  duration integer,
  total_questions integer,
  created_at timestamp default now()
);
```

---

## TABLE: mock_exam_questions

```sql
create table mock_exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references mock_exams(id),
  question_id uuid references questions(id)
);
```

---

## TABLE: mock_exam_attempts

```sql
create table mock_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  exam_id uuid references mock_exams(id),
  score integer,
  completed boolean default false,
  created_at timestamp default now()
);
```

---

## TABLE: study_plans

```sql
create table study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  daily_goal integer,
  exam_date date,
  created_at timestamp default now()
);
```

---

## TABLE: blogs

```sql
create table blogs (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text unique,
  content text,
  cover_image text,
  published boolean default false,
  created_at timestamp default now()
);
```

---

## TABLE: consultations

```sql
create table consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  full_name text,
  email text,
  consultation_type text,
  scheduled_at timestamp,
  status text default 'scheduled',
  notes text,
  created_at timestamp default now()
);
```

---

# 8. CONSULTATION BOOKING SYSTEM

## MVP APPROACH

Use Calendly integration similar to DedicatedPrep.

```yaml
Scheduling Service: Calendly
Frontend Integration: react-calendly
Booking Type: Free Consultation
```

---

## CONSULTATION FLOW

```text
User clicks CTA
       ↓
Opens Consultation Page
       ↓
Calendly Scheduling
       ↓
Confirmation Email
       ↓
Admin Receives Notification
       ↓
Consultation Happens
```

---

## REQUIRED PACKAGE

```bash
npm install react-calendly
```

---

## CONSULTATION PAGE STRUCTURE

```bash
/app/book-consultation/page.tsx
```

---

## CONSULTATION CTA SECTIONS

Place buttons in:
- Hero section
- Pricing section
- Footer CTA
- Sticky Navbar CTA

CTA Text:
- Book Free Consultation
- Talk to an Advisor
- Schedule Strategy Session

---

# 9. AUTHENTICATION ARCHITECTURE

## AUTH PROVIDER

```yaml
Provider: Supabase Auth
```

---

## AUTH FEATURES

```yaml
- Email/password login
- Signup
- Forgot password
- Session persistence
- Route protection
- Role-based access
```

---

# 10. LANDING PAGE ARCHITECTURE

## SECTIONS

```bash
Hero Section
Features Section
Question Bank Showcase
Analytics Showcase
Testimonials
Pricing
FAQ
Consultation CTA
Footer
```

---

## UI DESIGN STYLE

```yaml
Theme: Premium SaaS
Style: Glassmorphism
Animations: Framer Motion
Layout: Modern Dashboard Style
```

---

# 11. DASHBOARD ARCHITECTURE

## DASHBOARD SIDEBAR

```bash
Dashboard
Question Bank
Mock Exams
Analytics
Bookmarks
Study Planner
Profile
Settings
```

---

## DASHBOARD WIDGETS

```yaml
- Questions Solved
- Accuracy Percentage
- Study Streak
- Readiness Score
- Weak Subjects
- Weekly Performance
```

---

# 12. QUESTION BANK ARCHITECTURE

## FEATURES

```yaml
- Tutor mode
- Exam mode
- Timed mode
- Random questions
- Filters
- Bookmarking
- Flagging
- Explanations
```

---

## QUESTION FLOW

```text
Load Question
      ↓
Show Options
      ↓
Submit Answer
      ↓
Store Attempt
      ↓
Show Explanation
      ↓
Next Question
```

---

# 13. MOCK EXAM SYSTEM

## FEATURES

```yaml
- Timed exams
- Countdown timer
- Navigation panel
- Flag questions
- Review before submission
- Final score report
```

---

# 14. ANALYTICS SYSTEM

## ANALYTICS FEATURES

```yaml
- Subject accuracy
- Weak topics
- Performance trends
- Daily activity
- Time management
- Improvement graphs
```

---

# 15. STORAGE ARCHITECTURE

## SUPABASE STORAGE BUCKETS

```bash
question-images
profile-images
blog-images
documents
```

---

# 16. STATE MANAGEMENT

## ZUSTAND STORES

```bash
authStore
questionStore
examStore
analyticsStore
plannerStore
consultationStore
```

---

# 17. SECURITY ARCHITECTURE

## SECURITY FEATURES

```yaml
- Supabase Row Level Security
- Protected routes
- Role-based permissions
- Server-side validation
- Zod validation
```

---

# 18. RESPONSIVE DESIGN

## SUPPORTED DEVICES

```yaml
Desktop
Tablet
Mobile
```

---

# 19. DEPLOYMENT ARCHITECTURE

## FRONTEND

```yaml
Platform: Vercel
```

---

## DATABASE

```yaml
Platform: Supabase
```

---

## DOMAIN

```yaml
Provider: Cloudflare
```

---

# 20. DEVELOPMENT ROADMAP

## PHASE 1

```yaml
- Setup project
- Setup Supabase
- Authentication
- Landing page
```

---

## PHASE 2

```yaml
- Dashboard UI
- Question engine
- Database integration
```

---

## PHASE 3

```yaml
- Mock exams
- Analytics
- Bookmarks
```

---

## PHASE 4

```yaml
- Study planner
- Consultation system
- Admin dashboard
- Deployment
```

---

# 21. FUTURE SCALABILITY

## FUTURE FEATURES

```yaml
- AI tutor
- Stripe payments
- Video classes
- Mobile apps
- GPT explanations
- Adaptive testing
- Flashcards
```

---

# 22. RECOMMENDED NPM PACKAGES

```bash
npm install @supabase/supabase-js
npm install framer-motion
npm install recharts
npm install zustand
npm install zod
npm install react-hook-form
npm install lucide-react
npm install clsx
npm install tailwind-merge
npm install sonner
npm install react-calendly
```

---

# 23. FINAL MVP GOAL

Build a:
- modern
- scalable
- beautiful
- production-ready

USMLE prep platform MVP that can later evolve into:
- full SaaS product
- AI learning platform
- mobile ecosystem
- subscription business

without changing the core architecture.

