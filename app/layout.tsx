import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = { title: 'Resume Optimizer', description: 'AI Resume Optimizer FR/EN' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-neutral-50 text-neutral-900">{children}</body>
      </html>
    </ClerkProvider>
  );
}
