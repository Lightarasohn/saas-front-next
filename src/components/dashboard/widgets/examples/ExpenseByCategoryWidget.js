"use client";

import Alert from "@/components/ui/Alert";
import { useApiResource } from "@/hooks/useApiResource";
import { formatCurrency, isApproved } from "@/lib/cost-management/format";

export default function ExpenseByCategoryWidget() {
    const { loading, error, data } = useApiResource(
        "/api/cost-management/expenses?onlyMine=false"
    );

    if (loading) return <p className="text-sm text-neutral-400">Yükleniyor...</p>;
    if (error) return <Alert variant="error">{error}</Alert>;

    const approved = (data ?? []).filter(isApproved);
    const grandTotal = approved.reduce((sum, e) => sum + (e.amount ?? 0), 0);

    const byCategory = Object.values(
        approved.reduce((acc, expense) => {
            const name = expense.expenseCategoryName ?? "Diğer";
            acc[name] = acc[name] ?? { name, total: 0, count: 0 };
            acc[name].total += expense.amount ?? 0;
            acc[name].count += 1;
            return acc;
        }, {})
    ).sort((a, b) => b.total - a.total);

    if (byCategory.length === 0) {
        return <p className="text-sm text-neutral-500">Onaylanmış masraf kaydı yok.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold tabular-nums text-neutral-900">
                    {formatCurrency(grandTotal)}
                </span>
                <span className="text-xs text-neutral-500">{byCategory.length} kategori</span>
            </div>

            <ul className="flex flex-col gap-2 border-t border-neutral-200 pt-2">
                {byCategory.slice(0, 5).map((category) => {
                    const share = grandTotal > 0 ? Math.round((category.total / grandTotal) * 100) : 0;
                    return (
                        <li key={category.name} className="flex flex-col gap-1">
                            <div className="flex items-baseline justify-between gap-2 text-sm">
                                <span className="truncate text-neutral-900">{category.name}</span>
                                <span className="shrink-0 text-xs tabular-nums text-neutral-500">
                                    {formatCurrency(category.total)} · %{share}
                                </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-sm bg-neutral-100">
                                <div
                                    className="h-full rounded-sm bg-primary-600"
                                    style={{ width: `${share}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}