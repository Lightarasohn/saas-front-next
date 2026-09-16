"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Alert from "@/components/ui/Alert";
import InactiveToggle from "@/components/ui/InactiveToggle";
import BudgetFilters from "./BudgetFilters";
import BudgetTable from "./BudgetTable";
import CreateBudgetModal from "./CreateBudgetModal";
import UpdateBudgetModal from "./UpdateBudgetModal";
import { formatMoney } from "@/lib/format";
 
export default function BudgetManager({
    budgets,
    orgUnits,
    canManage,
    showInactive,
    filters,
}) {
    const router = useRouter();
 
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [notice, setNotice] = useState(null);
 
    const hiddenCount = budgets.filter((b) => b.orgUnitIsActive === false).length;
 
    const visibleBudgets = showInactive
        ? budgets
        : budgets.filter((b) => b.orgUnitIsActive !== false);
 
    const handleDone = (message) => {
        setNotice({ variant: "success", message });
        setIsCreateOpen(false);
        setEditing(null);
        router.refresh();
    };
 
    const totals = visibleBudgets.reduce(
        (acc, b) => ({
            total: acc.total + b.totalAmount,
            used: acc.used + b.usedAmount,
            remaining: acc.remaining + b.remainingAmount,
        }),
        { total: 0, used: 0, remaining: 0 },
    );
 
    const isEmpty = visibleBudgets.length === 0;
 
    return (
        <div className="flex flex-col gap-3">
            {notice ? <Alert variant={notice.variant}>{notice.message}</Alert> : null}
 
            <div className="grid grid-cols-3 gap-3">
                <Panel title="Toplam Bütçe">
                    <p
                        className={`text-2xl font-semibold tabular-nums ${
                            isEmpty ? "text-neutral-300" : "text-neutral-900"
                        }`}
                    >
                        {isEmpty ? "—" : formatMoney(totals.total)}
                    </p>
                    <p className="text-xs text-neutral-500">
                        {isEmpty ? "kayıt yok" : `${visibleBudgets.length} dönem`}
                    </p>
                </Panel>
 
                <Panel title="Harcanan">
                    <p
                        className={`text-2xl font-semibold tabular-nums ${
                            isEmpty ? "text-neutral-300" : "text-neutral-900"
                        }`}
                    >
                        {isEmpty ? "—" : formatMoney(totals.used)}
                    </p>
                    <p className="text-xs text-neutral-500">
                        {isEmpty
                            ? "kayıt yok"
                            : totals.total > 0
                              ? `%${Math.round((totals.used / totals.total) * 100)}`
                              : "—"}
                    </p>
                </Panel>
 
                <Panel title="Kalan">
                    <p
                        className={`text-2xl font-semibold tabular-nums ${
                            isEmpty
                                ? "text-neutral-300"
                                : totals.remaining < 0
                                  ? "text-error"
                                  : "text-neutral-900"
                        }`}
                    >
                        {isEmpty ? "—" : formatMoney(totals.remaining)}
                    </p>
                    <p className="text-xs text-neutral-500">
                        onaylanmış masraflar sonrası
                    </p>
                </Panel>
            </div>
 
            <Panel
                title="Bütçeler"
                action={
                    <div className="flex items-center gap-3">
                        <InactiveToggle
                            checked={showInactive}
                            count={hiddenCount}
                            label="Pasif birimleri göster"
                        />
 
                        {canManage ? (
                            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                                <Plus size={13} aria-hidden="true" />
                                Yeni Bütçe
                            </Button>
                        ) : null}
                    </div>
                }
            >
                <div className="flex flex-col gap-3">
                    <BudgetFilters orgUnits={orgUnits} filters={filters} />
 
                    <BudgetTable
                        budgets={visibleBudgets}
                        canManage={canManage}
                        onEdit={setEditing}
                    />
                </div>
            </Panel>
 
            <CreateBudgetModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                orgUnits={orgUnits}
                existingBudgets={budgets}
                onSuccess={handleDone}
            />
 
            <UpdateBudgetModal
                isOpen={editing !== null}
                onClose={() => setEditing(null)}
                budget={editing}
                onSuccess={handleDone}
            />
        </div>
    );
}