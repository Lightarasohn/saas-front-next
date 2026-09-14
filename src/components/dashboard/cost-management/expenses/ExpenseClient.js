"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { expenseSchema, expenseUpdateSchema } from "@/lib/validation/cms-validation";

export default function ExpenseClient({ mode = "create", expense = null, budgets = [], categories = [] }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const isEdit = mode === "edit";

    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(isEdit ? expenseUpdateSchema : expenseSchema),
        defaultValues: {
            budgetPublicId: "",
            expenseCategoryPublicId: expense?.expenseCategoryPublicId || "",
            amount: expense?.amount || "",
            description: expense?.description || "",
        },
    });

    const handleOpen = () => {
        reset({
            budgetPublicId: "",
            expenseCategoryPublicId: expense?.expenseCategoryPublicId || "",
            amount: expense?.amount || "",
            description: expense?.description || "",
        });
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            const method = isEdit ? "PUT" : "POST";
            const payload = isEdit 
                ? { 
                    expensePublicId: expense.publicId, 
                    expenseCategoryPublicId: data.expenseCategoryPublicId, 
                    amount: data.amount, 
                    description: data.description 
                  }
                : { 
                    budgetPublicId: data.budgetPublicId, 
                    expenseCategoryPublicId: data.expenseCategoryPublicId, 
                    amount: data.amount, 
                    description: data.description 
                  };

            const res = await fetch("/api/cost-management/expenses", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await res.json();

            if (body.isSuccess) {
                handleClose();
                router.refresh();
            } else {
                setError("root", { message: body.message });
            }
        } catch {
            setError("root", { message: "Sunucu hatası oluştu." });
        }
    };

    return (
        <>
            {isEdit ? (
                <Button variant="ghost" size="sm" onClick={handleOpen} title="Düzenle">
                    <Edit size={16} aria-hidden="true" />
                </Button>
            ) : (
                <Button variant="primary" size="sm" onClick={handleOpen}>
                    Yeni Masraf
                </Button>
            )}

            <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? "Masrafı Düzenle" : "Yeni Masraf Gir"} size="md">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    
                    {!isEdit && (
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-neutral-700">İlgili Bütçe</span>
                            <select 
                                className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                {...register("budgetPublicId")}
                            >
                                <option value="">Bütçe Seçin...</option>
                                {budgets.map((b) => (
                                    <option key={b.publicId} value={b.publicId}>
                                        {b.orgUnitName} - {b.month}/{b.year}
                                    </option>
                                ))}
                            </select>
                            {errors.budgetPublicId?.message && <span className="text-xs text-error">{errors.budgetPublicId.message}</span>}
                        </label>
                    )}

                    <div className="flex gap-4">
                        <label className="flex flex-col gap-1 flex-1">
                            <span className="text-sm font-medium text-neutral-700">Kategori</span>
                            <select 
                                className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                {...register("expenseCategoryPublicId")}
                            >
                                <option value="">Kategori Seçin...</option>
                                {categories.map((c) => (
                                    <option key={c.publicId} value={c.publicId}>{c.name}</option>
                                ))}
                            </select>
                            {errors.expenseCategoryPublicId?.message && <span className="text-xs text-error">{errors.expenseCategoryPublicId.message}</span>}
                        </label>

                        <Input 
                            label="Tutar" 
                            type="number" 
                            step="0.01"
                            className="flex-1"
                            error={errors.amount?.message} 
                            {...register("amount")} 
                        />
                    </div>

                    <Input 
                        label="Açıklama" 
                        placeholder="Örn: Müşteri ziyareti taksi ücreti"
                        error={errors.description?.message} 
                        {...register("description")} 
                    />

                    {errors.root?.message && <Alert variant="error">{errors.root.message}</Alert>}
                    
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>İptal</Button>
                        <Button type="submit" isLoading={isSubmitting}>{isEdit ? "Güncelle" : "Kaydet"}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}