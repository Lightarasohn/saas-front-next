import { z } from "zod";
 
export const expenseCategorySchema = z.object({
    name: z
        .string()
        .min(1, "Kategori adı zorunludur")
        .max(255, "Kategori adı en fazla 255 karakter olabilir"),
});
 
export const expenseCategoryUpdateSchema = z.object({
    expenseCategoryPublicId: z.string().uuid("Geçersiz kategori"),
    name: z
        .string()
        .min(1, "Kategori adı zorunludur")
        .max(255, "Kategori adı en fazla 255 karakter olabilir"),
});
 
export const orgUnitCreateSchema = z.object({
    // Gelen değer boş string ise null'a çevir, sonra UUID/nullable/optional kontrolü yap
    parentPublicId: z.preprocess(
        (val) => (val === "" ? null : val), 
        z.string().uuid("Geçerli bir UUID formatı olmalıdır").nullable().optional()
    ),
    name: z
        .string()
        .min(1, "Birim adı zorunludur")
        .max(255, "En fazla 255 karakter olabilir"),
});
 
export const orgUnitAssignSchema = z.object({
    userPublicId: z.string().uuid("Lütfen geçerli bir kullanıcı seçin"),
    orgUnitPublicId: z.string().uuid("Lütfen geçerli bir birim seçin"),
    type: z.enum(["user", "approver", "manager"], {
        required_error: "Lütfen bir rol seçin",
    }),
});
 
export const budgetSchema = z.object({
    orgUnitPublicId: z.string().uuid("Lütfen geçerli bir birim seçin"),
    month: z.coerce
        .number()
        .min(1, "Ay 1-12 arasında olmalıdır")
        .max(12, "Ay 1-12 arasında olmalıdır"),
    year: z.coerce.number().min(2020, "Geçerli bir yıl girin").max(2100, "Geçerli bir yıl girin"),
    totalAmount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır"),
});
 
export const budgetUpdateSchema = z.object({
    budgetPublicId: z.string().uuid("Geçersiz bütçe"),
    month: z.coerce
        .number()
        .min(1, "Ay 1-12 arasında olmalıdır")
        .max(12, "Ay 1-12 arasında olmalıdır"),
    year: z.coerce.number().min(2020, "Geçerli bir yıl girin").max(2100, "Geçerli bir yıl girin"),
    totalAmount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır"),
});
 
// Kategori ya listeden seçilir (PublicId) ya da yeni ad yazılır (Name).
// İkisinden en az biri dolu olmalı — backend CreateExpenseDTO bu şekilde çalışıyor.
export const expenseSchema = z
    .object({
        budgetPublicId: z.string().uuid("Lütfen bir bütçe seçin"),
        expenseCategoryPublicId: z.string().uuid().nullable().optional(),
        expenseCategoryName: z.string().max(255).nullable().optional(),
        amount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır"),
        description: z
            .string()
            .max(512, "Açıklama en fazla 512 karakter olabilir")
            .optional()
            .nullable(),
    })
    .refine(
        (data) =>
            !!data.expenseCategoryPublicId ||
            (!!data.expenseCategoryName && data.expenseCategoryName.trim().length > 0),
        {
            message: "Kategori seçin veya yeni kategori adı yazın",
            path: ["expenseCategoryPublicId"],
        },
    );
 
export const expenseUpdateSchema = z.object({
    expensePublicId: z.string().uuid("Geçersiz masraf"),
    expenseCategoryPublicId: z.string().uuid("Lütfen bir kategori seçin"),
    amount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır"),
    description: z
        .string()
        .max(512, "Açıklama en fazla 512 karakter olabilir")
        .optional()
        .nullable(),
});
 
export const expenseRejectSchema = z.object({
    expensePublicId: z.string().uuid("Geçersiz masraf"),
    rejectReason: z
        .string()
        .min(1, "Lütfen bir ret sebebi girin")
        .max(512, "Sebep en fazla 512 karakter olabilir"),
});
 
export const changeUserRoleSchema = z.object({
    userPublicId: z.string().uuid("Geçersiz kullanıcı"),
    roleId: z.coerce.number().int().min(1).max(3),
});

export const orgUnitUpdateSchema = z.object({
    orgUnitPublicId: z.string().uuid("Geçersiz birim"),
    name: z.string().min(1, "Birim adı zorunludur").max(255, "En fazla 255 karakter olabilir"),
});