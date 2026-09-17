"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";

function formatCurrency(amount) {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
    }).format(new Date(dateString));
}

// Backend'in döndürdüğü "status" metni için rozet rengini belirler.
// Kesin enum/string değerlerini görmediğim için anahtar kelime eşleşmesiyle
// tahmin ediyorum — gerçek metinler farklıysa burayı güncelleyin.
function statusVariant(status) {
    const s = (status ?? "").toLocaleLowerCase("tr-TR");
    if (s.includes("red")) return "error";
    if (s.includes("onay")) return "success";
    return "warning";
}

export default function CostManagementWidget() {
    const [state, setState] = useState({
        loading: true,
        error: null,
        budgets: [],
        expenses: [],
    });

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            try {
                const [budgetsRes, expensesRes] = await Promise.all([
                    fetch(`/api/cost-management/budgets?year=${year}&month=${month}`, { cache: "no-store" }),
                    fetch(`/api/cost-management/expenses?onlyMine=false`, { cache: "no-store" }),
                ]);

                const budgetsBody = await budgetsRes.json();
                const expensesBody = await expensesRes.json();

                if (cancelled) return;

                const budgetsOk = budgetsRes.ok && budgetsBody?.isSuccess;
                const expensesOk = expensesRes.ok && expensesBody?.isSuccess;

                setState({
                    loading: false,
                    error: !budgetsOk && !expensesOk ? "Veriler yüklenemedi." : null,
                    budgets: budgetsOk ? budgetsBody.data ?? [] : [],
                    expenses: expensesOk ? expensesBody.data ?? [] : [],
                });
            } catch (err) {
                if (!cancelled) {
                    setState({
                        loading: false,
                        error: "Sunucu ile iletişim kurulamadı.",
                        budgets: [],
                        expenses: [],
                    });
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    if (state.loading) {
        return <p className="text-sm text-neutral-400">Yükleniyor...</p>;
    }

    if (state.error) {
        return <Alert variant="error">{state.error}</Alert>;
    }

    const totals = state.budgets.reduce(
        (acc, b) => ({
            total: acc.total + (b.totalAmount ?? 0),
            used: acc.used + (b.usedAmount ?? 0),
            remaining: acc.remaining + (b.remainingAmount ?? 0),
        }),
        { total: 0, used: 0, remaining: 0 }
    );

    const usedPercent = totals.total > 0 ? Math.min(100, Math.round((totals.used / totals.total) * 100)) : 0;

    const recentExpenses = [...state.expenses]
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-3">
            {state.budgets.length === 0 ? (
                <p className="text-sm text-neutral-500">Bu ay için tanımlı bütçe yok.</p>
            ) : (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-semibold tabular-nums text-neutral-900">
                            {formatCurrency(totals.remaining)}
                        </span>
                        <span className="text-xs text-neutral-500">
                            kalan / {formatCurrency(totals.total)}
                        </span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-sm bg-neutral-100">
                        <div
                            className={`h-full rounded-sm ${usedPercent >= 90 ? "bg-error" : "bg-primary-600"}`}
                            style={{ width: `${usedPercent}%` }}
                        />
                    </div>

                    <span className="text-xs text-neutral-500">%{usedPercent} kullanıldı</span>
                </div>
            )}

            <div className="flex flex-col gap-1 border-t border-neutral-200 pt-2">
                <p className="text-xs font-medium text-neutral-700">Son Masraflar</p>

                {recentExpenses.length === 0 ? (
                    <p className="text-xs text-neutral-500">Henüz masraf kaydı yok.</p>
                ) : (
                    <ul className="flex flex-col gap-1">
                        {recentExpenses.map((expense) => (
                            <li
                                key={expense.publicId}
                                className="flex items-center justify-between gap-2 text-sm"
                            >
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-neutral-900">
                                        {expense.expenseCategoryName ?? "—"}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        {expense.orgUnitName ?? "—"} · {formatDate(expense.createDate)}
                                    </span>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <span className="tabular-nums text-neutral-900">
                                        {formatCurrency(expense.amount)}
                                    </span>
                                    <Badge variant={statusVariant(expense.status)}>
                                        {expense.status ?? "—"}
                                    </Badge>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}