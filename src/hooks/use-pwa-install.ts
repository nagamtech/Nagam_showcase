import { useEffect, useRef, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallStatus = "idle" | "prompting" | "accepted" | "dismissed" | "error";

export function usePwaInstall() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [status, setStatus] = useState<InstallStatus>("idle");
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-expect-error iOS Safari proprietary property
        window.navigator.standalone === true;
      setIsInstalled(standalone);
      return standalone;
    };

    if (checkInstalled()) {
      setIsInstallable(false);
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };

    const onAppInstalled = () => {
      deferredPrompt.current = null;
      setIsInstallable(false);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = () => {
      if (checkInstalled()) {
        setIsInstallable(false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onDisplayModeChange);
    } else {
      // @ts-expect-error older API fallback
      mediaQuery.addListener(onDisplayModeChange);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", onDisplayModeChange);
      } else {
        // @ts-expect-error older API fallback
        mediaQuery.removeListener(onDisplayModeChange);
      }
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPrompt.current;
    if (!promptEvent) return { outcome: "dismissed" as const };

    setStatus("prompting");
    try {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      setStatus(choice.outcome === "accepted" ? "accepted" : "dismissed");
      deferredPrompt.current = null;
      setIsInstallable(false);
      return choice;
    } catch (error) {
      setStatus("error");
      return { outcome: "dismissed" as const, error };
    }
  }, []);

  return {
    isInstallable,
    isInstalled,
    status,
    promptInstall,
  };
}
