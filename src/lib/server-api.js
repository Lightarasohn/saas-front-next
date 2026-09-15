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
        return { status: res.status, body };
    } catch (error) {
        console.log("Backend'e ulaşılamadı:", endpoint, error);
        return {
            status: 503,
            body: { isSuccess: false, message: "Sunucuya bağlanılamadı", data: null },
        };
    }
}
 
export async function getMe() {
    const { body } = await fetchServer("/api/auth/me");
    return body.isSuccess ? body.data : null;
}
 
export async function getModules() {
    const { body } = await fetchServer("/api/modules");
    return body.isSuccess ? body.data : [];
}