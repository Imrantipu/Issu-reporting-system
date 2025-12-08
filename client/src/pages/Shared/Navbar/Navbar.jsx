// src/pages/Shared/Navbar/Navbar.jsx

import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import apiClient from '../../../lib/apiClient';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logOut, loading } = useAuth();
    const [dbUser, setDbUser] = useState(null);
    const [fetchingUser, setFetchingUser] = useState(false);
    const navigate = useNavigate();

    // Fetch user from database to get role
    useEffect(() => {
        const fetchUser = async () => {
            if (user) {
                setFetchingUser(true);
                try {
                    const response = await apiClient.get('/users/me');
                    setDbUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                } finally {
                    setFetchingUser(false);
                }
            } else {
                setDbUser(null);
            }
        };

        fetchUser();
    }, [user]);

    const navItems = [
        { to: '/', label: 'Home' },
        { to: '/all-issues', label: 'All Issues' },
        { to: '/reports', label: 'Reports' },
        { to: '/resources', label: 'Resources' },
    ];

    const getDashboardPath = () => {
        if (!dbUser) return '/dashboard/citizen';
        if (dbUser.role === 'admin') return '/dashboard/admin';
        if (dbUser.role === 'staff') return '/dashboard/staff';
        return '/dashboard/citizen';
    };

    const handleLogout = async () => {
        try {
            await logOut();
            setDbUser(null);
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    };
    
    // Show spinner while checking auth status
    if (loading || fetchingUser) {
        return (
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
                <div className="section-shell">
                    <div className="navbar mt-4 rounded-2xl border border-white/60 bg-white/70 shadow-lg shadow-slate-200/70">
                        <span className="loading loading-dots loading-md mx-auto text-cyan-600" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-0 z-50 bg-gradient-to-b from-white/85 to-white/40 backdrop-blur-xl">
            <div className="section-shell">
                <div className="navbar mt-4 rounded-2xl border border-white/60 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur-2xl">

                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle bg-white/60 lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] w-60 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-lg shadow-slate-200/70 backdrop-blur">
                                {navItems.map((item) => (
                                    <li key={item.to}>
                                        <NavLink
                                            to={item.to}
                                            className={({ isActive }) =>
                                                `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-slate-900 text-white shadow-lg shadow-cyan-200/60'
                                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                }`
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 🌟 IMPROVED LOGO SECTION 🌟 */}
                        <Link to="/" className="btn btn-ghost gap-3 text-xl font-black tracking-tight text-slate-900 hover:bg-transparent">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-200/60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.327L13.789 5.071a2 2 0 00-3.578 0L3.341 16.673A2 2 0 005.13 20z" />
                                </svg>
                            </span>
                            <div className="text-left">
                                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Civic Care</div>
                                <div className="text-lg leading-none">Report Hub</div>
                            </div>
                        </Link>
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal rounded-full bg-white/60 px-2 py-1 text-sm font-semibold shadow-sm shadow-slate-200/70">
                            {navItems.map((item) => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `rounded-full px-4 py-2 transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-slate-900 text-white shadow-lg shadow-cyan-200/60'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. User Actions (End) - DYNAMIC LOGIN/PROFILE SECTION */}
                    <div className="navbar-end">
                        {user ? (
                            /* Logged In View: Profile Picture Dropdown */
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom border border-white/50 bg-white/70 shadow-sm shadow-slate-200/60" data-tip={user.displayName || user.email}>
                                    <div className="w-10 rounded-full">
                                        <img 
                                            alt="User Profile" 
                                            // Use user.photoURL if available, otherwise fallback to a default image
                                            src={user.photoURL || 'https://i.ibb.co/L8Gj18j/user-placeholder.jpg'} 
                                        />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] w-60 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-xl shadow-slate-200/70 backdrop-blur">
                                    {/* User Name & Role */}
                                    <li className="menu-title">
                                        <div className="flex items-center justify-between">
                                            <span className='text-md font-semibold text-slate-900'>
                                                {dbUser?.name || user.displayName || "User"}
                                            </span>
                                            {dbUser?.premium && (
                                                <span className="badge badge-xs badge-accent">Premium</span>
                                            )}
                                        </div>
                                        {dbUser?.role && (
                                            <span className={`badge badge-xs mt-1 ${
                                                dbUser.role === 'admin' ? 'badge-error' :
                                                dbUser.role === 'staff' ? 'badge-warning' :
                                                'badge-info'
                                            }`}>
                                                {dbUser.role}
                                            </span>
                                        )}
                                    </li>

                                    {/* Dashboard Link */}
                                    <li>
                                        <Link to={getDashboardPath()} className="justify-between rounded-lg px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100">
                                            Dashboard
                                        </Link>
                                    </li>

                                    {/* Logout Button */}
                                    <li><a onClick={handleLogout} className="rounded-lg px-3 py-2 font-semibold text-rose-600 hover:bg-rose-50">Logout</a></li>
                                </ul>
                            </div>
                        ) : (
                            /* Logged Out View: Login and Registration Buttons */
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn h-11 min-h-0 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-200/70 hover:-translate-y-0.5 hover:shadow-md hover:shadow-cyan-100 transition">
                                    Login
                                </Link>
                                <Link to="/register" className="btn h-11 min-h-0 rounded-full border-none bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-100 transition">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
