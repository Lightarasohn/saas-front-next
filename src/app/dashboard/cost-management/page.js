import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, Receipt, Wallet, PieChart } from "lucide-react";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";

export const metadata = {
    title: "Özet | Masraf Yönetimi",
};

export default async function CMSDashboardPage() {
    // Next.js Route Handler'larına istek atarken mevcut tarayıcı cookie'sini aktarıyoruz
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const cookieHeader = headersList.get("cookie") || "";

    const fetchOptions = {
        cache: "no-store",
        headers: { cookie: cookieHeader }
    };

    // Bütçe ve Masraf verilerini paralel çekiyoruz[cite: 5, 7]
    const [resBudgets, resExpenses] = await Promise.all([
        fetch(`${protocol}://${host}/api/cost-management/budgets`, fetchOptions).catch(() => null),
        fetch(`${protocol}://${host}/api/cost-management/expenses?onlyMine=false`, fetchOptions).catch(() => null)
    ]);

    const bodyBudgets = resBudgets ? await resBudgets.json() : { isSuccess: false, data: [] };
    const bodyExpenses = resExpenses ? await resExpenses.json() : { isSuccess: false, data: [] };

    const budgets = bodyBudgets.isSuccess ? bodyBudgets.data : [];
    const expenses = bodyExpenses.isSuccess ? bodyExpenses.data : [];

    // Özet istatistiklerin hesaplanması (Bütçeler üzerinden)[cite: 5]
    const totalBudget = budgets.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalUsed = budgets.reduce((acc, curr) => acc + curr.usedAmount, 0);
    const totalRemaining = budgets.reduce((acc, curr) => acc + curr.remainingAmount, 0);

    // Son masrafları almak (Tarihe göre sıralı geldiğini varsayarak ilk 5'ini alıyoruz)[cite: 7]
    const recentExpenses = expenses.slice(0, 5);

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
                <h1 className="text-lg font-semibold text-neutral-900">Masraf Yönetimi Özeti</h1>
            </div>

            {/* İstatistik Grid'i: Tasarım kurallarındaki gap-4 ve Panel bileşeni kuralları */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col rounded border border-neutral-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                        <Wallet size={16} className="text-primary-600" aria-hidden="true" />
                        Toplam Tanımlı Bütçe
                    </div>
                    <div className="mt-2 text-2xl font-semibold tabular-nums text-neutral-900">
                        {formatCurrency(totalBudget)}
                    </div>
                </div>

                <div className="flex flex-col rounded border border-neutral-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                        <PieChart size={16} className="text-warning" aria-hidden="true" />
                        Toplam Harcanan
                    </div>
                    <div className="mt-2 text-2xl font-semibold tabular-nums text-neutral-900">
                        {formatCurrency(totalUsed)}
                    </div>
                </div>

                <div className="flex flex-col rounded border border-neutral-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                        <Receipt size={16} className="text-success" aria-hidden="true" />
                        Kalan Toplam Bütçe
                    </div>
                    <div className="mt-2 text-2xl font-semibold tabular-nums text-neutral-900">
                        {formatCurrency(totalRemaining)}
                    </div>
                </div>
            </div>

            {/* Alt ızgara: Son Masraflar ve Hızlı Erişim (Panel kullanımı) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Panel title="Son Girilen Masraflar">
                        {recentExpenses.length === 0 ? (
                            <p className="text-sm text-neutral-500">Henüz masraf kaydı bulunmuyor.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-neutral-200 text-xs text-neutral-500">
                                        <tr>
                                            <th className="px-3 py-2 font-medium">Kategori</th>
                                            <th className="px-3 py-2 font-medium text-right">Tutar</th>
                                            <th className="px-3 py-2 font-medium w-32">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {recentExpenses.map((expense) => (
                                            <tr key={expense.publicId} className="hover:bg-neutral-50">
                                                <td className="px-3 py-2 font-medium text-neutral-900">
                                                    {expense.expenseCategoryName}
                                                </td>
                                                <td className="px-3 py-2 text-right font-medium text-neutral-900">
                                                    {formatCurrency(expense.amount)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {getStatusBadge(expense.status)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="mt-3 flex justify-end">
                            <Link 
                                href="/dashboard/cms/expenses" 
                                className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
                            >
                                Tüm Masrafları Gör <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                        </div>
                    </Panel>
                </div>

                <div className="lg:col-span-1">
                    <Panel title="Hızlı Erişim">
                        <nav className="flex flex-col gap-2">
                            <Link 
                                href="/dashboard/cms/budgets" 
                                className="flex items-center justify-between rounded-sm border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
                            >
                                <span>Bütçe Yönetimi</span>
                                <ArrowRight size={14} className="text-neutral-400" aria-hidden="true" />
                            </Link>
                            <Link 
                                href="/dashboard/cms/expenses" 
                                className="flex items-center justify-between rounded-sm border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
                            >
                                <span>Masraflar ve Onaylar</span>
                                <ArrowRight size={14} className="text-neutral-400" aria-hidden="true" />
                            </Link>
                            <Link 
                                href="/dashboard/cms/org-units" 
                                className="flex items-center justify-between rounded-sm border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
                            >
                                <span>Organizasyon Birimleri</span>
                                <ArrowRight size={14} className="text-neutral-400" aria-hidden="true" />
                            </Link>
                            <Link 
                                href="/dashboard/cms/categories" 
                                className="flex items-center justify-between rounded-sm border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
                            >
                                <span>Masraf Kategorileri</span>
                                <ArrowRight size={14} className="text-neutral-400" aria-hidden="true" />
                            </Link>
                        </nav>
                    </Panel>
                </div>
            </div>
        </div>
    );
}