import React, { useState } from 'react';
import API from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            // FIXED: Professional English Error Message
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="w-full max-w-md bg-[#1e293b] rounded-2xl border border-slate-800 p-8 shadow-xl">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-white flex justify-center items-center gap-2">
                        Welcome Back 🔑
                    </h2>
                    {/* FIXED: Changed to English */}
                    <p className="text-sm text-slate-400 mt-2">Login to manage your tasks efficiently</p>
                </div>

                {/* Error Alert Box */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 mt-2"
                    >
                        Sign In
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center mt-6">
                    {/* FIXED: Changed to English */}
                    <p className="text-sm text-slate-400">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-500 hover:underline font-medium">
                            Register here
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;