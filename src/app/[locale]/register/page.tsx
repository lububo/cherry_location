import { RegisterForm } from "@/components/RegisterForm";
import { getTranslations } from "next-intl/server";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-6 py-12">
      <div className="w-full rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink-900">
          {t("registerTitle")}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {t("registerSubtitle")}
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
