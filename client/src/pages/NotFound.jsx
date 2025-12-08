import React from 'react';
import { Link } from "react-router";
import notFoundImage from '../assets/error-404.png';

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-cyan-200/40 blur-3xl" aria-hidden="true" />
        <img src={notFoundImage} alt="Not found" className="relative mx-auto h-48 w-48 object-contain" />
      </div>
      <div className="space-y-2">
        <p className="eyebrow">404</p>
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="max-w-md text-slate-600">The page you’re looking for doesn’t exist or has moved. Let’s guide you back.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 hover:shadow-xl">
          Back to Home
        </Link>
        <Link className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100" to="/all-issues">
          View All Issues
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
