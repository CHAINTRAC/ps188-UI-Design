import { motion } from "framer-motion";

export default function Card({ children, className = "", delay = 0, noPad = false, as: As = motion.div, ...rest }) {
  return (
    <As
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] ${
        noPad ? "" : "p-5"
      } ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}
