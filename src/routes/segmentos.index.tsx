import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { countBySegment, segments } from "@/data/catalog";

export const Route = createFileRoute("/segmentos/")({
  head: () => ({
    meta: [
      { title: "Segmentos atendidos — Nagam Showcase" },
      {
        name: "description",
        content:
          "Barbearias, lanchonetes, pizzarias, óticas, pet shops e mais: veja as soluções digitais disponíveis para cada segmento.",
      },
      { property: "og:title", content: "Segmentos atendidos — Nagam Showcase" },
      {
        property: "og:description",
        content: "Explore aplicativos por segmento do comércio local.",
      },
    ],
  }),
  component: SegmentsPage,
});

function SegmentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Segmentos</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Cada segmento reúne aplicativos prontos para demonstração, com fluxos completos e dados
        simulados.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((s) => (
          <Link
            key={s.slug}
            to="/segmentos/$slug"
            params={{ slug: s.slug }}
            className="surface-card group flex items-start gap-3 p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span className="tile-gradient grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border text-xl">
              {s.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold tracking-tight">{s.name}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{s.description}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">
                {countBySegment(s.slug)} {countBySegment(s.slug) === 1 ? "solução" : "soluções"}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}