'use client';
import { useState } from 'react';

export default function Paywall() {
  const [loading, setLoading] = useState(false);

  async function buy() {
    setLoading(true);
    const res = await fetch('/api/checkout', { method: 'POST' });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className="rounded-xl border p-4 bg-white">
      <p className="mb-3">Free trial used. Upgrade to continue.</p>
      <button onClick={buy} disabled={loading} className="rounded-xl bg-black text-white px-4 py-2">
        {loading ? 'Redirecting…' : 'Upgrade €9/mo'}
      </button>
    </div>
  );
}
