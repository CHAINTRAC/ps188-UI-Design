import { useState } from "react";
import { Check, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <div className="text-[13px] font-medium text-ink">{label}</div>
        <p className="mt-0.5 text-[11.5px] text-ink-faint">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-surface-sunken border border-line"}`}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
          style={{ transform: checked ? "translateX(21px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}

const ROLE_PERMISSIONS = [
  { permission: "Screen documents & record decisions", verifier: true, admin: false, superadmin: false },
  { permission: "View own screening history", verifier: true, admin: false, superadmin: false },
  { permission: "Manage verifiers in their region", verifier: false, admin: true, superadmin: false },
  { permission: "View regional reports & audit log", verifier: false, admin: true, superadmin: false },
  { permission: "Manage admins & checkpoints org-wide", verifier: false, admin: false, superadmin: true },
  { permission: "View full organization audit trail", verifier: false, admin: false, superadmin: true },
];

export default function Settings() {
  const [mfa, setMfa] = useState(true);
  const [forceReset, setForceReset] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("1h");

  return (
    <>
      <Topbar title="Settings" subtitle="Organization profile, security policy, and role permissions" />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <Card delay={0.02}>
          <span className="mb-4 block text-[13.5px] font-semibold">Organization Profile</span>
          <div className="flex flex-col divide-y divide-line-soft">
            {[
              { label: "Organization", value: "Ministry of Home Affairs" },
              { label: "Department", value: "Sashastra Seema Bal (SSB), Police II Division" },
              { label: "Problem Statement", value: "SIH PS 26188" },
              { label: "Category", value: "Software · Blockchain & Cybersecurity" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                <span className="text-[12px] text-ink-dim">{row.label}</span>
                <span className="text-right text-[12.5px] font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.06}>
          <span className="mb-1 block text-[13.5px] font-semibold">Security Policy</span>
          <div className="flex flex-col divide-y divide-line-soft">
            <Toggle
              checked={mfa}
              onChange={setMfa}
              label="Require MFA for admins"
              description="Admins must verify with a second factor at sign-in."
            />
            <Toggle
              checked={forceReset}
              onChange={setForceReset}
              label="Force password reset every 90 days"
              description="Applies to all verifier and admin accounts."
            />
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <div className="text-[13px] font-medium text-ink">Session timeout</div>
                <p className="mt-0.5 text-[11.5px] text-ink-faint">Automatically sign out after inactivity.</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="rounded-lg border border-line bg-surface-sunken/60 px-3 py-1.5 text-[12.5px] text-ink outline-none focus:border-brand"
              >
                <option value="30m">30 min</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="8h">8 hours</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <Card noPad delay={0.1}>
        <span className="block px-5 pt-5 text-[13.5px] font-semibold">Role Permissions</span>
        <div className="overflow-x-auto">
          <div className="min-w-[520px] px-5 pb-5 pt-4">
            <div className="grid grid-cols-[1.8fr_0.7fr_0.7fr_0.7fr] gap-2 border-b border-line-soft pb-2.5 text-[10.5px] tracking-wide text-ink-faint">
              <span>PERMISSION</span>
              <span>VERIFIER</span>
              <span>ADMIN</span>
              <span>SUPER ADMIN</span>
            </div>
            {ROLE_PERMISSIONS.map((row, i) => (
              <div
                key={row.permission}
                className={`grid grid-cols-[1.8fr_0.7fr_0.7fr_0.7fr] items-center gap-2 py-3 ${
                  i !== ROLE_PERMISSIONS.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="text-[12.5px] text-ink">{row.permission}</span>
                {[row.verifier, row.admin, row.superadmin].map((has, idx) => (
                  <span key={idx}>
                    {has ? (
                      <Check size={15} strokeWidth={2.25} className="text-good-ink" />
                    ) : (
                      <X size={15} strokeWidth={2.25} className="text-ink-faint/50" />
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
