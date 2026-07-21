'use client';
import { useState, useEffect } from 'react';
import { Users, Activity, ArrowLeft, ShieldCheck, Database, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [authError, setAuthError] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [status, setStatus] = useState('Fetching Database...');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://medagent-pro-agentic-production.up.railway.app';

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${apiUrl.replace(/\/$/, '')}/admin/users`);
            const data = await res.json();
            setUsers(data.users || []);
            setStatus('Live Database Connection');
        } catch (e) {
            setStatus('Database Connection Failed');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await fetch(`${apiUrl.replace(/\/$/, '')}/admin/create_user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail, password: 'default_password_until_auth' })
            });
            setNewEmail('');
            fetchUsers();
        } catch (e) {
            console.error(e);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center font-sans relative selection:bg-emerald-500/30 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] blur-[160px] rounded-full bg-emerald-900/20 pointer-events-none" />
                <div className="z-10 bg-gray-900/60 border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl w-full max-w-md flex flex-col items-center">
                    <div className="p-4 bg-emerald-900/30 rounded-2xl mb-6 shadow-inner">
                        <ShieldCheck size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Admin Authentication</h2>
                    <p className="text-gray-500 text-sm mb-8 text-center leading-relaxed">This portal is restricted to MedAgent-Pro administrators only.</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (passcode === (process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'admin123')) {
                                setIsAuthenticated(true);
                            } else {
                                setAuthError(true);
                                setTimeout(() => setAuthError(false), 3000);
                            }
                        }}
                        className="w-full flex flex-col gap-5"
                    >
                        <div className="relative">
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className={`w-full bg-black/60 border rounded-2xl px-5 py-4 text-center tracking-widest text-xl font-mono focus:outline-none transition-colors shadow-inner ${authError ? 'border-red-500 focus:border-red-500 text-red-100' : 'border-gray-800 focus:border-emerald-500 text-white'}`}
                                placeholder="••••••••"
                                autoFocus
                            />
                            {authError && <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-[10px] font-black text-center uppercase tracking-widest">Access Denied</p>}
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-4 rounded-[1.25rem] shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-95 mt-2">
                            Verify Identity
                        </button>
                    </form>
                    <Link href="/" className="mt-8 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 font-bold uppercase tracking-wider">
                        <ArrowLeft size={14} /> Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500/30">
            <div className={`absolute top-[-20%] left-[20%] w-[50%] h-[50%] blur-[160px] rounded-full pointer-events-none bg-blue-900/20`} />

            <header className="px-8 py-6 border-b border-gray-800 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-xl transition cursor-pointer text-gray-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <ShieldCheck size={32} className="text-emerald-500" />
                    <h1 className="text-2xl font-bold tracking-tight">Admin Master Portal</h1>
                    <div className="ml-5 px-3 py-1.5 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 rounded-[1rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Database size={12} /> {status}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 lg:p-10 max-w-[1600px] xl:w-[95%] mx-auto w-full z-10 flex gap-10 flex-col lg:flex-row">
                <div className="w-full lg:w-1/3">
                    <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem] shadow-2xl backdrop-blur-3xl">
                        <h2 className="text-xl font-bold flex items-center gap-3 mb-8 text-gray-200">
                            <Users size={22} className="text-blue-500" /> Provision Account
                        </h2>
                        <form onSubmit={handleCreateUser} className="flex flex-col gap-6">
                            <div>
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-3">Institutional Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-white placeholder-gray-600 shadow-inner"
                                    placeholder="doctor@hospital.com"
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-4 rounded-[1.25rem] shadow-[0_8px_30px_rgb(37,99,235,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2 mt-4 text-base">
                                <Plus size={18} strokeWidth={3} /> Deploy Secure Account
                            </button>
                        </form>
                    </div>
                </div>

                <div className="w-full lg:w-2/3">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-[2rem] shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col h-full min-h-[600px]">
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/60 shrink-0">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-200">
                                <Activity size={22} className="text-purple-500" /> Administrative Ledger
                            </h2>
                            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">{users.length} Active Accounts</span>
                        </div>

                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-black/40 border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
                                        <th className="p-5 font-black">User UUID</th>
                                        <th className="p-5 font-black">Email Config</th>
                                        <th className="p-5 font-black text-center">Remaining Credits</th>
                                        <th className="p-5 font-black text-right">Registered</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/60">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-16 text-center text-gray-600 italic">No users found in PostgreSQL database.</td>
                                        </tr>
                                    ) : (
                                        users.map(u => (
                                            <tr key={u.id} className="hover:bg-white/[0.03] transition-colors cursor-crosshair">
                                                <td className="p-5 font-mono text-[11px] text-gray-500 w-1/3">
                                                    <span className="bg-gray-900 border border-gray-800 px-2 py-1 rounded inline-block">
                                                        {u.id}
                                                    </span>
                                                </td>
                                                <td className="p-5 font-semibold text-gray-300 text-sm tracking-wide">{u.email}</td>
                                                <td className="p-5 text-center">
                                                    <span className="bg-blue-900/30 text-blue-400 border border-blue-800/40 px-3 py-1.5 rounded-[1rem] text-[11px] font-black uppercase tracking-widest">
                                                        {u.credits} API
                                                    </span>
                                                </td>
                                                <td className="p-5 text-xs text-gray-500 font-medium text-right">
                                                    {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
