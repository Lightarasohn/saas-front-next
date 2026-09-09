"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, User, CreditCard, LogOut } from "lucide-react";
import { ROLES, hasRole } from "@/lib/roles";

export default function UserDropdown({ user }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (err) {
            console.log(err);
        }
        router.replace("/login");
        router.refresh();
    };

    const itemClass =
        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100";

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
                <span>{user?.name ?? "—"}</span>
                <ChevronDown size={14} aria-hidden="true" />
            </button>

            {isOpen ? (
                <div
                    role="menu"
                    className="absolute right-0 z-40 mt-1 w-52 rounded border border-neutral-200 bg-white py-1 shadow-lg"
                >
                    <div className="border-b border-neutral-200 px-3 py-2">
                        <p className="truncate text-sm font-medium text-neutral-900">
                            {user?.name ?? "—"}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                            {user?.email ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                            {user?.roleName ?? "—"}
                        </p>
                    </div>

                    <Link
                        href="/dashboard/profile"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                        className={itemClass}
                    >
                        <User size={14} aria-hidden="true" />
                        Profil Ayarları
                    </Link>

                    {hasRole(user, ROLES.SUPER_ADMIN) ? (
                        <Link
                            href="/dashboard/subscription"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                            className={itemClass}
                        >
                            <CreditCard size={14} aria-hidden="true" />
                            Abonelik Yönetimi
                        </Link>
                    ) : null}

                    <div className="my-1 border-t border-neutral-200" />

                    <button
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`${itemClass} text-error hover:bg-error-bg disabled:opacity-50`}
                    >
                        <LogOut size={14} aria-hidden="true" />
                        {isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
                    </button>
                </div>
            ) : null}
        </div>
    );
}