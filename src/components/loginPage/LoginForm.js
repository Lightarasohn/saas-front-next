"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/validation/auth-validation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";
import Card from "../ui/Card";

const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const handleLogin = async (data) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const body = await res.json();
      if (body.isSuccess) {
        router.replace("/dashboard");
        router.refresh();
      } else {
        setError("root", { message: body.message });
      }
    } catch {
      setError("root", {
        message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="w-full max-w-sm">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Giriş Yap</h1>

        <Input
          label="E-posta"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Link
          href="/forgot-email"
          className="max-w-fit text-xs text-primary-600 hover:underline"
        >
          E-postamı Unuttum
        </Link>

        <Input
          label="Parola"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Link
          href="/forgot-password"
          className="max-w-fit text-xs text-primary-600 hover:underline"
        >
          Parolamı Unuttum
        </Link>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş"}
        </Button>

        <Alert variant="error">
          {errors.root?.message}
        </Alert>
      </Card>
    </form>
  );
};

export default LoginForm;
