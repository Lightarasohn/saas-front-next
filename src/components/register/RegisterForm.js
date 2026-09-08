"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validation";
import RegisteredModal from "./RegisteredModal";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const RegisterForm = () => {
    const [isWithCompany, setIsWithCompany] = useState(true);
    const [recoveryKey, setRecoveryKey] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        resetField,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    const handleModeChange = (withCompany) => {
        setIsWithCompany(withCompany);
        resetField("companyField");
    };

    const handleRegister = async (data) => {
        try {
            const url = isWithCompany
                ? "/api/auth/register-with-company"
                : "/api/auth/register-to-company";

            const payload = isWithCompany
                ? { name: data.name, email: data.email, password: data.password, companyName: data.companyField }
                : { name: data.name, email: data.email, password: data.password, inviteCode: data.companyField };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                cache: "no-store",
            });

            const body = await res.json();

            if (body.isSuccess) {
                setRecoveryKey(body.data);
                setIsModalOpen(true);
            } else {
                setError("root", { message: body.message });
            }
        } catch {
            setError("root", { message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." });
        }
    };

    const tabClass =
        "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors";

    return (
        <>
            <form onSubmit={handleSubmit(handleRegister)} className="w-full max-w-lg">
                <Card className="flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold">Kayıt Ol</h1>

                    <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
                        <label
                            className={`${tabClass} ${
                                isWithCompany
                                    ? "bg-white text-neutral-900 shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-900"
                            }`}
                        >
                            <input
                                type="radio"
                                name="registerType"
                                value="withCompany"
                                checked={isWithCompany}
                                onChange={() => handleModeChange(true)}
                                className="sr-only"
                            />
                            Organizasyon Oluştur
                        </label>
                        <label
                            className={`${tabClass} ${
                                !isWithCompany
                                    ? "bg-white text-neutral-900 shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-900"
                            }`}
                        >
                            <input
                                type="radio"
                                name="registerType"
                                value="toCompany"
                                checked={!isWithCompany}
                                onChange={() => handleModeChange(false)}
                                className="sr-only"
                            />
                            Bir Organizasyona Katıl
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Ad Soyad"
                            type="text"
                            autoComplete="name"
                            error={errors.name?.message}
                            {...register("name")}
                        />

                        <Input
                            label="E-posta"
                            type="email"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <Input
                            label="Parola"
                            type="password"
                            autoComplete="new-password"
                            hint="8-32 karakter, büyük/küçük harf ve rakam"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <Input
                            label={isWithCompany ? "Organizasyon Adı" : "Organizasyon Davet Kodu"}
                            type="text"
                            error={errors.companyField?.message}
                            {...register("companyField")}
                        />
                    </div>

                    <Button type="submit" isLoading={isSubmitting} className="w-full">
                        {isSubmitting ? "Gönderiliyor..." : "Kaydol"}
                    </Button>

                    <Alert variant="error">{errors.root?.message}</Alert>
                </Card>
            </form>

            <RegisteredModal
                isOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                recoveryKey={recoveryKey}
            />
        </>
    );
};

export default RegisterForm;