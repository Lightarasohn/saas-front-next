"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Alert from "@/components/ui/Alert";
import ExpenseFilters from "./ExpenseFilters";
import ExpenseTable from "./ExpenseTable";
import CreateExpenseModal from "./CreateExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal";
import RejectExpenseModal from "./RejectExpenseModal";
import BulkActionBar from "./BulkActionBar";
import { formatMoney, formatPeriod } from "@/lib/format";
import { EXPENSE_STATUS } from "@/lib/expense-status";
 
export default function ExpenseManager({
    expenses,
    budgets,
    categories,
    activeBudget,
    me,
    filters,
}) {
    const router = useRouter();
 
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [rejecting, setRejecting] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [notice, setNotice] = useState(null);
 
    const isAdmin = me?.roleName === "Admin" || me?.roleName === "SuperAdmin";
 
    const handleDone = (message, variant = "success") => {
        setNotice({ variant, message });
        setIsCreateOpen(false);
        setEditing(null);
        setRejecting(null);
        setSelectedIds([]);
        router.refresh();
    };
 
    // Kullanıcı bu masrafı onaylayabilir mi?
    // Backend zaten yalnızca kendi masraflarını + yetkili olduğu birimlerin
    // masraflarını döndürüyor. Yani başkasının masrafı listede görünüyorsa
    // bu kullanıcı o birimde onaylayıcıdır.
    const canActOn = (expense) =>
        expense.statusId === EXPENSE_STATUS.PENDING &&
        (isAdmin || expense.userPublicId !== me?.publicId);
 
    const canEdit = (expense) =>
        expense.statusId === EXPENSE_STATUS.PENDING &&
        (isAdmin || expense.userPublicId !== me?.publicId);
 
    const pendingExpenses = expenses.filter(
        (e) => e.statusId === EXPENSE_STATUS.PENDING,
    );
 
    const summary = expenses.reduce(
        (acc, e) => {
            if (e.statusId === EXPENSE_STATUS.PENDING) {
                acc.pendingCount += 1;
                acc.pendingAmount += e.amount;
            } else if (e.statusId === EXPENSE_STATUS.APPROVED) {
                acc.approvedAmount += e.amount;
            } else {
                acc.rejectedCount += 1;
            }
            return acc;
        },
        { pendingCount: 0, pendingAmount: 0, approvedAmount: 0, rejectedCount: 0 },
    );
 
    return (
        <div className="flex flex-col gap-3">
            {notice ? <Alert variant={notice.variant}>{notice.message}</Alert> : null}
 
            {/* Bütçe bağlamı: hangi bütçedeyiz, ne kadar kaldı, bekleyenler ne yapar */}
            {activeBudget ? (
                <Panel
                    title={`${activeBudget.orgUnitName} — ${formatPeriod(activeBudget.month, activeBudget.year)}`}
                    action={
                        <Link
                            href="/dashboard/cost-management/budgets"
                            className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
                        >
                            <ArrowLeft size={12} aria-hidden="true" />
                            Bütçelere dön
                        </Link>
                    }
                >
                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <p className="text-xs text-neutral-500">Bütçe</p>
                            <p className="text-sm font-medium tabular-nums text-neutral-900">
                                {formatMoney(activeBudget.totalAmount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500">Onaylanan</p>
                            <p className="text-sm font-medium tabular-nums text-neutral-900">
                                {formatMoney(activeBudget.usedAmount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500">Kalan</p>
                            <p
                                className={`text-sm font-medium tabular-nums ${
                                    activeBudget.remainingAmount < 0
                                        ? "text-error"
                                        : "text-neutral-900"
                                }`}
                            >
                                {formatMoney(activeBudget.remainingAmount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500">
                                Bekleyen ({summary.pendingCount})
                            </p>
                            <p className="text-sm font-medium tabular-nums text-warning">
                                {formatMoney(summary.pendingAmount)}
                            </p>
                        </div>
                    </div>
 
                    {summary.pendingAmount > activeBudget.remainingAmount ? (
                        <p className="mt-3 rounded-sm border border-warning-border bg-warning-bg px-3 py-2 text-xs text-warning">
                            Bekleyen masrafların tamamı onaylanırsa bütçe{" "}
                            {formatMoney(summary.pendingAmount - activeBudget.remainingAmount)}{" "}
                            aşılacak.
                        </p>
                    ) : null}
                </Panel>
            ) : null}
 
            <Panel
                title="Masraflar"
                action={
                    <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                        <Plus size={13} aria-hidden="true" />
                        Yeni Masraf
                    </Button>
                }
            >
                <div className="flex flex-col gap-3">
                    <ExpenseFilters budgets={budgets} filters={filters} />
 
                    <ExpenseTable
                        expenses={expenses}
                        me={me}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        canActOn={canActOn}
                        canEdit={canEdit}
                        onEdit={setEditing}
                        onReject={setRejecting}
                        onDone={handleDone}
                        showBudgetColumn={!activeBudget}
                    />
                </div>
            </Panel>
 
            <BulkActionBar
                selectedIds={selectedIds}
                expenses={pendingExpenses}
                onClear={() => setSelectedIds([])}
                onDone={handleDone}
            />
 
            <CreateExpenseModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                budgets={budgets}
                categories={categories}
                defaultBudget={activeBudget}
                onSuccess={handleDone}
            />
 
            <UpdateExpenseModal
                isOpen={editing !== null}
                onClose={() => setEditing(null)}
                expense={editing}
                categories={categories}
                onSuccess={handleDone}
            />
 
            <RejectExpenseModal
                isOpen={rejecting !== null}
                onClose={() => setRejecting(null)}
                expense={rejecting}
                onSuccess={handleDone}
            />
        </div>
    );
}