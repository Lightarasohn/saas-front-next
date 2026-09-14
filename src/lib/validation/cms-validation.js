import { z } from "zod";

export const expenseCategorySchema = z.object({
    name: z.string()
        .min(1, "Kategori adı zorunludur")
        .max(255, "Kategori adı en fazla 255 karakter olabilir"),
});

export const orgUnitCreateSchema = z.object({
    name: z.string().min(1, "Birim adı zorunludur").max(255, "En fazla 255 karakter olabilir"),
});

export const orgUnitAssignSchema = z.object({
    userPublicId: z.string().uuid("Lütfen geçerli bir kullanıcı seçin"),
    roleType: z.enum(["user", "approver", "manager"], {
        required_error: "Lütfen bir rol seçin",
    }),
});

export const budgetSchema = z.object({
    orgUnitPublicId: z.string().uuid("Lütfen geçerli bir birim seçin"),
    month: z.coerce.number().min(1, "Ay 1-12 arasında olmalıdır").max(12, "Ay 1-12 arasında olmalıdır"),
    year: z.coerce.number().min(2020, "Geçerli bir yıl girin"),
    totalAmount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır")
});

export const budgetUpdateSchema = z.object({
    totalAmount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır")
});

export const expenseSchema = z.object({
    budgetPublicId: z.string().uuid("Lütfen bir bütçe seçin"),
    expenseCategoryPublicId: z.string().uuid("Lütfen bir kategori seçin"),
    amount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır"),
    description: z.string().max(512, "Açıklama en fazla 512 karakter olabilir").optional().nullable(),
});

export const expenseUpdateSchema = z.object({
    expenseCategoryPublicId: z.string().uuid("Lütfen bir kategori seçin"),
    amount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır"),
    description: z.string().max(512, "Açıklama en fazla 512 karakter olabilir").optional().nullable(),
});

export const expenseRejectSchema = z.object({
    rejectReason: z.string().min(1, "Lütfen bir ret sebebi girin").max(512, "Sebep en fazla 512 karakter olabilir"),
});