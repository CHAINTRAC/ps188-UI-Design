import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line/70 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-[11.5px] text-ink-faint md:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} strokeWidth={1.8} />
          <span>Sentinel · AI-Based Fake Identity &amp; Document Screening System</span>
        </div>
        <span>SIH PS 26188 · Ministry of Home Affairs · Sashastra Seema Bal (SSB), Police II Division</span>
      </div>
    </footer>
  );
}
