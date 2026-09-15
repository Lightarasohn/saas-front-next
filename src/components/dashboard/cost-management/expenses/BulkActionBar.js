"use client";
 
import { useState } from "react";
import { X, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
 
export default function BulkActionBar({ selectedIds, expenses, onClear, onDone }) {
    const [isBusy, setIsBusy] = useState(false);
    const [warning, setWarning] = useState(null);
 
    if (selectedIds.length === 0) return null;
 
    const total = expenses
        .filter((e) => selectedIds.includes(e.publicId))
        .reduce((sum, e) => sum + e.amount, 0);
 
    const check = async () => {
        setIsBusy(true);
        setWarning(null);
 
        try {
            const res = await fetch(
                "/api/cost-management/expenses/can-approve-range",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ expensePublicIdList: selectedIds }),
                },
            );
 
            const body = await res.json();
 
            if (body.isSuccess) {
                await approve();
            } else {
                setWarning(body.message ?? "Onaylanamaz");
                setIsBusy(false);
            }
        } catch {
            setWarning("Sunucuya ulaşılamadı");
            setIsBusy(false);
        }
    };
 
    const approve = async () => {
        setIsBusy(true);
 
        try {
            const res = await fetch("/api/cost-management/expenses/approve-range", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expensePublicIdList: selectedIds }),
            });
 
            const body = await res.json();
 
            onDone(
                body.isSuccess
                    ? (body.message ?? "Masraflar onaylandı")
                    : (body.message ?? "Onaylanamadı"),
                body.isSuccess ? "success" : "error",
            );
        } catch {
            onDone("Sunucuya ulaşılamadı", "error");
        } finally {
            setIsBusy(false);
        }
    };
 
    return (
        <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 px-4">
            <div className="flex flex-col gap-2 rounded border border-neutral-300 bg-white p-3 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClear}
                            className="rounded-sm p-1 text-neutral-500 transition-colors hover:bg-neutral-100"
                            title="Seçimi temizle"
                        >
                            <X size={14} aria-hidden="true" />
                        </button>
 
                        <span className="text-sm text-neutral-700">
                            <span className="font-medium text-neutral-900">
                                {selectedIds.length}
                            </span>{" "}
                            masraf seçildi
                        </span>
 
                        <span className="text-sm font-medium tabular-nums text-neutral-900">
                            {formatMoney(total)}
                        </span>
                    </div>
 
                    <Button size="sm" onClick={check} isLoading={isBusy}>
                        <Check size={13} aria-hidden="true" />
                        {isBusy ? "İşleniyor..." : "Seçilenleri Onayla"}
                    </Button>
                </div>
 
                {warning ? (
                    <div className="flex items-center justify-between gap-3 rounded-sm border border-warning-border bg-warning-bg px-3 py-2">
                        <span className="text-xs text-warning">{warning}</span>
                        <button
                            type="button"
                            onClick={approve}
                            className="shrink-0 text-xs font-medium text-warning underline"
                        >
                            Yine de onayla
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}