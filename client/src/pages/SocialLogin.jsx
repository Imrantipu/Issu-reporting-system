import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const SocialLogin = () => {
    const { signInGoogle } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = () => {
        setLoading(true);
        signInGoogle()
            .then(result => {
                toast.success('Signed in with Google successfully!');
                navigate(location.state || '/');
            })
            .catch(error => {
                console.error(error);
                toast.error(error.message || 'Google sign-in failed');
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className='text-center'>
            <p className='mb-3 text-sm font-semibold text-slate-600'>Or continue with</p>
            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <span className="loading loading-spinner loading-sm text-cyan-600"></span>
                        Signing in...
                    </>
                ) : (
                    <>
                        <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Continue with Google
                    </>
                )}
            </button>
        </div>
    );
};

export default SocialLogin;
