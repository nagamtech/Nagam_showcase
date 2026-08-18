import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { countBySegment, segments, solutions, solutionsBySegment } from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Showcase Apps — Portfólio de Soluções para Pequenos Negócios" },
      {
        name: "description",
        content:
          "Explore aplicativos desenvolvidos para resolver problemas reais do comércio e teste demonstrações interativas por segmento.",
      },
      { property: "og:title", content: "Showcase Apps — Portfólio de Soluções" },
      {
        property: "og:description",
        content: "Biblioteca interativa de aplicativos para barbearias, lanchonetes, lojas e mais.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return segments.filter((s) => {
      if (filter && s.slug !== filter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        solutionsBySegment(s.slug).some((sol) => sol.name.toLowerCase().includes(q))
      );
    });
  }, [query, filter]);

  return (
    <div>
      <section className="hero-gradient px-4 pt-14 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" /> {solutions.length} demonstrações interativas
          </span>
          <h1 className="mt-5 text-3xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            Portfólio de Soluções para Pequenos Negócios
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Explore aplicativos desenvolvidos para resolver problemas reais do comércio.
          </p>

          <div className="mx-auto mt-7 max-w-md">
            <div className="surface-card flex items-center gap-2 px-3.5 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar segmento ou aplicativo"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-4">
          <FilterChip active={filter === null} onClick={() => setFilter(null)}>
            Todos
          </FilterChip>
          {segments.map((s) => (
            <FilterChip
              key={s.slug}
              active={filter === s.slug}
              onClick={() => setFilter(filter === s.slug ? null : s.slug)}
            >
              {s.emoji} {s.name}
            </FilterChip>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <Link
              key={s.slug}
              to="/segmentos/$slug"
              params={{ slug: s.slug }}
              className="surface-card group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="tile-gradient grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border text-xl">
                  {s.emoji}
                </span>
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                  {countBySegment(s.slug)}{" "}
                  {countBySegment(s.slug) === 1 ? "solução" : "soluções"}
                </span>
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight">{s.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent">
                Explorar segmento
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhum segmento encontrado para “{query}”.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "shrink-0 rounded-full border border-accent bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-foreground transition"
          : "shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-accent/40"
      }
    >
      {children}
    </button>
  );
}
