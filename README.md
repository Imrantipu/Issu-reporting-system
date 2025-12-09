# 🏙️ Public Infrastructure Issue Reporting System

A comprehensive digital platform that enables citizens to report public infrastructure issues, while government staff and admins efficiently manage, verify, assign, and resolve reported problems with full transparency and tracking.

## 🔗 Live URLs

- **Client (Frontend):** [Coming Soon - Firebase Hosting]
- **Server (Backend):** [Coming Soon - Vercel]

---

## 🔐 Test Credentials

### Admin Account
- **Email:** `admin@publicreport.com`
- **Password:** `Admin123!@#`
- **Access:** Full system control, user management, staff assignment, payment overview

### Staff Account
- **Email:** `staff@publicreport.com`
- **Password:** `Staff123!@#`
- **Name:** John Doe
- **Access:** View and update assigned issues, change status, add progress updates

### Citizen Account (Free User)
- **Email:** `citizen@publicreport.com`
- **Password:** `Citizen123!@#`
- **Name:** Jane Smith
- **Status:** Free user with 2/3 issues already posted
- **Access:** Submit up to 3 issues, upvote, boost priority (with payment)

---

## ✨ Key Features

1. **🔐 Role-Based Authentication System**
   - Three distinct user roles: Admin, Staff, and Citizen
   - Firebase Authentication with email/password and Google OAuth
   - JWT token-based API security with role verification middleware

2. **📊 Comprehensive Issue Tracking**
   - Complete issue lifecycle: Pending → In-Progress → Working → Resolved → Closed
   - Real-time timeline/tracking for every issue showing all status changes
   - Read-only audit trail preserving complete history

3. **🔍 Advanced Search & Filtering**
   - Server-side pagination for optimal performance
   - Real-time search by title, description, location, and category
   - Multi-criteria filtering: status, priority, category
   - Loading states during data fetching

4. **⬆️ Community Upvoting System**
   - Citizens can upvote issues to show importance
   - One upvote per user per issue (prevents spam)
   - Users cannot upvote their own issues
   - Instant UI updates with optimistic rendering

5. **🚀 Priority Boost with Payment**
   - Citizens can boost issues to high priority for 100 BDT
   - Stripe integration for secure card payments
   - Boosted issues appear first in all lists
   - Payment confirmation with automatic priority update

6. **💎 Premium Subscription System**
   - Free users: Limited to 3 issue submissions
   - Premium users: Unlimited issue reporting for 1000 BDT/month
   - Stripe payment integration with subscription management
   - Premium badge display on user profiles

7. **📄 PDF Invoice Generation**
   - Downloadable invoices for all payments
   - Professional invoice template with company branding
   - Available in Admin Payments page and User Profile
   - Includes transaction details, dates, and payment info

8. **👥 Advanced Admin Dashboard**
   - Comprehensive statistics with charts (issues, payments, users)
   - One-time staff assignment to issues (permanent assignment)
   - User management: Block/unblock citizens
   - Staff management: Full CRUD operations with Firebase sync
   - Payment overview with filtering options

9. **🛠️ Staff Workflow Management**
   - View assigned issues (boosted issues prioritized)
   - Controlled status transitions with validation
   - Timeline entry creation on every status change
   - Personal dashboard with assignment statistics

10. **📱 Fully Responsive Design**
    - Mobile-first approach with TailwindCSS + DaisyUI
    - Responsive dashboards for all user roles
    - Touch-friendly interface for mobile devices
    - Optimized layouts for tablet and desktop

11. **🎨 Smooth Animations & UX**
    - Framer Motion page transitions
    - Card hover effects and micro-interactions
    - Loading skeletons for better perceived performance
    - Toast notifications for all actions (react-hot-toast)

12. **🔄 Optimistic UI Updates**
    - TanStack Query for efficient data fetching and caching
    - Automatic cache invalidation on mutations
    - Real-time UI updates without page refresh
    - Axios interceptors for global error handling

13. **🛡️ Security Best Practices**
    - Firebase Admin SDK token verification on server
    - Role-based middleware protection for all routes
    - Environment variables for all secrets
    - CORS configuration for production safety

14. **📸 Image Upload Integration**
    - ImgBB integration for issue images
    - User profile photo uploads
    - Preview before upload
    - Optimized image delivery

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** TailwindCSS + DaisyUI
- **Routing:** React Router v7
- **State Management:** TanStack Query v5
- **Authentication:** Firebase Auth (Email/Password + Google OAuth)
- **HTTP Client:** Axios with interceptors
- **Payments:** Stripe.js + Stripe Elements
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast
- **PDF Generation:** jsPDF
- **Forms:** React Hook Form

### Backend
- **Runtime:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase Admin SDK + JWT
- **Payments:** Stripe API
- **Security:** CORS, role-based middleware
- **Logging:** Morgan

### DevOps & Deployment
- **Client Hosting:** Firebase Hosting
- **Server Hosting:** Vercel
- **Database:** MongoDB Atlas
- **Version Control:** Git & GitHub
- **Image Storage:** ImgBB

---

## 📦 Installation & Setup (Optional)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Firebase project
- Stripe account (test mode)
- ImgBB API key

### Client Setup
```bash
cd client
npm install
# Configure .env file with Firebase, API URL, Stripe, and ImgBB keys
npm run dev
```

### Server Setup
```bash
cd server
npm install
# Configure .env file with MongoDB, Firebase Admin, and Stripe keys
npm run dev

# Seed test users and data
npm run seed:all
```

---

## 🎯 Challenge Tasks Completed

✅ **Token Verification & Role-Based Middleware** - Implemented with Firebase Admin SDK
✅ **Server-Side Pagination** - Implemented on all issue lists
✅ **Pagination UI Controls** - Working pagination on All Issues page
✅ **Server-Side Search** - By title, description, location, category
✅ **Server-Side Filtering** - By status, priority, category
✅ **Search & Filter UI** - With loading states and instant results
✅ **PDF Invoice Generation** - Available in Admin and User dashboards

---

## 🌟 Optional Tasks Completed

✅ **Animations** - Framer Motion for smooth transitions and interactions
✅ **Axios Interceptors** - For authentication and global error handling

---

## 👨‍💻 Development Notes

### Seeding Test Data
```bash
cd server

# Create individual users
npm run seed:admin    # Creates admin account
npm run seed:staff    # Creates staff account
npm run seed:citizen  # Creates citizen account
npm run seed:issues   # Creates 2 test issues for citizen

# Or seed everything at once
npm run seed:all
```

### Key Features Highlights
- **3-Issue Limit Enforcement:** Free users are blocked after 3 submissions with subscription prompt
- **Boosted Issue Priority:** Boosted issues always appear first in all lists
- **Staff Assignment:** One-time permanent assignment by admin
- **Timeline Tracking:** Every action creates an audit entry
- **Blocked Users:** Can login but cannot submit/edit/upvote/boost
- **Status Transitions:** Enforced workflow (pending→in-progress→working→resolved→closed)

---
