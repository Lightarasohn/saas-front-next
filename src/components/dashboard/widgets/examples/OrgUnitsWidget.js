"use client";

import Alert from "@/components/ui/Alert";
import { useApiResource } from "@/hooks/useApiResource";

export default function OrgUnitsWidget() {
    const { loading, error, data } = useApiResource("/api/cost-management/org-units");

    if (loading) return <p className="text-sm text-neutral-400">Yükleniyor...</p>;
    if (error) return <Alert variant="error">{error}</Alert>;

    const units = data ?? [];
    const activeUnits = units.filter((u) => u.isActive);
    const memberTotal = activeUnits.reduce((sum, u) => sum + (u.memberCount ?? 0), 0);

    if (units.length === 0) {
        return <p className="text-sm text-neutral-500">Tanımlı birim yok.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold tabular-nums text-neutral-900">
                    {activeUnits.length}
                </span>
                <span className="text-xs text-neutral-500">aktif birim · {memberTotal} üye</span>
            </div>

            <ul className="flex flex-col gap-0.5 border-t border-neutral-200 pt-2">
                {units.slice(0, 8).map((unit) => (
                    <li
                        key={unit.publicId}
                        className="flex items-center justify-between gap-2 text-sm"
                        style={{ paddingLeft: `${(unit.level ?? 0) * 12}px` }}
                    >
                        <span
                            className={`truncate ${
                                unit.isActive ? "text-neutral-900" : "text-neutral-400 line-through"
                            }`}
                        >
                            {unit.name}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-neutral-500">
                            {unit.memberCount ?? 0}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}