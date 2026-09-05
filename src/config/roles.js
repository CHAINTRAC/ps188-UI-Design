import {
  ScanLine,
  History,
  LayoutGrid,
  Users,
  FileBarChart2,
  ScrollText,
  Building2,
  MapPinned,
  Settings2,
  Ban,
} from "lucide-react";

export const ROLES = {
  verifier: {
    key: "verifier",
    label: "Verifier",
    tagline: "Checkpoint officer",
    userName: "R. Sharma",
    userInitials: "RS",
    userMeta: "Verifier · CP-04",
    email: "r.sharma@ssb.gov.in",
    basePath: "/verifier",
    nav: [
      { label: "Screen Document", icon: ScanLine, path: "/verifier" },
      { label: "My History", icon: History, path: "/verifier/history" },
    ],
  },
  admin: {
    key: "admin",
    label: "Admin",
    tagline: "North Zone",
    userName: "A. Mehta",
    userInitials: "AM",
    userMeta: "Admin · North Zone",
    email: "a.mehta@ssb.gov.in",
    basePath: "/admin",
    nav: [
      { label: "Team Overview", icon: LayoutGrid, path: "/admin" },
      { label: "Verifiers", icon: Users, path: "/admin/verifiers" },
      { label: "Blacklist", icon: Ban, path: "/admin/blacklist" },
      { label: "Reports", icon: FileBarChart2, path: "/admin/reports" },
      { label: "Audit Log", icon: ScrollText, path: "/admin/audit-log" },
    ],
  },
  superadmin: {
    key: "superadmin",
    label: "Super Admin",
    tagline: "All regions",
    userName: "D. Kulkarni",
    userInitials: "DK",
    userMeta: "Super Admin",
    email: "d.kulkarni@ssb.gov.in",
    basePath: "/super-admin",
    nav: [
      { label: "Org Overview", icon: LayoutGrid, path: "/super-admin" },
      { label: "Admins", icon: Users, path: "/super-admin/admins" },
      { label: "Checkpoints", icon: MapPinned, path: "/super-admin/checkpoints" },
      { label: "Blacklist", icon: Ban, path: "/super-admin/blacklist" },
      { label: "Audit Trail", icon: ScrollText, path: "/super-admin/audit-trail" },
      { label: "Settings", icon: Settings2, path: "/super-admin/settings" },
    ],
  },
};

export const ROLE_LIST = Object.values(ROLES);
export { Building2 };

export function dashboardPathFor(role) {
  return ROLES[role]?.basePath ?? "/login";
}
