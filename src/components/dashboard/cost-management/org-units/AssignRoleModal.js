"use client";
 
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orgUnitAssignSchema } from "@/lib/validation/cms-validation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
 
const ROLE_OPTIONS = [
    {
        value: "user",
        label: "Üye",
        hint: "Birime masraf girebilir.",
    },
    {
        value: "approver",
        label: "Onaylayıcı",
        hint: "Birimin ve alt birimlerinin masraflarını onaylayabilir.",
    },
    {
        value: "manager",
        label: "Yönetici",
        hint: "Onaylayıcı yetkilerine ek olarak bütçe tanımlayabilir.",
    },
];
 
export default function AssignRoleModal({ isOpen, onClose, orgUnit, users, onSuccess }) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(orgUnitAssignSchema),
        mode: "onBlur",
    });
 
    useEffect(() => {
        if (!isOpen) return;
 
        reset({
            userPublicId: "",
            orgUnitPublicId: orgUnit?.publicId ?? "",
            type: "user",
        });
    }, [isOpen, orgUnit, reset]);
 
    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/org-units/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
 
            const body = await res.json();
 
            if (body.isSuccess) {
                onSuccess(body.message ?? "Kullanıcı atandı");
            } else {
                setError("root", { message: body.message ?? "Atama yapılamadı" });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı" });
        }
    };
 
    if (!orgUnit) return null;
 
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${orgUnit.name} — Kullanıcı Ata`}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input type="hidden" {...register("orgUnitPublicId")} />
 
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-700">Kullanıcı</span>
                    <select
                        className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        {...register("userPublicId")}
                    >
                        <option value="">Seçiniz</option>
                        {users.map((user) => (
                            <option key={user.publicId} value={user.publicId}>
                                {user.name} — {user.email}
                            </option>
                        ))}
                    </select>
                    {errors.userPublicId ? (
                        <span className="text-xs text-error">{errors.userPublicId.message}</span>
                    ) : null}
                </label>
 
                <fieldset className="flex flex-col gap-1">
                    <legend className="mb-1 text-sm font-medium text-neutral-700">
                        Birimdeki Rolü
                    </legend>
 
                    <div className="flex flex-col gap-1">
                        {ROLE_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                className="flex cursor-pointer items-start gap-2 rounded-sm border border-neutral-200 px-3 py-2 transition-colors hover:bg-neutral-50 has-checked:border-primary-500 has-checked:bg-primary-50"
                            >
                                <input
                                    type="radio"
                                    value={option.value}
                                    className="mt-0.5"
                                    {...register("type")}
                                />
                                <span className="flex flex-col">
                                    <span className="text-sm font-medium text-neutral-900">
                                        {option.label}
                                    </span>
                                    <span className="text-xs text-neutral-500">{option.hint}</span>
                                </span>
                            </label>
                        ))}
                    </div>
 
                    {errors.type ? (
                        <span className="text-xs text-error">{errors.type.message}</span>
                    ) : null}
                </fieldset>
 
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
                        {isSubmitting ? "Atanıyor..." : "Ata"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}