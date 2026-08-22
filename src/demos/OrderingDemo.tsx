import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Minus, Plus, Receipt, ShoppingBag, Store, Truck, UtensilsCrossed } from "lucide-react";
import type { OrderingConfig } from "@/data/types";
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

type Step = "home" | "category" | "product" | "cart" | "checkout" | "payment" | "sent";
type Item = OrderingConfig["categories"][number]["items"][number];

const STATUSES = ["Pedido recebido", "Em preparo", "Pronto", "Saiu para entrega", "Concluído"];

export default function OrderingDemo({ config }: { config: OrderingConfig }) {
  const [tab, setTab] = useState<"loja" | "pedidos">("loja");
  const [step, setStep] = useState<Step>("home");
  const [categoryId, setCategoryId] = useState(config.categories[0]!.id);
  const [product, setProduct] = useState<Item | null>(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<{ item: Item; qty: number }[]>([]);
  const [mode, setMode] = useState<"retirada" | "entrega">("retirada");
  const [payment, setPayment] = useState<"pix" | "cartao" | "dinheiro">("pix");
  const [loading, setLoading] = useState<string | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  const category = config.categories.find((c) => c.id === categoryId)!;
  const subtotal = cart.reduce((t, l) => t + l.item.price * l.qty, 0);
  const fee = mode === "entrega" ? 7 : 0;
  const total = subtotal + fee;
  const cartCount = cart.reduce((t, l) => t + l.qty, 0);
  const featured = useMemo(() => config.categories.flatMap((c) => c.items).slice(0, 3), [config]);

  const run = (label: string, ms: number, done: () => void) => {
    setLoading(label);
    window.setTimeout(() => {
      setLoading(null);
      done();
    }, ms);
  };

  const addToCart = (item: Item, quantity: number) => {
    setCart((prev) => {
      const found = prev.find((l) => l.item.id === item.id);
      if (found) return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + quantity } : l));
      return [...prev, { item, qty: quantity }];
    });
    toast.success(`${item.name} no carrinho`);
  };

  const changeQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((l) => (l.item.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );

  const reset = () => {
    setCart([]);
    setStep("home");
    setStatusIndex(0);
    setOrderId(null);
    setQty(1);
    setProduct(null);
  };

  const advanceStatus = () => {
    setStatusIndex((i) => {
      const next = Math.min(i + 1, STATUSES.length - 1);
      toast(STATUSES[next]);
      return next;
    });
  };

  const body = () => {
    if (tab === "pedidos") {
      return (
        <Screen k="pedidos">
          <DemoHeader title="Meus pedidos" subtitle={orderId ? `#${orderId}` : "Nenhum pedido ativo"} />
          <DemoScroll>
            {!orderId ? (
              <EmptyState emoji="🧾" title="Sem pedidos ainda" text="Finalize um pedido para acompanhar aqui." />
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Pedido #{orderId}</p>
                  <p className="mt-1 text-sm font-semibold">{STATUSES[statusIndex]}</p>
                  <div className="mt-3 space-y-2">
                    {STATUSES.map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <span
                          className={
                            i <= statusIndex
                              ? "grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground"
                              : "grid h-5 w-5 place-items-center rounded-full border border-border text-muted-foreground"
                          }
                        >
                          {i <= statusIndex ? <Check className="h-3 w-3" /> : null}
                        </span>
                        <span className={i <= statusIndex ? "text-xs font-medium" : "text-xs text-muted-foreground"}>
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <GhostButton onClick={advanceStatus}>Simular próximo status</GhostButton>
                <GhostButton
                  onClick={() => {
                    reset();
                    setTab("loja");
                  }}
                >
                  Fazer novo pedido
                </GhostButton>
              </div>
            )}
          </DemoScroll>
        </Screen>
      );
    }

    switch (step) {
      case "home":
        return (
          <Screen k="home">
            <DemoHeader title={config.appName} subtitle={config.tagline} />
            <DemoScroll>
              <div className="tile-gradient rounded-2xl border border-border p-4">
                <p className="text-xs font-medium text-accent">Aberto agora</p>
                <p className="mt-1 text-lg leading-tight font-semibold tracking-tight">
                  Peça pelo app e retire sem fila
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Entrega em até 35 min na região.</p>
              </div>
              <p className="mt-4 mb-2 text-xs font-semibold text-muted-foreground">Categorias</p>
              <div className="grid grid-cols-3 gap-2">
                {config.categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategoryId(c.id);
                      setStep("category");
                    }}
                    className="rounded-2xl border border-border bg-card px-2 py-3 text-center transition hover:border-accent/40 active:scale-95"
                  >
                    <span className="block text-xl">{c.emoji}</span>
                    <span className="mt-1 block text-[11px] font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
              <p className="mt-5 mb-2 text-xs font-semibold text-muted-foreground">Mais pedidos</p>
              <div className="space-y-2">
                {featured.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      const owner = config.categories.find((c) =>
                        c.items.some((it) => it.id === i.id),
                      );
                      if (owner) setCategoryId(owner.id);
                      setProduct(i);
                      setQty(1);
                      setStep("product");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition hover:border-accent/40 active:scale-[0.99]"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-xl">
                      {i.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{i.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{i.desc}</span>
                    </span>
                    <span className="text-sm font-semibold text-accent">{brl(i.price)}</span>
                  </button>
                ))}
              </div>
            </DemoScroll>
          </Screen>
        );

      case "category":
        return (
          <Screen k="category">
            <DemoHeader title={category.name} subtitle={`${category.items.length} itens`} onBack={() => setStep("home")} />
            <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 py-3">
              {config.categories.map((c) => (
                <Chip key={c.id} active={c.id === categoryId} onClick={() => setCategoryId(c.id)}>
                  {c.emoji} {c.name}
                </Chip>
              ))}
            </div>
            <DemoScroll className="pt-0">
              <div className="space-y-2">
                {category.items.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      setProduct(i);
                      setQty(1);
                      setStep("product");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition hover:border-accent/40 active:scale-[0.99]"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-xl">
                      {i.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{i.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{i.desc}</span>
                    </span>
                    <span className="text-sm font-semibold text-accent">{brl(i.price)}</span>
                  </button>
                ))}
              </div>
            </DemoScroll>
          </Screen>
        );

      case "product":
        return (
          <Screen k="product">
            <DemoHeader title={product!.name} onBack={() => setStep("category")} />
            <DemoScroll>
              <div className="grid h-40 place-items-center rounded-2xl bg-accent-soft text-6xl">
                {product!.emoji}
              </div>
              <p className="mt-4 text-base font-semibold">{product!.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{product!.desc}</p>
              <p className="mt-3 text-lg font-semibold text-accent">{brl(product!.price)}</p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border transition active:scale-95"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border transition active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton
                onClick={() => {
                  addToCart(product!, qty);
                  setStep("cart");
                }}
              >
                Adicionar • {brl(product!.price * qty)}
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "cart":
        return (
          <Screen k="cart">
            <DemoHeader title="Carrinho" subtitle={`${cartCount} item(s)`} onBack={() => setStep("home")} />
            <DemoScroll>
              {cart.length === 0 ? (
                <EmptyState emoji="🛒" title="Carrinho vazio" text="Adicione itens do cardápio para continuar." />
              ) : (
                <div className="space-y-2">
                  {cart.map((l) => (
                    <div key={l.item.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-lg">
                        {l.item.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{l.item.name}</p>
                        <p className="text-xs text-muted-foreground">{brl(l.item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeQty(l.item.id, -1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-border active:scale-95"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-semibold">{l.qty}</span>
                        <button
                          onClick={() => changeQty(l.item.id, 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-border active:scale-95"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DemoScroll>
            <DemoFooter>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{brl(subtotal)}</span>
              </div>
              <PrimaryButton disabled={cart.length === 0} onClick={() => setStep("checkout")}>
                Continuar
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "checkout":
        return (
          <Screen k="checkout">
            <DemoHeader title="Entrega" subtitle="Como você quer receber?" onBack={() => setStep("cart")} />
            <DemoScroll>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "retirada", label: "Retirar no local", icon: <Store className="h-4 w-4" /> },
                    { id: "entrega", label: "Entrega", icon: <Truck className="h-4 w-4" /> },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setMode(o.id)}
                    className={
                      mode === o.id
                        ? "rounded-2xl border border-accent bg-accent-soft p-3 text-left"
                        : "rounded-2xl border border-border bg-card p-3 text-left transition hover:border-accent/40"
                    }
                  >
                    <span className="text-accent">{o.icon}</span>
                    <span className="mt-2 block text-xs font-semibold">{o.label}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      {o.id === "entrega" ? "Taxa R$ 7,00" : "Sem taxa"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-5 mb-2 text-xs font-semibold text-muted-foreground">Pagamento</p>
              <div className="flex flex-wrap gap-2">
                {(["pix", "cartao", "dinheiro"] as const).map((p) => (
                  <Chip key={p} active={payment === p} onClick={() => setPayment(p)}>
                    {p === "pix" ? "Pix" : p === "cartao" ? "Cartão" : "Dinheiro"}
                  </Chip>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-border bg-muted/50 p-3 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{brl(subtotal)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Taxa</span>
                  <span>{fee === 0 ? "Grátis" : brl(fee)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-border pt-2 text-sm font-semibold">
                  <span>Total</span>
                  <span className="text-accent">{brl(total)}</span>
                </div>
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton onClick={() => setStep("payment")}>Ir para o pagamento</PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "payment":
        return (
          <Screen k="payment">
            <DemoHeader title="Pagamento simulado" onBack={() => setStep("checkout")} />
            <DemoScroll>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">Valor a pagar</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{brl(total)}</p>
                <div className="mx-auto mt-4 grid h-32 w-32 place-items-center rounded-2xl bg-muted text-4xl">
                  {payment === "pix" ? "🔳" : payment === "cartao" ? "💳" : "💵"}
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Demonstração: nenhum valor é cobrado de verdade.
                </p>
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton
                onClick={() =>
                  run("Processando pagamento", 1200, () => {
                    setOrderId(String(1000 + Math.floor(Math.random() * 9000)));
                    setStatusIndex(0);
                    setStep("sent");
                    toast.success("Pagamento aprovado");
                  })
                }
              >
                Pagar agora
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "sent":
        return (
          <Screen k="sent">
            <DemoScroll className="grid place-items-center text-center">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft">
                  <Check className="h-8 w-8 text-accent" />
                </span>
                <p className="mt-4 text-lg font-semibold tracking-tight">Pedido enviado!</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pedido #{orderId} • {mode === "entrega" ? "Entrega" : "Retirada"} • {brl(total)}
                </p>
                <div className="mt-6 w-full space-y-2">
                  <PrimaryButton onClick={() => setTab("pedidos")}>Acompanhar pedido</PrimaryButton>
                  <GhostButton onClick={reset}>Voltar ao cardápio</GhostButton>
                </div>
              </div>
            </DemoScroll>
          </Screen>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      {loading ? <LoadingOverlay label={loading} /> : null}
      <div className="flex min-h-0 flex-1 flex-col">{body()}</div>
      <TabBar
        tabs={[
          { id: "loja", label: "Cardápio", icon: <UtensilsCrossed className="h-4 w-4" /> },
          { id: "pedidos", label: "Pedidos", icon: <Receipt className="h-4 w-4" /> },
        ]}
        active={tab}
        onChange={(id) => {
          const next = id as "loja" | "pedidos";
          setTab(next);
          if (next === "loja" && step === "sent") reset();
        }}
      />
      {tab === "loja" && cartCount > 0 && ["home", "category", "product"].includes(step) ? (
        <button
          onClick={() => setStep("cart")}
          className="absolute right-4 bottom-20 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-lg transition active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" /> {cartCount} • {brl(subtotal)}
        </button>
      ) : null}
    </div>
  );
}