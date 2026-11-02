export default function PageHeader({
    title,
    subtitle,
    actions,
}: {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
                <h1 className="font-serif italic text-2xl sm:text-3xl text-[#fbf3ec]">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-[#8f7768]">{subtitle}</p>}
            </div>
            {actions}
        </div>
    );
}