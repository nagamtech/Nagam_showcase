import { Link } from "@tanstack/react-router";
import { Smartphone, Download, Menu, X } from "lucide-react";
import { toast } from "sonner";
import logoNavy from "@/assets/nagam-horizontal-navy.png.asset.json";
import logoWhite from "@/assets/nagam-horizontal-white.png.asset.json";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { useState } from "react";

const nav = [
  { to: "/", label: "Início" },
  { to: "/segmentos", label: "Segmentos" },
  { to: "/solucoes", label: "Soluções" },
] as const;

export function SiteHeader() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePwaInstall();
  const showInstall = !isInstalled && (isInstallable || isIOS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleInstallClick = async () => {
    if (!isInstallable && isIOS) {
      toast.info("Instalar no iPhone", {
        description: 'Toque em Compartilhar e escolha "Adicionar à Tela de Início".',
      });
      return;
    }
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
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 relative">
        {/* Logo à esquerda */}
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Nagam">
          <img src={logoNavy.url} alt="Nagam" className="h-10 w-auto shrink-0 dark:hidden" />
          <img src={logoWhite.url} alt="Nagam" className="hidden h-10 w-auto shrink-0 dark:block" />
        </Link>

        {/* Espaço flexível */}
        <div className="flex-1" />

        {/* ✅ BOTÃO COM "DOWNLOAD" SEMPRE VISÍVEL */}
        {showInstall && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Download do App"
            title="Download do App"
          >
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            <span>Download</span> {/* ✅ SEMPRE VISÍVEL */}
          </button>
        )}

        {/* Menu desktop — visível em telas grandes */}
        <nav className="hidden md:flex min-w-0 items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted"
              activeProps={{ className: "bg-accent-soft text-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Ícone Hambúrguer — visível apenas no mobile */}
        <button
          type="button"
          className="md:hidden ml-1 p-1.5 rounded-full hover:bg-muted transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* ✅ MENU MOBILE — FUNDO AZUL + MAIS ESPAÇAMENTO */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 rounded-xl shadow-lg overflow-hidden md:hidden"
               style={{ backgroundColor: "#0a2463" }}> {/* Cor azul da marca */}
            <nav className="flex flex-col p-4 gap-3"> {/* Mais espaçamento entre itens */}
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-white transition hover:bg-white/10"
                  activeProps={{ className: "bg-white/20 text-white font-semibold" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
