import { createFileRoute, redirect } from "@tanstack/react-router";
import { Package, BarChart3, DollarSign, Users, Settings, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = import.meta.env['VITE_ADMIN_EMAIL'] as string | undefined;

export const Route = createFileRoute("/backoffice")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Back-Office & Gestão — Nagam" },
      {
        name: "description",
        content: "Painel administrativo da Nagam com módulos de gestão interna e operação.",
      },
      { property: "og:title", content: "Back-Office & Gestão — Nagam" },
      {
        property: "og:description",
        content: "Painel administrativo da Nagam com módulos de gestão interna e operação.",
      },
    ],
  }),
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw redirect({ to: "/" });
    }

    if (!ADMIN_EMAIL || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      throw redirect({ to: "/" });
    }
  },
  component: BackOffice,
});

const solutions = [
  {
    icon: <Package className="h-8 w-8" />,
    title: "Controle de Estoque",
    description:
      "Gestão completa de entradas, saídas, inventário e alertas de reposição em tempo real.",
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Gestão Financeira",
    description: "Contas a pagar e receber, fluxo de caixa, relatórios e conciliação bancária.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Recursos Humanos",
    description: "Cadastro de colaboradores, ponto eletrônico, folha de pagamento e escalas.",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Relatórios e Análises",
    description: "Painéis gerenciais, indicadores de desempenho e exportação de dados.",
  },
  {
    icon: <ClipboardList className="h-8 w-8" />,
    title: "Gestão de Pedidos",
    description: "Acompanhamento de pedidos, status, logística e histórico completo.",
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Configurações do Sistema",
    description: "Permissões de usuários, parâmetros, integrações e personalização.",
  },
];

function BackOffice() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Back-Office & Gestão Administrativa
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soluções projetadas para otimizar a gestão interna da sua empresa, com controle,
            agilidade e informações precisas para tomada de decisão.
          </p>
        </div>
      </section>
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol) => (
              <article
                key={sol.title}
                className="group bg-card border border-border/60 rounded-2xl p-6 hover:shadow-lg hover:border-primary/40 transition-all duration-300"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {sol.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{sol.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{sol.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
