import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CircleAlert } from "lucide-react";
import { getSegment, solutionsBySegment } from "@/data/catalog";
import type { Segment, Solution } from "@/data/types";

export const Route = createFileRoute("/segmentos/$slug")({
  loader: ({ params }) => {
    const segment = getSegment(params.slug);
    if (!segment) throw notFound();
    return { segment, list: solutionsBySegment(params.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Segmento não encontrado — Nagam Showcase" }, { name: "robots", content: "noindex" }],
      };
    }
    const { segment } = loaderData;
    const title = `${segment.name} — Soluções digitais | Nagam Showcase`;
    return {
      meta: [
        { title },
        { name: "description", content: `${segment.description} Veja demonstrações interativas.` },
        { property: "og:title", content: title },
        { property: "og:description", content: segment.description },
      ],
    };
  },
  component: SegmentPage,
});

function SegmentPage() {
  const { segment, list } = Route.useLoaderData() as { segment: Segment; list: Solution[] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/segmentos"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar
      </Link>

      <header className="mt-6 flex items-start gap-4">
        <span className="tile-gradient grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border text-2xl">
          {segment.emoji}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{segment.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{segment.description}</p>
        </div>
      </header>

      <section className="surface-card mt-7 p-5">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Principais desafios
        </p>
        <ul className="mt-3 space-y-2">
          {segment.challenges.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-muted-foreground">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        Soluções disponíveis ({list.length})
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {list.map((s) => (
          <article key={s.slug} className="surface-card flex flex-col overflow-hidden">
            <div className="tile-gradient grid h-36 place-items-center border-b border-border text-5xl">
              {segment.emoji}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h3 className="text-base font-semibold tracking-tight">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Problema resolvido
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.problem}</p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {s.benefits.map((b) => (
                  <li
                    key={b}
                    className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent"
                  >
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to="/solucoes/$slug"
                params={{ slug: s.slug }}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
              >
                Explorar Demonstração <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}