"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { expenseRejectSchema } from "@/lib/validation/cms-validation";

export default function ExpenseActionsClient({ expense }) {
    const router = useRouter();
    const [actionState, setActionState] = useState(null); // "approve" | "reject" | null
    const [globalError, setGlobalError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(expenseRejectSchema),
        defaultValues: { rejectReason: "" },
    });

    const closeModals = () => {
        setActionState(null);
        setGlobalError(null);
        reset();
    };

    const handleApproveClick = async () => {
        setIsLoading(true);
        setGlobalError(null);
        try {
            // Önce masrafın bütçeyi aşıp aşmadığı kontrol edilir[cite: 1]
            const checkRes = await fetch("/api/cost-management/expenses/actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actionType: "can-approve", expensePublicId: expense.publicId }),
            });
            const checkBody = await checkRes.json();

            if (!checkBody.isSuccess) {
                setGlobalError(checkBody.message);
                setActionState("approve"); // Hata göstermek için modalı açık tut
            } else {
                setActionState("approve");
            }
        } catch {
            setGlobalError("Sunucu hatası oluştu.");
            setActionState("approve");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmApprove = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/cost-management/expenses/actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actionType: "approve", expensePublicId: expense.publicId }),
            });
            const body = await res.json();

            if (body.isSuccess) {
                closeModals();
                router.refresh();
            } else {
                setGlobalError(body.message);
            }
        } catch {
            setGlobalError("Onay işlemi sırasında hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const onRejectSubmit = async (data) => {
        try {
            const res = await fetch("/api/cost-management/expenses/actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    actionType: "reject", 
                    expensePublicId: expense.publicId, 
                    rejectReason: data.rejectReason 
                }),
            });
            const body = await res.json();

            if (body.isSuccess) {
                closeModals();
                router.refresh();
            } else {
                setGlobalError(body.message);
            }
        } catch {
            setGlobalError("Ret işlemi sırasında hata oluştu.");
        }
    };

    return (
        <>
            <Button variant="ghost" size="sm" onClick={handleApproveClick} title="Onayla" disabled={isLoading}>
                <Check size={16} className="text-success" aria-hidden="true" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setActionState("reject")} title="Reddet">
                <X size={16} className="text-error" aria-hidden="true" />
            </Button>

            {/* Onaylama Modalı */}
            <Modal isOpen={actionState === "approve"} onClose={closeModals} title="Masrafı Onayla" size="sm">
                <div className="flex flex-col gap-4">
                    {globalError ? (
                        <Alert variant="error">{globalError}</Alert>
                    ) : (
                        <p className="text-sm text-neutral-700">
                            Bu masrafı onaylamak istediğinize emin misiniz? İşlem bütçeden düşülecektir.
                        </p>
                    )}
                    
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeModals} disabled={isLoading}>İptal</Button>
                        <Button type="button" variant="primary" onClick={confirmApprove} isLoading={isLoading} disabled={!!globalError}>
                            Onayla
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Reddetme Modalı */}
            <Modal isOpen={actionState === "reject"} onClose={closeModals} title="Masrafı Reddet" size="sm">
                <form onSubmit={handleSubmit(onRejectSubmit)} className="flex flex-col gap-4">
                    <Input 
                        label="Ret Sebebi" 
                        placeholder="Örn: Fiş tarihi hatalı"
                        error={errors.rejectReason?.message} 
                        {...register("rejectReason")} 
                    />

                    {globalError && <Alert variant="error">{globalError}</Alert>}
                    
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeModals} disabled={isSubmitting}>İptal</Button>
                        <Button type="submit" variant="danger" isLoading={isSubmitting}>Reddet</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}