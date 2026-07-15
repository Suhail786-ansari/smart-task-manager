import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="w-full max-w-md bg-[#1e293b] rounded-2xl border border-slate-800 p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back </h2>
                {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center rounded-lg">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
                    <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">Sign In</button>
                </form>
                <p className="text-sm text-slate-400 text-center mt-4">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link></p>
            </div>
        </div>
    );
};
export default Login;