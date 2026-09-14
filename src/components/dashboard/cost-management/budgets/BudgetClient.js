"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { budgetSchema, budgetUpdateSchema } from "@/lib/validation/cms-validation";

export default function BudgetClient({ mode = "create", budget = null, orgUnits = [] }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const isEdit = mode === "edit";

    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(isEdit ? budgetUpdateSchema : budgetSchema),
        defaultValues: {
            orgUnitPublicId: "",
            month: budget?.month || new Date().getMonth() + 1,
            year: budget?.year || new Date().getFullYear(),
            totalAmount: budget?.totalAmount || "",
        },
    });

    const handleOpen = () => {
        reset({
            orgUnitPublicId: "",
            month: budget?.month || new Date().getMonth() + 1,
            year: budget?.year || new Date().getFullYear(),
            totalAmount: budget?.totalAmount || "",
        });
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                // Güncelleme işleminden önce onay kontrolü (can-update)
                const checkRes = await fetch("/api/cost-management/budgets/can-update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        budgetPublicId: budget.publicId,
                        orgUnitPublicId: budget.orgUnitPublicId,
                        year: budget.year,
                        month: budget.month,
                        totalAmount: data.totalAmount,
                    }),
                });
                const checkBody = await checkRes.json();

                if (!checkBody.isSuccess) {
                    setError("root", { message: checkBody.message });
                    return;
                }

                // Doğrulama başarılıysa güncellemeyi gerçekleştir
                const updateRes = await fetch("/api/cost-management/budgets", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        budgetPublicId: budget.publicId,
                        year: budget.year,
                        month: budget.month,
                        totalAmount: data.totalAmount,
                    }),
                });
                const updateBody = await updateRes.json();

                if (updateBody.isSuccess) {
                    handleClose();
                    router.refresh();
                } else {
                    setError("root", { message: updateBody.message });
                }

            } else {
                // Yeni Bütçe Ekleme
                const res = await fetch("/api/cost-management/budgets", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orgUnitPublicId: data.orgUnitPublicId,
                        month: data.month,
                        year: data.year,
                        totalAmount: data.totalAmount,
                    }),
                });
                const body = await res.json();

                if (body.isSuccess) {
                    handleClose();
                    router.refresh();
                } else {
                    setError("root", { message: body.message });
                }
            }
        } catch {
            setError("root", { message: "Sunucu hatası oluştu. Lütfen tekrar deneyin." });
        }
    };

    return (
        <>
            {isEdit ? (
                <Button variant="ghost" size="sm" onClick={handleOpen}>Düzenle</Button>
            ) : (
                <Button variant="primary" size="sm" onClick={handleOpen}>Yeni Bütçe</Button>
            )}

            <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? "Bütçeyi Düzenle" : "Yeni Bütçe Tanımla"} size="sm">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    
                    {!isEdit && (
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-neutral-700">Organizasyon Birimi</span>
                            <select 
                                className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                {...register("orgUnitPublicId")}
                            >
                                <option value="">Birim Seçin...</option>
                                {orgUnits.map((unit) => (
                                    <option key={unit.publicId} value={unit.publicId}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            {errors.orgUnitPublicId?.message && <span className="text-xs text-error">{errors.orgUnitPublicId.message}</span>}
                        </label>
                    )}

                    <div className="flex gap-4">
                        <Input 
                            label="Ay" 
                            type="number" 
                            min="1" max="12" 
                            disabled={isEdit} 
                            error={errors.month?.message} 
                            className="flex-1"
                            {...register("month")} 
                        />
                        <Input 
                            label="Yıl" 
                            type="number" 
                            disabled={isEdit} 
                            error={errors.year?.message} 
                            className="flex-1"
                            {...register("year")} 
                        />
                    </div>

                    <Input 
                        label="Toplam Tutar" 
                        type="number" 
                        step="0.01"
                        placeholder="Örn: 50000" 
                        error={errors.totalAmount?.message} 
                        {...register("totalAmount")} 
                    />

                    {errors.root?.message && <Alert variant="error">{errors.root.message}</Alert>}
                    
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>İptal</Button>
                        <Button type="submit" isLoading={isSubmitting}>{isEdit ? "Güncelle" : "Oluştur"}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}