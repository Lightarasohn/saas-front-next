import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(8, "Parola en az 8 karakter olmalı")
    .max(32, "Parola en fazla 32 karakter olabilir")
    .regex(/[a-z]/, "En az bir küçük harf içermeli")
    .regex(/[A-Z]/, "En az bir büyük harf içermeli")
    .regex(/[0-9]/, "En az bir rakam içermeli");

export const changePasswordSchema = z.object({
    newPassword: passwordSchema,
});

export const changePasswordDirectlySchema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
});

export const changeEmailSchema = z.object({
    email: z.email("Geçerli bir e-posta girin")
});

export const registerSchema = z.object({
    name: z.string().min(1, "Ad soyad gerekli"),
    email: z.string().email("Geçerli bir e-posta girin"),
    password: passwordSchema,
    companyField: z.string().min(1, "Bu alan gerekli"),
});

export const loginSchema = z.object({
    email: z.string().email("Geçerli bir e-posta girin"),
    password: z.string().min(1, "Parola gerekli"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Geçerli bir e-posta girin"),
});

export const forgotEmailSchema = z.object({
    secretKey: z.string().min(1, "Bu alan gerekli"),
});