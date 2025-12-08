import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import SocialLogin from './SocialLogin';
import toast from 'react-hot-toast';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleRegistration = async (data) => {
        setLoading(true);
        const profileImg = data.photo[0];

        try {
            // Register user
            const result = await registerUser(data.email, data.password);

            // Upload image
            const formData = new FormData();
            formData.append('image', profileImg);
            const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
            const imageRes = await axios.post(image_API_URL, formData);

            // Update profile
            const userProfile = {
                displayName: data.name,
                photoURL: imageRes.data.data.url
            };
            await updateUserProfile(userProfile);

            toast.success('Registration successful! Welcome aboard!');
            navigate(location.state || '/');
        } catch (error) {
            console.error(error);
            const errorMessage = error.code === 'auth/email-already-in-use'
                ? 'Email already in use'
                : error.message || 'Registration failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="section-shell grid min-h-[80vh] items-center gap-10 py-12 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-4">
                <span className="eyebrow">Create your profile</span>
                <h1 className="text-4xl font-bold text-slate-900">Join the public reporting network</h1>
                <p className="max-w-2xl text-lg text-slate-600">
                    Register once to report, track, and collaborate with municipal teams. Your identity helps us prioritize responses faster.
                </p>
                <div className="grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm shadow-cyan-100/60">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Verified updates from city staff
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm shadow-cyan-100/60">
                        <span className="h-2 w-2 rounded-full bg-cyan-500" />
                        Save locations & categories
                    </div>
                </div>
            </div>

            <div className="glass-panel w-full max-w-xl justify-self-end rounded-3xl border border-slate-100/80 bg-white/85 p-8 shadow-2xl shadow-cyan-200/40">
                <div className="mb-6 space-y-1 text-center">
                    <h3 className="text-2xl font-bold text-slate-900">Create an account</h3>
                    <p className="text-slate-600">We’ll personalize your dashboard after a quick setup.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(handleRegistration)}>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                            placeholder="Alex Jordan"
                        />
                        {errors.name?.type === 'required' && <p className='text-sm text-rose-600'>Name is required.</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Profile Photo</label>
                        <input
                            type="file"
                            {...register('photo', { required: true })}
                            className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                        />
                        {errors.photo?.type === 'required' && <p className='text-sm text-rose-600'>Photo is required.</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                            placeholder="you@example.com"
                        />
                        {errors.email?.type === 'required' && <p className='text-sm text-rose-600'>Email is required.</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: true,
                                minLength: 6,
                                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                            })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                            placeholder="At least 6 characters"
                        />
                        {
                            errors.password?.type === 'required' && <p className='text-sm text-rose-600'>Password is required.</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className='text-sm text-rose-600'>
                                Password must be 6 characters or longer
                            </p>
                        }
                        {
                            errors.password?.type === 'pattern' && <p className='text-sm text-rose-600'>Password must have at least one uppercase, one lowercase, one number, and one special character.</p>
                        }
                    </div>

                    <button
                        disabled={loading}
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border-none bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Registering...
                            </>
                        ) : (
                            <>
                                Register
                                <span aria-hidden className="text-base">↗</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6">
                    <SocialLogin />
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link
                        state={location.state}
                        className='font-semibold text-cyan-700 underline decoration-2 underline-offset-4'
                        to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
