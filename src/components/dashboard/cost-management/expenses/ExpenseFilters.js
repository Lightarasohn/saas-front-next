"use client";
 
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { formatPeriod } from "@/lib/format";
import { EXPENSE_STATUS, STATUS_LABELS } from "@/lib/expense-status";
 
const selectClass =
    "rounded-sm border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
 
export default function ExpenseFilters({ budgets, filters }) {
    const router = useRouter();
    const pathname = usePathname();
 
    const apply = (key, value) => {
        const next = { ...filters, [key]: value };
        const query = new URLSearchParams();
 
        if (next.budgetPublicId) query.set("budgetPublicId", next.budgetPublicId);
        if (next.statusId) query.set("statusId", next.statusId);
        if (next.onlyMine) query.set("onlyMine", "true");
 
        const qs = query.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };
 
    const hasFilter = Boolean(
        filters.budgetPublicId || filters.statusId || filters.onlyMine,
    );
 
    return (
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
            <span className="text-xs font-medium text-neutral-500">Filtre:</span>
 
            <select
                className={selectClass}
                value={filters.budgetPublicId}
                onChange={(e) => apply("budgetPublicId", e.target.value)}
                aria-label="Bütçe"
            >
                <option value="">Tüm bütçeler</option>
                {budgets.map((b) => (
                    <option key={b.publicId} value={b.publicId}>
                        {b.orgUnitName} — {formatPeriod(b.month, b.year)}
                    </option>
                ))}
            </select>
 
            <select
                className={selectClass}
                value={filters.statusId}
                onChange={(e) => apply("statusId", e.target.value)}
                aria-label="Durum"
            >
                <option value="">Tüm durumlar</option>
                {Object.values(EXPENSE_STATUS).map((id) => (
                    <option key={id} value={id}>
                        {STATUS_LABELS[id]}
                    </option>
                ))}
            </select>
 
            <label className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-neutral-200 px-2 py-1 text-sm text-neutral-700 transition-colors hover:bg-neutral-50">
                <input
                    type="checkbox"
                    checked={filters.onlyMine}
                    onChange={(e) => apply("onlyMine", e.target.checked)}
                />
                Sadece benimkiler
            </label>
 
            {hasFilter ? (
                <button
                    type="button"
                    onClick={() => router.push(pathname)}
                    className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                    <X size={12} aria-hidden="true" />
                    Temizle
                </button>
            ) : null}
        </div>
    );
}