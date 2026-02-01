import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { MapSection } from "@/components/MapSection";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { TopNav } from "@/components/TopNav";
import { GardenGallery } from "@/components/GardenGallery";
import { SearchFilters } from "@/components/SearchFilters";
import { SearchEmptyState } from "@/components/SearchEmptyState";

type SearchParams = {
  q?: string;
  region?: string;
  sort?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("app");
  const params = await searchParams;

  const q = params.q?.trim();
  const region = params.region?.trim();
  const sort = params.sort?.trim();

  const orderBy =
    sort === "price"
      ? { pricePerKg: "asc" as const }
      : { name: "asc" as const };

  const gardensRaw = await prisma.garden.findMany({
    orderBy,
    include: { images: true },
  });

  const qLower = q?.toLowerCase();
  const regionLower = region?.toLowerCase();
  const gardens = gardensRaw.filter((garden) => {
    const name = garden.name.toLowerCase();
    const reg = garden.region.toLowerCase();
    const qOk = qLower ? name.includes(qLower) || reg.includes(qLower) : true;
    const rOk = regionLower ? reg.includes(regionLower) : true;
    return qOk && rOk;
  });


  return (
    <div className="min-h-screen bg-sand-50 text-ink-900">
      <header className="border-b border-ink-100 bg-sand-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-ink-500">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl px-6 pb-6">
          <TopNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <div id="search">
          <SearchFilters
            initialQ={q}
            initialRegion={region}
            initialSort={sort}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <section className="space-y-4">
            {gardens.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-6 text-sm text-ink-500">
                <SearchEmptyState q={q} region={region} />
              </div>
            ) : (
              gardens.map((garden) => (
                <article
                  key={garden.id}
                  className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm"
                >
                  {garden.images.length > 0 && (
                    <GardenGallery
                      images={garden.images}
                      title={garden.name}
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{garden.name}</h2>
                    <span className="text-xs uppercase tracking-wide text-ink-400">
                      {garden.region}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-ink-600">
                    {garden.isSelfPick && (
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                        {t("labels.selfPick")}
                      </span>
                    )}
                    {garden.pricePerKg && (
                      <span>
                        {t("labels.price")}: {garden.pricePerKg}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-ink-500">
                    {t("labels.contact")}{" "}
                    {garden.contactPhone ?? garden.contactEmail ?? "-"}
                  </div>
                </article>
              ))
            )}
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
            <MapSection
              gardens={gardens.map((garden) => ({
                id: garden.id,
                name: garden.name,
                latitude: garden.latitude,
                longitude: garden.longitude,
              }))}
            />
          </section>
        </div>

      </main>
    </div>
  );
}
