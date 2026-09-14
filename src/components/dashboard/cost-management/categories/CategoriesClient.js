"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { expenseCategorySchema } from "@/lib/validation/cms-validation";

export default function CategoriesClient({ mode = "add", category = null }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const isEdit = mode === "edit";

    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(expenseCategorySchema),
        defaultValues: { name: category?.name || "" },
    });

    const handleOpen = () => {
        reset({ name: category?.name || "" });
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
                ? { expenseCategoryPublicId: category.publicId, name: data.name }
                : { name: data.name };

            const res = await fetch("/api/cost-management/categories", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const body = await res.json();

            if (body.isSuccess) {
                handleClose();
                router.refresh();
            } else {
                setError("root", { message: body.message || "İşlem sırasında bir hata oluştu." });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." });
        }
    };

    return (
        <>
            {isEdit ? (
                <Button variant="ghost" size="sm" onClick={handleOpen}>Düzenle</Button>
            ) : (
                <Button variant="primary" size="sm" onClick={handleOpen}>Yeni Kategori</Button>
            )}

            <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"} size="sm">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input label="Kategori Adı" placeholder="Örn: Seyahat Giderleri" error={errors.name?.message} {...register("name")} />
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