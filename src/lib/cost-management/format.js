// Backend statusId enum'unu görmediğim için aşağıdaki eşleme bir tahmin.
// Gerçek değerleri öğrenince SADECE burayı güncellemeniz yeterli.
export const EXPENSE_STATUS = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
    REVISION: 4,
};

export function formatCurrency(amount) {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(dateString) {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(
        new Date(dateString)
    );
}

// statusId varsa onu, yoksa metin eşleşmesini kullanır.
export function statusVariant(expense) {
    if (expense?.statusId === EXPENSE_STATUS.APPROVED) return "success";
    if (expense?.statusId === EXPENSE_STATUS.REJECTED) return "error";
    if (expense?.statusId === EXPENSE_STATUS.PENDING) return "warning";

    const s = (expense?.status ?? "").toLocaleLowerCase("tr-TR");
    if (s.includes("red")) return "error";
    if (s.includes("onay")) return "success";
    return "warning";
}

export function isPending(expense) {
    if (expense?.statusId !== undefined && expense?.statusId !== null) {
        return expense.statusId === EXPENSE_STATUS.PENDING;
    }
    const s = (expense?.status ?? "").toLocaleLowerCase("tr-TR");
    return s.includes("bekle");
}

export function isApproved(expense) {
    if (expense?.statusId !== undefined && expense?.statusId !== null) {
        return expense.statusId === EXPENSE_STATUS.APPROVED;
    }
    return (expense?.status ?? "").toLocaleLowerCase("tr-TR").includes("onay");
}