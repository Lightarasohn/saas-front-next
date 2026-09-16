"use client";
 
import { useRouter, usePathname, useSearchParams } from "next/navigation";
 
export default function InactiveToggle({ checked, count, label = "Pasifleri göster" }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
 
    const toggle = (next) => {
        const query = new URLSearchParams(searchParams.toString());
 
        if (next) {
            query.set("showInactive", "true");
        } else {
            query.delete("showInactive");
        }
 
        const qs = query.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };
 
    if (!count) return null;
 
    return (
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-600 transition-colors hover:text-neutral-900">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => toggle(e.target.checked)}
            />
            {label} ({count})
        </label>
    );
}