import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, KeyRound, LogOut, MapPin, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useMe, useLogout } from "../features/auth/hooks";
import { useChangeOwnPassword } from "../features/users/hooks";
import { initialsFor } from "../lib/format";

const ROLE_TONE = { verifier: "brand", admin: "warn", superadmin: "good" };

function ChangePasswordForm({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const changePassword = useChangeOwnPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    changePassword.mutate({ current_password: currentPassword, new_password: newPassword });
  };

  const errorMessage =
    changePassword.isError && (changePassword.error.response?.data?.error?.message || "Could not change password.");

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-2.5 border-t border-line-soft pt-5 text-left">
      {changePassword.isSuccess ? (
        <div className="rounded-lg border border-good/30 bg-good-soft px-3.5 py-2.5 text-[12px] text-good-ink">
          Password changed successfully.
        </div>
      ) : (
        <>
          {(errorMessage || mismatch) && (
            <div className="rounded-lg border border-bad/30 bg-bad-soft px-3.5 py-2.5 text-[12px] text-bad-ink">
              {mismatch ? "New password and confirmation don't match." : errorMessage}
            </div>
          )}
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[12.5px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
          />
          <input
            required
            type="password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[12.5px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
          />
          <input
            required
            type="password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[12.5px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
          />
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="rounded-lg bg-navy py-2.5 text-[12.5px] font-semibold text-white shadow-sm disabled:opacity-70"
          >
            {changePassword.isPending ? "Changing…" : "Change Password"}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-line py-2.5 text-[12.5px] font-medium text-ink-dim hover:bg-surface-sunken"
      >
        Close
      </button>
    </form>
  );
}

export default function Profile({ role }) {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const logout = useLogout();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const tone = ROLE_TONE[role.key] ?? "brand";
  const location = role.tagline;

  const userName = user?.full_name ?? role.userName;
  const userInitials = user ? initialsFor(user.full_name) : role.userInitials;
  const memberSince = user
    ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Topbar title="Profile" subtitle={role.tagline} />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[300px_1fr]">
        <Card delay={0.02} className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-[22px] font-semibold text-white">
            {userInitials}
          </div>
          <div className="mt-4 text-[16px] font-semibold text-ink">{userName}</div>
          <Badge variant={tone} className="mt-2">
            {role.label.toUpperCase()}
          </Badge>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">{role.userMeta}</p>

          {!showChangePassword && (
            <div className="mt-6 flex w-full flex-col gap-2 border-t border-line-soft pt-5">
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-[12.5px] font-medium text-ink-dim transition-colors hover:bg-surface-sunken"
              >
                <KeyRound size={14} strokeWidth={1.75} />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-[12.5px] font-medium text-bad-ink transition-colors hover:bg-bad-soft"
              >
                <LogOut size={14} strokeWidth={1.75} />
                Sign Out
              </button>
            </div>
          )}
          {showChangePassword && <ChangePasswordForm onClose={() => setShowChangePassword(false)} />}
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
                { icon: Calendar, label: "Member since", value: memberSince },
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
            <p className="text-[12px] leading-relaxed text-ink-faint">This account is active and in good standing.</p>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
