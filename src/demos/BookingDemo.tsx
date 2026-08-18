import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Check, Clock, Home, User } from "lucide-react";
import type { BookingConfig } from "@/data/types";
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
  SelectTile,
  TabBar,
} from "./ui";

type Step = "home" | "pros" | "services" | "date" | "time" | "name" | "confirm" | "success";

interface Appointment {
  id: string;
  pro: string;
  service: string;
  date: Date;
  time: string;
  price: number;
  client: string;
  status: "confirmado" | "cancelado";
}

const SLOTS = ["09:00", "09:40", "10:20", "11:00", "13:30", "14:10", "15:00", "16:20", "17:00", "18:00"];

const dayLabel = (d: Date) =>
  d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").toUpperCase();
const fullDate = (d: Date) =>
  d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", weekday: "long" });

export default function BookingDemo({ config }: { config: BookingConfig }) {
  const [tab, setTab] = useState<"agendar" | "historico">("agendar");
  const [step, setStep] = useState<Step>("home");
  const [pro, setPro] = useState<BookingConfig["pros"][number] | null>(null);
  const [service, setService] = useState<BookingConfig["services"][number] | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);

  const days = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return [
      {
        id: "seed-1",
        pro: config.pros[0].name,
        service: config.services[0].name,
        date: d,
        time: "10:20",
        price: config.services[0].price,
        client: "Você",
        status: "confirmado",
      },
    ];
  });

  const takenSlots = (d: Date | null) => {
    if (!d) return new Set<string>();
    const seed = d.getDate() + d.getMonth();
    return new Set(SLOTS.filter((_, i) => (i * 3 + seed) % 5 === 0));
  };

  const run = (label: string, ms: number, done: () => void) => {
    setLoading(label);
    window.setTimeout(() => {
      setLoading(null);
      done();
    }, ms);
  };

  const reset = () => {
    setPro(null);
    setService(null);
    setDate(null);
    setTime(null);
    setName("");
    setRescheduleId(null);
    setStep("home");
  };

  const confirm = () => {
    run("Confirmando agendamento", 900, () => {
      if (rescheduleId) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === rescheduleId
              ? { ...a, pro: pro!.name, service: service!.name, date: date!, time: time!, price: service!.price }
              : a,
          ),
        );
        toast.success("Agendamento remarcado");
      } else {
        setAppointments((prev) => [
          {
            id: `a-${Date.now()}`,
            pro: pro!.name,
            service: service!.name,
            date: date!,
            time: time!,
            price: service!.price,
            client: name.trim() || "Você",
            status: "confirmado",
          },
          ...prev,
        ]);
        toast.success("Agendamento confirmado");
      }
      setStep("success");
    });
  };

  const cancel = (id: string) => {
    run("Cancelando", 600, () => {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a)));
      toast("Agendamento cancelado", { description: "O horário voltou a ficar disponível." });
    });
  };

  const reschedule = (a: Appointment) => {
    setRescheduleId(a.id);
    setPro(config.pros.find((p) => p.name === a.pro) ?? config.pros[0]);
    setService(config.services.find((s) => s.name === a.service) ?? config.services[0]);
    setDate(null);
    setTime(null);
    setName(a.client);
    setTab("agendar");
    setStep("date");
    toast("Escolha o novo horário");
  };

  const body = () => {
    if (tab === "historico") {
      return (
        <Screen k="historico">
          <DemoHeader title="Meus agendamentos" subtitle={`${appointments.length} registro(s)`} />
          <DemoScroll>
            {appointments.length === 0 ? (
              <EmptyState emoji="🗓️" title="Nada por aqui" text="Seus agendamentos aparecem nesta tela." />
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-border bg-card p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{a.service}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.pro} • {a.client}
                        </p>
                      </div>
                      <span
                        className={
                          a.status === "confirmado"
                            ? "rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent"
                            : "rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                        }
                      >
                        {a.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {a.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {a.time}
                      </span>
                      <span className="ml-auto font-medium text-foreground">{brl(a.price)}</span>
                    </div>
                    {a.status === "confirmado" ? (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => reschedule(a)}
                          className="rounded-xl border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted active:scale-[0.98]"
                        >
                          Reagendar
                        </button>
                        <button
                          onClick={() => cancel(a.id)}
                          className="rounded-xl border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/5 active:scale-[0.98]"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
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
                <p className="text-xs font-medium text-accent">Agendamento online</p>
                <p className="mt-1 text-lg leading-tight font-semibold tracking-tight">
                  Escolha {config.proLabel.toLowerCase()}, {config.serviceLabel.toLowerCase()} e horário
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Leva menos de 30 segundos.</p>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Próximo horário livre</p>
                <SelectTile
                  emoji="⚡"
                  title={`Hoje às ${SLOTS[3]}`}
                  subtitle={`${config.pros[0].name} • ${config.services[0].name}`}
                  meta={brl(config.services[0].price)}
                  onClick={() => {
                    setPro(config.pros[0]);
                    setService(config.services[0]);
                    setDate(days[0]);
                    setTime(SLOTS[3]);
                    setStep("name");
                  }}
                />
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  {config.proLabel}s disponíveis
                </p>
                <div className="space-y-2">
                  {config.pros.map((p) => (
                    <SelectTile
                      key={p.id}
                      emoji={p.emoji}
                      title={p.name}
                      subtitle={p.role}
                      meta={`★ ${p.rating.toFixed(1)}`}
                      onClick={() => {
                        setPro(p);
                        setStep("services");
                      }}
                    />
                  ))}
                </div>
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton onClick={() => setStep("pros")}>Novo agendamento</PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "pros":
        return (
          <Screen k="pros">
            <DemoHeader
              title={`Escolha o ${config.proLabel.toLowerCase()}`}
              subtitle="Etapa 1 de 5"
              onBack={() => setStep("home")}
            />
            <DemoScroll>
              <div className="space-y-2">
                {config.pros.map((p) => (
                  <SelectTile
                    key={p.id}
                    emoji={p.emoji}
                    title={p.name}
                    subtitle={p.role}
                    meta={`★ ${p.rating.toFixed(1)}`}
                    active={pro?.id === p.id}
                    onClick={() => setPro(p)}
                  />
                ))}
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton disabled={!pro} onClick={() => setStep("services")}>
                Continuar
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "services":
        return (
          <Screen k="services">
            <DemoHeader
              title={`Escolha o ${config.serviceLabel.toLowerCase()}`}
              subtitle="Etapa 2 de 5"
              onBack={() => setStep("pros")}
            />
            <DemoScroll>
              <div className="space-y-2">
                {config.services.map((s) => (
                  <SelectTile
                    key={s.id}
                    emoji="🕑"
                    title={s.name}
                    subtitle={`${s.note} • ${s.duration} min`}
                    meta={brl(s.price)}
                    active={service?.id === s.id}
                    onClick={() => setService(s)}
                  />
                ))}
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton disabled={!service} onClick={() => setStep("date")}>
                Continuar
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "date":
        return (
          <Screen k="date">
            <DemoHeader
              title="Selecione a data"
              subtitle="Etapa 3 de 5"
              onBack={() => setStep("services")}
            />
            <DemoScroll>
              <div className="grid grid-cols-4 gap-2">
                {days.map((d) => {
                  const active = date?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      onClick={() => setDate(d)}
                      className={
                        active
                          ? "rounded-2xl border border-accent bg-accent px-2 py-3 text-accent-foreground transition active:scale-95"
                          : "rounded-2xl border border-border bg-card px-2 py-3 transition hover:border-accent/40 active:scale-95"
                      }
                    >
                      <span className="block text-[10px] font-medium opacity-70">{dayLabel(d)}</span>
                      <span className="block text-base font-semibold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
              {date ? (
                <p className="mt-4 text-xs text-muted-foreground capitalize">{fullDate(date)}</p>
              ) : null}
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton disabled={!date} onClick={() => setStep("time")}>
                Ver horários
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "time": {
        const taken = takenSlots(date);
        return (
          <Screen k="time">
            <DemoHeader
              title="Selecione o horário"
              subtitle="Etapa 4 de 5"
              onBack={() => setStep("date")}
            />
            <DemoScroll>
              <p className="mb-3 text-xs text-muted-foreground capitalize">{date ? fullDate(date) : ""}</p>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <Chip
                    key={s}
                    active={time === s}
                    disabled={taken.has(s)}
                    onClick={() => setTime(s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Horários riscados já estão ocupados na agenda.
              </p>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton disabled={!time} onClick={() => setStep("name")}>
                Continuar
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );
      }

      case "name":
        return (
          <Screen k="name">
            <DemoHeader title="Seus dados" subtitle="Etapa 5 de 5" onBack={() => setStep("time")} />
            <DemoScroll>
              <label className="block text-xs font-semibold text-muted-foreground">Nome completo</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <div className="mt-4 rounded-2xl border border-border bg-muted/50 p-3 text-xs">
                <p className="font-semibold">Resumo</p>
                <p className="mt-1 text-muted-foreground">
                  {pro?.name} • {service?.name}
                </p>
                <p className="text-muted-foreground capitalize">
                  {date ? fullDate(date) : ""} às {time}
                </p>
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton disabled={name.trim().length < 2} onClick={() => setStep("confirm")}>
                Revisar agendamento
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "confirm":
        return (
          <Screen k="confirm">
            <DemoHeader title="Confirmar" subtitle="Revise os dados" onBack={() => setStep("name")} />
            <DemoScroll>
              <div className="rounded-2xl border border-border bg-card p-4">
                {[
                  [config.proLabel, pro?.name ?? ""],
                  [config.serviceLabel, service?.name ?? ""],
                  ["Data", date ? fullDate(date) : ""],
                  ["Horário", time ?? ""],
                  ["Duração", `${service?.duration} min`],
                  ["Cliente", name.trim()],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-0">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="text-right text-xs font-medium capitalize">{v}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-semibold text-accent">{brl(service?.price ?? 0)}</span>
                </div>
              </div>
            </DemoScroll>
            <DemoFooter>
              <PrimaryButton onClick={confirm}>
                {rescheduleId ? "Confirmar novo horário" : "Confirmar agendamento"}
              </PrimaryButton>
            </DemoFooter>
          </Screen>
        );

      case "success":
        return (
          <Screen k="success">
            <DemoScroll className="grid place-items-center text-center">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft">
                  <Check className="h-8 w-8 text-accent" />
                </span>
                <p className="mt-4 text-lg font-semibold tracking-tight">Tudo certo!</p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">
                  {service?.name} com {pro?.name}
                  <br />
                  {date ? fullDate(date) : ""} às {time}
                </p>
                <div className="mt-6 w-full space-y-2">
                  <PrimaryButton
                    onClick={() => {
                      reset();
                      setTab("historico");
                    }}
                  >
                    Ver meus agendamentos
                  </PrimaryButton>
                  <GhostButton onClick={reset}>Fazer outro agendamento</GhostButton>
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
          { id: "agendar", label: "Agendar", icon: <Home className="h-4 w-4" /> },
          { id: "historico", label: "Histórico", icon: <User className="h-4 w-4" /> },
        ]}
        active={tab}
        onChange={(id) => {
          setTab(id as "agendar" | "historico");
          if (id === "agendar" && step === "success") reset();
        }}
      />
    </div>
  );
}

