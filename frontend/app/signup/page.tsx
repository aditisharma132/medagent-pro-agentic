'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusSquare, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Signup() {
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
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} relative py-12`}>
            <div className={`fixed top-[-20%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full pointer-events-none ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-200/50'}`} />

            <div className={`z-10 w-full max-w-md p-10 rounded-3xl shadow-2xl border backdrop-blur-md ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-xl'}`}>
                <div className="flex flex-col items-center mb-8">
                    <div className={`p-4 rounded-2xl mb-5 ${isDark ? 'bg-blue-900/50 text-indigo-400' : 'bg-blue-100 text-indigo-600'}`}>
                        <PlusSquare size={48} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
                    <p className={`text-base mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Join the MedAgent-Pro platform</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                        <div className="relative">
                            <User className={`absolute left-3 top-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input type="text" placeholder="Dr. John Doe" className={`w-full pl-10 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`} />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input type="email" placeholder="doctor@hospital.com" className={`w-full pl-10 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`} />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input type="password" placeholder="••••••••" className={`w-full pl-10 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`} />
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                <p className={`text-center text-sm mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Already have an account? <Link href="/login" className="text-indigo-400 font-bold hover:underline">Sign In here.</Link>
                </p>
                <div className="text-center mt-6">
                    <Link href="/" className={`text-sm font-medium hover:underline transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>&larr; Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );
}
