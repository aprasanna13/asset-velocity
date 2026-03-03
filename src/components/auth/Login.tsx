import React, { useState } from 'react';
import logo from '../../assets/Logo.png';
import { Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'test123' && password === 'test123') {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-900/20 mb-4">
                        <img src={logo} alt="Velocity Logo" className="w-8 h-8" />
                    </div>
                    <h1 className="font-black tracking-[0.2em] text-2xl text-white uppercase">Velocity</h1>
                    <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">Secure Access Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Username</label>
                        <div className="flex items-center gap-4 px-4 py-3 rounded-xl border bg-zinc-900/50 border-zinc-800/50 focus-within:border-orange-500/50 transition-colors">
                            <UserIcon size={18} className="text-zinc-600" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="bg-transparent border-none outline-none text-sm placeholder-zinc-700 w-full text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Password</label>
                        <div className="flex items-center gap-4 px-4 py-3 rounded-xl border bg-zinc-900/50 border-zinc-800/50 focus-within:border-orange-500/50 transition-colors">
                            <Lock size={18} className="text-zinc-600" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="bg-transparent border-none outline-none text-sm placeholder-zinc-700 w-full text-white"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl text-xs font-black transition-all shadow-lg shadow-orange-900/20 active:scale-[0.98] uppercase tracking-[0.2em]"
                    >
                        Authenticate
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Agentic Asset Management System v1.0</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
