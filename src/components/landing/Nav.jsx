import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

const LINKS = [
  { id: "challenge", label: "The Challenge" },
  { id: "how-it-works", label: "How It Works" },
  { id: "impact", label: "Impact" },
];

function NavLink({ id, label, scrollTo }) {
  return (
    <button onClick={() => scrollTo(id)} className="group relative py-1 text-ink-dim transition-colors hover:text-ink">
      {label}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
    </button>
  );
}

export default function Nav() {
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-md dark:bg-canvas dark:backdrop-blur-none"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover" />
          <span className="font-display text-[15px] font-semibold text-ink">Sentinel</span>
        </div>

        <nav className="hidden items-center gap-7 text-[13px] font-medium md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.id} {...l} scrollTo={scrollTo} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="rounded-full bg-navy px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_0_0_0_rgba(0,0,0,0)] transition-shadow hover:shadow-[0_0_20px_-2px_var(--color-brand)]"
          >
            Sign In
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
