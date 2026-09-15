"use client";
 
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseRejectSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { formatMoney } from "@/lib/format";
 
export default function RejectExpenseModal({ isOpen, onClose, expense, onSuccess }) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(expenseRejectSchema),
        mode: "onBlur",
    });
 
    useEffect(() => {
        if (!isOpen || !expense) return;
 
        reset({
            expensePublicId: expense.publicId,
            rejectReason: "",
        });
    }, [isOpen, expense, reset]);
 
    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/expenses/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
 
            const body = await res.json();
 
            if (body.isSuccess) {
                onSuccess(body.message ?? "Masraf reddedildi");
            } else {
                setError("root", { message: body.message ?? "Reddedilemedi" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };
 
    if (!expense) return null;
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Masrafı Reddet">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input type="hidden" {...register("expensePublicId")} />
 
                <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-neutral-500">Kategori</span>
                        <span className="text-neutral-900">
                            {expense.expenseCategoryName}
                        </span>
                    </div>
                    <div className="mt-1 flex justify-between">
                        <span className="text-neutral-500">Tutar</span>
                        <span className="tabular-nums text-neutral-900">
                            {formatMoney(expense.amount)}
                        </span>
                    </div>
                    <div className="mt-1 flex justify-between">
                        <span className="text-neutral-500">Giren</span>
                        <span className="text-neutral-900">{expense.createUserName}</span>
                    </div>
                    {expense.description ? (
                        <div className="mt-1 flex justify-between gap-4">
                            <span className="shrink-0 text-neutral-500">Açıklama</span>
                            <span className="text-right text-neutral-900">
                                {expense.description}
                            </span>
                        </div>
                    ) : null}
                </div>
 
                <Input
                    label="Ret Sebebi"
                    type="text"
                    placeholder="Fatura tarihi hatalı"
                    hint="Masrafı giren kişi bu açıklamayı görecek."
                    error={errors.rejectReason?.message}
                    {...register("rejectReason")}
                />
 
                <Alert variant="error">{errors.root?.message}</Alert>
 
                <div className="flex gap-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        İptal
                    </Button>
                    <Button
                        type="submit"
                        variant="danger"
                        className="flex-1"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Reddediliyor..." : "Reddet"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}