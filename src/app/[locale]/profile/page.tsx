import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { UserProfile } from "@/components/UserProfile";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { TopNav } from "@/components/TopNav";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-sand-50 text-ink-900">
      <header className="border-b border-ink-100 bg-sand-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Cherry Location
            </h1>
            <p className="text-sm text-ink-500">
              Manage your garden profile
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl px-6 pb-6">
          <TopNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <UserProfile />
      </main>
    </div>
  );
}
