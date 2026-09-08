"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    return (
        <button onClick={handleLogout} disabled={isLoggingOut}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 disabled:opacity-50">
            {isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </button>
    );
};

export default LogoutButton;