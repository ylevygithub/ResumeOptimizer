'use client';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-4xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold">Resume Optimizer</Link>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-xl border px-4 py-2">Sign in</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link href="/app" className="rounded-xl bg-black text-white px-4 py-2">Open App</Link>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
