"use client";
 
import { Ban, Pencil, Check, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatMoney, formatDate, formatPeriod } from "@/lib/format";
import { EXPENSE_STATUS, STATUS_LABELS, STATUS_VARIANTS } from "@/lib/expense-status";
 
function Row({ label, children }) {
    return (
        <div className="flex gap-4 border-b border-neutral-100 py-2 last:border-0">
            <span className="w-28 shrink-0 text-xs text-neutral-500">{label}</span>
            <div className="min-w-0 flex-1 text-sm text-neutral-900">{children}</div>
        </div>
    );
}
 
export default function ExpenseDetailModal({
    isOpen,
    onClose,
    expense,
    canEdit,
    canAct,
    onEdit,
    onApprove,
    onReject,
}) {
    if (!expense) return null;
 
    const isRejected = expense.statusId === EXPENSE_STATUS.REJECTED;
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Masraf Detayı" size="lg">
            <div className="flex flex-col">
                <Row label="Durum">
                    <Badge variant={STATUS_VARIANTS[expense.statusId]}>
                        {STATUS_LABELS[expense.statusId]}
                    </Badge>
                </Row>
 
                <Row label="Tutar">
                    <span className="text-lg font-semibold tabular-nums">
                        {formatMoney(expense.amount)}
                    </span>
                </Row>
 
                <Row label="Kategori">{expense.expenseCategoryName}</Row>
 
                <Row label="Birim">
                    {expense.orgUnitName}
                    <span className="ml-2 text-xs text-neutral-500">
                        {formatPeriod(expense.budgetMonth, expense.budgetYear)}
                    </span>
                </Row>
 
                <Row label="Giren">{expense.createUserName}</Row>
 
                <Row label="Tarih">{formatDate(expense.createDate)}</Row>
 
                <Row label="Açıklama">
                    {expense.description ? (
                        <p className="break-all whitespace-pre-wrap">
                            {expense.description}
                        </p>
                    ) : (
                        <span className="text-neutral-400">—</span>
                    )}
                </Row>
 
                {isRejected && expense.rejectReason ? (
                    <Row label="Ret Sebebi">
                        <div className="flex gap-2 rounded-sm border border-error-border bg-error-bg px-3 py-2">
                            <Ban size={14} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
                            <p className="break-all whitespace-pre-wrap text-error">
                                {expense.rejectReason}
                            </p>
                        </div>
                    </Row>
                ) : null}
            </div>
 
            <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={onClose}>
                    Kapat
                </Button>
 
                {canEdit ? (
                    <Button
                        variant="secondary"
                        onClick={() => {
                            onClose();
                            onEdit(expense);
                        }}
                    >
                        <Pencil size={13} aria-hidden="true" />
                        Düzenle
                    </Button>
                ) : null}
 
                {canAct ? (
                    <>
                        <Button
                            variant="danger"
                            onClick={() => {
                                onClose();
                                onReject(expense);
                            }}
                        >
                            <X size={13} aria-hidden="true" />
                            Reddet
                        </Button>
 
                        <Button
                            onClick={() => {
                                onClose();
                                onApprove(expense);
                            }}
                        >
                            <Check size={13} aria-hidden="true" />
                            Onayla
                        </Button>
                    </>
                ) : null}
            </div>
        </Modal>
    );
}