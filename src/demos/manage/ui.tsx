import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "accent" | "warn" | "plain";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg leading-none font-semibold tracking-tight",
          tone === "accent" && "text-accent",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mt-5 mb-2 flex items-center justify-between first:mt-0">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase">{children}</p>
      {right}
    </div>
  );
}

export function StatusPill({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: "ok" | "warn" | "danger" | "accent" | "plain";
}) {
  const tones: Record<string, string> = {
    ok: "bg-emerald-500/12 text-emerald-600",
    warn: "bg-amber-500/15 text-amber-600",
    danger: "bg-red-500/12 text-red-600",
    accent: "bg-accent-soft text-accent",
    plain: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
      />
      {value ? (
        <button onClick={() => onChange("")} aria-label="Limpar">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      ) : null}
    </div>
  );
}

export function Row({
  emoji,
  title,
  subtitle,
  right,
  onClick,
}: {
  emoji?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left",
        onClick && "transition hover:border-accent/40 active:scale-[0.99]",
      )}
    >
      {emoji ? (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-base">
          {emoji}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{title}</span>
        {subtitle ? (
          <span className="block truncate text-[11px] text-muted-foreground">{subtitle}</span>
        ) : null}
      </span>
      {right ? <span className="shrink-0 text-right">{right}</span> : null}
    </Tag>
  );
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium">{value}</span>
    </div>
  );
}

export function MiniBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-24 items-end gap-1.5">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-accent/80"
            style={{ height: `${Math.max(6, (d.value / max) * 76)}px` }}
          />
          <span className="text-[9px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-foreground/30 backdrop-blur-[2px]">
      <button className="flex-1" aria-label="Fechar" onClick={onClose} />
      <div className="animate-fade-in max-h-[80%] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-4 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          <button onClick={onClose} aria-label="Fechar" className="text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ChainNote({ steps }: { steps: string[] }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-accent/40 bg-accent-soft/50 p-3">
      <p className="text-[10px] font-semibold text-accent uppercase">Módulos integrados</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{steps.join(" → ")}</p>
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
      />
    </label>
  );
}
