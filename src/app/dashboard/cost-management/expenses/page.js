import { headers } from "next/headers";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import ExpenseActionsClient from "@/components/dashboard/cost-management/expenses/ExpenseActionsClient";
import ExpenseClient from "@/components/dashboard/cost-management/expenses/ExpenseClient";

export const metadata = {
    title: "Masraf Yönetimi | CMS",
};

export default async function ExpensesPage() {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const cookieHeader = headersList.get("cookie") || "";

    const fetchOptions = {
        cache: "no-store",
        headers: { cookie: cookieHeader }
    };

    // Masrafları (tümü), bütçeleri ve kategorileri çekiyoruz
    const [resExpenses, resBudgets, resCategories] = await Promise.all([
        fetch(`${protocol}://${host}/api/cost-management/expenses?onlyMine=false`, fetchOptions).catch(() => null),
        fetch(`${protocol}://${host}/api/cost-management/budgets`, fetchOptions).catch(() => null),
        fetch(`${protocol}://${host}/api/cost-management/categories`, fetchOptions).catch(() => null)
    ]);

    const bodyExpenses = resExpenses ? await resExpenses.json() : { isSuccess: false, data: [] };
    const bodyBudgets = resBudgets ? await resBudgets.json() : { isSuccess: false, data: [] };
    const bodyCategories = resCategories ? await resCategories.json() : { isSuccess: false, data: [] };

    const expenses = bodyExpenses.isSuccess ? bodyExpenses.data : [];
    const budgets = bodyBudgets.isSuccess ? bodyBudgets.data : [];
    const categories = bodyCategories.isSuccess ? bodyCategories.data : [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Onaylandı": return <Badge variant="success">Onaylandı</Badge>;
            case "Beklemede": return <Badge variant="warning">Beklemede</Badge>;
            case "Reddedildi": return <Badge variant="error">Reddedildi</Badge>;
            default: return <Badge variant="neutral">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-neutral-900">Masraf Yönetimi</h1>
                <ExpenseClient mode="create" budgets={budgets} categories={categories} />
            </div>

            <Panel title="Masraf Listesi">
                {expenses.length === 0 ? (
                    <p className="text-sm text-neutral-500">Kayıtlı masraf bulunmamaktadır.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 text-xs text-neutral-500">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Açıklama</th>
                                    <th className="px-3 py-2 font-medium">Kategori</th>
                                    <th className="px-3 py-2 font-medium text-right">Tutar</th>
                                    <th className="px-3 py-2 font-medium w-32">Durum</th>
                                    <th className="px-3 py-2 font-medium w-48 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {expenses.map((expense) => (
                                    <tr key={expense.publicId} className="hover:bg-neutral-50">
                                        <td className="px-3 py-2 font-medium text-neutral-900">
                                            {expense.description || "—"}
                                        </td>
                                        <td className="px-3 py-2 text-neutral-600">
                                            {expense.expenseCategoryName}
                                        </td>
                                        <td className="px-3 py-2 text-right font-medium text-neutral-900">
                                            {formatCurrency(expense.amount)}
                                        </td>
                                        <td className="px-3 py-2">
                                            {getStatusBadge(expense.status)}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {expense.status === "Beklemede" && (
                                                    <>
                                                        <ExpenseActionsClient expense={expense} />
                                                        <ExpenseClient mode="edit" expense={expense} budgets={budgets} categories={categories} />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>
        </div>
    );
}