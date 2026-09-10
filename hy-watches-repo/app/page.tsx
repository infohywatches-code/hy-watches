"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

/*  HY Watches — flagship storefront
 *  Design tokens ported from HY Systems (globals.css), gold accent system.
 *  Global CSS (tokens, cursor, orbs, ticker, marquee, word reveal) lives in
 *  app/globals.css — see the <style> block of the published artifact.
 *  All imagery is generated as data-URI SVG so builds never break on a missing
 *  asset; replace the `image` fields with CDN URLs when photography lands.
 */


interface Product {
  id: string;
  name: string;
  price: string;
  tags: string[];
  swatch: string;
  image: string;
  model: string;
}

interface Feature {
  title: string;
  desc: string;
}

interface SocialPost {
  platform: string;
  handle: string;
  caption: string;
  image: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: string[];
}

/* ---------- WhatsApp ---------- */

const WHATSAPP_NUMBER: string = "61450935568";

function whatsappLink(modelName: string): string {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hello, I want to buy " + modelName);
}

/* ---------- Placeholder imagery ----------
   Data-URI SVG so <img> renders with zero network calls.
   Replace `image` values with CDN URLs in production. */

function dataUri(svg: string): string {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function watchImage(swatch: string, variant: string): string {
  const steel: boolean = swatch === "#DDDEDF";
  const dial: string = steel ? "#101014" : "#0A0A0C";
  const mark: string = steel ? "#C9CACC" : "#7A7B7F";
  const strap: string = steel ? "#1B1B1F" : "#141416";
  const edge: string = steel ? "#8E9094" : "#141416";
  const hand: string = steel ? "#EDEEEF" : "#D6D7DA";

  let face: string = "";
  if (variant === "diver") {
    face += '<circle cx="150" cy="210" r="82" fill="' + (steel ? "#16171B" : "#0E0E11") + '"/>';
    for (let i = 0; i < 12; i++) {
      const a: number = (i * Math.PI) / 6;
      face +=
        '<circle cx="' + (150 + 72 * Math.sin(a)).toFixed(1) + '" cy="' + (210 - 72 * Math.cos(a)).toFixed(1) +
        '" r="' + (i === 0 ? 4 : 2.4) + '" fill="' + (i === 0 ? "#D4AF37" : mark) + '"/>';
    }
  }

  const dialR: number = variant === "diver" ? 68 : 78;
  face += '<circle cx="150" cy="210" r="' + dialR + '" fill="' + dial + '"/>';
  face += '<circle cx="150" cy="210" r="' + dialR + '" fill="none" stroke="rgba(212,175,55,0.22)" stroke-width="1"/>';

  if (variant === "field") {
    face +=
      '<g fill="' + mark + '" font-family="monospace" font-size="15" text-anchor="middle">' +
      '<text x="150" y="152">12</text><text x="209" y="216">3</text><text x="150" y="280">6</text><text x="92" y="216">9</text></g>';
  }

  if (variant === "chrono") {
    face += '<circle cx="112" cy="210" r="24" fill="none" stroke="' + mark + '" stroke-width="1" opacity="0.7"/>';
    face += '<circle cx="188" cy="210" r="24" fill="none" stroke="' + mark + '" stroke-width="1" opacity="0.7"/>';
    face += '<line x1="112" y1="210" x2="112" y2="192" stroke="#D4AF37" stroke-width="1.4"/>';
    face += '<line x1="188" y1="210" x2="200" y2="200" stroke="' + mark + '" stroke-width="1.4"/>';
  }

  if (variant === "chrono" || variant === "minimal") {
    for (let i = 0; i < 12; i++) {
      const a: number = (i * Math.PI) / 6;
      const outer: number = 66;
      const inner: number = i % 3 === 0 ? 54 : 58;
      face +=
        '<line x1="' + (150 + outer * Math.sin(a)).toFixed(1) + '" y1="' + (210 - outer * Math.cos(a)).toFixed(1) +
        '" x2="' + (150 + inner * Math.sin(a)).toFixed(1) + '" y2="' + (210 - inner * Math.cos(a)).toFixed(1) +
        '" stroke="' + mark + '" stroke-width="' + (i % 3 === 0 ? 2.4 : 1) + '"/>';
    }
  }

  const svg: string =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420">' +
    '<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="' + swatch + '"/><stop offset="52%" stop-color="' + edge + '"/><stop offset="100%" stop-color="' + swatch + '"/>' +
    '</linearGradient><radialGradient id="g" cx="32%" cy="26%" r="72%">' +
    '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>' +
    "</radialGradient></defs>" +
    '<rect x="112" y="16" width="76" height="112" rx="5" fill="' + strap + '"/>' +
    '<rect x="112" y="292" width="76" height="112" rx="5" fill="' + strap + '"/>' +
    '<g stroke="rgba(255,255,255,0.06)" stroke-width="1"><path d="M112 44h76M112 68h76M112 92h76M112 328h76M112 352h76M112 376h76"/></g>' +
    '<circle cx="150" cy="210" r="92" fill="url(#c)"/>' +
    '<circle cx="150" cy="210" r="92" fill="none" stroke="rgba(212,175,55,0.45)" stroke-width="1"/>' +
    '<rect x="240" y="198" width="16" height="24" rx="3" fill="#D4AF37"/>' +
    face +
    '<g stroke="' + hand + '" stroke-linecap="square">' +
    '<line x1="150" y1="210" x2="150" y2="158" stroke-width="4"/>' +
    '<line x1="150" y1="210" x2="192" y2="238" stroke-width="3"/>' +
    '<line x1="150" y1="210" x2="120" y2="252" stroke-width="1" stroke="#D4AF37"/></g>' +
    '<circle cx="150" cy="210" r="4" fill="' + hand + '"/>' +
    '<circle cx="150" cy="210" r="' + dialR + '" fill="url(#g)"/>' +
    "</svg>";

  return dataUri(svg);
}

function reelImage(label: string, seed: number): string {
  const tints: string[] = ["rgba(212,175,55,0.20)", "rgba(197,160,89,0.24)", "rgba(212,175,55,0.14)"];
  const svg: string =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">' +
    '<rect width="400" height="500" fill="#0E0E11"/>' +
    '<circle cx="' + (140 + seed * 60) + '" cy="' + (170 + seed * 40) + '" r="180" fill="' + tints[seed % 3] + '"/>' +
    '<g stroke="rgba(212,175,55,0.30)" fill="none">' +
    '<circle cx="200" cy="240" r="96" stroke-width="1"/><circle cx="200" cy="240" r="64" stroke-width="1"/>' +
    '<line x1="200" y1="240" x2="200" y2="186" stroke="rgba(255,255,255,0.55)" stroke-width="3"/>' +
    '<line x1="200" y1="240" x2="238" y2="262" stroke="rgba(255,255,255,0.55)" stroke-width="2"/></g>' +
    '<circle cx="200" cy="240" r="30" fill="rgba(0,0,0,0.55)" stroke="rgba(212,175,55,0.6)"/>' +
    '<path d="M192 228l20 12-20 12z" fill="#D4AF37"/>' +
    '<text x="28" y="462" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="15" letter-spacing="3">' + label + "</text>" +
    "</svg>";
  return dataUri(svg);
}

function featureImage(seed: number): string {
  const svg: string =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#0E0E11"/>' +
    '<circle cx="200" cy="150" r="' + (110 + seed * 4) + '" fill="none" stroke="rgba(212,175,55,0.12)" stroke-width="1"/>' +
    '<circle cx="200" cy="150" r="' + (70 + seed * 6) + '" fill="none" stroke="rgba(212,175,55,0.38)" stroke-width="1"/>' +
    '<circle cx="200" cy="150" r="' + (46 + seed * 10) + '" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>' +
    '<line x1="200" y1="150" x2="200" y2="' + (150 - (70 + seed * 6)) + '" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>' +
    "</svg>";
  return dataUri(svg);
}

function bannerImage(kind: string): string {
  const svg: string =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640">' +
    '<rect width="800" height="640" fill="' + (kind === "classic" ? "#000000" : "#15151A") + '"/>' +
    '<circle cx="' + (kind === "classic" ? 610 : 190) + '" cy="' + (kind === "classic" ? 150 : 490) + '" r="300" fill="rgba(212,175,55,0.16)"/>' +
    '<g stroke="rgba(212,175,55,0.14)" stroke-width="1">' +
    '<path d="M0 160h800M0 320h800M0 480h800M200 0v640M400 0v640M600 0v640"/></g>' +
    "</svg>";
  return dataUri(svg);
}

/* ---------- Data ---------- */

const coreCollection: Product[] = [
  { id: "MOD-01", name: "The Classic Diver", price: "4,600", tags: ["41.5mm", "Automatic"], swatch: "#DDDEDF", model: "MOD-01", image: watchImage("#DDDEDF", "diver") },
  { id: "MOD-02", name: "The Field Watch", price: "4,600", tags: ["38mm", "Automatic"], swatch: "#292929", model: "MOD-02", image: watchImage("#292929", "field") },
  { id: "MOD-03", name: "The Chronograph", price: "3,600", tags: ["41.5mm", "Meca-Quartz"], swatch: "#DDDEDF", model: "MOD-03", image: watchImage("#DDDEDF", "chrono") },
  { id: "MOD-04", name: "The Minimalist", price: "5,600", tags: ["40mm", "Automatic"], swatch: "#292929", model: "MOD-04", image: watchImage("#292929", "minimal") }
];

const features: Feature[] = [
  { title: "Waterproof checked", desc: "All watches are water resistance checked to at least 300m to ensure reliability and durability in all conditions." },
  { title: "Accuracy regulated & tested", desc: "HY watches feature accuracy-tested movements, ensuring reliable and precise timekeeping across all models." },
  { title: "Quality checked and certified", desc: "HY watches are quality checked by our experts, reflecting our commitment and pride in delivering the best." }
];

const socialPosts: SocialPost[] = [
  { platform: "TikTok", handle: "@hywatches", caption: "Unboxing the Classic Diver, cut to length, nothing skipped.", image: reelImage("UNBOXING / MOD-01", 0), href: "https://www.tiktok.com" },
  { platform: "Instagram", handle: "@hywatches", caption: "Wrist roll on a 17cm wrist, real light, no colour grade.", image: reelImage("WRIST ROLL / MOD-04", 1), href: "https://www.instagram.com" },
  { platform: "Facebook", handle: "HY Watches", caption: "Owner reviews at six months, scratches and all.", image: reelImage("SIX MONTHS ON", 2), href: "https://www.facebook.com" }
];

const tickerItems: string[] = ["300m water resistance", "Swiss automatic", "Regulated in five positions", "Sapphire crystal", "316L stainless", "Five-year warranty"];

const navLinks: NavItem[] = [
  { label: "New In", href: "#new-arrivals" },
  { label: "Watches", href: "#collection" },
  { label: "Accessories", href: "#features" }
];

const footerColumns: FooterColumn[] = [
  { heading: "Watches", links: ["New In", "Classic", "Toolwatches", "Capsule", "Straps"] },
  { heading: "Brand", links: ["Story", "Movements", "Materials", "Journal"] },
  { heading: "Service", links: ["Contact", "Warranty", "Sizing", "Repairs", "Shipping"] },
  { heading: "Social", links: ["TikTok", "Instagram", "Facebook"] }
];

/* ---------- Icons ---------- */

function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

function WhatsAppIcon({ size }: { size?: number }) {
  const s: number = size || 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.2 6.39 2.2 11.8c0 1.9.53 3.68 1.46 5.2L2 22l5.14-1.62a9.9 9.9 0 0 0 4.9 1.28h.01c5.43 0 9.84-4.39 9.84-9.8C21.89 6.39 17.47 2 12.04 2Zm5.75 13.9c-.24.68-1.4 1.3-1.94 1.34-.5.05-.98.23-3.3-.7-2.78-1.1-4.54-3.94-4.68-4.12-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.28.24-.27.53-.34.7-.34.18 0 .35 0 .5.01.16.01.38-.06.6.46.23.55.77 1.9.84 2.04.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.17-.2.7-.81.88-1.09.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.2.53.32.07.11.07.64-.17 1.31Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.5 10.5L14 14" strokeLinecap="square" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="8" cy="5.4" r="2.8" />
      <path d="M2.6 14c.7-3 2.8-4.4 5.4-4.4S12.7 11 13.4 14" strokeLinecap="square" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2 5.5h14M2 12.5h14" strokeLinecap="square" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 4l10 10M14 4L4 14" strokeLinecap="square" />
    </svg>
  );
}

/* ---------- Motion ---------- */

function CursorFX() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine: boolean = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduced: boolean = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("hy-cursor-on");
    let mx: number = window.innerWidth / 2;
    let my: number = window.innerHeight / 2;
    let rx: number = mx;
    let ry: number = my;
    let raf: number = 0;

    const move = (e: MouseEvent): void => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    };
    const over = (e: MouseEvent): void => {
      const el = e.target as HTMLElement | null;
      const t = el && el.closest ? el.closest("a,button,input,select,textarea,[data-hover]") : null;
      if (ring.current) ring.current.classList.toggle("hov", !!t);
    };
    const loop = (): void => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      if (ring.current) ring.current.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    loop();

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("hy-cursor-on");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cur-dot" aria-hidden="true" />
      <div ref={ring} className="cur-ring" aria-hidden="true" />
    </>
  );
}

function useReveal(): void {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.transitionDelay = i * 0.08 + "s";
            el.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function useSpotlight() {
  return useCallback((e: ReactMouseEvent<HTMLElement>): void => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
  }, []);
}

function WordReveal({ text, delay }: { text: string; delay?: number }) {
  const base: number = delay || 0;
  const words: string[] = text.split(" ");
  return (
    <>
      {words.map((w: string, i: number) => (
        <span key={w + i} className="word" style={{ animationDelay: (base + i * 0.035).toFixed(3) + "s" }}>
          {w}
          {"\u00A0"}
        </span>
      ))}
    </>
  );
}

/* ---------- Buy action ---------- */

function BuyButton({ modelName, block }: { modelName: string; block?: boolean }) {
  return (
    <a
      href={whatsappLink(modelName)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={"Enquire on WhatsApp about " + modelName}
      className={
        (block ? "flex w-full " : "inline-flex ") +
        "items-center justify-center gap-3 border border-[#D4AF37] px-5 py-3 text-[0.88rem] font-medium text-[#D4AF37] transition-[background-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_14px_46px_-14px_rgba(212,175,55,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      }
    >
      <WhatsAppIcon size={16} />
      I want to buy
    </a>
  );
}

/* ---------- Header ---------- */

function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panel: string =
    "pointer-events-auto flex items-center border border-[rgba(212,175,55,0.28)] backdrop-blur-md transition-colors duration-500 " +
    (scrolled ? "bg-[rgba(8,8,9,0.88)]" : "bg-[rgba(8,8,9,0.44)]");

  return (
    <header className="fixed top-0 z-50 w-full pointer-events-none">
      <div className="wrap flex items-start justify-between gap-4 py-4">
        <nav className={panel + " h-[52px] pl-5 pr-2"} aria-label="Primary">
          <Link href="#top" className="pr-6 text-[0.95rem] font-bold uppercase tracking-tight text-white">HY Watches</Link>
          <ul className="hidden items-center gap-8 pr-4 md:flex">
            {navLinks.map((l: NavItem) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[0.88rem] font-medium text-[#8C8C95] transition-colors duration-300 hover:text-[#D4AF37]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="flex h-[40px] w-[40px] items-center justify-center border-l border-[rgba(212,175,55,0.28)] text-[#E6E6EA] transition-colors duration-300 hover:text-[#D4AF37] md:hidden"
          >
            <MenuIcon />
          </button>
        </nav>

        <div className={panel + " h-[52px] divide-x divide-[rgba(212,175,55,0.28)]"}>
          <Link href="#collection" aria-label="Search the collection" className="hidden h-full w-[52px] items-center justify-center text-[#8C8C95] transition-colors duration-300 hover:text-[#D4AF37] md:flex">
            <SearchIcon />
          </Link>
          <Link href="#collection" aria-label="Client account" className="hidden h-full w-[52px] items-center justify-center text-[#8C8C95] transition-colors duration-300 hover:text-[#D4AF37] md:flex">
            <AccountIcon />
          </Link>
          <a
            href={whatsappLink("an HY Watches timepiece")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message HY Watches on WhatsApp"
            className="flex h-full items-center gap-3 px-5 text-[#D4AF37] transition-colors duration-300 hover:text-white"
          >
            <WhatsAppIcon size={16} />
            <span className="mono hidden text-[0.72rem] uppercase tracking-[0.16em] sm:inline">WhatsApp</span>
            <span className="dot" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const items: NavItem[] = navLinks.concat([{ label: "HY on social", href: "#social" }]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Navigation" className="fixed inset-0 z-40 flex flex-col bg-[rgba(0,0,0,0.94)] px-6 pb-10 pt-[104px] backdrop-blur-[22px]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className="absolute right-6 top-[26px] flex h-[44px] w-[44px] items-center justify-center border border-[rgba(212,175,55,0.28)] text-[#E6E6EA]"
      >
        <CloseIcon />
      </button>
      <ul>
        {items.map((l: NavItem, i: number) => (
          <li key={l.label}>
            <Link
              href={l.href}
              onClick={onClose}
              className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] py-5 text-[1.9rem] font-medium tracking-[-0.03em] text-[#E6E6EA] transition-colors duration-300 hover:text-[#D4AF37]"
            >
              {l.label}
              <span className="mono text-[0.78rem] tracking-[0.1em] text-[#4F4F58]">{String(i + 1).padStart(2, "0")}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-10">
        <BuyButton modelName="an HY Watches timepiece" block />
        <p className="mono mt-6 text-[0.66rem] uppercase tracking-[0.2em] text-[#4F4F58]">Fremantle — Geneva — Tokyo</p>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const onMove = useSpotlight();

  return (
    <section id="top" className="relative h-[85vh] min-h-[620px] overflow-hidden bg-black">
      <div className="absolute inset-0 z-10" aria-hidden="true">
        <span className="orb orb1" />
        <span className="orb orb2" />
        <span className="orb orb3" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)",
            backgroundSize: "88px 88px"
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000 4%, rgba(0,0,0,0.15) 48%, rgba(0,0,0,0.5) 100%)" }} />
      </div>

      <div className="wrap relative z-20 flex h-full flex-col justify-end pb-12 md:pb-16">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end md:gap-16">
          <div className="max-w-[760px]">
            <p className="eyebrow word mb-7" style={{ animationDelay: "0.05s" }}>Reference 2026 / Series One</p>
            <h1 className="h1 text-white">
              <WordReveal text="Crafting modern timepieces that merge iconic design, advanced technical solutions, and high performance." delay={0.18} />
            </h1>
          </div>

          <aside onMouseMove={onMove} className="spot w-full shrink-0 border border-[rgba(212,175,55,0.28)] bg-[rgba(8,8,9,0.58)] p-7 backdrop-blur-md md:w-[338px]">
            <div className="relative z-[2]">
              <p className="mono text-[0.66rem] uppercase tracking-[0.2em] text-[#D4AF37]">Capsule</p>
              <p className="h3 mt-4 text-white">Raw in form, sharp in detail, impossible to overlook</p>
              <div className="gold-rule my-6" />
              <BuyButton modelName="the Capsule collection" block />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------- Ticker ---------- */

function Ticker() {
  const row: string[] = tickerItems.concat(tickerItems);
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__t">
        {row.map((t: string, i: number) => (
          <span key={t + i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Products ---------- */

function ProductCard({ product }: { product: Product }) {
  const onMove = useSpotlight();

  return (
    <article onMouseMove={onMove} className="spot group flex flex-col bg-[#080809] p-5 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#0E0E11] md:p-7">
      <div className="relative z-[2] flex flex-1 flex-col">
        <div className="relative aspect-[3/4] overflow-hidden border border-[rgba(212,175,55,0.18)] bg-[#0E0E11]">
          <img
            src={product.image}
            alt={product.name + ", reference " + product.model}
            width={300}
            height={420}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-6 drop-shadow-xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <ul className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.tags.map((t: string) => (
              <li key={t} className="mono border border-[rgba(212,175,55,0.28)] bg-[rgba(0,0,0,0.45)] px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-[#C5A059]">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h3 className="text-[1.02rem] font-medium tracking-[-0.02em] text-white">{product.name}</h3>
          <p className="mono shrink-0 text-[0.86rem] text-[#D4AF37]">€{product.price}</p>
        </div>

        <div className="mt-5 h-[1px] w-full bg-[rgba(255,255,255,0.07)]" />

        <div className="mt-4 flex items-center justify-between">
          <p className="mono text-[0.68rem] uppercase tracking-[0.18em] text-[#4F4F58]">{product.model}</p>
          <span className="h-4 w-4 rounded-full border border-[rgba(212,175,55,0.45)]" style={{ backgroundColor: product.swatch }} title={product.swatch} aria-hidden="true" />
        </div>

        <div className="mt-6">
          <BuyButton modelName={product.name} block />
        </div>
      </div>
    </article>
  );
}

function ProductGrid() {
  const hasProducts: boolean = Array.isArray(coreCollection) && coreCollection.length > 0;

  return (
    <section id="new-arrivals" className="wrap py-20 md:py-28">
      <div className="flex items-end justify-between gap-6 pb-10" data-reveal>
        <div>
          <p className="eyebrow mb-5">Available now</p>
          <h2 className="h2 text-white">New arrivals</h2>
        </div>
        <p className="mono shrink-0 pb-2 text-[0.74rem] uppercase tracking-[0.18em] text-[#4F4F58]">
          {hasProducts ? coreCollection.length + "/" + coreCollection.length : "0/0"} Catalog
        </p>
      </div>

      {hasProducts ? (
        <div className="seam grid-cols-1 md:grid-cols-2 lg:grid-cols-4" data-reveal>
          {coreCollection.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="border border-[rgba(255,255,255,0.07)] bg-[#080809] p-10">
          <p className="h3 text-white">The catalogue is empty</p>
          <p className="copy mt-3">No references are published for this season. Message us for archive availability.</p>
          <div className="mt-6">
            <BuyButton modelName="an archive reference" />
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Categories ---------- */

function CategoryBlock({ eyebrow, title, subtitle, kind }: { eyebrow: string; title: string; subtitle: string; kind: string }) {
  const onMove = useSpotlight();

  return (
    <article onMouseMove={onMove} className={"spot group relative aspect-square overflow-hidden md:aspect-[5/4] " + (kind === "classic" ? "bg-black" : "bg-[#15151A]")}>
      <img
        src={bannerImage(kind)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className="relative z-[2] flex h-full flex-col justify-end p-8 md:p-12">
        <p className="mono text-[0.66rem] uppercase tracking-[0.2em] text-[#C5A059]">{eyebrow}</p>
        <h3 className="h2 mt-4 text-white">{title}</h3>
        <p className="copy mt-4 max-w-[38ch]">{subtitle}</p>
        <div className="mt-8">
          <BuyButton modelName={"the " + title + " line"} />
        </div>
      </div>
    </article>
  );
}

function CategoryMatrix() {
  return (
    <section id="collection" className="wrap pb-20 md:pb-28">
      <div className="seam grid-cols-1 md:grid-cols-2" data-reveal>
        <CategoryBlock eyebrow="Permanent collection" title="Classic" subtitle="Explore our most iconic permanent line." kind="classic" />
        <CategoryBlock eyebrow="Built for the field" title="Toolwatches" subtitle="Explore our purpose-built toolwatches." kind="tool" />
      </div>
    </section>
  );
}

/* ---------- Features ---------- */

function Features() {
  return (
    <section id="features" className="wrap pb-20 md:pb-28">
      <div className="pb-10" data-reveal>
        <p className="eyebrow mb-5">Every reference, every unit</p>
        <h2 className="h2 max-w-[18ch] text-white">Tested before it leaves the bench</h2>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8" data-reveal>
        {features.map((f: Feature, i: number) => (
          <article key={f.title}>
            <img
              src={featureImage(i)}
              alt=""
              aria-hidden="true"
              width={400}
              height={300}
              loading="lazy"
              decoding="async"
              className="h-[300px] w-full border border-[rgba(212,175,55,0.14)] object-cover grayscale"
            />
            <h3 className="mt-6 text-[1.06rem] font-semibold tracking-[-0.025em] text-white">{f.title}</h3>
            <p className="copy mt-3 text-[0.98rem] text-[rgba(255,255,255,0.6)]">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- HY on social ---------- */

function SocialCard({ post }: { post: SocialPost }) {
  const onMove = useSpotlight();

  return (
    <article onMouseMove={onMove} className="spot group border border-[rgba(212,175,55,0.28)] bg-[#080809]">
      <a
        href={post.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={"Open " + post.platform + ": " + post.caption}
        className="relative z-[2] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={post.image}
            alt={post.caption}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
          <p className="mono absolute left-4 top-4 border border-[rgba(212,175,55,0.4)] bg-[rgba(0,0,0,0.5)] px-2 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[#D4AF37]">
            {post.platform}
          </p>
        </div>
        <div className="p-6">
          <p className="mono text-[0.66rem] uppercase tracking-[0.18em] text-[#4F4F58]">{post.handle}</p>
          <p className="copy mt-3 text-[0.96rem] text-[#E6E6EA]">{post.caption}</p>
          <span className="mt-5 inline-flex items-center gap-3 text-[0.86rem] font-medium text-[#D4AF37]">
            Watch it
            <Arrow className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
          </span>
        </div>
      </a>
    </article>
  );
}

function SocialSection() {
  return (
    <section id="social" className="wrap pb-20 md:pb-28">
      <div className="grid grid-cols-1 gap-10 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" data-reveal>
        <div>
          <p className="eyebrow mb-5">Filmed, not styled</p>
          <h2 className="h2 text-white">HY on social</h2>
        </div>
        <div>
          <p className="copy">
            Every reference is filmed the way you would receive it: box opened once, film peeled on camera, worn on a real wrist under
            ordinary light. No studio grade, no stand-in models, no cut hiding a swap. If a case back is marked or a bracelet sits
            proud, it stays in the edit.
          </p>
          <p className="copy mt-5">
            Watch a full unboxing before you commit, then send us the reference number and we answer with sizing, lead time and the
            price you pay.
          </p>
          <div className="mt-8">
            <BuyButton modelName="a watch I saw on social" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3" data-reveal>
        {socialPosts.map((p: SocialPost) => (
          <SocialCard key={p.platform} post={p} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Wordmark ---------- */

function Wordmark() {
  return (
    <div className="marquee border-y border-[rgba(212,175,55,0.18)] py-10" aria-hidden="true">
      <div className="marquee__t">
        {Array.from({ length: 8 }).map((_, i: number) => (
          <span key={i}>HY Watches</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="bg-black px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {footerColumns.map((col: FooterColumn) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="mono text-xs uppercase tracking-widest text-[#D4AF37]">{col.heading}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l: string) => (
                  <li key={l}>
                    <Link href="#top" className="mono text-xs uppercase tracking-widest text-[rgba(255,255,255,0.5)] transition-colors duration-300 hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-5 border border-[rgba(212,175,55,0.28)] p-7 md:flex-row md:items-center md:justify-between">
          <p className="mono text-xs uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Enquiries answered on WhatsApp, +61 450 935 568</p>
          <BuyButton modelName="an HY Watches timepiece" />
        </div>

        <div className="mt-10 h-[1px] w-full bg-[rgba(255,255,255,0.07)]" />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ul className="flex gap-8">
            <li>
              <Link href="#top" className="mono text-xs uppercase tracking-widest text-[rgba(255,255,255,0.5)] transition-colors duration-300 hover:text-white">Sales Terms</Link>
            </li>
            <li>
              <Link href="#top" className="mono text-xs uppercase tracking-widest text-[rgba(255,255,255,0.5)] transition-colors duration-300 hover:text-white">Privacy Statement</Link>
            </li>
          </ul>
          <p className="mono text-xs uppercase tracking-widest text-[rgba(255,255,255,0.5)]">2026 HY Watches. Built for performance.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- App ---------- */

export default function HYWatchesStorefront() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  useReveal();

  return (
    <>
      <CursorFX />
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Hero />
        <Ticker />
        <ProductGrid />
        <CategoryMatrix />
        <Features />
        <SocialSection />
        <Wordmark />
      </main>
      <Footer />
    </>
  );
}
