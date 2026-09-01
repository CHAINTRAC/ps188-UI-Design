import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import useTheme from "../../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const [theme, toggle] = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line bg-surface text-ink-dim transition-colors hover:bg-surface-sunken ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
