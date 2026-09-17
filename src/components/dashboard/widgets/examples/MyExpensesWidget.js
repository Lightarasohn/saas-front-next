"use client";

import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import { useApiResource } from "@/hooks/useApiResource";
import {
    formatCurrency,
    formatDate,
    isApproved,
    isPending,
    statusVariant,
} from "@/lib/cost-management/format";

export default function MyExpensesWidget() {
    const { loading, error, data } = useApiResource("/api/cost-management/expenses?onlyMine=true");

    if (loading) return <p className="text-sm text-neutral-400">Yükleniyor...</p>;
    if (error) return <Alert variant="error">{error}</Alert>;

    const expenses = data ?? [];
    const pendingCount = expenses.filter(isPending).length;
    const approvedTotal = expenses
        .filter(isApproved)
        .reduce((sum, e) => sum + (e.amount ?? 0), 0);

    const recent = [...expenses]
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold tabular-nums text-neutral-900">
                    {formatCurrency(approvedTotal)}
                </span>
                <span className="text-xs text-neutral-500">
                    onaylanan · {pendingCount} beklemede
                </span>
            </div>

            {recent.length === 0 ? (
                <p className="text-xs text-neutral-500">Henüz masraf girmediniz.</p>
            ) : (
                <ul className="flex flex-col gap-1 border-t border-neutral-200 pt-2">
                    {recent.map((expense) => (
                        <li
                            key={expense.publicId}
                            className="flex items-center justify-between gap-2 text-sm"
                        >
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-neutral-900">
                                    {expense.expenseCategoryName ?? "—"}
                                </span>
                                <span className="truncate text-xs text-neutral-500">
                                    {expense.description || formatDate(expense.createDate)}
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <span className="tabular-nums text-neutral-900">
                                    {formatCurrency(expense.amount)}
                                </span>
                                <Badge variant={statusVariant(expense)}>
                                    {expense.status ?? "—"}
                                </Badge>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}