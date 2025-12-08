// src/layouts/RootLayout.jsx

import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Shared/Navbar/Navbar'; // Adjust path if needed
import Footer from '../pages/Shared/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop';


const RootLayout = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
            <div
                className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-200/60 via-white/80 to-transparent blur-3xl"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none fixed inset-y-0 right-0 w-72 bg-gradient-to-l from-emerald-100/50 via-white/60 to-transparent blur-3xl"
                aria-hidden="true"
            />
            <div className="relative z-10 flex min-h-screen flex-col">
                {/* The Navbar goes here */}
                <Navbar />
                
                {/* The content of the current route (Home, All Issues, etc.) renders here */}
                <main className="section-shell flex-grow pb-16 pt-10">
                    <ScrollToTop />
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default RootLayout;
