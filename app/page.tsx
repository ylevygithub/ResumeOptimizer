import Header from '@/components/Header';
import Link from 'next/link';

export default function Landing() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl p-6">
        <section className="rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold mb-2">AI Resume Optimizer (FR/EN)</h1>
          <p className="text-neutral-600 mb-6">
            Collez votre CV + une offre. Obtenez un résumé percutant, mots-clés ATS, et bullets adaptés au marché français.
          </p>
          <div className="flex gap-3">
            <Link href="/app" className="rounded-xl bg-black text-white px-5 py-3">Try free (3 runs)</Link>
            <a href="#pricing" className="rounded-xl border px-5 py-3">Pricing</a>
          </div>
        </section>

        <section id="pricing" className="mt-10 grid gap-6">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold mb-2">Pro — €9/mo</h2>
            <p className="text-neutral-600 mb-4">Runs illimités + export.</p>
            <Link href="/app" className="rounded-xl bg-black text-white px-5 py-3 inline-block">Get started</Link>
          </div>
        </section>
      </main>
    </>
  );
}
