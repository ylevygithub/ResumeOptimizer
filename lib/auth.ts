import { auth, currentUser } from '@clerk/nextjs/server';

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('UNAUTHENTICATED');
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) throw new Error('NO_EMAIL');
  return { userId, email: user.emailAddresses[0].emailAddress, user };
}
