import { Link } from "@tanstack/react-router";
import { Smartphone, Download } from "lucide-react";
import { toast } from "sonner";

import logoNavy from "@/assets/nagam-horizontal-navy.png.asset.json";
import logoWhite from "@/assets/nagam-horizontal-white.png.asset.json";
import { usePwaInstall } from "@/hooks/use-pwa-install";

const nav = [
  { to: "/", label: "Início" },
  { to: "/segmentos", label: "Segmentos" },
  { to: "/solucoes", label: "Soluções" },
] as const;

export function SiteHeader() {
  const { isInstallable, promptInstall } = usePwaInstall();

  const handleInstallClick = async () => {
    const result = await promptInstall();
    if (result.outcome === "accepted") {
      toast.success("Instalação iniciada", {
        description: "O app Nagam será adicionado à sua tela inicial.",
      });
    } else {
      toast.info("Instalação adiada", {
        description: "Você pode instalar o app a qualquer momento pelo menu do navegador.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Nagam">
          <img src={logoNavy.url} alt="Nagam" className="h-10 w-auto shrink-0 dark:hidden" />
          <img src={logoWhite.url} alt="Nagam" className="hidden h-10 w-auto shrink-0 dark:block" />
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
          {isInstallable && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Instalar app"
              title="Instalar app"
            >
              <span className="relative flex items-center justify-center">
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                <Download className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
