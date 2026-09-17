import Link from "next/link";
import UserDropdown from "./UserDropdown";

export default function DashboardHeader({ user }) {
    const initial = user?.companyName?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <header className="flex h-11 shrink-0 items-center justify-between bg-neutral-900 px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-accent-500 text-xs font-semibold text-accent-900">
                    {initial}
                </div>
                <span className="text-sm font-medium text-white">
                    {user?.companyName ?? "—"}
                </span>
            </Link>

            <UserDropdown user={user} />
        </header>
    );
}