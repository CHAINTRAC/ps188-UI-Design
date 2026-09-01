import { motion } from "framer-motion";
import { Calendar, KeyRound, LogOut, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const ROLE_TONE = { verifier: "brand", admin: "warn", superadmin: "good" };

export default function Profile({ role }) {
  const tone = ROLE_TONE[role.key] ?? "brand";
  const location = role.tagline;

  return (
    <>
      <Topbar title="Profile" subtitle={role.tagline} />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[300px_1fr]">
        <Card delay={0.02} className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-[22px] font-semibold text-white">
            {role.userInitials}
          </div>
          <div className="mt-4 text-[16px] font-semibold text-ink">{role.userName}</div>
          <Badge variant={tone} className="mt-2">
            {role.label.toUpperCase()}
          </Badge>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">{role.userMeta}</p>

          <div className="mt-6 flex w-full flex-col gap-2 border-t border-line-soft pt-5">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-[12.5px] font-medium text-ink-dim transition-colors hover:bg-surface-sunken">
              <KeyRound size={14} strokeWidth={1.75} />
              Change Password
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-[12.5px] font-medium text-bad-ink transition-colors hover:bg-bad-soft"
            >
              <LogOut size={14} strokeWidth={1.75} />
              Sign Out
            </Link>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="flex flex-col gap-5"
        >
          <Card noPad delay={0.08}>
            <div className="border-b border-line-soft px-5 py-4 text-[13.5px] font-semibold">Account Details</div>
            <div className="flex flex-col">
              {[
                { icon: ShieldCheck, label: "Role", value: role.label },
                { icon: MapPin, label: "Assignment", value: location },
                { icon: Calendar, label: "Member since", value: "14 Feb 2024" },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex items-center gap-3 px-5 py-3.5 ${i !== arr.length - 1 ? "border-b border-line-soft" : ""}`}
                >
                  <row.icon size={15} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                  <span className="w-32 shrink-0 text-[12px] text-ink-dim">{row.label}</span>
                  <span className="text-[13px] font-medium text-ink">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card delay={0.14}>
            <div className="mb-1 text-[13.5px] font-semibold">Account status</div>
            <p className="text-[12px] leading-relaxed text-ink-faint">
              This account is active and in good standing. Password changes and other account settings will be
              managed here once the backend is connected.
            </p>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
