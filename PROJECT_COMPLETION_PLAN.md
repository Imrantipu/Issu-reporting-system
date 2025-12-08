# Public Infrastructure Issue Reporting System - Completion Plan

## Project Status Overview

### ✅ Completed (Server-Side - ~70%)

#### Core Infrastructure
- [x] Express server setup with CORS, Firebase Admin, MongoDB
- [x] Environment variable configuration
- [x] MongoDB models (User, Issue, Payment)
- [x] Authentication middleware (JWT + Firebase token verification)
- [x] Role-based access control middleware

#### API Endpoints
- [x] **Issues API** - Full CRUD with pagination, search, filters, upvote
- [x] **Admin API** - Staff management, user blocking, issue assignment/rejection
- [x] **Staff API** - Assigned issues list, status transitions
- [x] **Payments API** - Stripe integration for boost & subscription

### ⚠️ Partially Complete (Client-Side - ~15%)

#### Setup & Structure
- [x] Vite + React project initialized
- [x] TailwindCSS + DaisyUI configured
- [x] TanStack Query installed
- [x] Firebase SDK installed
- [x] Basic page components created (Login, Register, Home, AllIssues, etc.)

#### Missing Core
- [ ] AuthContext and authentication flow
- [ ] Firebase configuration
- [ ] Axios instance with interceptors
- [ ] Protected route wrapper
- [ ] API service layer
- [ ] All dashboard pages and layouts
- [ ] Payment integration UI
- [ ] PDF invoice generation
- [ ] Timeline/tracking UI component

---

## 🎯 Completion Strategy (Phases)

### **PHASE 1: Core Client Infrastructure** (Priority: CRITICAL)
*Estimated: 2-3 hours | Commits: 5-7*

#### 1.1 Firebase & Auth Setup
- [ ] Create `firebase/config.js` with Firebase initialization
- [ ] Create `context/AuthContext.jsx` with:
  - Email/password login
  - Google sign-in
  - Register with photo upload
  - Logout
  - User state persistence
  - Token refresh handling
- [ ] Create `hooks/useAuth.js` hook
- [ ] Wrap app with AuthProvider in `main.jsx`

#### 1.2 API Layer & Axios
- [ ] Create `lib/axios.js` with base config
- [ ] Add axios interceptor for auth token
- [ ] Add response/error interceptors
- [ ] Create `lib/api.js` with all API calls:
  - Auth APIs (login, register, logout)
  - Issues APIs (CRUD, upvote, boost)
  - Admin APIs (staff, users, payments)
  - Staff APIs (assigned issues, status change)
  - Payment APIs (intents, confirm)

#### 1.3 TanStack Query Setup
- [ ] Configure QueryClient in `main.jsx`
- [ ] Create query keys constants file
- [ ] Set up default options (refetch, retry, staleTime)

#### 1.4 Routing & Protection
- [ ] Create `routes/PrivateRoute.jsx` component
- [ ] Create `routes/RoleRoute.jsx` for role-based routes
- [ ] Set up main router in `App.jsx` with:
  - Public routes (/, /login, /register, /all-issues, /issue/:id)
  - Private routes (dashboards)
  - Role-based routes (admin, staff, citizen)
- [ ] Add redirect logic for blocked users

**Commits for Phase 1:**
1. "feat(client): configure Firebase and create AuthContext"
2. "feat(client): add axios instance with auth interceptors"
3. "feat(client): create API service layer with all endpoints"
4. "feat(client): configure TanStack Query provider"
5. "feat(client): add PrivateRoute and role-based routing"

---

### **PHASE 2: Public Pages** (Priority: HIGH)
*Estimated: 3-4 hours | Commits: 6-8*

#### 2.1 Authentication Pages
- [ ] Complete `Login.jsx`:
  - Email/password form with validation
  - Google sign-in button
  - Error handling with toast
  - Redirect after login
- [ ] Complete `Register.jsx`:
  - Registration form (name, email, password, photo upload)
  - Image upload to ImgBB/Cloudinary
  - Success toast and redirect
- [ ] Extract `SocialLogin.jsx` as reusable component

#### 2.2 Home Page Sections
- [ ] Complete `BannerSection.jsx` with slider (Swiper)
- [ ] Create `LatestResolvedIssues.jsx` component:
  - Fetch 6 resolved issues sorted by status
  - Display cards with view details button
- [ ] Create `FeaturesSection.jsx` component
- [ ] Create `HowItWorksSection.jsx` component
- [ ] Create 2 extra sections (Testimonials, Statistics, etc.)
- [ ] Update `Home.jsx` to combine all sections

#### 2.3 All Issues Page
- [ ] Complete `AllIssues.jsx`:
  - Fetch issues with pagination using TanStack Query
  - Implement search bar (server-side)
  - Implement filters (category, status, priority)
  - Display issue cards with badges
  - Upvote button (redirect to login if not authenticated)
  - Pagination controls
  - Loading skeleton
  - Empty state

#### 2.4 Issue Details Page
- [ ] Complete `IssueDetails.jsx`:
  - Fetch single issue with timeline
  - Display full issue information
  - Show assigned staff info (if exists)
  - Edit button (owner + pending status)
  - Delete button (owner only)
  - Boost button (if not boosted) with payment flow
  - Upvote button
  - Timeline/tracking section component
- [ ] Create `Timeline.jsx` component:
  - Vertical timeline UI
  - Status badges with colors
  - Show all timeline entries sorted by date

#### 2.5 Navbar & Footer
- [ ] Complete `Navbar.jsx`:
  - Logo and site name
  - Navigation links
  - Profile dropdown (when logged in)
  - Logout functionality
  - Mobile responsive menu
- [ ] Complete `Footer.jsx` with proper content

**Commits for Phase 2:**
1. "feat(client): complete login and register pages with validation"
2. "feat(client): build home page banner with Swiper slider"
3. "feat(client): add latest resolved issues section to home"
4. "feat(client): add features and how-it-works sections to home"
5. "feat(client): implement all-issues page with pagination and filters"
6. "feat(client): complete issue details page with timeline"
7. "feat(client): build timeline tracking component"
8. "feat(client): finalize navbar with profile dropdown and footer"

---

### **PHASE 3: Citizen Dashboard** (Priority: HIGH)
*Estimated: 3-4 hours | Commits: 5-7*

#### 3.1 Dashboard Layout
- [ ] Create `layouts/DashboardLayout.jsx`:
  - Sidebar with navigation
  - Mobile responsive drawer
  - User profile section in sidebar
  - Active route highlighting
  - Logout button

#### 3.2 Dashboard Overview
- [ ] Create `Dashboard/CitizenDashboard.jsx`:
  - Stats cards (total issues, pending, in-progress, resolved, payments)
  - Fetch user's issue statistics
  - Chart component (pie/bar chart using Recharts or Chart.js)
  - Premium status badge

#### 3.3 My Issues Page
- [ ] Create `Dashboard/MyIssues.jsx`:
  - Fetch user's issues with TanStack Query
  - Tabular/card view of issues
  - Filter dropdown (status, category)
  - Edit button (opens modal, pending only)
  - Delete button (confirmation dialog)
  - View details button (navigate to details page)
- [ ] Create `EditIssueModal.jsx`:
  - Pre-filled form with issue data
  - Update issue on submit
  - Instant UI update with TanStack Query mutation

#### 3.4 Report Issue Page
- [ ] Complete `Dashboard/ReportIssue.jsx`:
  - Form with title, description, category, location, image
  - Image upload to ImgBB/Cloudinary
  - Check user's issue limit (3 for free users)
  - Show subscription prompt if limit reached
  - Success toast and redirect to My Issues
  - Create timeline entry on backend

#### 3.5 Profile Page
- [ ] Create `Dashboard/Profile.jsx`:
  - Display user information
  - Update profile form (name, photo)
  - Premium badge (if subscribed)
  - Subscription button (if not premium)
  - Stripe payment integration for subscription
  - Show blocked warning (if blocked)
  - Display payment history

**Commits for Phase 3:**
1. "feat(client): create dashboard layout with responsive sidebar"
2. "feat(client): build citizen dashboard with stats and charts"
3. "feat(client): implement my-issues page with edit/delete actions"
4. "feat(client): add report-issue page with image upload"
5. "feat(client): create profile page with subscription flow"
6. "feat(client): integrate Stripe for subscription payment"

---

### **PHASE 4: Staff Dashboard** (Priority: HIGH)
*Estimated: 2-3 hours | Commits: 3-5*

#### 4.1 Staff Dashboard Overview
- [ ] Create `Dashboard/StaffDashboard.jsx`:
  - Stats cards (assigned issues, resolved, today's tasks)
  - Charts for issue statistics
  - Recent assigned issues list

#### 4.2 Assigned Issues Page
- [ ] Create `Dashboard/AssignedIssues.jsx`:
  - Fetch assigned issues (boosted first)
  - Tabular view with issue data
  - Status change dropdown (pending→in-progress→working→resolved→closed)
  - Filter by status, priority
  - Update status with TanStack Query mutation
  - Loading states

#### 4.3 Staff Profile
- [ ] Create `Dashboard/StaffProfile.jsx`:
  - View profile information
  - Update name, photo
  - Show assigned issues count

**Commits for Phase 4:**
1. "feat(client): create staff dashboard with statistics"
2. "feat(client): implement assigned-issues page with status transitions"
3. "feat(client): add staff profile page"

---

### **PHASE 5: Admin Dashboard** (Priority: HIGH)
*Estimated: 4-5 hours | Commits: 7-10*

#### 5.1 Admin Dashboard Overview
- [ ] Create `Dashboard/AdminDashboard.jsx`:
  - Stats cards (total issues, resolved, pending, rejected, payments)
  - Charts (pie, bar, line charts)
  - Latest issues table (5-10 entries)
  - Latest payments table (5-10 entries)
  - Latest registered users table (5-10 entries)

#### 5.2 All Issues Management
- [ ] Create `Dashboard/AdminAllIssues.jsx`:
  - Fetch all issues (boosted first)
  - Tabular view with columns: title, category, status, priority, assigned staff
  - Assign Staff button (only if not assigned)
  - Reject button (only if pending)
  - Filter by status, category, priority
  - Pagination
- [ ] Create `AssignStaffModal.jsx`:
  - Fetch all staff from DB
  - Dropdown to select staff
  - Confirm assignment
  - Update UI instantly

#### 5.3 Manage Users Page
- [ ] Create `Dashboard/ManageUsers.jsx`:
  - Fetch all citizen users
  - Tabular view with name, email, role, subscription status
  - Block/Unblock button with confirmation dialog
  - Filter by subscription status, blocked status
  - Pagination

#### 5.4 Manage Staff Page
- [ ] Create `Dashboard/ManageStaff.jsx`:
  - Fetch all staff
  - Tabular view
  - Add Staff button (opens modal)
  - Update button (opens modal with pre-filled data)
  - Delete button (confirmation dialog)
- [ ] Create `AddStaffModal.jsx`:
  - Form with name, email, phone, photo, password
  - Submit to create staff in Firebase + DB
- [ ] Create `UpdateStaffModal.jsx`:
  - Pre-filled form
  - Update staff info

#### 5.5 Payments Page
- [ ] Create `Dashboard/Payments.jsx`:
  - Fetch all payments
  - Tabular view with user, type, amount, date, status
  - Filter by type (boost/subscription), status, date range
  - Download PDF invoice button per row
  - Optional: Chart showing monthly payments

#### 5.6 Admin Profile
- [ ] Create `Dashboard/AdminProfile.jsx`:
  - View and update admin info

**Commits for Phase 5:**
1. "feat(admin): create admin dashboard with stats and charts"
2. "feat(admin): implement all-issues page with assign/reject actions"
3. "feat(admin): build assign-staff modal with dropdown"
4. "feat(admin): create manage-users page with block/unblock"
5. "feat(admin): implement manage-staff page with CRUD operations"
6. "feat(admin): add staff modals for create and update"
7. "feat(admin): build payments page with filters"
8. "feat(admin): add admin profile page"

---

### **PHASE 6: Payments & PDF Invoices** (Priority: CRITICAL - Challenge Task)
*Estimated: 2-3 hours | Commits: 3-4*

#### 6.1 Stripe Integration UI
- [ ] Create `components/StripeCheckout.jsx`:
  - Stripe Elements provider
  - Card element
  - Handle payment confirmation
  - Loading states
- [ ] Integrate in boost flow (IssueDetails page)
- [ ] Integrate in subscription flow (Profile page)
- [ ] Test payment flow end-to-end

#### 6.2 PDF Invoice Generation
- [ ] Install `@react-pdf/renderer` or `jspdf` + `html2canvas`
- [ ] Create `components/InvoiceTemplate.jsx`:
  - Invoice layout with:
    - Company/app branding
    - Invoice number
    - Date
    - Payer info
    - Amount, type (boost/subscription)
    - Issue ID (if boost)
    - Transaction ID
- [ ] Add download button in Admin Payments page
- [ ] Add download button in User Profile page (for own payments)

**Commits for Phase 6:**
1. "feat(payments): integrate Stripe Elements for boost and subscription"
2. "feat(payments): create PDF invoice template"
3. "feat(payments): add invoice download to admin payments page"
4. "feat(payments): add invoice download to user profile"

---

### **PHASE 7: Missing Server Endpoints** (Priority: MEDIUM)
*Estimated: 1-2 hours | Commits: 2-3*

#### 7.1 User Profile Endpoints
- [ ] Add `GET /users/me` - Get current user profile
- [ ] Add `PATCH /users/me` - Update current user profile
- [ ] Add `GET /users/me/payments` - Get current user's payments
- [ ] Add `GET /admin/users` - Get all citizen users (admin only)

#### 7.2 Dashboard Stats Endpoints
- [ ] Add `GET /users/me/stats` - Get user's issue statistics
- [ ] Add `GET /staff/stats` - Get staff's statistics
- [ ] Add `GET /admin/stats` - Get admin dashboard statistics

**Commits for Phase 7:**
1. "feat(server): add user profile and stats endpoints"
2. "feat(server): add admin users list endpoint"

---

### **PHASE 8: Polish & UX Enhancements** (Priority: MEDIUM)
*Estimated: 2-3 hours | Commits: 5-8*

#### 8.1 Loading States & Skeletons
- [ ] Create loading skeletons for:
  - Issue cards
  - Tables
  - Dashboard stats
- [ ] Add loading spinners for buttons during mutations

#### 8.2 Empty States
- [ ] Create empty state components for:
  - No issues found
  - No assigned issues (staff)
  - No payments
  - Search results empty

#### 8.3 Toast Notifications
- [ ] Install `react-hot-toast` or `react-toastify`
- [ ] Add toasts for:
  - Login/Logout success/error
  - Register success/error
  - Issue CRUD operations
  - Payment success/error
  - Staff assignment
  - User block/unblock
  - All mutations

#### 8.4 Confirmation Dialogs
- [ ] Create reusable `ConfirmDialog.jsx` component
- [ ] Add confirmations for:
  - Delete issue
  - Delete staff
  - Block/unblock user
  - Reject issue

#### 8.5 Responsive Design
- [ ] Test and fix mobile responsiveness for:
  - All public pages
  - All dashboard pages
  - Modals and forms
  - Tables (horizontal scroll or stack)

**Commits for Phase 8:**
1. "style: add loading skeletons and spinners"
2. "style: create empty state components"
3. "feat: integrate toast notifications for all actions"
4. "feat: add confirmation dialogs for destructive actions"
5. "style: ensure full mobile responsiveness"

---

### **PHASE 9: Challenge Tasks** (Priority: CRITICAL - Required)
*Estimated: 2-3 hours | Commits: 3-4*

#### 9.1 Token Verification & Middleware ✅
- [x] Already implemented in `middleware/auth.js`

#### 9.2 Pagination ✅
- [x] Server-side pagination already implemented in `/issues` route
- [ ] Ensure UI has pagination controls

#### 9.3 Server-Side Search & Filters ✅
- [x] Server-side search already implemented (title, description, location)
- [x] Server-side filters already implemented (category, status, priority)
- [ ] Ensure UI has search and filter controls
- [ ] Add loading state during search/filter

#### 9.4 PDF Invoice Generation
- [ ] Already planned in Phase 6

**Commits for Phase 9:**
1. "feat: add pagination controls to all-issues page"
2. "feat: implement search and filter UI with loading states"

---

### **PHASE 10: Optional Tasks (Choose 2)** (Priority: LOW)
*Estimated: 2-3 hours | Commits: 2-4*

#### Option 1: Animations
- [ ] Install Framer Motion or AOS
- [ ] Add page transitions
- [ ] Add card hover animations
- [ ] Add modal enter/exit animations
- [ ] Add button click animations

#### Option 2: Axios Interceptors ✅
- [x] Already planned in Phase 1

#### Option 3: Dark/Light Theme
- [ ] Install theme context or use DaisyUI themes
- [ ] Create theme toggle button in navbar
- [ ] Persist theme preference in localStorage
- [ ] Test all pages in both themes

#### Option 4: Prevent Multiple Upvotes ✅
- [x] Already implemented on server-side
- [ ] Add visual feedback (disable button if already upvoted)

**Recommendation:** Choose Option 1 (Animations) + Option 3 (Dark/Light Theme)

**Commits for Phase 10:**
1. "feat: add Framer Motion animations to pages and components"
2. "feat: implement dark/light theme toggle with persistence"

---

### **PHASE 11: Environment Variables & Deployment** (Priority: CRITICAL)
*Estimated: 2-3 hours | Commits: 3-5*

#### 11.1 Environment Variables
- [ ] Create `.env.example` files for both client and server
- [ ] Document all required env variables
- [ ] Ensure no secrets in committed code
- [ ] Add `.env` to `.gitignore`

#### 11.2 Server Deployment (Vercel)
- [ ] Create `vercel.json` config
- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy server to Vercel
- [ ] Test all API endpoints on production

#### 11.3 Client Deployment (Firebase Hosting)
- [ ] Build production client (`npm run build`)
- [ ] Initialize Firebase Hosting
- [ ] Configure `firebase.json`
- [ ] Set production API URL in client env
- [ ] Deploy to Firebase Hosting
- [ ] Test full application flow on production

#### 11.4 Testing
- [ ] Test all user flows:
  - Registration → Login → Report Issue → View Issues
  - Admin: Assign Staff → Staff: Update Status
  - Subscription flow → Report more issues
  - Boost flow → Check priority ordering
  - Upvote flow
- [ ] Test on mobile devices
- [ ] Test with different user roles

**Commits for Phase 11:**
1. "chore: add env examples and update gitignore"
2. "deploy: configure Vercel for server deployment"
3. "deploy: configure Firebase Hosting for client"
4. "fix: production bug fixes and optimizations"

---

### **PHASE 12: README & Final Touches** (Priority: HIGH)
*Estimated: 1-2 hours | Commits: 2-3*

#### 12.1 README.md
- [ ] Create comprehensive README with:
  - Website name
  - Live site URL
  - Admin email & password
  - Staff email & password (with assigned issues)
  - Citizen email & password (free user with 2 issues posted)
  - At least 10 feature bullet points:
    1. Role-based authentication (Admin, Staff, Citizen)
    2. Google OAuth integration
    3. Real-time issue tracking with timeline
    4. Server-side pagination, search, and filtering
    5. Upvote system for issue prioritization
    6. Premium subscription with unlimited issue reporting
    7. Stripe payment integration for boost and subscription
    8. PDF invoice generation
    9. Staff assignment and status workflow management
    10. Admin dashboard with comprehensive statistics and charts
    11. Responsive design for mobile, tablet, desktop
    12. [Add 2 more based on optional features]
  - Technologies used
  - Installation instructions (optional)

#### 12.2 Code Cleanup
- [ ] Remove console.logs
- [ ] Remove commented code
- [ ] Fix linting errors
- [ ] Organize imports

#### 12.3 Final Testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Final mobile responsiveness check
- [ ] Check all toasts/notifications work
- [ ] Verify no Lorem Ipsum text anywhere

**Commits for Phase 12:**
1. "docs: create comprehensive README with features and credentials"
2. "chore: code cleanup and linting fixes"
3. "fix: final bug fixes and polish"

---

## 📊 Commit Requirements Tracking

### Client-Side Commits (Minimum: 20)
- Phase 1: 5 commits
- Phase 2: 8 commits
- Phase 3: 6 commits
- Phase 4: 4 commits
- Phase 5: 9 commits
- Phase 6: 4 commits
- Phase 8: 5 commits
- Phase 9: 2 commits
- Phase 10: 2 commits
- Phase 11: 2 commits
- Phase 12: 2 commits
**Total Estimated: 49 commits** ✅ (well above 20)

### Server-Side Commits (Minimum: 12)
- Already completed: ~6 commits (from git log)
- Phase 7: 2 commits
- Phase 11: 2 commits
- Phase 12: 1 commit
- Additional refinements: 3-5 commits
**Total Estimated: 14-16 commits** ✅ (above 12)

---

## 🎯 Recommended Implementation Order

### Week 1 (Days 1-3): Core Functionality
1. **Day 1**: Phase 1 (Client Infrastructure) + Phase 7 (Server endpoints)
2. **Day 2**: Phase 2 (Public Pages)
3. **Day 3**: Phase 3 (Citizen Dashboard) + Phase 6 (Payments/PDF)

### Week 2 (Days 4-6): Dashboards & Polish
4. **Day 4**: Phase 4 (Staff Dashboard) + Phase 5 (Admin Dashboard)
5. **Day 5**: Phase 8 (Polish) + Phase 9 (Challenge tasks verification)
6. **Day 6**: Phase 10 (Optional) + Phase 11 (Deployment) + Phase 12 (README)

---

## 🚨 Critical Path Items (Must Complete First)

1. ✅ AuthContext and authentication flow
2. ✅ Axios + API service layer
3. ✅ Protected routing
4. ✅ Citizen dashboard (Report Issue, My Issues)
5. ✅ Admin dashboard (Assign Staff, Manage Users/Staff)
6. ✅ Staff dashboard (Update status)
7. ✅ Stripe payment integration
8. ✅ PDF invoice generation
9. ✅ Search, filter, pagination UI
10. ✅ Deployment

---

## 📝 Submission Checklist

Before submitting, ensure:
- [ ] 20+ meaningful client commits
- [ ] 12+ meaningful server commits
- [ ] README.md with all required info
- [ ] Admin credentials working
- [ ] Staff credentials with assigned issues
- [ ] Citizen credentials (free, 2 issues posted)
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Private routes stay logged in after refresh
- [ ] Firebase/MongoDB secrets in env vars
- [ ] No Lorem Ipsum text
- [ ] Sweet alerts/toasts (no browser alerts)
- [ ] TanStack Query for all data fetching
- [ ] All challenge tasks completed
- [ ] 2 optional tasks completed
- [ ] Both deployments live and working
- [ ] Tested all user flows

---

## 🛠️ Tech Stack Reference

**Frontend:**
- React 19 + Vite
- TailwindCSS + DaisyUI
- TanStack Query
- React Router v7
- React Hook Form
- Firebase Auth
- Axios
- Swiper
- Stripe.js
- @react-pdf/renderer or jspdf
- react-hot-toast or react-toastify
- Framer Motion or AOS (optional)
- Recharts or Chart.js (for charts)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Firebase Admin SDK
- Stripe
- JWT verification

**Deployment:**
- Client: Firebase Hosting or Netlify/Vercel
- Server: Vercel or Render/Railway
- Database: MongoDB Atlas
- Image hosting: ImgBB or Cloudinary

---

## 💡 Tips for Success

1. **Commit frequently**: Make commits after each feature completion
2. **Test as you build**: Don't wait until the end to test
3. **Mobile-first**: Design for mobile from the start
4. **Reuse components**: Create reusable components to save time
5. **Use TypeScript types**: Better developer experience (optional)
6. **Error boundaries**: Add error boundaries for production
7. **Loading states**: Never leave users hanging
8. **Accessibility**: Add proper ARIA labels and keyboard navigation
9. **Performance**: Lazy load routes and components
10. **Deploy early**: Deploy to staging environment early to catch issues

---

## ⏱️ Estimated Total Time

- **Client Development**: 18-22 hours
- **Server Completion**: 3-4 hours
- **Integration & Testing**: 4-5 hours
- **Deployment & README**: 2-3 hours
- **Buffer for debugging**: 5-7 hours

**Total: 32-41 hours** (approximately 4-6 days of focused work)

---

## 🎉 Good Luck!

Follow this plan step by step, commit frequently, and you'll have an impressive, production-ready application. Remember to test each feature thoroughly before moving to the next phase.
