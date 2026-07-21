import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'MedAgent-Pro',
    description: 'Evidence-based Multi-modal Medical Diagnosis via Reasoning Agentic Workflow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-950 text-white min-h-screen selection:bg-blue-500/30 font-sans">
                {children}
            </body>
        </html>
    )
}
