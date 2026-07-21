'use client';
import { useState } from 'react';

export default function Dashboard() {
    const [status, setStatus] = useState<string>('Awaiting Input...');
    const [reasoning, setReasoning] = useState<string[]>([]);

    const handleSimulatedRun = () => {
        setStatus('Planner Agent formulating strategy...');
        setTimeout(() => {
            setReasoning(prev => [...prev, '[Planner] Generated clinical pathway based on guidelines.']);
            setStatus('Decider Agent evaluating image...');
            setTimeout(() => {
                setReasoning(prev => [...prev, '[Decider] Called HF Tool: Segmentation. Detected lesion.']);
                setStatus('Diagnosis Complete');
                setReasoning(prev => [...prev, '[Decider] Final Diagnosis: High probability of Glaucoma.']);
            }, 2000);
        }, 2000);
    };

    return (
        <div className="flex min-h-screen bg-black overflow-hidden relative">
            {/* Decorative Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[150px] rounded-full pointer-events-none" />

            {/* Main Container */}
            <main className="z-10 flex flex-col w-full max-w-6xl mx-auto p-8 h-screen">
                <header className="flex items-center justify-between py-6 border-b border-gray-800">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        MedAgent-Pro
                    </h1>
                    <div className="flex items-center space-x-3">
                        <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-400">System Online</span>
                    </div>
                </header>

                <div className="flex flex-1 gap-8 mt-8 overflow-hidden">
                    {/* Left panel: Upload & Patient Data */}
                    <div className="w-1/3 flex flex-col gap-6">
                        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl flex flex-col h-full shadow-xl">
                            <h2 className="text-xl font-semibold mb-4 text-gray-200">Patient Case</h2>
                            <div className="border border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 transition-colors cursor-pointer group mb-6">
                                <div className="mb-3 p-3 bg-gray-800 rounded-full group-hover:bg-blue-900/50 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                </div>
                                <p className="text-sm">Drag & drop medical scan</p>
                                <span className="text-xs text-gray-600 mt-2">DICOM, PNG, JPEG</span>
                            </div>

                            <button
                                onClick={handleSimulatedRun}
                                className="w-full mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                Run Diagnostic Agents
                            </button>
                        </div>
                    </div>

                    {/* Right panel: Agent Reasoning */}
                    <div className="w-2/3 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-6 rounded-2xl flex flex-col shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-200">Agent Reasoning Feed</h2>
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-mono text-blue-400">{status}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {reasoning.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-600">
                                    Pending agent execution...
                                </div>
                            ) : (
                                reasoning.map((log, idx) => (
                                    <div key={idx} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl font-mono text-sm shadow-sm transition-all animate-pulse">
                                        <span className="text-indigo-400 mr-2">&gt;</span> {log}
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
