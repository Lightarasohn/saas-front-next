"use client";
 
import { useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import CategoryCombobox from "./CategoryCombobox";
import { formatMoney, formatPeriod } from "@/lib/format";
 
const selectClass =
    "rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
 
export default function CreateExpenseModal({
    isOpen,
    onClose,
    budgets,
    categories,
    defaultBudget,
    onSuccess,
}) {
    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        control,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(expenseSchema),
        mode: "onBlur",
    });
 
    const watchedBudget = useWatch({ control, name: "budgetPublicId" });
    const watchedCategory = useWatch({ control, name: "expenseCategoryName" });
    const watchedAmount = useWatch({ control, name: "amount" });
 
    useEffect(() => {
        if (!isOpen) return;
 
        reset({
            budgetPublicId: defaultBudget?.publicId ?? "",
            expenseCategoryPublicId: null,
            expenseCategoryName: "",
            amount: "",
            description: "",
        });
 
        // reset değerleri sıfırlar ama hataları her zaman temizlemez
        clearErrors();
    }, [isOpen, defaultBudget, reset, clearErrors]);
 
    const selectedBudget = budgets.find((b) => b.publicId === watchedBudget) ?? null;
 
    const matchedCategory = categories.find(
        (c) => c.name.toLowerCase() === (watchedCategory ?? "").trim().toLowerCase(),
    );
 
    const amountNumber = Number(watchedAmount) || 0;
 
    const onSubmit = async (data) => {
        // Yazılan ad mevcut bir kategoriyle eşleşiyorsa onun id'sini gönder,
        // eşleşmiyorsa adı gönder — backend yoksa oluşturur.
        const payload = {
            budgetPublicId: data.budgetPublicId,
            expenseCategoryPublicId: matchedCategory?.publicId ?? null,
            expenseCategoryName: matchedCategory
                ? null
                : data.expenseCategoryName.trim(),
            amount: data.amount,
            description: data.description || null,
        };
 
        try {
            const res = await fetch("/api/cost-management/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
 
            const body = await res.json();
 
            if (body.isSuccess) {
                onSuccess(body.message ?? "Masraf eklendi");
            } else {
                setError("root", { message: body.message ?? "Masraf eklenemedi" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Masraf" size="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-700">Bütçe</span>
                    <select className={selectClass} {...register("budgetPublicId")}>
                        <option value="">Seçiniz</option>
                        {budgets.map((b) => (
                            <option key={b.publicId} value={b.publicId}>
                                {b.orgUnitName} — {formatPeriod(b.month, b.year)}
                            </option>
                        ))}
                    </select>
                    {errors.budgetPublicId ? (
                        <span className="text-xs text-error">
                            {errors.budgetPublicId.message}
                        </span>
                    ) : null}
                </label>
 
                {/* Seçilen bütçenin durumu — kullanıcı ne kadar yer kaldığını görür */}
                {selectedBudget ? (
                    <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">Bütçede kalan</span>
                            <span
                                className={`font-medium tabular-nums ${
                                    selectedBudget.remainingAmount < 0
                                        ? "text-error"
                                        : "text-neutral-900"
                                }`}
                            >
                                {formatMoney(selectedBudget.remainingAmount)}
                            </span>
                        </div>
 
                        {amountNumber > 0 ? (
                            <div className="mt-1 flex justify-between text-xs">
                                <span className="text-neutral-500">
                                    Bu masraf onaylanırsa
                                </span>
                                <span
                                    className={`font-medium tabular-nums ${
                                        selectedBudget.remainingAmount - amountNumber < 0
                                            ? "text-error"
                                            : "text-neutral-700"
                                    }`}
                                >
                                    {formatMoney(
                                        selectedBudget.remainingAmount - amountNumber,
                                    )}
                                </span>
                            </div>
                        ) : null}
                    </div>
                ) : null}
 
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-700">Kategori</span>
                    <Controller
                        control={control}
                        name="expenseCategoryName"
                        render={({ field }) => (
                            <CategoryCombobox
                                categories={categories}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.expenseCategoryPublicId?.message}
                            />
                        )}
                    />
                </div>
 
                <Input
                    label="Tutar"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    error={errors.amount?.message}
                    {...register("amount")}
                />
 
                <Input
                    label="Açıklama"
                    type="text"
                    placeholder="Ankara müşteri ziyareti"
                    hint="İsteğe bağlı. Onaylayan kişinin masrafı anlamasına yardımcı olur."
                    error={errors.description?.message}
                    {...register("description")}
                />
 
                <Alert variant="error">{errors.root?.message}</Alert>
 
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={onClose}
                    >
                        İptal
                    </Button>
                    <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                        {isSubmitting ? "Ekleniyor..." : "Ekle"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}