import { headers } from "next/headers";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import BudgetClient from "@/components/dashboard/cost-management/budgets/BudgetClient";

export const metadata = {
    title: "Bütçe Yönetimi | CMS",
};

export default async function BudgetsPage() {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const cookieHeader = headersList.get("cookie") || "";

    const fetchOptions = {
        cache: "no-store",
        headers: { cookie: cookieHeader }
    };

    // Bütçeleri ve Organizasyon Birimlerini paralel çekiyoruz
    const [resBudgets, resOrgUnits] = await Promise.all([
        fetch(`${protocol}://${host}/api/cost-management/budgets`, fetchOptions),
        fetch(`${protocol}://${host}/api/cost-management/org-units`, fetchOptions).catch(() => null)
    ]);

    const bodyBudgets = await resBudgets.json();
    const bodyOrgUnits = resOrgUnits ? await resOrgUnits.json() : { isSuccess: false, data: [] };

    const budgets = bodyBudgets.isSuccess ? bodyBudgets.data : [];
    const orgUnits = bodyOrgUnits.isSuccess ? bodyOrgUnits.data : [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-neutral-900">Bütçe Yönetimi</h1>
                <BudgetClient mode="create" orgUnits={orgUnits} />
            </div>

            <Panel title="Dönem Bütçeleri">
                {budgets.length === 0 ? (
                    <p className="text-sm text-neutral-500">Henüz hiç bütçe tanımlanmamış.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 text-xs text-neutral-500">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Birim</th>
                                    <th className="px-3 py-2 font-medium">Dönem</th>
                                    <th className="px-3 py-2 font-medium text-right">Toplam Bütçe</th>
                                    <th className="px-3 py-2 font-medium text-right">Harcanan</th>
                                    <th className="px-3 py-2 font-medium text-right">Kalan</th>
                                    <th className="px-3 py-2 font-medium w-24 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {budgets.map((budget) => (
                                    <tr key={budget.publicId} className="hover:bg-neutral-50">
                                        <td className="px-3 py-2 font-medium text-neutral-900">
                                            {budget.orgUnitName}
                                        </td>
                                        <td className="px-3 py-2 text-neutral-600">
                                            {budget.month.toString().padStart(2, '0')} / {budget.year}
                                        </td>
                                        <td className="px-3 py-2 text-right font-medium text-neutral-900">
                                            {formatCurrency(budget.totalAmount)}
                                        </td>
                                        <td className="px-3 py-2 text-right text-warning">
                                            {formatCurrency(budget.usedAmount)}
                                        </td>
                                        <td className="px-3 py-2 text-right text-success font-medium">
                                            {formatCurrency(budget.remainingAmount)}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <BudgetClient mode="edit" budget={budget} />
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