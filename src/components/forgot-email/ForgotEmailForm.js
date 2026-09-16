"use client";

import { forgotEmailSchema } from "@/lib/validation/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const ForgotEmailForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotEmailSchema),
    mode: "onBlur",
  });

  const handleForgotEmail = async (data) => {
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
    <form onSubmit={handleSubmit(handleForgotEmail)} className="w-full max-w-sm">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">E-posta Değiştir</h1>
        
        <Input
          label="Kurtarma Anahtarı"
          hint="Hesabınızı oluştururken size verilen kurtarma anahtarını giriniz."
          type="text"
          autoComplete="off"
          error={errors.secretKey?.message}
          {...register("secretKey")}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? "İşleniyor..." : "Bağlantı Gönder"}
        </Button>

        {errors.root?.message ? (
          <Alert variant="error">{errors.root.message}</Alert>
        ) : null}
        
        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : null}
      </Card>
    </form>
  );
};

export default ForgotEmailForm;