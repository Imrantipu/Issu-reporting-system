# Quick Development Checklist

## 🔥 TODAY'S PRIORITY (Start Here)

### Phase 1: Client Infrastructure (CRITICAL - Do First)
- [ ] Create `client/src/firebase/config.js`
- [ ] Create `client/src/context/AuthContext.jsx`
- [ ] Create `client/src/hooks/useAuth.js`
- [ ] Create `client/src/lib/axios.js`
- [ ] Create `client/src/lib/api.js` (all API calls)
- [ ] Create `client/src/routes/PrivateRoute.jsx`
- [ ] Update `client/src/App.jsx` with all routes
- [ ] Update `client/src/main.jsx` with providers

**Goal**: Get authentication and routing working end-to-end

---

## 📋 Component Checklist

### Layouts
- [ ] `layouts/DashboardLayout.jsx`

### Pages - Public
- [x] `pages/Home.jsx` (exists, needs completion)
- [x] `pages/Login.jsx` (exists, needs completion)
- [x] `pages/Register.jsx` (exists, needs completion)
- [x] `pages/AllIssues.jsx` (exists, needs completion)
- [x] `pages/IssueDetails.jsx` (exists, needs completion)
- [x] `pages/NotFound.jsx` (exists)

### Pages - Citizen Dashboard
- [ ] `pages/Dashboard/CitizenDashboard.jsx`
- [ ] `pages/Dashboard/MyIssues.jsx`
- [x] `pages/Dashboard/ReportIssue.jsx` (exists, needs completion)
- [ ] `pages/Dashboard/Profile.jsx`

### Pages - Staff Dashboard
- [ ] `pages/Dashboard/StaffDashboard.jsx`
- [ ] `pages/Dashboard/AssignedIssues.jsx`
- [ ] `pages/Dashboard/StaffProfile.jsx`

### Pages - Admin Dashboard
- [ ] `pages/Dashboard/AdminDashboard.jsx`
- [ ] `pages/Dashboard/AdminAllIssues.jsx`
- [ ] `pages/Dashboard/ManageUsers.jsx`
- [ ] `pages/Dashboard/ManageStaff.jsx`
- [ ] `pages/Dashboard/Payments.jsx`
- [ ] `pages/Dashboard/AdminProfile.jsx`

### Components - Home
- [x] `components/Home/BannerSection.jsx` (exists)
- [ ] `components/Home/LatestResolvedIssues.jsx`
- [ ] `components/Home/FeaturesSection.jsx`
- [ ] `components/Home/HowItWorksSection.jsx`
- [ ] `components/Home/ExtraSection1.jsx`
- [ ] `components/Home/ExtraSection2.jsx`

### Components - Issues
- [ ] `components/Issues/IssueCard.jsx`
- [ ] `components/Issues/Timeline.jsx`
- [ ] `components/Issues/EditIssueModal.jsx`

### Components - Admin
- [ ] `components/Admin/AssignStaffModal.jsx`
- [ ] `components/Admin/AddStaffModal.jsx`
- [ ] `components/Admin/UpdateStaffModal.jsx`

### Components - Shared
- [ ] `components/ConfirmDialog.jsx`
- [ ] `components/LoadingSkeleton.jsx`
- [ ] `components/EmptyState.jsx`
- [ ] `components/Pagination.jsx`
- [ ] `components/StatsCard.jsx`
- [ ] `components/StripeCheckout.jsx`
- [ ] `components/InvoiceTemplate.jsx`

### Shared
- [x] `pages/Shared/Navbar/Navbar.jsx` (exists, needs completion)
- [x] `pages/Shared/Footer/Footer.jsx` (exists, needs completion)

---

## 🔌 API Endpoints Status

### Server Routes (Completed ✅)
- ✅ POST `/issues` - Create issue
- ✅ GET `/issues` - List issues (paginated, searchable, filterable)
- ✅ GET `/issues/:id` - Get issue
- ✅ PATCH `/issues/:id` - Update issue
- ✅ DELETE `/issues/:id` - Delete issue
- ✅ POST `/issues/:id/upvote` - Upvote issue
- ✅ POST `/admin/issues/:id/assign-staff` - Assign staff
- ✅ POST `/admin/issues/:id/reject` - Reject issue
- ✅ GET `/admin/staff` - List staff
- ✅ POST `/admin/staff` - Create staff
- ✅ PATCH `/admin/staff/:id` - Update staff
- ✅ DELETE `/admin/staff/:id` - Delete staff
- ✅ POST `/admin/users/:id/block` - Block user
- ✅ POST `/admin/users/:id/unblock` - Unblock user
- ✅ GET `/staff/issues` - List assigned issues
- ✅ POST `/staff/issues/:id/status` - Change status
- ✅ POST `/payments/boost-intent` - Create boost payment
- ✅ POST `/payments/boost/confirm` - Confirm boost
- ✅ POST `/payments/subscription-intent` - Create subscription payment
- ✅ POST `/payments/subscription/confirm` - Confirm subscription
- ✅ GET `/payments` - List all payments (admin)

### Missing Server Routes (TODO)
- [ ] GET `/users/me` - Get current user
- [ ] PATCH `/users/me` - Update current user
- [ ] GET `/users/me/payments` - Get user's payments
- [ ] GET `/admin/users` - List all citizens
- [ ] GET `/users/me/stats` - User statistics
- [ ] GET `/staff/stats` - Staff statistics
- [ ] GET `/admin/stats` - Admin statistics

---

## ✅ Requirements Tracker

### Main Requirements
- [ ] 20+ meaningful client commits
- [ ] 12+ meaningful server commits (currently ~6)
- [ ] README.md with:
  - [ ] Website name
  - [ ] Admin email & password
  - [ ] Live site URL
  - [ ] 10+ feature bullet points
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Dashboard responsive
- [ ] Private routes persist after refresh
- [ ] Firebase/MongoDB secrets in env vars
- [ ] No Lorem Ipsum text
- [ ] Sweet alerts/toasts (not browser alert)
- [ ] TanStack Query for all data fetching

### Challenge Tasks (ALL REQUIRED)
- ✅ Token verification & role-based middleware (done)
- ✅ Server-side pagination (done)
- [ ] Pagination UI controls
- ✅ Server-side search & filter (done)
- [ ] Search & filter UI with loader
- [ ] Downloadable PDF invoices (admin payments page)
- [ ] Downloadable PDF invoices (user profile page)

### Optional Tasks (Choose 2)
- [ ] Option 1: Animations (Framer Motion or AOS)
- [ ] Option 2: Axios interceptors (planned in infrastructure)
- [ ] Option 3: Dark/Light theme
- [ ] Option 4: Prevent multiple upvotes UI feedback

**Recommended**: Choose Options 1 & 3 (Animations + Dark Theme)

---

## 📦 Dependencies to Install (Client)

Check if these are missing:
```bash
cd client
npm install react-hot-toast
npm install recharts  # or chart.js react-chartjs-2
npm install @react-pdf/renderer  # or jspdf html2canvas
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install framer-motion  # if choosing animations optional task
```

---

## 🌍 Environment Variables Setup

### Server `.env` (check you have all)
```
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
ALLOWED_ORIGINS=http://localhost:5173,https://your-deployed-client.web.app
PORT=5000
APP_NAME=Public Infrastructure Issue Reporting
```

### Client `.env` (create this)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_IMGBB_API_KEY=
```

---

## 🎯 Daily Goals

### Day 1
- [ ] Complete Phase 1 (Client Infrastructure)
- [ ] Complete missing server endpoints (Phase 7)
- [ ] Test: Can login/register and make authenticated API calls

### Day 2
- [ ] Complete all public pages (Phase 2)
- [ ] Test: Can browse issues, view details, search, filter

### Day 3
- [ ] Complete Citizen Dashboard (Phase 3)
- [ ] Complete Payment integration (Phase 6)
- [ ] Test: Can report issues, edit, delete, subscribe, boost

### Day 4
- [ ] Complete Staff Dashboard (Phase 4)
- [ ] Complete Admin Dashboard (Phase 5)
- [ ] Test: Staff can update status, Admin can assign/manage

### Day 5
- [ ] Complete Polish & UX (Phase 8)
- [ ] Verify Challenge Tasks (Phase 9)
- [ ] Complete 2 Optional Tasks (Phase 10)
- [ ] Test: All toasts, confirmations, loading states work

### Day 6
- [ ] Deploy client and server (Phase 11)
- [ ] Write README (Phase 12)
- [ ] Final testing on production
- [ ] Submit assignment

---

## 🧪 Testing Checklist

### User Flows to Test
- [ ] Register → Auto login → Redirect to home
- [ ] Login with email/password → Redirect to previous page
- [ ] Login with Google → Redirect to previous page
- [ ] Logout → Clear token → Redirect to home
- [ ] Report issue (free user) → 3 issue limit works
- [ ] Subscribe → Stripe payment → Premium status → Unlimited issues
- [ ] Report issue (premium user) → No limit
- [ ] Edit issue (pending) → Updates in DB and UI
- [ ] Delete issue → Removes from DB and UI
- [ ] Upvote issue → Count increases → Can't upvote again
- [ ] Boost issue → Stripe payment → Priority changes → Appears first
- [ ] Admin assigns staff → Staff sees issue in dashboard
- [ ] Staff changes status → Timeline updates → Transitions enforced
- [ ] Admin blocks user → User can't submit/edit/upvote
- [ ] Admin creates staff → Staff can login
- [ ] Admin deletes staff → Staff issues unassigned
- [ ] Search issues → Results match
- [ ] Filter issues → Results match
- [ ] Pagination → Page changes show different issues
- [ ] Download invoice → PDF generates correctly
- [ ] Responsive on mobile → All pages work
- [ ] Private routes → Stay logged in after refresh
- [ ] Private routes → Redirect to login if not authenticated

---

## 🚀 Deployment Steps

### Server (Vercel)
1. [ ] Create `vercel.json`
2. [ ] Push to GitHub
3. [ ] Connect repo to Vercel
4. [ ] Add environment variables
5. [ ] Deploy
6. [ ] Test health endpoint

### Client (Firebase Hosting)
1. [ ] Update API URL to production in `.env`
2. [ ] Build: `npm run build`
3. [ ] Install Firebase CLI: `npm install -g firebase-tools`
4. [ ] Login: `firebase login`
5. [ ] Init: `firebase init hosting`
6. [ ] Deploy: `firebase deploy`
7. [ ] Test on live URL

---

## 📝 Submission Format

```
1. Admin Email: admin@example.com
2. Admin Password: Admin123!
3. Live Site Link (Client): https://your-app.web.app
4. Client GitHub Repo: https://github.com/username/client-repo
5. Server GitHub Repo: https://github.com/username/server-repo
6. One Staff Email & Password: staff1@example.com / Staff123!
   (This staff has 3 assigned issues and has worked on them)
7. One citizen Email & Password: citizen1@example.com / Citizen123!
   (This is a free user who has already posted 2 issues)
```

---

## 💡 Quick Tips

- **Commit after every feature**: Don't batch commits
- **Test immediately**: Don't wait to test at the end
- **Use existing components**: Don't reinvent the wheel
- **Copy-paste smartly**: Reuse patterns from working pages
- **Console.log everything**: Debug as you go
- **Read error messages**: They usually tell you what's wrong
- **Deploy early**: Catch deployment issues early
- **Ask for help**: If stuck for >30 mins, search or ask

---

## 🎨 UI/UX Reminders

- Use DaisyUI components (btn, card, badge, modal, etc.)
- Consistent color scheme for status badges:
  - Pending: yellow/warning
  - In-Progress: blue/info
  - Working: purple/primary
  - Resolved: green/success
  - Closed: gray/neutral
  - Rejected: red/error
- Loading states: skeleton or spinner
- Empty states: friendly message + call-to-action
- Confirmations: always for destructive actions
- Toasts: success (green), error (red), info (blue)

---

## 🔗 Useful Resources

- **TanStack Query**: https://tanstack.com/query/latest/docs/react/overview
- **React Router v7**: https://reactrouter.com/
- **Stripe React**: https://stripe.com/docs/stripe-js/react
- **React PDF**: https://react-pdf.org/
- **DaisyUI**: https://daisyui.com/components/
- **Framer Motion**: https://www.framer.com/motion/
- **React Hot Toast**: https://react-hot-toast.com/

---

Good luck! 🚀 You've got this!
