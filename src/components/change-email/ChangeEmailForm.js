"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { changeEmailSchema } from "@/lib/validation/auth-validation";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const ChangeEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // checking | ready | retry | done
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [newRecoveryKey, setNewRecoveryKey] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changeEmailSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    (async () => {
      if (!token) {
        setMessage("Geçersiz veya eksik bağlantı.");
        setStatus("retry");
        return;
      }

      try {
        const res = await fetch(
          `/api/auth/validate-change-email?token=${token}`,
          { cache: "no-store" }
        );
        const body = await res.json();
        
        if (res.ok && body.isSuccess) {
          // Backend'den gelen yeni kurtarma anahtarını state'e atıyoruz
          setNewRecoveryKey(body.data.newRecoveryKey);
          setStatus("ready");
        } else {
          setMessage(body.message || "Bağlantı doğrulanamadı.");
          setStatus("retry");
        }
      } catch (err) {
        console.error(err);
        setMessage("Sunucu bağlantı problemi.");
        setStatus("retry");
      }
    })();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/auth/change-email?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email: data.email }),
      });
      
      const body = await res.json();
      
      if (res.ok && body.isSuccess) {
        setStatus("done");
      } else {
        setError("root", { message: body.message || "Bir hata oluştu." });
      }
    } catch (err) {
      console.error(err);
      setError("root", { message: "Sunucu hatası oluştu!" });
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Yeni E-posta Adresi</h1>

        {status === "checking" ? (
          <p className="text-sm text-neutral-500">
            Bağlantı kontrol ediliyor...
          </p>
        ) : null}

        {status === "ready" ? (
          <div className="flex flex-col gap-4">
            {/* Kullanıcının yeni anahtarı görmesi zorunlu alan */}
            <Alert variant="warning">
              <span className="mb-2 block font-medium">⚠️ Kurtarma Anahtarınız Değişti</span>
              <p className="mb-2 text-xs">
                Güvenliğiniz için eski anahtarınız iptal edildi. Lütfen yeni anahtarınızı güvenli bir yere kaydedin:
              </p>
              <code className="block select-all rounded bg-warning-border/30 p-2 text-center text-sm font-semibold tracking-wider">
                {newRecoveryKey}
              </code>
            </Alert>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Yeni E-posta"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
              </Button>
              {errors.root?.message ? (
                <Alert variant="error">{errors.root.message}</Alert>
              ) : null}
            </form>
          </div>
        ) : null}

        {status === "retry" ? (
          <div className="flex flex-col gap-3">
            <Alert variant="error">{message}</Alert>
            <Link href="/forgot-email" className="text-sm font-medium text-primary-600 hover:underline">
              Yeni Bağlantı İste
            </Link>
          </div>
        ) : null}

        {status === "done" ? (
          <div className="flex flex-col gap-3">
            <Alert variant="success">
              E-posta adresiniz başarıyla güncellendi.
            </Alert>
            <Link href="/login" className="text-sm font-medium text-primary-600 hover:underline">
              Giriş Yap
            </Link>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default ChangeEmailForm;