"use client";
 
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orgUnitCreateSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
 
const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";
 
export default function CreateOrgUnitModal({
    isOpen,
    onClose,
    orgUnits,
    defaultParent,
    onSuccess,
}) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(orgUnitCreateSchema),
        mode: "onBlur",
    });
 
    // Modal her açıldığında formu temizle, üst birimi seçili birime ayarla
    useEffect(() => {
        if (!isOpen) return;
 
        reset({
            name: "",
            parentPublicId: defaultParent?.publicId ?? "",
        });
    }, [isOpen, defaultParent, reset]);
 
    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/org-units", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    parentPublicId: data.parentPublicId || EMPTY_GUID,
                    name: data.name,
                }),
            });
 
            const body = await res.json();
 
            if (body.isSuccess) {
                onSuccess(body.message ?? "Birim oluşturuldu");
            } else {
                setError("root", { message: body.message ?? "Birim oluşturulamadı" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Birim">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-700">Üst Birim</span>
                    <select
                        className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        {...register("parentPublicId")}
                    >
                        <option value="">Üst birim yok (kök birim)</option>
                        {orgUnits.map((unit) => (
                            <option key={unit.publicId} value={unit.publicId}>
                                {"\u00A0".repeat(unit.level * 3)}
                                {unit.name}
                            </option>
                        ))}
                    </select>
                    <span className="text-xs text-neutral-500">
                        Boş bırakılırsa en üst seviyede bir birim oluşturulur.
                    </span>
                </label>
 
                <Input
                    label="Birim Adı"
                    type="text"
                    placeholder="Pazarlama"
                    error={errors.name?.message}
                    {...register("name")}
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
                        {isSubmitting ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}