"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orgUnitUpdateSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function UpdateOrgUnitModal({ isOpen, onClose, orgUnit, onSuccess }) {
    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(orgUnitUpdateSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        if (!isOpen || !orgUnit) return;

        reset({
            orgUnitPublicId: orgUnit.publicId,
            name: orgUnit.name,
        });
        clearErrors();
    }, [isOpen, orgUnit, reset, clearErrors]);

    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/org-units", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const body = await res.json();

            if (body.isSuccess) {
                onSuccess(body.message ?? "Birim güncellendi");
            } else {
                setError("root", { message: body.message ?? "Birim güncellenemedi" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };

    if (!orgUnit) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Birimi Düzenle">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input type="hidden" {...register("orgUnitPublicId")} />

                <Input
                    label="Birim Adı"
                    type="text"
                    hint="Birimin hiyerarşideki yeri değiştirilemez."
                    error={errors.name?.message}
                    {...register("name")}
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