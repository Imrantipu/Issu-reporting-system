import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="mt-10 bg-slate-900 text-slate-100">
      <div className="section-shell grid gap-8 py-10 md:grid-cols-[1.2fr,1fr,1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-200/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.327L13.789 5.071a2 2 0 00-3.578 0L3.341 16.673A2 2 0 005.13 20z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Civic Care</p>
              <p className="text-lg font-bold text-white">Report Hub</p>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Report, track, and resolve public infrastructure issues with full transparency across citizens, staff, and admins.
          </p>
          <div className="flex gap-3 text-sm text-slate-300">
            <span className="rounded-full bg-white/10 px-3 py-1">Secure</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Responsive</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Data-driven</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Navigate</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all-issues">All Issues</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/resources">Resources</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Stay updated</h3>
          <p className="text-sm text-slate-300">Get alerts when issues near you are resolved.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
            <button className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-200/60 transition hover:-translate-y-0.5 hover:shadow-xl">
              Notify me
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Civic Care Report Hub. Built for transparent cities.
      </div>
    </footer>
  );
};

export default Footer;
