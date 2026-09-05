import { motion } from "framer-motion";
import { RefreshCw, ServerCrash } from "lucide-react";

export default function ServiceDown() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/20" />
          <span className="absolute inline-flex h-[72%] w-[72%] animate-ping rounded-full bg-brand/25 [animation-delay:400ms]" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface-sunken">
            <ServerCrash size={20} strokeWidth={1.75} className="text-ink-dim" />
          </div>
        </div>
        <div>
          <h1 className="font-display text-[22px] font-semibold text-ink">Can't reach Sentinel's server</h1>
          <p className="mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-ink-dim">
            The screening service isn't responding right now. This is usually temporary — check your
            connection, or try again in a moment.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-1 flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm"
        >
          <RefreshCw size={14} strokeWidth={2} />
          Try again
        </button>
      </motion.div>
    </div>
  );
}
