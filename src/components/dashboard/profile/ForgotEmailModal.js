"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotEmailSchema } from "@/lib/validation/auth-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

const ForgotEmailModal = ({ isOpen, onClose }) => {
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotEmailSchema),
    mode: "onBlur",
  });

  // Modal her açıldığında eski verileri ve hataları temizleriz
  useEffect(() => {
    if (isOpen) {
      reset();
      setSuccessMessage(null);
      setError("root", { message: "" });
    }
  }, [isOpen, reset, setError]);

  const onSubmit = async (data) => {
    setSuccessMessage(null);
    setError("root", { message: "" });

    try {
      const res = await fetch("/api/auth/forgot-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: data.secretKey }),
      });

      const body = await res.json();

      if (res.ok && body.isSuccess) {
        setSuccessMessage(body.message);
      } else {
        setError("root", { message: body.message || "İşlem tamamlanamadı." });
      }
    } catch (err) {
      console.error(err);
      setError("root", { message: "Sunucu hatası oluştu!" });
    }
  };

  return (
    <Modal
      isOpen={isOpen} 
      onClose={onClose} 
      title="E-posta Adresini Değiştir"
      closeOnOverlayClick={false}
    >
      <p className="mb-4 text-sm text-neutral-500">
        İşlemi başlatabilmek için hesabınızı oluştururken size verilen kurtarma anahtarını girmelisiniz. E-posta değiştirme bağlantısı <strong>mevcut e-posta adresinize</strong> gönderilecektir.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Kurtarma Anahtarı"
          type="text"
          autoComplete="off"
          error={errors.secretKey?.message}
          disabled={!!successMessage} // Başarılıysa inputu kitle
          {...register("secretKey")}
        />

        {errors.root?.message ? (
          <Alert variant="error">{errors.root.message}</Alert>
        ) : null}

        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : null}

        {/* Butonlar ConfirmModal mantığına benzer dizildi */}
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {successMessage ? "Kapat" : "Vazgeç"}
          </Button>
          
          {!successMessage ? (
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Bağlantı Gönder
            </Button>
          ) : null}
        </div>
      </form>
    </Modal>
  );
};

export default ForgotEmailModal;