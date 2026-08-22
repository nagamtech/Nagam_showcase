import { useEffect, useState } from "react";
import { Maximize2, RotateCcw, X } from "lucide-react";
import type { DemoConfig } from "@/data/types";
import { DemoRenderer } from "@/demos";

export function PhoneFrame({
  config,
  demoKey,
  fullscreen,
}: {
  config: DemoConfig;
  demoKey: number;
  fullscreen?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="relative mx-auto w-full max-w-[340px] rounded-[3rem] border border-border bg-foreground/90 p-[10px]"
      style={{ boxShadow: "var(--shadow-float)" }}
    >
      <div
        className="relative overflow-hidden rounded-[2.4rem] bg-background"
        style={{ height: fullscreen ? "min(76vh, 720px)" : "min(70vh, 680px)" }}
      >
        <div className="pointer-events-none absolute top-2 left-1/2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
        <div className="h-full pt-6">
          {mounted ? (
            <DemoRenderer key={demoKey} config={config} />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup({ config, appName }: { config: DemoConfig; appName: string }) {
  const [demoKey, setDemoKey] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Uma única instância de DemoRenderer: expandir apenas altera o container,
  // sem remontar o demo (o estado do fluxo é preservado).
  return (
    <div>
      <div
        className={
          expanded
            ? "animate-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-foreground/40 p-4 backdrop-blur-md"
            : ""
        }
      >
        {expanded ? <p className="text-xs font-medium text-primary-foreground">{appName}</p> : null}

        <PhoneFrame config={config} demoKey={demoKey} fullscreen={expanded} />

        {expanded ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDemoKey((k) => k + 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Reiniciar
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              <X className="h-4 w-4" /> Fechar demonstração
            </button>
          </div>
        ) : (
          <div className="mx-auto mt-5 flex max-w-[340px] items-center gap-2">
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
            >
              <Maximize2 className="h-4 w-4" /> Expandir demonstração
            </button>
            <button
              onClick={() => setDemoKey((k) => k + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" /> Reiniciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
