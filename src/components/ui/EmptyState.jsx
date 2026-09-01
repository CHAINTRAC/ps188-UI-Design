import Topbar from "../layout/Topbar";

export default function EmptyState({ role, title, subtitle, description, Icon }) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} role={role} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line py-24 text-center">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken text-ink-faint">
            <Icon size={20} strokeWidth={1.75} />
          </div>
        )}
        <div className="max-w-sm">
          <p className="text-[13.5px] font-medium text-ink">{title}</p>
          <p className="mt-1 text-[12.5px] text-ink-faint">{description}</p>
        </div>
      </div>
    </>
  );
}
