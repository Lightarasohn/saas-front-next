import { cookies } from "next/headers";

const API = process.env.API_URL;

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
        try {
            await fetch(`${API}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
                cache: "no-store",
            });
        } catch (err) {
            console.log("Logout isteği başarısız:", err);
        }
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return Response.json({ isSuccess: true, message: "Çıkış yapıldı" });
}