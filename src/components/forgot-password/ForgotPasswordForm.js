"use client";

import { forgotPasswordSchema } from "@/lib/validation/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const ForgotPasswordForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const handleForgotPassword = async (data) => {
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const body = await res.json();
      if (body.isSuccess) {
        setSuccessMessage(body.message);
      } else {
        setError("root", { message: body.message });
      }
    } catch (err) {
      console.log(err);
      setError("root", { message: "Sunucu hatası oluştu!" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleForgotPassword)}
      className="w-full max-w-sm"
    >
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Parola Sıfırla</h1>
        <Input
          label="E-posta"
          hint="Sıfırlama linkini bu adrese göndereceğiz."
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? "Gönderiliyor..." : "Sıfırlama E-postası Gönder"}
        </Button>

        <Alert variant="error">{errors.root?.message}</Alert>
        <Alert variant="success">{successMessage}</Alert>
      </Card>
    </form>
  );
};

export default ForgotPasswordForm;
