import { createFileRoute } from "@tanstack/react-router";

import logoWhite from "@/assets/nagam-horizontal-white.png.asset.json";
import logoNavy from "@/assets/nagam-horizontal-navy.png.asset.json";
import symbolBlue from "@/assets/nagam-symbol-blue.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nagam — Tecnologia Para Negócios Locais" },
      {
        name: "description",
        content:
          "A Nagam desenvolve sites, sistemas e automações sob medida para negócios locais crescerem com tecnologia simples e direta.",
      },
      { property: "og:title", content: "Nagam — Tecnologia Para Negócios Locais" },
      {
        property: "og:description",
        content:
          "Sites, sistemas e automações sob medida para negócios locais crescerem com tecnologia simples e direta.",
      },
    ],
  }),
  component: Index,
});

const servicos = [
  {
    titulo: "Sites e landing pages",
    texto:
      "Presença digital rápida, responsiva e pronta para aparecer nas buscas do seu bairro e da sua cidade.",
  },
  {
    titulo: "Sistemas sob medida",
    texto:
      "Agenda, pedidos, estoque e cadastro de clientes num painel feito para a rotina do seu negócio.",
  },
  {
    titulo: "Automação e atendimento",
    texto:
      "WhatsApp, cobranças e lembretes no automático, para a equipe cuidar do que realmente importa.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <img src={logoNavy.url} alt="Nagam" className="h-9 w-auto dark:hidden" />
          <img src={logoWhite.url} alt="Nagam" className="hidden h-9 w-auto dark:block" />
          <a
            href="#contato"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Falar com a Nagam
          </a>
        </div>
      </header>

      <main>
        <section className="bg-brand-gradient text-navy-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-32">
            <div>
              <span className="inline-flex rounded-full border border-current/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] opacity-80">
                Tecnologia Para Negócios Locais
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] md:text-6xl">
                O sistema que o seu negócio precisa, sem complicação.
              </h1>
              <p className="mt-6 max-w-xl text-lg opacity-85">
                A Nagam constrói sites, sistemas e automações sob medida para comércios,
                clínicas e prestadores de serviço da sua região.
              </p>
              <div className="mt-9">
                <a
                  href="#contato"
                  className="inline-flex rounded-full bg-brand-foreground px-7 py-3 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
                >
                  Começar um projeto
                </a>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <img
                src={symbolBlue.url}
                alt=""
                aria-hidden="true"
                className="w-56 opacity-90 drop-shadow-2xl md:w-72"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-bold md:text-3xl">O que fazemos</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {servicos.map((s) => (
              <article
                key={s.titulo}
                className="rounded-2xl border border-border bg-card p-7 shadow-card"
              >
                <div className="h-1.5 w-10 rounded-full bg-brand" />
                <h3 className="mt-5 text-lg font-semibold">{s.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl bg-accent p-10 text-center shadow-brand md:p-16">
            <h2 className="text-2xl font-bold text-navy md:text-4xl">
              Vamos colocar o seu negócio no digital.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Conte o seu desafio e devolvemos uma proposta objetiva, com prazo e escopo claros.
            </p>
            <a
              href="mailto:contato@nagam.com.br"
              className="mt-8 inline-flex rounded-full bg-brand px-7 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              contato@nagam.com.br
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-sm text-muted-foreground md:flex-row md:justify-between">
          <img src={logoNavy.url} alt="Nagam" className="h-7 w-auto dark:hidden" />
          <img src={logoWhite.url} alt="Nagam" className="hidden h-7 w-auto dark:block" />
          <p>© {new Date().getFullYear()} Nagam · Tecnologia Para Negócios Locais</p>
        </div>
      </footer>
    </div>
  );
}
