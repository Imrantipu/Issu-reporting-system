import React from 'react';
import { useForm } from 'react-hook-form';

import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import SocialLogin from './SocialLogin';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();


    const handleLogin = (data) => {
        console.log('form data', data);
        signInUser(data.email, data.password)
            .then(result => {
                console.log(result.user)
                navigate(location?.state || '/')
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className="section-shell grid min-h-[75vh] items-center gap-10 py-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
                <span className="eyebrow">Welcome back</span>
                <h1 className="text-4xl font-bold text-slate-900">Sign in to keep your reports moving</h1>
                <p className="max-w-2xl text-lg text-slate-600">
                    Track updates, prioritize urgent issues, and stay in sync with city teams. Your dashboard keeps every report transparent.
                </p>
                <div className="grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm shadow-cyan-100/60">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Real-time status changes
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm shadow-cyan-100/60">
                        <span className="h-2 w-2 rounded-full bg-cyan-500" />
                        Smart reminders for your reports
                    </div>
                </div>
            </div>

            <div className="glass-panel w-full max-w-xl justify-self-end rounded-3xl border border-slate-100/80 bg-white/85 p-8 shadow-2xl shadow-cyan-200/40">
                <div className="mb-6 space-y-1 text-center">
                    <h3 className="text-2xl font-bold text-slate-900">Login to your account</h3>
                    <p className="text-slate-600">Access your reporting workspace in seconds</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                            placeholder="you@example.com"
                        />
                        {errors.email?.type === 'required' && <p className='text-sm text-rose-600'>Email is required</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                            <label>Password</label>
                            <a className="text-cyan-700 hover:text-cyan-800">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            {...register('password', { required: true, minLength: 6 })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                            placeholder="••••••••"
                        />
                        {errors.password?.type === 'minLength' && <p className='text-sm text-rose-600'>Password must be 6 characters or longer</p>}
                    </div>

                    <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border-none bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-100">
                        Login
                        <span aria-hidden className="text-base">↗</span>
                    </button>
                </form>

                <div className="mt-6">
                    <SocialLogin />
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                    New to Zap Shift?{' '}
                    <Link
                        state={location.state}
                        className='font-semibold text-cyan-700 underline decoration-2 underline-offset-4'
                        to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
