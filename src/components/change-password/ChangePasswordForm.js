"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { changePasswordSchema } from "@/lib/validation/auth-validation";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const ChangePasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    (async () => {
      if (!token) {
        setMessage("Geçersiz bağlantı.");
        setStatus("retry");
        return;
      }
      try {
        const res = await fetch(
          `/api/auth/validate-change-password?token=${token}`,
          {
            cache: "no-store",
          },
        );
        const body = await res.json();
        if (body.isSuccess) {
          setStatus("ready");
        } else {
          setMessage(body.message);
          setStatus("retry");
        }
      } catch {
        setMessage("Sunucu problemi.");
        setStatus("retry");
      }
    })();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/auth/change-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ newPassword: data.newPassword }),
      });
      const body = await res.json();
      if (body.isSuccess) {
        setStatus("done");
      } else {
        setError("root", { message: body.message });
      }
    } catch {
      setError("root", { message: "Sunucu hatası oluştu!" });
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Parola Sıfırla</h1>

        {status === "checking" ? (
          <p className="text-sm text-neutral-500">
            Bağlantı kontrol ediliyor...
          </p>
        ) : null}

        {status === "ready" ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Yeni Parola"
              type="password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Yenileniyor..." : "Yenile"}
            </Button>
            <Alert variant="error">{errors.root?.message}</Alert>
          </form>
        ) : null}

        {status === "retry" ? (
    <>
        <Alert variant="error">{message}</Alert>
        <Link href="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
            Yeni Bağlantı İste
        </Link>
    </>
) : null}

        {status === "done" ? (
          <>
          <Alert variant="success">
            Parola yenilendi.
          </Alert>
          <Link href="/login" className="text-sm font-medium text-primary-600 hover:underline">
              Giriş Yap
            </Link>
          </>
          
        ) : null}
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
