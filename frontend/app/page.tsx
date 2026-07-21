'use client';
import { useState, useRef } from 'react';

export default function Dashboard() {
    const [status, setStatus] = useState<string>('System Online');
    const [reasoning, setReasoning] = useState<string[]>([]);
    const [patientData, setPatientData] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [apiUrl, setApiUrl] = useState<string>('https://protective-emotion-production.up.railway.app'); // Update this dynamically to your real railway URL

    const fileInputRef = useRef<HTMLInputElement>(null);

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
            // 1. Call the Planner Agent via Backend
            const formData = new FormData();
            formData.append('case_context', patientData || "No data provided.");
            formData.append('clinical_guidelines', ''); // We rely on the Planner's default Gemini logic or you can paste rules in the box!

            const diagRes = await fetch(`${apiUrl.replace(/\/$/, '')}/diagnose`, {
                method: "POST",
                body: formData
            });

            if (!diagRes.ok) throw new Error(`Backend Error ${diagRes.status}`);

            const diagData = await diagRes.json();

            if (diagData.plan) {
                setReasoning(prev => [...prev, `[Planner] ${diagData.plan}`]);
                setStatus('Decider Agent evaluating step...');

                // 2. Call the Decider Agent via Backend
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
            setReasoning(prev => [...prev, `[System Error] ${err.message}. Please ensure the Railway backend API URL is correct.`]);
        }
    };

    return (
        <div className="flex min-h-screen bg-black overflow-hidden relative">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[150px] rounded-full pointer-events-none" />

            <main className="z-10 flex flex-col w-full max-w-6xl mx-auto p-8 h-screen">
                <header className="flex items-center justify-between py-6 border-b border-gray-800">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block">
                            MedAgent-Pro
                        </h1>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-gray-500">Backend API URL:</span>
                            <input
                                type="text"
                                value={apiUrl}
                                onChange={e => setApiUrl(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 w-72 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-400">{status}</span>
                    </div>
                </header>

                <div className="flex flex-1 gap-8 mt-8 overflow-hidden">
                    <div className="w-1/3 flex flex-col gap-6">
                        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl flex flex-col h-full shadow-xl">
                            <h2 className="text-xl font-semibold mb-4 text-gray-200">Patient Case</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Clinical Context & Rules</label>
                                <textarea
                                    value={patientData}
                                    onChange={(e) => setPatientData(e.target.value)}
                                    placeholder="Paste patient data and clinical rules here..."
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-none h-48 custom-scrollbar"
                                />
                            </div>

                            <label className="border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:bg-gray-800/20 transition-colors cursor-pointer group mb-6">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <div className="mb-3 p-3 bg-gray-800 rounded-full group-hover:bg-blue-900/50 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                </div>
                                {fileName ? (
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm font-medium text-blue-400 text-center break-all">{fileName}</p>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setFileName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                            className="mt-3 text-xs bg-red-900/40 text-red-300 px-3 py-1.5 rounded-lg border border-red-800/50 hover:bg-red-800/80 transition-colors z-20"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-center">Click to attach scan</p>
                                )}
                            </label>

                            <button
                                onClick={handleDiagnosticRun}
                                className="w-full mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                Run Diagnostic Agents
                            </button>
                        </div>
                    </div>

                    <div className="w-2/3 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-6 rounded-2xl flex flex-col shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-200">Agent Reasoning Feed</h2>
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-mono text-blue-400">{status}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {reasoning.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-600">
                                    Awaiting Execution...
                                </div>
                            ) : (
                                reasoning.map((log, idx) => (
                                    <div key={idx} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl font-mono text-sm shadow-sm transition-all whitespace-pre-wrap leading-relaxed">
                                        <span className="text-indigo-400 mr-2 font-bold">&gt;</span> {log}
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
