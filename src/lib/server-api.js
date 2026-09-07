import { cookies } from "next/headers";

export async function getMe() {
    const API = process.env.API_URL;
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