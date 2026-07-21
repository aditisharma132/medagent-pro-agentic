'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusSquare, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} relative`}>
            <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full pointer-events-none ${isDark ? 'bg-blue-900/30' : 'bg-blue-200/50'}`} />

            <div className={`z-10 w-full max-w-md p-10 rounded-3xl shadow-2xl border backdrop-blur-md ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-xl'}`}>
                <div className="flex flex-col items-center mb-8">
                    <div className={`p-4 rounded-2xl mb-5 ${isDark ? 'bg-indigo-900/50 text-blue-400' : 'bg-indigo-100 text-blue-600'}`}>
                        <PlusSquare size={48} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
                    <p className={`text-base mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to your MedAgent-Pro account</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input type="email" placeholder="doctor@hospital.com" className={`w-full pl-10 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`} />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                            <a href="#" className="text-xs text-blue-500 hover:underline font-medium">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input type="password" placeholder="••••••••" className={`w-full pl-10 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`} />
                        </div>
                    </div>

                    <button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <p className={`text-center text-sm mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Don't have an account? <Link href="/signup" className="text-blue-500 font-bold hover:underline">Sign Up here.</Link>
                </p>
                <div className="text-center mt-6">
                    <Link href="/" className={`text-sm font-medium hover:underline transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>&larr; Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );
}
