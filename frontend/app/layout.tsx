import './globals.css'
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'MedAgent-Pro | Enterprise Medical AI',
    description: 'Evidence-based Multi-modal Medical Diagnosis System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={outfit.variable}>
            <body className="font-sans antialiased no-scrollbar selection:bg-blue-500/30">
                {children}
            </body>
        </html>
    )
}
