"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Navigation listener component wrapped in Suspense to safely read searchParams
 * without de-optimizing Next.js static prerendering during build.
 */
function NavigationEvents({ onComplete }: { onComplete: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid triggering complete on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onComplete();
  }, [pathname, searchParams, onComplete]);

  return null;
}

export interface TopLoadingBarProps {
  /** Height in pixels (default: 3.5) */
  height?: number;
  /** Custom z-index (default: 99999) */
  zIndex?: number;
}

export default function TopLoadingBar({
  height = 3.5,
  zIndex = 99999,
}: TopLoadingBarProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "completing">("idle");

  const statusRef = useRef<"idle" | "loading" | "completing">("idle");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const trickleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const complete = useCallback(() => {
    if (statusRef.current === "idle") return;

    clearTimers();
    setStatus("completing");
    setProgress(100);

    // After width expands to 100% (200ms), begin fade-out
    setTimeout(() => {
      setVisible(false);

      // Once fade-out finishes (250ms), reset state back to 0
      setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 250);
    }, 200);
  }, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();

    setVisible(true);
    setStatus("loading");
    setProgress(20);

    // Trickle progress naturally while the page loads
    trickleTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        let step = 2;
        if (prev < 45) step = 10;
        else if (prev < 70) step = 5;
        else if (prev < 85) step = 2;
        else step = 0.5;
        return Math.min(prev + step, 92);
      });
    }, 220);

    // Safety timeout in case navigation is cancelled or fails
    safetyTimerRef.current = setTimeout(() => {
      complete();
    }, 8000);
  }, [clearTimers, complete]);

  // Global click & navigation listeners
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore right/middle clicks or modified clicks (Ctrl, Cmd, Shift, Alt)
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }
      if (e.defaultPrevented) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a");
      if (!anchor) return;

      // Ignore external tabs, downloads, or custom targets
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel")?.includes("external")) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("javascript:") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:")
      ) {
        return;
      }

      // Ignore on-page anchor hashes (#reviews, #pune-locations)
      if (href.startsWith("#")) return;

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Ignore external domains
        if (targetUrl.origin !== currentUrl.origin) return;

        // Ignore if clicking link to the exact same page & search query
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }

        // Valid internal route change initiated
        start();
      } catch {
        // Fallback: ignore malformed URLs
      }
    };

    const handlePopState = () => {
      start();
    };

    const handleCustomStart = () => start();
    const handleCustomComplete = () => complete();

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("top-loader:start", handleCustomStart);
    window.addEventListener("top-loader:complete", handleCustomComplete);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("top-loader:start", handleCustomStart);
      window.removeEventListener("top-loader:complete", handleCustomComplete);
      clearTimers();
    };
  }, [start, complete, clearTimers]);

  return (
    <>
      <Suspense fallback={null}>
        <NavigationEvents onComplete={complete} />
      </Suspense>

      <div
        id="top-loading-bar"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 pointer-events-none transition-opacity duration-250 ease-out"
        style={{
          zIndex,
          opacity: visible ? 1 : 0,
          height: `${height}px`,
        }}
      >
        <div
          className="h-full relative overflow-hidden shadow-xs"
          style={{
            width: `${progress}%`,
            transitionProperty: "width",
            transitionDuration:
              status === "completing" ? "200ms" : status === "idle" ? "0ms" : "300ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            background:
              "linear-gradient(90deg, #E64A19 0%, #FF5722 45%, #FFA000 80%, #FFB300 100%)",
            boxShadow:
              "0 0 12px rgba(255, 87, 34, 0.75), 0 0 5px rgba(255, 160, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Subtle light shimmer passing across bar during loading */}
          <div
            className="absolute inset-0 top-loader-shimmer pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
              width: "60%",
            }}
          />

          {/* Luminous Leading Edge Peg Glow */}
          <div
            className="absolute right-0 top-0 h-full pointer-events-none"
            style={{
              width: "100px",
              height: "100%",
              boxShadow: "0 0 14px #FFA000, 0 0 8px #FF5722",
              opacity: 0.95,
              transform: "rotate(3deg) translate(0px, -4px)",
            }}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Programmatic helper to manually trigger the top loading bar
 */
export function startTopLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("top-loader:start"));
  }
}

/**
 * Programmatic helper to manually finish the top loading bar
 */
export function completeTopLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("top-loader:complete"));
  }
}
