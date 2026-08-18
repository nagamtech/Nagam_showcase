import { useState } from "react";
import { toast } from "sonner";
import { Check, Heart, LayoutGrid } from "lucide-react";
import type { CatalogConfig } from "@/data/types";
import {
  brl,
  Chip,
  DemoFooter,
  DemoHeader,
  DemoScroll,
  EmptyState,
  GhostButton,
  LoadingOverlay,
  PrimaryButton,
  Screen,
  TabBar,
} from "./ui";

type Step = "categories" | "products" | "detail" | "confirm" | "done";
type Item = CatalogConfig["categories"][number]["items"][number];

export default function CatalogDemo({ config }: { config: CatalogConfig }) {
  const [tab, setTab] = useState<"vitrine" | "reservas">("vitrine");
  const [step, setStep] = useState<Step>("categories");
  const [categoryId, setCategoryId] = useState(config.categories[0].id);
  const [item, setItem] = useState<Item | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [reservations, setReservations] = useState<
    { id: string; name: string; variant: string; price: number; emoji: string }[]
  >([]);

  const category = config.categories.find((c) => c.id === categoryId)!;

  const reserve = () => {
    setLoading("Reservando peça");
    window.setTimeout(() => {
      setLoading(null);
      setReservations((prev) => [
        {
          id: `r-${Date.now()}`,
          name: item!.name,
          variant: variant!,
          price: item!.price,
          emoji: item!.emoji,
        },
        ...prev,
      ]);
      toast.success("Reserva confirmada");
      setStep("done");
    }, 1000);
  };

  const body = () => {
    if (tab === "reservas") {
      return (
        <Screen k="reservas">
          <DemoHeader title="Minhas reservas" subtitle={`${reservations.length} item(s)`} />
          <DemoScroll>
            {reservations.length === 0 ? (
              <EmptyState emoji="🏷️" title="Nenhuma reserva" text="Reserve um item da vitrine para vê-lo aqui." />
            ) : (
              <div className="space-y-2">
                {reservations.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-lg">
                      {r.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {config.variantLabel}: {r.variant}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-accent">{brl(r.price)}</p>
                      <button
                        onClick={() => {
                          setReservations((prev) => prev.filter((x) => x.id !== r.id));
                          toast("Reserva cancelada");
                        }}
                        className="text-[11px] text-muted-foreground underline"
                      >
                        cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DemoScroll>
        </Screen>
      );
    }

    switch (step) {
      case "categories":
        return (
          <Screen k="categories">
            <DemoHeader title={config.appName} subtitle={config.tagline} />
            <DemoScroll>
              <div className="tile-gradient rounded-2xl border border-border p-4">
                <p className="text-xs font-medium text-accent">Vitrine digital</p>
                <p className="mt-1 text-lg leading-tight font-semibold tracking-tight">
                  Escolha, reserve e retire na loja
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Reserva sem pagamento antecipado.</p>
              </div>
              <p className="mt-4 mb-2 text-xs font-semibold text-muted-foreground">Categorias</p>
              <div className="grid grid-cols-2 gap-2">
                {config.categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategoryId(c.id);
                      setStep("products");
                    }}
                    className="rounded-2xl border border-border bg-card p-4 text-left transition hover:border-accent/40 active:scale-[0.98]"
                  >
                    <span className="block text-2xl">{c.emoji}</span>
                    <span className="mt-2 block text-sm font-semibold">{c.name}</span>
                    <span className="block text-[11px] text-muted-foreground">{c.items.length} itens</span>
                  </button>
                ))}
              </div>
            </DemoScroll>
          </Screen>
        );

      case "products":
        return (
          <Screen k="products">
            <DemoHeader title={category.name} subtitle={`${category.items.length} itens`} onBack={() => setStep("categories")} />
            <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 py-3">
              {config.categories.map((c) => (
                <Chip key={c.id} active={c.id === categoryId} onClick={() => setCategoryId(c.id)}>
                  {c.emoji} {c.name}
                </Chip>
              ))}
            </div>
            <DemoScroll className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                {category.items.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      setItem(i);
                      setVariant(null);
                      setStep("detail");
                    }}
                    className="overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-accent/40 active:scale-[0.98]"
                  >
                    <span className="grid h-24 place-items-center bg-accent-soft text-3xl">{i.emoji}</span>
                    <span className="block p-3">
                      <span className="block truncate text-xs font-semibold">{i.name}</span>
                      <span className="mt-1 block text-xs font-semibold text-accent">{brl(i.price)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </DemoScroll>
          </Screen>
        );

      case "detail":
        return (
          <Screen k="detail">
            <DemoHeader title={item!.name} onBack={() => setStep("products")} />
            <DemoScroll>
              <div className="grid h-44 place-items-center rounded-2xl bg-accent-soft text-6xl">{item!.emoji}</div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold">{item!.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item!.desc}</p>
                </div>
                <button
                  onClick={() => toast("Salvo nos favoritos")}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition active:scale-95"
                  aria-label="Favoritar"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-lg font-semibold text-accent">{brl(item!.price)}</p>
              <p className="mt-5 mb-2 text-xs font-semibold text-muted-foreground">{config.variantLabel}</p>
              <div className="flex flex-wrap gap-2">
                {item!.variants.map((v) => (
                  <Chip key={v} active={variant === v} onClick={() => setVariant(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton disabled={!variant} onClick={() => setStep("confirm")}>
                {variant ? "Reservar item" : `Selecione ${config.variantLabel.toLowerCase()}`}
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "confirm":
        return (
          <Screen k="confirm">
            <DemoHeader title="Confirmar reserva" onBack={() => setStep("detail")} />
            <DemoScroll>
              <div className="rounded-2xl border border-border bg-card p-4">
                {[
                  ["Item", item!.name],
                  [config.variantLabel, variant ?? ""],
                  ["Retirada", "Loja física • até 48h"],
                  ["Pagamento", "Na retirada"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="text-xs font-medium">{v}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Valor</span>
                  <span className="text-sm font-semibold text-accent">{brl(item!.price)}</span>
                </div>
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton onClick={reserve}>Confirmar reserva</PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "done":
        return (
          <Screen k="done">
            <DemoScroll className="grid place-items-center text-center">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft">
                  <Check className="h-8 w-8 text-accent" />
                </span>
                <p className="mt-4 text-lg font-semibold tracking-tight">Reserva confirmada</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item!.name} • {config.variantLabel}: {variant}
                </p>
                <div className="mt-6 w-full space-y-2">
                  <PrimaryButton onClick={() => setTab("reservas")}>Ver minhas reservas</PrimaryButton>
                  <GhostButton onClick={() => setStep("categories")}>Continuar navegando</GhostButton>
                </div>
              </div>
            </DemoScroll>
          </Screen>
        );
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      {loading ? <LoadingOverlay label={loading} /> : null}
      <div className="flex min-h-0 flex-1 flex-col">{body()}</div>
      <TabBar
        tabs={[
          { id: "vitrine", label: "Vitrine", icon: <LayoutGrid className="h-4 w-4" /> },
          { id: "reservas", label: "Reservas", icon: <Heart className="h-4 w-4" /> },
        ]}
        active={tab}
        onChange={(id) => setTab(id as "vitrine" | "reservas")}
      />
    </div>
  );
}