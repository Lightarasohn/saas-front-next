"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordDirectlySchema } from "@/lib/validation/auth-validation";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  // checking | ready | retry | done
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordDirectlySchema),
    mode: "onBlur",
  });

  // Modal açıldığında doğrulama (Cooldown kontrolü vb.) yapılır
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      setStatus("checking");
      setMessage("");
      
      try {
        const res = await fetch("/api/auth/validate-change-password-directly", { 
          cache: "no-store" 
        });
        const body = await res.json();
        
        if (res.ok && body.isSuccess) {
          setStatus("ready");
        } else {
          setMessage(body.message || "İşlem şu anda gerçekleştirilemiyor.");
          setStatus("retry");
        }
      } catch {
        setMessage("Sunucu ile iletişim kurulamadı.");
        setStatus("retry");
      }
    })();
  }, [isOpen]);

  const handleClose = () => {
    reset();
    setStatus("checking");
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/auth/change-password-directly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ 
          oldPassword: data.oldPassword, 
          newPassword: data.newPassword 
        }),
      });
      
      const body = await res.json();
      
      if (res.ok && body.isSuccess) {
        setStatus("done");
      } else {
        setError("root", { message: body.message || "Bir hata oluştu." });
      }
    } catch {
      setError("root", { message: "Sunucu hatası oluştu!" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Parola Yenile" closeOnOverlayClick={false}>
      {status === "checking" ? (
        <p className="text-sm text-neutral-500">Uygunluk kontrol ediliyor...</p>
      ) : null}

      {status === "ready" ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Mevcut Parola"
            type="password"
            autoComplete="current-password"
            error={errors.oldPassword?.message}
            {...register("oldPassword")}
          />

          <Input
            label="Yeni Parola"
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          
          {errors.root?.message ? (
            <Alert variant="error">{errors.root.message}</Alert>
          ) : null}
          
          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={handleClose} disabled={isSubmitting}>
              Vazgeç
            </Button>
            <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
              Yenile
            </Button>
          </div>
        </form>
      ) : null}

      {status === "retry" ? (
        <div className="flex flex-col gap-3">
          <Alert variant="error">{message}</Alert>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Kapat
            </Button>
          </div>
        </div>
      ) : null}

      {status === "done" ? (
        <div className="flex flex-col gap-3">
          <Alert variant="success">Parola başarıyla yenilendi.</Alert>
          <Button type="button" variant="primary" className="w-full" onClick={handleClose}>
            Tamam
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};

export default ChangePasswordModal;