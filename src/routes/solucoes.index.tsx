import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { getSegment, solutions } from "@/data/catalog";

export const Route = createFileRoute("/solucoes/")({
  head: () => ({
    meta: [
      { title: "Todas as soluções — Showcase Apps" },
      {
        name: "description",
        content:
          "Lista completa de aplicativos demonstráveis: agendamento, cardápio digital, catálogo e reservas para o comércio local.",
      },
      { property: "og:title", content: "Todas as soluções — Showcase Apps" },
      {
        property: "og:description",
        content: "Aplicativos navegáveis com fluxos completos e dados simulados.",
      },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return solutions;
    return solutions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        (getSegment(s.segmentSlug)?.name.toLowerCase().includes(q) ?? false),
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Soluções</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        {solutions.length} aplicativos demonstráveis, cada um com fluxo completo dentro do mockup.
      </p>

      <div className="surface-card mt-6 flex max-w-md items-center gap-2 px-3.5 py-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar solução"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const seg = getSegment(s.segmentSlug)!;
          return (
            <Link
              key={s.slug}
              to="/solucoes/$slug"
              params={{ slug: s.slug }}
              className="surface-card group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <span className="tile-gradient grid h-11 w-11 place-items-center rounded-2xl border border-border text-xl">
                {seg.emoji}
              </span>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">{seg.name}</p>
                <p className="text-base font-semibold tracking-tight">{s.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent">
                Explorar demonstração
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
      {list.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Nada encontrado.</p>
      ) : null}
    </div>
  );
}