import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await API.post('/auth/register', { email, password });
            alert("Registration successful! You can now sign in.");
            navigate('/');
        } catch (err) {
            // Backend se aane wala error ya default English message
            const serverMsg = err.response?.data?.message;
            if (serverMsg && serverMsg.toLowerCase().includes('registered')) {
                setError("Email is already registered. Please sign in.");
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="w-full max-w-md bg-[#1e293b] rounded-2xl border border-slate-800 p-8 shadow-2xl">
                <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Create Account </h2>
                
                {/* Error message in professional English */}
                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center rounded-lg font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500" 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 mt-2"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-slate-400 text-center mt-6">
                    Already have an account? 
                    <Link to="/" className="text-blue-500 hover:underline font-medium ml-1">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;