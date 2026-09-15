"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { href: "/dashboard/cost-management/expenses", label: "Masraflar" },
    { href: "/dashboard/cost-management/budgets", label: "Bütçeler" },
    { href: "/dashboard/cost-management/org-units", label: "Birimler" },
];

export default function CostManagementTabs() {
    const pathname = usePathname();

    return (
        <nav className="flex gap-1 border-b border-neutral-200">
            {TABS.map((tab) => {
                const isActive = pathname === tab.href;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`-mb-px border-b-2 px-3 py-1.5 text-sm transition-colors ${
                            isActive
                                ? "border-accent-500 font-medium text-neutral-900"
                                : "border-transparent text-neutral-500 hover:text-neutral-900"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}