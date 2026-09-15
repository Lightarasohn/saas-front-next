"use client";
 
import Link from "next/link";
import { Pencil, ArrowRight } from "lucide-react";
import { formatMoney, formatPeriod } from "@/lib/format";
 
export default function BudgetTable({ budgets, canManage, onEdit }) {
    if (budgets.length === 0) {
        return (
            <p className="py-4 text-center text-sm text-neutral-500">
                Seçilen filtrelere uygun bütçe bulunamadı.
            </p>
        );
    }
 
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                        <th className="px-2 py-1.5 font-medium">Dönem</th>
                        <th className="px-2 py-1.5 font-medium">Birim</th>
                        <th className="px-2 py-1.5 text-right font-medium">Bütçe</th>
                        <th className="px-2 py-1.5 text-right font-medium">Harcanan</th>
                        <th className="px-2 py-1.5 text-right font-medium">Kalan</th>
                        <th className="w-32 px-2 py-1.5 font-medium">Kullanım</th>
                        <th className="w-24 px-2 py-1.5" />
                    </tr>
                </thead>
 
                <tbody>
                    {budgets.map((budget) => {
                        const percent =
                            budget.totalAmount > 0
                                ? (budget.usedAmount / budget.totalAmount) * 100
                                : 0;
 
                        const barColor =
                            percent >= 100
                                ? "bg-error"
                                : percent >= 80
                                  ? "bg-warning"
                                  : "bg-primary-600";
 
                        return (
                            <tr
                                key={budget.publicId}
                                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                            >
                                <td className="px-2 py-2 whitespace-nowrap text-neutral-900">
                                    {formatPeriod(budget.month, budget.year)}
                                </td>
 
                                <td className="px-2 py-2 text-neutral-700">
                                    {budget.orgUnitName}
                                </td>
 
                                <td className="px-2 py-2 text-right tabular-nums text-neutral-900">
                                    {formatMoney(budget.totalAmount)}
                                </td>
 
                                <td className="px-2 py-2 text-right tabular-nums text-neutral-700">
                                    {formatMoney(budget.usedAmount)}
                                </td>
 
                                <td
                                    className={`px-2 py-2 text-right font-medium tabular-nums ${
                                        budget.remainingAmount < 0
                                            ? "text-error"
                                            : "text-neutral-900"
                                    }`}
                                >
                                    {formatMoney(budget.remainingAmount)}
                                </td>
 
                                <td className="px-2 py-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-neutral-100">
                                            <div
                                                className={`h-full ${barColor}`}
                                                style={{ width: `${Math.min(percent, 100)}%` }}
                                            />
                                        </div>
                                        <span className="w-9 text-right text-xs tabular-nums text-neutral-500">
                                            %{Math.round(percent)}
                                        </span>
                                    </div>
                                </td>
 
                                <td className="px-2 py-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            href={`/dashboard/cost-management/expenses?budgetPublicId=${budget.publicId}`}
                                            title="Masrafları gör"
                                            className="rounded-sm p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                        >
                                            <ArrowRight size={14} aria-hidden="true" />
                                        </Link>
 
                                        {canManage ? (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(budget)}
                                                title="Düzenle"
                                                className="rounded-sm p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                            >
                                                <Pencil size={14} aria-hidden="true" />
                                            </button>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}