import Header from '@/components/Header';
import Editor from '@/components/Editor';
import { currentUser } from '@clerk/nextjs/server';
import { hasActiveSub } from '@/lib/billing';

export default async function AppPage() {
  const user = await currentUser();
  if (!user) return <div className="p-6">Please sign in.</div>;
  const email = user.emailAddresses?.[0]?.emailAddress!;
  const sub = await hasActiveSub(email);
  const runs = (user.publicMetadata?.runsLeft as number | undefined) ?? 3;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl p-6">
        <Editor hasSub={sub} initialRuns={runs} />
      </main>
    </>
  );
}
