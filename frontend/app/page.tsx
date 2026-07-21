'use client';
import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, PlusSquare, Trash2, HeartPulse, Activity, LogIn, ExternalLink, FileText, Code2, Database } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [status, setStatus] = useState<string>('System Online');
    const [reasoning, setReasoning] = useState<string[]>([]);
    const [patientData, setPatientData] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://medagent-pro-agentic-production.up.railway.app';
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleDiagnosticRun = async () => {
        if (!patientData && !fileName) {
            setStatus('Error: Please provide inputs.');
            return;
        }

        setStatus('Planner Agent formulating strategy...');
        setReasoning([]);

        try {
            const formData = new FormData();
            formData.append('case_context', patientData || "No data provided.");
            formData.append('clinical_guidelines', '');

            const diagRes = await fetch(`${apiUrl.replace(/\/$/, '')}/diagnose`, {
                method: "POST",
                body: formData
            });

            if (!diagRes.ok) throw new Error(`Backend Error ${diagRes.status}`);
            const diagData = await diagRes.json();

            if (diagData.plan) {
                setReasoning(prev => [...prev, `[Planner] ${diagData.plan}`]);
                setStatus('Decider Agent evaluating step...');

                const execFormData = new FormData();
                execFormData.append('plan', diagData.plan);
                execFormData.append('current_state', 'Initial evaluation of provided case data.');
                execFormData.append('tools_results', fileName ? `Found attached visual scan metadata: ${fileName}` : 'No image provided.');

                const execRes = await fetch(`${apiUrl.replace(/\/$/, '')}/execute_step`, {
                    method: "POST",
                    body: execFormData
                });

                if (!execRes.ok) throw new Error(`Backend Error ${execRes.status}`);
                const execData = await execRes.json();

                if (execData.decision) {
                    setReasoning(prev => [...prev, `[Decider] ${execData.decision}`]);
                    setStatus('Diagnosis Complete');
                } else {
                    setStatus('Error: Decider failed to output.');
                }
            }
        } catch (err: any) {
            console.error(err);
            setStatus('Network Error.');
            setReasoning(prev => [...prev, `[System Error] ${err.message}. Please ensure the API is deployed and reachable.`]);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} relative`}>
            <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full pointer-events-none ${isDark ? 'bg-blue-900/30' : 'bg-blue-200/50'}`} />
            <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full pointer-events-none ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-200/40'}`} />

            <main className="z-10 flex flex-col flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 mb-2">
                <header className={`flex items-center justify-between pb-5 border-b transition-colors ${isDark ? 'border-gray-800' : 'border-gray-300'} shrink-0`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-indigo-900/50 text-blue-400' : 'bg-indigo-100 text-blue-600'}`}>
                            <PlusSquare size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                MedAgent-Pro
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`p-2 rounded-lg transition-transform hover:scale-105 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm'}`}
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Link href="/login" className="flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-lg transition-all shadow-sm bg-blue-600 hover:bg-blue-500 text-white">
                            <LogIn size={16} /> Sign In
                        </Link>
                        <Link href="/admin" className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-lg transition-all shadow-sm ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100 border-gray-300 shadow-sm'}`}>
                            <Activity size={16} className="text-blue-500" /> Admin
                        </Link>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-6 mt-6 flex-1 min-h-[500px]">
                    {/* Left panel */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
                        <div className={`backdrop-blur-md p-5 rounded-2xl flex flex-col min-h-[500px] h-full shadow-xl transition-colors border ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white/90 border-gray-200 shadow-lg'}`}>
                            <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 shrink-0 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                <HeartPulse size={18} className="text-red-500" /> Patient Case
                            </h2>

                            <div className="mb-4 flex-1 flex flex-col min-h-[150px]">
                                <label className={`block text-xs font-semibold mb-1.5 shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Clinical Context & Rules</label>
                                <textarea
                                    value={patientData}
                                    onChange={(e) => setPatientData(e.target.value)}
                                    placeholder="Paste patient data and clinical rules here..."
                                    className={`flex-1 w-full rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-colors border shadow-inner custom-scrollbar ${isDark ? 'bg-gray-950/80 border-gray-700 text-gray-200 placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'}`}
                                />
                            </div>

                            <label className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer group mb-4 overflow-hidden relative flex-shrink-0 min-h-[120px] ${isDark ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:bg-gray-800/40' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:bg-blue-50/50'}`}>
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <div className={`mb-2 p-2 rounded-full transition-transform group-hover:scale-110 ${isDark ? 'bg-gray-800 group-hover:bg-blue-900/50' : 'bg-white shadow group-hover:bg-blue-100'}`}>
                                    <PlusSquare size={20} className="text-blue-500" />
                                </div>
                                {fileName ? (
                                    <div className="flex flex-col items-center">
                                        <p className="text-xs font-bold text-blue-500 text-center break-all px-2">{fileName}</p>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setFileName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                            className="mt-2 flex items-center justify-center gap-1 text-[11px] bg-red-100 text-red-600 px-3 py-1 rounded-lg border border-red-200 hover:bg-red-200 transition-colors z-20 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800/50 dark:hover:bg-red-800/80"
                                        >
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs font-medium">Click to attach scan</p>
                                )}
                            </label>

                            <button
                                onClick={handleDiagnosticRun}
                                className="w-full h-12 shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
                            >
                                Run Diagnostic Agents
                            </button>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className={`w-full lg:w-2/3 h-full backdrop-blur-md p-6 rounded-2xl flex flex-col min-h-[500px] shadow-xl overflow-hidden transition-colors border ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white/90 border-gray-200 shadow-lg'}`}>
                        <div className="flex justify-between items-center mb-5 shrink-0">
                            <h2 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Agent Reasoning Feed</h2>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-colors ${isDark ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                {status}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                            {reasoning.length === 0 ? (
                                <div className={`h-full flex items-center justify-center border-2 border-dashed rounded-xl ${isDark ? 'border-gray-800 text-gray-600' : 'border-gray-300 text-gray-400 bg-gray-50/50'}`}>
                                    <p className="font-medium text-base">Awaiting Execution...</p>
                                </div>
                            ) : (
                                reasoning.map((log, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl font-mono text-xs shadow-sm transition-all whitespace-pre-wrap leading-relaxed border flex gap-3 ${isDark ? 'bg-gray-800/60 border-gray-700/50 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">&gt;</span>
                                        <span>{log}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ABOUT THE PAPER SECTION */}
            <section className={`z-10 relative flex-shrink-0 w-full border-t transition-colors pb-12 pt-8 px-4 md:px-8 mt-auto ${isDark ? 'border-gray-800 bg-gray-950/40' : 'border-gray-300 bg-gray-100/50'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText size={24} className="text-blue-500" />
                        <h2 className="text-2xl font-extrabold tracking-tight">About the MedAgent-Pro Replication</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>The Original Research</h3>
                            <p className={`leading-relaxed mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                This application is a full-stack, cloud-hosted replication of the architecture detailed in the 2026 ICLR paper <a href="https://arxiv.org/html/2503.18968v2" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold inline-flex items-center">MedAgent-Pro <ExternalLink size={14} className="ml-1" /></a>.
                            </p>
                            <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                The original research introduced a hierarchical multi-modal AI system designed to solve complex medical reasoning tasks by dynamically generating diagnostic pathways and bridging pure language models with specialized visual interpretation tools. I engineered this project to prove that complex AI loops can be deployed into highly scalable, modern web architectures specifically optimized for real-world clinical usage.
                            </p>
                        </div>

                        <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                            <h3 className={`text-lg font-bold mb-5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>My Architectural Additions</h3>
                            <ul className={`space-y-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg mt-0.5 ${isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                                        <Code2 size={18} className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <strong className={`block mb-0.5 text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Gemini 2.0 Engine Upgrade</strong>
                                        <p>Substituted the original architecture's expensive LLM reliance with Google's blistering-fast <code className="text-blue-500">gemini-2.0-flash</code> models using the newest `google-genai` SDK.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg mt-0.5 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                                        <Database size={18} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <strong className={`block mb-0.5 text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Railway Microservices</strong>
                                        <p>Deployed the heavy Python agent-orchestration engine (TaskPlanner & CaseDecider) entirely into a containerized Railway backend perfectly optimized for asynchronous AI streams.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg mt-0.5 ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                                        <Activity size={18} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <strong className={`block mb-0.5 text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Vercel Interactive UI</strong>
                                        <p>Built this aesthetic, responsive Next.js 14 dashboard supporting live diagnostic streams, custom theming, and an upcoming SaaS authenticated credit-tracking backend.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
