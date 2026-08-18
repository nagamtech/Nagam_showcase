import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const brl = (v: number) =>
  v === 0 ? "Grátis" : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function DemoHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="-ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-foreground transition hover:bg-muted active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-tight">{title}</p>
        {subtitle ? (
          <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </header>
  );
}

export function DemoScroll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("no-scrollbar flex-1 overflow-y-auto px-4 py-4", className)}>{children}</div>
  );
}

export function DemoFooter({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-border bg-card px-4 py-3 pb-4">{children}</div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

export function SelectTile({
  emoji,
  title,
  subtitle,
  meta,
  active,
  onClick,
}: {
  emoji?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition active:scale-[0.99]",
        active ? "border-accent ring-2 ring-accent/25" : "border-border hover:border-accent/40",
      )}
    >
      {emoji ? (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-lg">
          {emoji}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{title}</span>
        {subtitle ? (
          <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </span>
      {meta ? <span className="shrink-0 text-xs font-medium text-muted-foreground">{meta}</span> : null}
    </button>
  );
}

export function Chip({
  children,
  active,
  onClick,
  disabled,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-foreground hover:border-accent/40",
        disabled && "cursor-not-allowed opacity-35 line-through",
      )}
    >
      {children}
    </button>
  );
}

export function LoadingOverlay({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-card/85 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon: ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="flex shrink-0 items-center justify-around border-t border-border bg-card px-2 pt-2 pb-4">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 rounded-xl py-1 text-[10px] font-medium transition",
            active === t.id ? "text-accent" : "text-muted-foreground",
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </nav>
  );
}

export function Screen({ children, k }: { children: ReactNode; k: string }) {
  return (
    <div key={k} className="animate-fade-in flex h-full min-h-0 flex-col">
      {children}
    </div>
  );
}

export function EmptyState({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="grid place-items-center px-6 py-14 text-center">
      <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-2xl">
        {emoji}
      </span>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}