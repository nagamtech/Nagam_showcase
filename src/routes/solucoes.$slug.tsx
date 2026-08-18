import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { getSegment, getSolution } from "@/data/catalog";
import type { Segment, Solution } from "@/data/types";
import { PhoneMockup } from "@/components/showcase/PhoneMockup";

export const Route = createFileRoute("/solucoes/$slug")({
  loader: ({ params }) => {
    const solution = getSolution(params.slug);
    if (!solution) throw notFound();
    return { solution, segment: getSegment(solution.segmentSlug)! };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Solução não encontrada — Showcase Apps" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { solution, segment } = loaderData;
    const title = `${solution.name} — ${segment.name} | Showcase Apps`;
    return {
      meta: [
        { title },
        { name: "description", content: solution.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: solution.summary },
      ],
    };
  },
  component: SolutionPage,
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card p-5">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SolutionPage() {
  const { solution, segment } = Route.useLoaderData() as {
    solution: Solution;
    segment: Segment;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/segmentos/$slug"
        params={{ slug: segment.slug }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar para {segment.name}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-4">
          <header>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
              {segment.emoji} {segment.name}
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{solution.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{solution.summary}</p>
          </header>

          <Block title="Problema resolvido">
            <p className="text-sm text-muted-foreground">{solution.problem}</p>
          </Block>

          <Block title="Como funciona">
            <ol className="space-y-2">
              {solution.howItWorks.map((h, i) => (
                <li key={h} className="flex items-start gap-3 text-sm">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{h}</span>
                </li>
              ))}
            </ol>
          </Block>

          <Block title="Benefícios">
            <ul className="space-y-2">
              {solution.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Funcionalidades">
            <div className="grid gap-2 sm:grid-cols-2">
              {solution.features.map((f) => (
                <div
                  key={f}
                  className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-medium"
                >
                  {f}
                </div>
              ))}
            </div>
          </Block>

          <Block title="Fluxograma">
            <div className="flex flex-wrap items-center gap-2">
              {solution.flow.map((f, i) => (
                <span key={f} className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium">
                    {f}
                  </span>
                  {i < solution.flow.length - 1 ? (
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  ) : null}
                </span>
              ))}
            </div>
          </Block>

          <Block title="Tecnologias utilizadas">
            <div className="flex flex-wrap gap-2">
              {solution.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </Block>

          <Block title="Diferenciais">
            <ul className="space-y-2">
              {solution.differentials.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{d}</span>
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <PhoneMockup config={solution.demo} appName={solution.name} />
          <p className="mx-auto mt-4 max-w-[340px] text-center text-[11px] text-muted-foreground">
            Demonstração navegável com dados simulados. Todos os botões funcionam.
          </p>
        </aside>
      </div>
    </div>
  );
}