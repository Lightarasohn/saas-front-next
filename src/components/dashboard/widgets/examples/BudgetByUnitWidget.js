"use client";

import { useMemo } from "react";
import Alert from "@/components/ui/Alert";
import { useApiResource } from "@/hooks/useApiResource";
import { formatCurrency } from "@/lib/cost-management/format";

export default function BudgetByUnitWidget() {
    const path = useMemo(() => {
        const now = new Date();
        return `/api/cost-management/budgets?year=${now.getFullYear()}&month=${now.getMonth() + 1}`;
    }, []);

    const { loading, error, data } = useApiResource(path);

    if (loading) return <p className="text-sm text-neutral-400">Yükleniyor...</p>;
    if (error) return <Alert variant="error">{error}</Alert>;

    const budgets = [...(data ?? [])]
        .map((b) => ({
            ...b,
            percent:
                (b.totalAmount ?? 0) > 0
                    ? Math.min(100, Math.round(((b.usedAmount ?? 0) / b.totalAmount) * 100))
                    : 0,
        }))
        .sort((a, b) => b.percent - a.percent);

    if (budgets.length === 0) {
        return <p className="text-sm text-neutral-500">Bu ay için tanımlı bütçe yok.</p>;
    }

    return (
        <ul className="flex flex-col gap-2.5">
            {budgets.slice(0, 6).map((budget) => (
                <li key={budget.publicId} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="truncate text-neutral-900">{budget.orgUnitName ?? "—"}</span>
                        <span className="shrink-0 text-xs tabular-nums text-neutral-500">
                            {formatCurrency(budget.usedAmount)} / {formatCurrency(budget.totalAmount)}
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-sm bg-neutral-100">
                        <div
                            className={`h-full rounded-sm ${
                                budget.percent >= 90
                                    ? "bg-error"
                                    : budget.percent >= 70
                                      ? "bg-warning"
                                      : "bg-primary-600"
                            }`}
                            style={{ width: `${budget.percent}%` }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}