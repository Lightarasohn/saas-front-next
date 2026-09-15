"use client";
 
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseUpdateSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { formatMoney } from "@/lib/format";
 
const selectClass =
    "rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
 
export default function UpdateExpenseModal({
    isOpen,
    onClose,
    expense,
    categories,
    onSuccess,
}) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(expenseUpdateSchema),
        mode: "onBlur",
    });
 
    useEffect(() => {
        if (!isOpen || !expense) return;
 
        reset({
            expensePublicId: expense.publicId,
            expenseCategoryPublicId: expense.expenseCategoryPublicId,
            amount: expense.amount,
            description: expense.description ?? "",
        });
    }, [isOpen, expense, reset]);
 
    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/expenses", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    description: data.description || null,
                }),
            });
 
            const body = await res.json();
 
            if (body.isSuccess) {
                onSuccess(body.message ?? "Masraf güncellendi");
            } else {
                setError("root", { message: body.message ?? "Masraf güncellenemedi" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };
 
    if (!expense) return null;
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Masrafı Düzenle">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input type="hidden" {...register("expensePublicId")} />
 
                <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-neutral-500">Birim</span>
                        <span className="text-neutral-900">{expense.orgUnitName}</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                        <span className="text-neutral-500">Giren</span>
                        <span className="text-neutral-900">{expense.createUserName}</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                        <span className="text-neutral-500">Mevcut tutar</span>
                        <span className="tabular-nums text-neutral-900">
                            {formatMoney(expense.amount)}
                        </span>
                    </div>
                </div>
 
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-700">Kategori</span>
                    <select className={selectClass} {...register("expenseCategoryPublicId")}>
                        {categories
                            .filter((c) => c.isActive)
                            .map((c) => (
                                <option key={c.publicId} value={c.publicId}>
                                    {c.name}
                                </option>
                            ))}
                    </select>
                    {errors.expenseCategoryPublicId ? (
                        <span className="text-xs text-error">
                            {errors.expenseCategoryPublicId.message}
                        </span>
                    ) : null}
                </label>
 
                <Input
                    label="Tutar"
                    type="number"
                    step="0.01"
                    min="0"
                    error={errors.amount?.message}
                    {...register("amount")}
                />
 
                <Input
                    label="Açıklama"
                    type="text"
                    error={errors.description?.message}
                    {...register("description")}
                />
 
                <Alert variant="error">{errors.root?.message}</Alert>
 
                <div className="flex gap-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        İptal
                    </Button>
                    <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                        {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}