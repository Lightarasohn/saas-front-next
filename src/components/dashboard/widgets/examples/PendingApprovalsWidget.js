"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useApiResource } from "@/hooks/useApiResource";
import { formatCurrency, formatDate, isPending } from "@/lib/cost-management/format";

export default function PendingApprovalsWidget() {
    const { loading, error, data, refresh } = useApiResource(
        "/api/cost-management/expenses?onlyMine=false"
    );
    const [busyId, setBusyId] = useState(null);
    const [actionError, setActionError] = useState(null);

    async function act(kind, expensePublicId) {
        setBusyId(expensePublicId);
        setActionError(null);
        try {
            const res = await fetch(`/api/cost-management/expenses/${kind}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expensePublicId }),
            });
            const body = await res.json();
            if (!res.ok || !body?.isSuccess) {
                setActionError(body?.message ?? "İşlem tamamlanamadı.");
                return;
            }
            refresh();
        } catch {
            setActionError("Sunucu ile iletişim kurulamadı.");
        } finally {
            setBusyId(null);
        }
    }

    if (loading) return <p className="text-sm text-neutral-400">Yükleniyor...</p>;
    if (error) return <Alert variant="error">{error}</Alert>;

    const pending = (data ?? []).filter(isPending);
    const total = pending.reduce((sum, e) => sum + (e.amount ?? 0), 0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold tabular-nums text-neutral-900">
                    {pending.length}
                </span>
                <span className="text-xs text-neutral-500">
                    bekleyen · {formatCurrency(total)}
                </span>
            </div>

            {actionError && <Alert variant="error">{actionError}</Alert>}

            {pending.length === 0 ? (
                <p className="text-xs text-neutral-500">Onay bekleyen masraf yok.</p>
            ) : (
                <ul className="flex flex-col gap-1 border-t border-neutral-200 pt-2">
                    {pending.slice(0, 5).map((expense) => (
                        <li
                            key={expense.publicId}
                            className="flex items-center justify-between gap-2 text-sm"
                        >
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-neutral-900">
                                    {expense.expenseCategoryName ?? "—"}
                                </span>
                                <span className="truncate text-xs text-neutral-500">
                                    {expense.createUserName ?? "—"} · {formatDate(expense.createDate)}
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <span className="tabular-nums text-neutral-900">
                                    {formatCurrency(expense.amount)}
                                </span>
                                <button
                                    disabled={busyId === expense.publicId}
                                    onClick={() => act("approve", expense.publicId)}
                                    aria-label="Onayla"
                                    className="rounded-sm p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-success disabled:opacity-40"
                                >
                                    <Check size={14} aria-hidden="true" />
                                </button>
                                <button
                                    disabled={busyId === expense.publicId}
                                    onClick={() => act("reject", expense.publicId)}
                                    aria-label="Reddet"
                                    className="rounded-sm p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-error disabled:opacity-40"
                                >
                                    <X size={14} aria-hidden="true" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}