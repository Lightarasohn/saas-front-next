"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { orgUnitAssignSchema, orgUnitCreateSchema } from "@/lib/validation/cms-validation";

export default function OrgUnitClient({ mode = "create", unit = null, users = [] }) {
    const router = useRouter();
    const [modalType, setModalType] = useState(null);

    const createForm = useForm({
        resolver: zodResolver(orgUnitCreateSchema),
        defaultValues: { name: "" },
    });

    const assignForm = useForm({
        resolver: zodResolver(orgUnitAssignSchema),
        defaultValues: { userPublicId: "", roleType: "user" },
    });

    const closeModals = () => {
        setModalType(null);
        createForm.reset();
        assignForm.reset();
    };

    const onCreateSubmit = async (data) => {
        try {
            const parentPublicId = unit?.publicId || "00000000-0000-0000-0000-000000000000";
            const res = await fetch("/api/cost-management/org-units", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: data.name, parentPublicId }),
            });
            const body = await res.json();

            if (body.isSuccess) {
                closeModals();
                router.refresh();
            } else {
                createForm.setError("root", { message: body.message });
            }
        } catch {
            createForm.setError("root", { message: "Sunucu hatası oluştu." });
        }
    };

    const onAssignSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/org-units/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: data.roleType,
                    orgUnitPublicId: unit.publicId,
                    userPublicId: data.userPublicId,
                }),
            });
            const body = await res.json();

            if (body.isSuccess) {
                closeModals();
                router.refresh();
            } else {
                assignForm.setError("root", { message: body.message });
            }
        } catch {
            assignForm.setError("root", { message: "Sunucu hatası oluştu." });
        }
    };

    if (mode === "create" && !unit) {
        return (
            <>
                <Button variant="primary" size="sm" onClick={() => setModalType("create")}>Yeni Birim Ekle</Button>
                <Modal isOpen={modalType === "create"} onClose={closeModals} title="Yeni Ana Birim Ekle" size="sm">
                    <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex flex-col gap-4">
                        <Input label="Birim Adı" placeholder="Örn: Genel Müdürlük" error={createForm.formState.errors.name?.message} {...createForm.register("name")} />
                        {createForm.formState.errors.root?.message && <Alert variant="error">{createForm.formState.errors.root.message}</Alert>}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={closeModals}>İptal</Button>
                            <Button type="submit" isLoading={createForm.formState.isSubmitting}>Kaydet</Button>
                        </div>
                    </form>
                </Modal>
            </>
        );
    }

    return (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="sm" onClick={() => setModalType("create")} title="Alt Birim Ekle">
                <Plus size={16} aria-hidden="true" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setModalType("assign")} title="Kullanıcı / Rol Ata">
                <UserPlus size={16} aria-hidden="true" />
            </Button>

            <Modal isOpen={modalType === "create"} onClose={closeModals} title={`${unit?.name} - Alt Birim Ekle`} size="sm">
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex flex-col gap-4">
                    <Input label="Birim Adı" placeholder="Örn: Ar-Ge Ekibi" error={createForm.formState.errors.name?.message} {...createForm.register("name")} />
                    {createForm.formState.errors.root?.message && <Alert variant="error">{createForm.formState.errors.root.message}</Alert>}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeModals}>İptal</Button>
                        <Button type="submit" isLoading={createForm.formState.isSubmitting}>Kaydet</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={modalType === "assign"} onClose={closeModals} title={`${unit?.name} - Rol Ata`} size="sm">
                <form onSubmit={assignForm.handleSubmit(onAssignSubmit)} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-neutral-700">Kullanıcı</span>
                        <select 
                            className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            {...assignForm.register("userPublicId")}
                        >
                            <option value="">Seçiniz...</option>
                            {users.map(u => (
                                <option key={u.publicId} value={u.publicId}>{u.name} ({u.email})</option>
                            ))}
                        </select>
                        {assignForm.formState.errors.userPublicId?.message && <span className="text-xs text-error">{assignForm.formState.errors.userPublicId.message}</span>}
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-neutral-700">Atanacak Rol</span>
                        <select 
                            className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            {...assignForm.register("roleType")}
                        >
                            <option value="user">Standart Kullanıcı (User)</option>
                            <option value="approver">Onaylayıcı (Approver)</option>
                            <option value="manager">Yönetici (Manager)</option>
                        </select>
                    </label>

                    {assignForm.formState.errors.root?.message && <Alert variant="error">{assignForm.formState.errors.root.message}</Alert>}
                    
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeModals}>İptal</Button>
                        <Button type="submit" isLoading={assignForm.formState.isSubmitting}>Ata</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}