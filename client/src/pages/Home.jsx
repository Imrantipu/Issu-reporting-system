// src/pages/Home.jsx (Initial Structure)

import React from 'react';
import { Link } from 'react-router';
import BannerSection from '../components/Home/BannerSection';

const resolvedIssues = [
  {
    id: 1,
    title: 'Repaired major pothole cluster',
    category: 'Road Safety',
    status: 'Resolved',
    impact: 'Reduced detours for 3k commuters',
    updatedAt: 'Today, 09:20 AM',
    location: 'Downtown, Ward 4',
  },
  {
    id: 2,
    title: 'Streetlights restored near Riverside',
    category: 'Lighting',
    status: 'Resolved',
    impact: 'Improved visibility across 1.2km',
    updatedAt: 'Yesterday, 6:45 PM',
    location: 'Riverside Avenue',
  },
  {
    id: 3,
    title: 'Debris cleared & bins added',
    category: 'Sanitation',
    status: 'Resolved',
    impact: '4 new bins + scheduled weekly cleanups',
    updatedAt: 'Mon, 3:10 PM',
    location: 'Market Street',
  },
  {
    id: 4,
    title: 'Leaking hydrant sealed',
    category: 'Water',
    status: 'In-Progress',
    impact: 'Flow stabilized, final checks pending',
    updatedAt: 'Today, 08:10 AM',
    location: '8th Avenue',
  },
  {
    id: 5,
    title: 'Traffic signal recalibrated',
    category: 'Traffic',
    status: 'Resolved',
    impact: 'Reduced peak-hour congestion by 12%',
    updatedAt: 'Sun, 5:20 PM',
    location: 'Central Cross',
  },
  {
    id: 6,
    title: 'Sidewalk tiles replaced',
    category: 'Footpath',
    status: 'Pending',
    impact: 'Materials staged, work begins tonight',
    updatedAt: 'Tue, 11:45 AM',
    location: 'Old Town Plaza',
  },
];

const features = [
  { title: 'Full issue lifecycle', desc: 'Track every step from report to resolution with transparent timelines.' },
  { title: 'Priority boosting', desc: 'Citizens can boost urgent issues; teams see priority instantly.' },
  { title: 'Smart notifications', desc: 'Real-time alerts for status changes, assignments, and payments.' },
  { title: 'Role-based control', desc: 'Admin, Staff, and Citizen views tailored to their workflows.' },
];

const howItWorks = [
  { step: '01', title: 'Report', desc: 'Capture details, photos, and location in under a minute.' },
  { step: '02', title: 'Assign', desc: 'Admin validates and assigns to the right staff member.' },
  { step: '03', title: 'Update', desc: 'Staff updates status and progress with timeline entries.' },
  { step: '04', title: 'Resolve', desc: 'Citizen gets confirmation and can track closure history.' },
];

const extraHighlights = [
  { title: 'City-wide analytics', desc: 'Heatmaps and trends reveal hotspots for preventative maintenance.', badge: 'Data' },
  { title: 'Community trust', desc: 'Upvotes and transparent SLAs keep the process accountable.', badge: 'Trust' },
];

const premiumCta = {
  title: 'Upgrade to premium for faster responses',
  desc: 'Premium citizens skip the 3-issue limit and get priority routing for urgent reports.',
  bullets: ['Unlimited issue submissions', 'Priority in support queue', 'Receipts for boosted issues'],
};

const statusOrder = {
  Resolved: 0,
  'In-Progress': 1,
  Pending: 2,
  Closed: 3,
};

const Home = () => {
  const sortedIssues = [...resolvedIssues].sort(
    (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
  );

  return (
    <div className='space-y-14'>
      {/* 1. Banner Section */}
      <BannerSection /> 
      
      {/* 2. Latest Resolved Issues */}
      <section className='space-y-6'>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className='space-y-2'>
            <span className="eyebrow">Fresh updates</span>
            <div>
              <h2 className='text-3xl font-bold text-slate-900'>Latest resolved issues</h2>
              <p className='text-slate-600'>A quick snapshot of what the city teams have closed recently.</p>
            </div>
          </div>
          <Link to="/all-issues" className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100'>
            See full log
            <span aria-hidden className='text-base'>→</span>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedIssues.map((issue) => (
            <article key={issue.id} className="glass-panel group relative overflow-hidden rounded-2xl border border-slate-100/70 bg-white/80 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-100/50">
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                  issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                  issue.status === 'In-Progress' ? 'bg-cyan-50 text-cyan-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {issue.status}
                </span>
                <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">{issue.category}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{issue.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{issue.impact}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {issue.location}
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  {issue.updatedAt}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm font-semibold text-cyan-700">
                <Link to={`/issues/${issue.id}`} className="flex items-center gap-2 transition-all hover:gap-3">
                  View details
                  <span aria-hidden className="transition group-hover:translate-x-1">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Application Features Section */}
      <section className="space-y-5">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Platform features</span>
          <h2 className="text-3xl font-bold text-slate-900">Built for speed, trust, and clarity</h2>
          <p className="max-w-2xl text-slate-600">Every role gets the right tools: citizens report, staff act, admins orchestrate.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="glass-panel rounded-2xl border border-slate-100/70 bg-white/85 p-6 shadow-lg shadow-cyan-200/40">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white text-sm font-semibold">★</span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="space-y-5">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">How it works</span>
          <h2 className="text-3xl font-bold text-slate-900">From report to resolution</h2>
          <p className="max-w-2xl text-slate-600">Clear steps that keep everyone aligned and accountable.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {howItWorks.map((item) => (
            <div key={item.step} className="glass-panel flex flex-col gap-3 rounded-2xl border border-slate-100/70 bg-white/85 p-5 shadow-lg shadow-cyan-200/40">
              <span className="text-sm font-semibold text-cyan-700">{item.step}</span>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Extra sections */}
      <section className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-8 shadow-2xl shadow-cyan-200/40">
          <div className="flex items-center gap-2">
            <span className="eyebrow">Impact</span>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">A platform designed for data-driven cities</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {extraHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100/80 bg-white/90 p-5 shadow-sm shadow-cyan-100/60">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-cyan-700">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-700">{item.badge}</span>
                  Insight
                </div>
                <h4 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl shadow-cyan-200/30">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
            <span className="rounded-full bg-white/10 px-3 py-1 text-cyan-100">Premium</span>
            Fast lane
          </div>
          <h3 className="mt-4 text-2xl font-bold text-white">{premiumCta.title}</h3>
          <p className="mt-3 text-slate-200">{premiumCta.desc}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-100">
            {premiumCta.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-emerald-400" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <Link to="/login" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5 hover:shadow-xl">
            Get premium access
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
