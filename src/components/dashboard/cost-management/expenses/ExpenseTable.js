"use client";
 
import { useState } from "react";
import { Check, X, Pencil, Ban } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ExpenseDetailModal from "./ExpenseDetailModal";
import { formatMoney, formatDate, formatPeriod } from "@/lib/format";
import { EXPENSE_STATUS, STATUS_LABELS, STATUS_VARIANTS } from "@/lib/expense-status";
 
export default function ExpenseTable({
    expenses,
    me,
    selectedIds,
    onSelectionChange,
    canActOn,
    canEdit,
    onEdit,
    onReject,
    onDone,
    showBudgetColumn,
}) {
    const [busyId, setBusyId] = useState(null);
    const [detail, setDetail] = useState(null);
 
    const approve = async (expense) => {
        setBusyId(expense.publicId);
        try {
            const res = await fetch("/api/cost-management/expenses/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expensePublicId: expense.publicId }),
            });
 
            const body = await res.json();
 
            onDone(
                body.isSuccess ? "Masraf onaylandı" : (body.message ?? "Onaylanamadı"),
                body.isSuccess ? "success" : "error",
            );
        } catch {
            onDone("Sunucuya ulaşılamadı", "error");
        } finally {
            setBusyId(null);
        }
    };
 
    if (expenses.length === 0) {
        return (
            <p className="py-4 text-center text-sm text-neutral-500">
                Seçilen filtrelere uygun masraf bulunamadı.
            </p>
        );
    }
 
    const selectable = expenses.filter(canActOn);
    const allSelected =
        selectable.length > 0 && selectedIds.length === selectable.length;
 
    const toggleAll = () => {
        onSelectionChange(allSelected ? [] : selectable.map((e) => e.publicId));
    };
 
    const toggleOne = (id) => {
        onSelectionChange(
            selectedIds.includes(id)
                ? selectedIds.filter((x) => x !== id)
                : [...selectedIds, id],
        );
    };
 
    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                            <th className="w-8 px-2 py-1.5">
                                {selectable.length > 0 ? (
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        aria-label="Tümünü seç"
                                    />
                                ) : null}
                            </th>
                            <th className="px-2 py-1.5 font-medium">Tarih</th>
                            <th className="px-2 py-1.5 font-medium">Kategori</th>
                            <th className="px-2 py-1.5 font-medium">Açıklama</th>
                            {showBudgetColumn ? (
                                <th className="px-2 py-1.5 font-medium">Birim / Dönem</th>
                            ) : null}
                            <th className="px-2 py-1.5 font-medium">Giren</th>
                            <th className="px-2 py-1.5 text-right font-medium">Tutar</th>
                            <th className="px-2 py-1.5 font-medium">Durum</th>
                            <th className="w-24 px-2 py-1.5" />
                        </tr>
                    </thead>
 
                    <tbody>
                        {expenses.map((expense) => {
                            const isMine = expense.userPublicId === me?.publicId;
                            const isSelected = selectedIds.includes(expense.publicId);
                            const isBusy = busyId === expense.publicId;
                            const isRejected =
                                expense.statusId === EXPENSE_STATUS.REJECTED;
                            const isUnitActive = expense.orgUnitIsActive !== false;
 
                            return (
                                <tr
                                    key={expense.publicId}
                                    onClick={() => setDetail(expense)}
                                    className={`cursor-pointer border-b border-neutral-100 last:border-0 ${
                                        isSelected ? "bg-primary-50" : "hover:bg-neutral-50"
                                    }`}
                                >
                                    <td
                                        className="px-2 py-2 align-top"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {canActOn(expense) ? (
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleOne(expense.publicId)}
                                                aria-label="Seç"
                                            />
                                        ) : null}
                                    </td>
 
                                    <td className="px-2 py-2 align-top whitespace-nowrap text-neutral-700">
                                        {formatDate(expense.createDate)}
                                    </td>
 
                                    <td className="px-2 py-2 align-top">
                                        <div className="max-w-35 truncate text-neutral-900">
                                            {expense.expenseCategoryName}
                                        </div>
                                    </td>
 
                                    {/* max-width içteki div'de: <td> üzerindeki
                                        genişlik kısıtını tablo yok sayıyor */}
                                    <td className="px-2 py-2 align-top">
                                        <div className="max-w-60 truncate text-neutral-500">
                                            {expense.description || "—"}
                                        </div>
 
                                        {isRejected && expense.rejectReason ? (
                                            <div
                                                className="mt-0.5 flex max-w-60 items-start gap-1 text-xs text-error"
                                                title={expense.rejectReason}
                                            >
                                                <Ban
                                                    size={11}
                                                    className="mt-0.5 shrink-0"
                                                    aria-hidden="true"
                                                />
                                                <span className="truncate">
                                                    {expense.rejectReason}
                                                </span>
                                            </div>
                                        ) : null}
                                    </td>
 
                                    {showBudgetColumn ? (
                                        <td className="px-2 py-2 align-top">
                                            <div className="flex max-w-45 items-center gap-1.5">
                                                <span
                                                    className={`truncate ${
                                                        isUnitActive
                                                            ? "text-neutral-700"
                                                            : "text-neutral-400"
                                                    }`}
                                                >
                                                    {expense.orgUnitName}
                                                </span>
 
                                                {!isUnitActive ? (
                                                    <span className="shrink-0 rounded-sm bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                                                        Pasif
                                                    </span>
                                                ) : null}
                                            </div>
 
                                            <div className="text-xs text-neutral-400">
                                                {formatPeriod(
                                                    expense.budgetMonth,
                                                    expense.budgetYear,
                                                )}
                                            </div>
                                        </td>
                                    ) : null}
 
                                    <td className="px-2 py-2 align-top">
                                        <div className="max-w-30 truncate text-neutral-700">
                                            {expense.createUserName}
                                            {isMine ? (
                                                <span className="ml-1 text-xs text-neutral-400">
                                                    (siz)
                                                </span>
                                            ) : null}
                                        </div>
                                    </td>
 
                                    <td className="px-2 py-2 align-top text-right font-medium tabular-nums whitespace-nowrap text-neutral-900">
                                        {formatMoney(expense.amount)}
                                    </td>
 
                                    <td className="px-2 py-2 align-top">
                                        <Badge variant={STATUS_VARIANTS[expense.statusId]}>
                                            {STATUS_LABELS[expense.statusId]}
                                        </Badge>
                                    </td>
 
                                    <td
                                        className="px-2 py-2 align-top"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-end gap-1">
                                            {canEdit(expense) ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(expense)}
                                                    title="Düzenle"
                                                    className="rounded-sm p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                                >
                                                    <Pencil size={14} aria-hidden="true" />
                                                </button>
                                            ) : null}
 
                                            {canActOn(expense) ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        disabled={isBusy}
                                                        onClick={() => approve(expense)}
                                                        title="Onayla"
                                                        className="rounded-sm p-1 text-success transition-colors hover:bg-success-bg disabled:opacity-50"
                                                    >
                                                        <Check size={14} aria-hidden="true" />
                                                    </button>
 
                                                    <button
                                                        type="button"
                                                        disabled={isBusy}
                                                        onClick={() => onReject(expense)}
                                                        title="Reddet"
                                                        className="rounded-sm p-1 text-error transition-colors hover:bg-error-bg disabled:opacity-50"
                                                    >
                                                        <X size={14} aria-hidden="true" />
                                                    </button>
                                                </>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
 
            <ExpenseDetailModal
                isOpen={detail !== null}
                onClose={() => setDetail(null)}
                expense={detail}
                canEdit={detail ? canEdit(detail) : false}
                canAct={detail ? canActOn(detail) : false}
                onEdit={onEdit}
                onApprove={approve}
                onReject={onReject}
            />
        </>
    );
}