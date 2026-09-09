"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";

export default function DashboardSidebar({ modules }) {
    const pathname = usePathname();

    return (
        <aside className="w-40 shrink-0 bg-neutral-800 py-2">
            <p className="px-3 py-1 text-xs tracking-wide text-neutral-500">
                MODÜLLER
            </p>

            <nav className="flex flex-col">
                {modules.map((m) => {
                    const href = `/dashboard/${m.moduleKey}`;
                    const isActive = pathname === href;

                    if (!m.enabled) {
                        return (
                            <span
                                key={m.moduleKey}
                                title="Bu modül planınıza dahil değil"
                                className="flex cursor-not-allowed items-center gap-2 border-l-[3px] border-transparent px-3 py-1.5 text-sm text-neutral-500"
                            >
                                <Lock size={13} aria-hidden="true" />
                                {m.name}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={m.moduleKey}
                            href={href}
                            className={`border-l-[3px] px-3 py-1.5 text-sm transition-colors ${
                                isActive
                                    ? "border-accent-500 bg-primary-600 text-white"
                                    : "border-transparent text-neutral-400 hover:bg-neutral-700 hover:text-white"
                            }`}
                        >
                            {m.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}