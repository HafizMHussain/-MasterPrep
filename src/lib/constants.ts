import {
  BookOpen,
  BarChart3,
  Clock,
  Target,
  Brain,
  Award,
  Users,
  Star,
  CheckCircle2,
  Zap,
  Shield,
  Sparkles,
  GraduationCap,
  Stethoscope,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  type LucideIcon,
} from "lucide-react";

// ─── Navigation ───────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

// ─── Hero Stats ───────────────────────────────────────────
export const HERO_STATS = [
  { value: "2,500+", label: "Students Helped" },
  { value: "260+", label: "Avg Score" },
  { value: "98%", label: "Pass Rate" },
  { value: "4.9/5", label: "Student Rating" },
] as const;

// ─── Features ─────────────────────────────────────────────
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: BookOpen,
    title: "Extensive Question Bank",
    description:
      "Access 2,000+ expertly crafted USMLE-style questions with detailed explanations covering all Step 1 & Step 2 CK topics.",
  },
  {
    icon: Clock,
    title: "Timed Mock Exams",
    description:
      "Simulate the real exam experience with timed mock tests that mirror the actual USMLE format and difficulty level.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track your performance across subjects, identify weak areas, and monitor your progress with detailed visual analytics.",
  },
  {
    icon: Brain,
    title: "Smart Study Planner",
    description:
      "Get a personalized study plan tailored to your target exam date, strengths, and weaknesses for maximum efficiency.",
  },
  {
    icon: Target,
    title: "Targeted Practice",
    description:
      "Filter questions by subject, system, difficulty, and topic. Focus your study time where it matters most.",
  },
  {
    icon: Award,
    title: "Expert Consultations",
    description:
      "Book one-on-one sessions with USMLE experts who scored 250+ to get personalized guidance and strategy.",
  },
];

// ─── Testimonials ─────────────────────────────────────────
export interface Testimonial {
  name: string;
  role: string;
  score: string;
  improvement: string;
  text: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Sarah Ahmed",
    role: "IMG, Step 1",
    score: "262",
    improvement: "+45 points",
    text: "This platform completely transformed my study approach. The analytics helped me identify my weak areas in Biochemistry and Pathology, and the targeted practice made all the difference.",
    rating: 5,
    avatar: "SA",
  },
  {
    name: "Dr. Michael Chen",
    role: "US MD, Step 2 CK",
    score: "258",
    improvement: "+38 points",
    text: "The mock exams are incredibly realistic. I felt more confident on exam day because I had already experienced the same format and timing pressure. Highly recommended!",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Dr. Priya Patel",
    role: "IMG, Step 1",
    score: "255",
    improvement: "+50 points",
    text: "The one-on-one consultation with my tutor was a game-changer. They created a personalized study plan that was exactly what I needed. Scored way above my target!",
    rating: 5,
    avatar: "PP",
  },
  {
    name: "Dr. James Wilson",
    role: "DO, Step 1",
    score: "270",
    improvement: "+35 points",
    text: "Best question bank I've used. The explanations are thorough and the spaced repetition feature helped me retain information much better than traditional study methods.",
    rating: 5,
    avatar: "JW",
  },
  {
    name: "Dr. Fatima Hassan",
    role: "IMG, Step 2 CK",
    score: "265",
    improvement: "+42 points",
    text: "From scoring 220 on practice tests to 265 on the real exam. The study planner kept me accountable, and the analytics showed exactly where I needed to improve.",
    rating: 5,
    avatar: "FH",
  },
  {
    name: "Dr. David Kim",
    role: "US MD, Step 1",
    score: "272",
    improvement: "+30 points",
    text: "What sets this platform apart is the quality of questions. They're challenging, clinically-relevant, and the explanations teach you how to think, not just memorize.",
    rating: 5,
    avatar: "DK",
  },
];

// ─── Pricing ──────────────────────────────────────────────
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  badge?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Get started with basic access to explore the platform",
    features: [
      "50 practice questions",
      "1 mini mock exam",
      "Basic performance stats",
      "Community forum access",
      "Study tips & resources",
    ],
    highlighted: false,
    cta: "Start Free Trial",
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "Everything you need to ace the USMLE",
    features: [
      "2,000+ practice questions",
      "Unlimited mock exams",
      "Advanced analytics dashboard",
      "Personalized study planner",
      "Bookmark & review system",
      "Detailed explanations",
      "Performance tracking",
      "Email support",
    ],
    highlighted: true,
    cta: "Get Started",
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "$99",
    period: "per month",
    description: "Premium mentorship for maximum results",
    features: [
      "Everything in Pro",
      "2x monthly 1-on-1 tutoring",
      "Custom study plan by 250+ scorer",
      "Priority email & chat support",
      "AI-powered recommendations",
      "Weakness-targeted question sets",
      "Score prediction model",
      "Residency match guidance",
    ],
    highlighted: false,
    cta: "Go Premium",
  },
];

// ─── FAQ ──────────────────────────────────────────────────
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What USMLE steps does this platform cover?",
    answer:
      "Our platform currently covers USMLE Step 1 and Step 2 CK. We have comprehensive question banks for both exams, with questions organized by organ system, subject, and difficulty level. Step 3 content is in development and coming soon.",
  },
  {
    question: "How are the questions different from other QBanks?",
    answer:
      "Our questions are written by physicians who scored 250+ on their USMLE exams. Each question is clinically-oriented and comes with detailed explanations that teach underlying concepts, not just the correct answer. We focus on high-yield topics and frequently tested concepts.",
  },
  {
    question: "Can I try before I subscribe?",
    answer:
      "Absolutely! We offer a free 7-day trial with access to 50 practice questions and 1 mini mock exam. No credit card required. You can explore the platform, try the analytics features, and see if it's right for you.",
  },
  {
    question: "How does the consultation booking work?",
    answer:
      "Premium subscribers get 2 monthly 1-on-1 tutoring sessions with USMLE experts. You can book through our integrated scheduling system. Your tutor will analyze your performance data and create a personalized strategy to maximize your score.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Our platform is fully responsive and works great on mobile browsers. A dedicated iOS and Android app is currently in development and will be available soon with offline access and push notifications for study reminders.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with the platform for any reason, contact our support team within 30 days for a full refund, no questions asked.",
  },
  {
    question: "How often is new content added?",
    answer:
      "We add new questions weekly and update existing content based on the latest USMLE exam changes and student feedback. Our question bank is continuously growing and improving to ensure you have the most relevant preparation material.",
  },
  {
    question: "Can I track my progress over time?",
    answer:
      "Yes! Our analytics dashboard provides comprehensive progress tracking including accuracy by subject, performance trends over time, study streaks, time management stats, and a readiness score that predicts your exam performance.",
  },
];

// ─── Blog Posts (Dummy) ───────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorAvatar: string;
  coverColor: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-score-250-plus-on-usmle-step-1",
    title: "How to Score 250+ on USMLE Step 1: A Complete Guide",
    excerpt:
      "A comprehensive, step-by-step guide from students who scored 260+ sharing their study schedules, resources, and strategies.",
    category: "Study Tips",
    readTime: "12 min read",
    date: "April 28, 2026",
    author: "Dr. Sarah Ahmed",
    authorAvatar: "SA",
    coverColor: "from-blue-500 to-indigo-600",
  },
  {
    slug: "best-resources-for-usmle-step-2-ck",
    title: "Top 10 Resources for USMLE Step 2 CK Preparation",
    excerpt:
      "An honest review of the most popular Step 2 CK prep resources including QBanks, review books, and video lectures.",
    category: "Resources",
    readTime: "8 min read",
    date: "April 22, 2026",
    author: "Dr. Michael Chen",
    authorAvatar: "MC",
    coverColor: "from-emerald-500 to-teal-600",
  },
  {
    slug: "anatomy-high-yield-topics",
    title: "High-Yield Anatomy Topics for USMLE Step 1",
    excerpt:
      "Focus your anatomy review on these frequently tested topics to maximize your score with minimum time investment.",
    category: "High-Yield",
    readTime: "10 min read",
    date: "April 18, 2026",
    author: "Dr. Priya Patel",
    authorAvatar: "PP",
    coverColor: "from-purple-500 to-pink-600",
  },
  {
    slug: "managing-burnout-during-dedicated",
    title: "Managing Burnout During Your Dedicated Study Period",
    excerpt:
      "Practical tips for maintaining your mental health and avoiding burnout during the intense USMLE preparation period.",
    category: "Wellness",
    readTime: "7 min read",
    date: "April 15, 2026",
    author: "Dr. James Wilson",
    authorAvatar: "JW",
    coverColor: "from-orange-500 to-red-500",
  },
  {
    slug: "img-guide-to-usmle",
    title: "The Complete IMG Guide to USMLE Success",
    excerpt:
      "Everything international medical graduates need to know about USMLE preparation, from timeline planning to visa considerations.",
    category: "IMG Guide",
    readTime: "15 min read",
    date: "April 10, 2026",
    author: "Dr. Fatima Hassan",
    authorAvatar: "FH",
    coverColor: "from-cyan-500 to-blue-600",
  },
  {
    slug: "pharmacology-study-strategies",
    title: "Mastering Pharmacology: Strategies That Actually Work",
    excerpt:
      "Learn the most effective techniques for memorizing drug mechanisms, side effects, and interactions for the USMLE.",
    category: "Study Tips",
    readTime: "9 min read",
    date: "April 5, 2026",
    author: "Dr. David Kim",
    authorAvatar: "DK",
    coverColor: "from-rose-500 to-pink-600",
  },
];

// ─── Team Members ─────────────────────────────────────────
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  score?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Dr. Ahmad Raza",
    role: "Founder & Lead Mentor",
    bio: "Board-certified physician with 10+ years of USMLE tutoring experience. Passionate about helping students achieve their dream scores.",
    avatar: "AR",
    score: "Step 1: 268",
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of Content",
    bio: "Former residency program director who leads our question writing team. Ensures every question meets the highest clinical standards.",
    avatar: "EW",
    score: "Step 2: 272",
  },
  {
    name: "Dr. Raj Mehta",
    role: "Senior Tutor",
    bio: "Internal medicine resident and USMLE tutor who specializes in personalized study plans and test-taking strategies.",
    avatar: "RM",
    score: "Step 1: 265",
  },
  {
    name: "Dr. Lisa Park",
    role: "Analytics Lead",
    bio: "Data scientist and physician who built our adaptive learning algorithms and performance prediction models.",
    avatar: "LP",
    score: "Step 1: 260",
  },
];

// ─── Features Detail Page ─────────────────────────────────
export interface FeatureDetail {
  icon: LucideIcon;
  title: string;
  description: string;
  highlights: string[];
  badge?: string;
}

export const FEATURE_DETAILS: FeatureDetail[] = [
  {
    icon: BookOpen,
    title: "Question Bank",
    description:
      "2,000+ expertly crafted USMLE-style questions with detailed explanations. Filter by subject, system, difficulty, and more.",
    highlights: [
      "Step 1 & Step 2 CK coverage",
      "Detailed explanations with diagrams",
      "Filter by organ system, subject, difficulty",
      "Tutor mode & exam mode",
      "Track questions you've seen",
    ],
  },
  {
    icon: Clock,
    title: "Mock Exams",
    description:
      "Simulate the real USMLE experience with full-length timed exams that mirror the actual format.",
    highlights: [
      "Full-length & custom-length exams",
      "Real exam countdown timer",
      "Question navigation panel",
      "Flag & review questions",
      "Detailed score report",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Comprehensive performance tracking to identify strengths, weaknesses, and progress over time.",
    highlights: [
      "Subject-wise accuracy breakdown",
      "Performance trend charts",
      "Daily activity tracking",
      "Time management stats",
      "Readiness score prediction",
    ],
  },
  {
    icon: Calendar,
    title: "Study Planner",
    description:
      "AI-powered study planner that creates personalized schedules based on your target date and performance.",
    highlights: [
      "Custom daily goals",
      "Exam date countdown",
      "Topic-wise scheduling",
      "Progress milestones",
      "Adaptive recommendations",
    ],
  },
  {
    icon: MessageSquare,
    title: "Expert Consultations",
    description:
      "Book 1-on-1 sessions with mentors who scored 250+ on their USMLE exams for personalized guidance.",
    highlights: [
      "250+ scoring tutors",
      "Personalized strategy sessions",
      "Study plan review",
      "Weakness analysis",
      "Flexible scheduling",
    ],
  },
  {
    icon: Sparkles,
    title: "AI Tutor",
    description:
      "Coming soon — an AI-powered tutor that provides instant explanations and adaptive question recommendations.",
    highlights: [
      "Instant explanations",
      "Adaptive question selection",
      "Concept reinforcement",
      "Natural language Q&A",
      "24/7 availability",
    ],
    badge: "Coming Soon",
  },
];
