"use client";
 
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
 
const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
 
const selectClass =
    "rounded-sm border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
 
export default function BudgetFilters({ orgUnits, filters }) {
    const router = useRouter();
    const pathname = usePathname();
 
    const currentYear = new Date().getFullYear();
    const years = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];
 
    const apply = (key, value) => {
        const next = { ...filters, [key]: value };
        const query = new URLSearchParams();
 
        Object.entries(next).forEach(([k, v]) => {
            if (v) query.set(k, v);
        });
 
        const qs = query.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };
 
    const hasFilter = Boolean(filters.year || filters.month || filters.orgUnitPublicId);
 
    return (
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
            <span className="text-xs font-medium text-neutral-500">Filtre:</span>
 
            <select
                className={selectClass}
                value={filters.year}
                onChange={(e) => apply("year", e.target.value)}
                aria-label="Yıl"
            >
                <option value="">Tüm yıllar</option>
                {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
 
            <select
                className={selectClass}
                value={filters.month}
                onChange={(e) => apply("month", e.target.value)}
                aria-label="Ay"
            >
                <option value="">Tüm aylar</option>
                {MONTHS.map((name, i) => (
                    <option key={name} value={i + 1}>{name}</option>
                ))}
            </select>
 
            <select
                className={selectClass}
                value={filters.orgUnitPublicId}
                onChange={(e) => apply("orgUnitPublicId", e.target.value)}
                aria-label="Birim"
            >
                <option value="">Tüm birimler</option>
                {orgUnits.map((unit) => (
                    <option key={unit.publicId} value={unit.publicId}>
                        {"\u00A0".repeat(unit.level * 3)}{unit.name}
                    </option>
                ))}
            </select>
 
            {hasFilter ? (
                <button
                    type="button"
                    onClick={() => router.push(pathname)}
                    className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                    <X size={12} aria-hidden="true" />
                    Temizle
                </button>
            ) : null}
        </div>
    );
}