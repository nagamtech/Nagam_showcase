import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Início" },
  { to: "/segmentos", label: "Segmentos" },
  { to: "/solucoes", label: "Soluções" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
            S
          </span>
          <span className="truncate text-sm font-semibold tracking-tight">Showcase Apps</span>
        </Link>
        <nav className="no-scrollbar ml-auto flex items-center gap-1 overflow-x-auto">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted"
              activeProps={{ className: "bg-accent-soft text-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}