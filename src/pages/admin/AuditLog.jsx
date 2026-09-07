import AuditTrailView from "../../components/shared/AuditTrailView";
import { useMe } from "../../features/auth/hooks";

export default function AuditLog() {
  const { data: me } = useMe();
  return (
    <AuditTrailView
      title="Audit Log"
      subtitle={`${me?.region || "Your region"} · every action across your team`}
    />
  );
}
