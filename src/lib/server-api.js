import { cookies } from "next/headers";

const API = process.env.API_URL;

export async function fetchServer(endpoint, options = {}) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const headers = {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(options.headers || {}),
    };

    try {
        const res = await fetch(`${API}${endpoint}`, {
            ...options,
            headers,
            cache: options.cache || "no-store",
        });

        const body = await res.json();
        return body; 
    } catch (error) {
        return { isSuccess: false, message: "Sunucuya bağlanılamadı", data: null };
    }
}

export async function getMe() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return null;

    const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });

    if (!res.ok) return null;

    const body = await res.json();
    return body.isSuccess ? body.data : null;
}

export async function getModules() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return [];

    const res = await fetch(`${API}/api/modules`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });

    if (!res.ok) return [];

    const body = await res.json();
    return body.isSuccess ? body.data : [];
}