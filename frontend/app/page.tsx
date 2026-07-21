'use client';
import { useState, useRef, useEffect } from 'react';
import { Maximize, Minimize, Moon, Sun, PlusSquare, Trash2, HeartPulse, Activity } from 'lucide-react';

export default function Dashboard() {
    const [status, setStatus] = useState<string>('System Online');
    const [reasoning, setReasoning] = useState<string[]>([]);
    const [patientData, setPatientData] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Hardcoded the URL directly in code
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://medagent-pro-agentic-production.up.railway.app';
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Error attempting to enable full-screen mode", err);
            });
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

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
        <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden relative`}>
            <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full pointer-events-none ${isDark ? 'bg-blue-900/30' : 'bg-blue-200/50'}`} />
            <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full pointer-events-none ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-200/40'}`} />

            <main className="z-10 flex flex-col w-full max-w-7xl mx-auto p-8 h-screen">
                <header className={`flex items-center justify-between py-6 border-b transition-colors ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-indigo-900/50 text-blue-400' : 'bg-indigo-100 text-blue-600'}`}>
                            <PlusSquare size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                MedAgent-Pro
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`p-2 rounded-lg transition-transform hover:scale-105 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm'}`}
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className={`p-2 rounded-lg transition-transform hover:scale-105 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm'}`}
                            title="Toggle Fullscreen"
                        >
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin'}
                            className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-lg transition-all shadow-sm ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100 border-gray-300 shadow-sm'}`}
                            title="Go to Admin Panel"
                        >
                            <Activity size={18} className="text-blue-500" /> Admin
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 gap-8 mt-8 overflow-hidden h-full">
                    {/* Left panel */}
                    <div className="w-1/3 flex flex-col gap-6 h-full">
                        <div className={`backdrop-blur-md p-6 rounded-2xl flex flex-col h-full shadow-xl transition-colors border ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white/90 border-gray-200 shadow-lg'}`}>
                            <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                <HeartPulse size={20} className="text-red-500" /> Patient Case
                            </h2>

                            <div className="mb-4 flex-1 flex flex-col">
                                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Clinical Context & Rules</label>
                                <textarea
                                    value={patientData}
                                    onChange={(e) => setPatientData(e.target.value)}
                                    placeholder="Paste patient data and clinical rules here..."
                                    className={`flex-1 w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-colors border shadow-inner custom-scrollbar ${isDark ? 'bg-gray-950/80 border-gray-700 text-gray-200 placeholder-gray-600' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'}`}
                                />
                            </div>

                            <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer group mb-6 overflow-hidden relative min-h-[140px] ${isDark ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:bg-gray-800/40' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:bg-blue-50/50'}`}>
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <div className={`mb-3 p-3 rounded-full transition-transform group-hover:scale-110 ${isDark ? 'bg-gray-800 group-hover:bg-blue-900/50' : 'bg-white shadow group-hover:bg-blue-100'}`}>
                                    <PlusSquare size={24} className="text-blue-500" />
                                </div>
                                {fileName ? (
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm font-bold text-blue-500 text-center break-all px-2">{fileName}</p>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setFileName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                            className="mt-3 flex items-center justify-center gap-1 text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-200 transition-colors z-20 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800/50 dark:hover:bg-red-800/80"
                                        >
                                            <Trash2 size={14} /> Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium">Click to attach scan</p>
                                )}
                            </label>

                            <button
                                onClick={handleDiagnosticRun}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
                            >
                                Run Diagnostic Agents
                            </button>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className={`w-2/3 backdrop-blur-md p-6 rounded-2xl flex flex-col shadow-xl overflow-hidden transition-colors border ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white/90 border-gray-200 shadow-lg'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Agent Reasoning Feed</h2>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-colors ${isDark ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                {status}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar pb-4">
                            {reasoning.length === 0 ? (
                                <div className={`h-full flex items-center justify-center border-2 border-dashed rounded-xl ${isDark ? 'border-gray-800 text-gray-600' : 'border-gray-300 text-gray-400 bg-gray-50/50'}`}>
                                    <p className="font-medium text-lg">Awaiting Execution...</p>
                                </div>
                            ) : (
                                reasoning.map((log, idx) => (
                                    <div key={idx} className={`p-5 rounded-xl font-mono text-sm shadow-sm transition-all whitespace-pre-wrap leading-relaxed border flex gap-3 ${isDark ? 'bg-gray-800/60 border-gray-700/50 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                                        <span className="text-indigo-500 font-bold shrink-0 mt-0.5">&gt;</span>
                                        <span>{log}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
