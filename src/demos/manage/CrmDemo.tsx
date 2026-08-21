import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Users, Star } from "lucide-react";
import type { CrmConfig } from "@/data/types";
import { brl, DemoFooter, DemoHeader, DemoScroll, PrimaryButton, Screen, Chip, TabBar } from "../ui";
import { ChainNote, Field, KpiCard, Row, SearchField, SectionTitle, Sheet, StatusPill, TextInput } from "./ui";

type Client = CrmConfig["clients"][number];

export default function CrmDemo({ config }: { config: CrmConfig }) {
  const [tab, setTab] = useState<"lista" | "indicadores">("lista");
  const [clients, setClients] = useState<Client[]>(config.clients);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | "ativos" | "inativos">("todos");
  const [selected, setSelected] = useState<Client | null>(null);
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState("");
  const [form, setForm] = useState({ name: "", meta: "" });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      const okQ = !q || c.name.toLowerCase().includes(q) || c.meta.toLowerCase().includes(q);
      const active = c.visits >= 3;
      const okF = filter === "todos" || (filter === "ativos" ? active : !active);
      return okQ && okF;
    });
  }, [clients, query, filter]);

  const avgTicket = clients.reduce((s, c) => s + c.ticket, 0) / (clients.length || 1);
  const actives = clients.filter((c) => c.visits >= 3).length;

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === "lista" ? (
          <Screen k="lista">
            <DemoHeader title={config.appName} subtitle={config.tagline} />
            <DemoScroll>
              <SearchField value={query} onChange={setQuery} placeholder={`Pesquisar ${config.entityLabel.toLowerCase()}`} />
              <div className="mt-3 flex gap-2">
                {(["todos", "ativos", "inativos"] as const).map((f) => (
                  <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                    {f[0].toUpperCase() + f.slice(1)}
                  </Chip>
                ))}
              </div>
              <SectionTitle right={<span className="text-[11px] text-muted-foreground">{list.length}</span>}>
                {config.entityLabel}s
              </SectionTitle>
              <div className="space-y-2">
                {list.map((c) => (
                  <Row
                    key={c.id}
                    emoji={c.emoji}
                    title={c.name}
                    subtitle={`${c.meta} • última: ${c.last}`}
                    onClick={() => setSelected(c)}
                    right={
                      <>
                        <span className="block text-xs font-semibold text-accent">{brl(c.ticket)}</span>
                        <StatusPill tone={c.visits >= 3 ? "ok" : "warn"}>
                          {c.visits >= 3 ? "ativo" : "inativo"}
                        </StatusPill>
                      </>
                    }
                  />
                ))}
                {list.length === 0 ? (
                  <p className="py-10 text-center text-xs text-muted-foreground">Nenhum registro.</p>
                ) : null}
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton onClick={() => setAdding(true)}>
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Cadastrar {config.entityLabel.toLowerCase()}
                </span>
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        ) : (
          <Screen k="ind">
            <DemoHeader title="Indicadores" subtitle="Carteira de clientes" />
            <DemoScroll>
              <div className="grid grid-cols-2 gap-2">
                <KpiCard label="Cadastrados" value={String(clients.length)} />
                <KpiCard label="Ativos" value={String(actives)} tone="accent" hint="3+ visitas" />
                <KpiCard label="Ticket médio" value={brl(avgTicket)} />
                <KpiCard label="Inativos" value={String(clients.length - actives)} hint="reativar" />
              </div>
              <SectionTitle>Maiores tickets</SectionTitle>
              <div className="space-y-2">
                {[...clients]
                  .sort((a, b) => b.ticket - a.ticket)
                  .slice(0, 4)
                  .map((c) => (
                    <Row
                      key={c.id}
                      emoji={c.emoji}
                      title={c.name}
                      subtitle={`${c.visits} atendimentos`}
                      right={<span className="text-xs font-semibold text-accent">{brl(c.ticket)}</span>}
                    />
                  ))}
              </div>
              <ChainNote steps={["Atendimento", "Histórico do cliente", "Ticket médio", "Dashboard"]} />
            </DemoScroll>
          </Screen>
        )}
      </div>

      {selected ? (
        <Sheet title={selected.name} onClose={() => setSelected(null)}>
          <div className="rounded-2xl border border-border p-3">
            <Field label={config.entityLabel} value={selected.meta} />
            <Field label="Atendimentos" value={selected.visits} />
            <Field label="Ticket médio" value={brl(selected.ticket)} />
            <Field label="Última visita" value={selected.last} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selected.tags.map((t) => (
              <StatusPill key={t} tone="accent">
                {t}
              </StatusPill>
            ))}
          </div>
          <SectionTitle>{config.historyLabel}</SectionTitle>
          <div className="space-y-2">
            {selected.history.map((h) => (
              <Row
                key={h.date + h.label}
                title={h.label}
                subtitle={h.date}
                right={<span className="text-xs font-semibold text-accent">{brl(h.value)}</span>}
              />
            ))}
          </div>
          <SectionTitle>Observações</SectionTitle>
          <p className="rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground">{selected.notes}</p>
          <div className="mt-3 space-y-2">
            <TextInput label="Nova observação" value={note} onChange={setNote} placeholder="Ex: prefere atendimento à tarde" />
            <PrimaryButton
              disabled={!note.trim()}
              onClick={() => {
                setClients((prev) =>
                  prev.map((c) => (c.id === selected.id ? { ...c, notes: note.trim() } : c)),
                );
                setSelected({ ...selected, notes: note.trim() });
                setNote("");
                toast.success("Ficha atualizada");
              }}
            >
              Salvar observação
            </PrimaryButton>
          </div>
        </Sheet>
      ) : null}

      {adding ? (
        <Sheet title={`Novo ${config.entityLabel.toLowerCase()}`} onClose={() => setAdding(false)}>
          <div className="space-y-2">
            <TextInput label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Nome completo" />
            <TextInput
              label="Informação principal"
              value={form.meta}
              onChange={(v) => setForm({ ...form, meta: v })}
              placeholder="Telefone, veículo, pet..."
            />
            <PrimaryButton
              disabled={!form.name.trim()}
              onClick={() => {
                setClients((prev) => [
                  {
                    id: `c-${Date.now()}`,
                    name: form.name.trim(),
                    meta: form.meta.trim() || "Sem informações",
                    emoji: "🧾",
                    tags: ["novo"],
                    visits: 0,
                    ticket: 0,
                    last: "hoje",
                    notes: "Cadastro criado agora.",
                    history: [],
                  },
                  ...prev,
                ]);
                setForm({ name: "", meta: "" });
                setAdding(false);
                toast.success("Cadastro realizado");
              }}
            >
              Salvar cadastro
            </PrimaryButton>
          </div>
        </Sheet>
      ) : null}

      <TabBar
        tabs={[
          { id: "lista", label: "Cadastros", icon: <Users className="h-4 w-4" /> },
          { id: "indicadores", label: "Indicadores", icon: <Star className="h-4 w-4" /> },
        ]}
        active={tab}
        onChange={(id) => setTab(id as "lista" | "indicadores")}
      />
    </div>
  );
}
