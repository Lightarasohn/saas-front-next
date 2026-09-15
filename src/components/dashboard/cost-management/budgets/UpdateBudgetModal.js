"use client";
 
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetUpdateSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { formatMoney } from "@/lib/format";
 
const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
 
const selectClass =
    "rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
 
export default function UpdateBudgetModal({ isOpen, onClose, budget, onSuccess }) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(budgetUpdateSchema),
        mode: "onBlur",
    });
 
    useEffect(() => {
        if (!isOpen || !budget) return;
 
        reset({
            budgetPublicId: budget.publicId,
            month: budget.month,
            year: budget.year,
            totalAmount: budget.totalAmount,
        });
    }, [isOpen, budget, reset]);
 
    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/budgets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
 
            const body = await res.json();
 
            if (body.isSuccess) {
                onSuccess(body.message ?? "Bütçe güncellendi");
            } else {
                setError("root", { message: body.message ?? "Bütçe güncellenemedi" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };
 
    if (!budget) return null;
 
    const currentYear = new Date().getFullYear();
    const years = [currentYear + 1, currentYear, currentYear - 1];
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${budget.orgUnitName} — Bütçe Düzenle`}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input type="hidden" {...register("budgetPublicId")} />
 
                <div className="flex justify-between rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2">
                    <div>
                        <p className="text-xs text-neutral-500">Harcanan</p>
                        <p className="text-sm font-medium tabular-nums text-neutral-900">
                            {formatMoney(budget.usedAmount)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-neutral-500">Kalan</p>
                        <p
                            className={`text-sm font-medium tabular-nums ${
                                budget.remainingAmount < 0 ? "text-error" : "text-neutral-900"
                            }`}
                        >
                            {formatMoney(budget.remainingAmount)}
                        </p>
                    </div>
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-neutral-700">Ay</span>
                        <select className={selectClass} {...register("month")}>
                            {MONTHS.map((name, i) => (
                                <option key={name} value={i + 1}>{name}</option>
                            ))}
                        </select>
                        {errors.month ? (
                            <span className="text-xs text-error">{errors.month.message}</span>
                        ) : null}
                    </label>
 
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-neutral-700">Yıl</span>
                        <select className={selectClass} {...register("year")}>
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        {errors.year ? (
                            <span className="text-xs text-error">{errors.year.message}</span>
                        ) : null}
                    </label>
                </div>
 
                <Input
                    label="Bütçe Tutarı"
                    type="number"
                    step="0.01"
                    min={budget.usedAmount}
                    hint={`En az ${formatMoney(budget.usedAmount)} olabilir — onaylanmış masraflar bu tutarın altına inemez.`}
                    error={errors.totalAmount?.message}
                    {...register("totalAmount")}
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