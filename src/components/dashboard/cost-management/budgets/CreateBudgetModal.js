"use client";
 
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { formatPeriod } from "@/lib/format";
 
const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
 
const selectClass =
    "rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
 
export default function CreateBudgetModal({
    isOpen,
    onClose,
    orgUnits,
    existingBudgets,
    onSuccess,
}) {
    const now = new Date();
 
    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(budgetSchema),
        mode: "onBlur",
    });
 
    const selectedOrgUnit = useWatch({ control, name: "orgUnitPublicId" });
 
    useEffect(() => {
        if (!isOpen) return;
 
        reset({
            orgUnitPublicId: "",
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            totalAmount: "",
        });
    }, [isOpen, reset]);
 
    // Seçilen birimin mevcut bütçe dönemleri
    const takenPeriods = existingBudgets
        .filter((b) => b.orgUnitPublicId === selectedOrgUnit)
        .map((b) => formatPeriod(b.month, b.year));
 
    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
 
            const body = await res.json();
 
            if (body.isSuccess) {
                onSuccess(body.message ?? "Bütçe oluşturuldu");
            } else {
                setError("root", { message: body.message ?? "Bütçe oluşturulamadı" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };
 
    const currentYear = now.getFullYear();
    const years = [currentYear + 1, currentYear, currentYear - 1];
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Bütçe">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-700">Birim</span>
                    <select className={selectClass} {...register("orgUnitPublicId")}>
                        <option value="">Seçiniz</option>
                        {orgUnits
                            .filter((u) => u.isActive)
                            .map((unit) => (
                                <option key={unit.publicId} value={unit.publicId}>
                                    {"\u00A0".repeat(unit.level * 3)}{unit.name}
                                </option>
                            ))}
                    </select>
                    {errors.orgUnitPublicId ? (
                        <span className="text-xs text-error">
                            {errors.orgUnitPublicId.message}
                        </span>
                    ) : null}
                </label>
 
                {takenPeriods.length > 0 ? (
                    <div className="rounded-sm border border-info-border bg-info-bg px-3 py-2">
                        <p className="text-xs font-medium text-info">
                            Bu birimin bütçesi olan dönemler:
                        </p>
                        <p className="text-xs text-info">{takenPeriods.join(" · ")}</p>
                    </div>
                ) : null}
 
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
                    min="0"
                    placeholder="50000"
                    hint="Bu dönemde bu birimin harcayabileceği üst sınır."
                    error={errors.totalAmount?.message}
                    {...register("totalAmount")}
                />
 
                <Alert variant="error">{errors.root?.message}</Alert>
 
                <div className="flex gap-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        İptal
                    </Button>
                    <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                        {isSubmitting ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}