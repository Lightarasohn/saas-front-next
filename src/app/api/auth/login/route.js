import { cookies } from "next/headers";

const API = process.env.API_URL;

export async function POST(request) {
    const body = await request.json();

    const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!data.isSuccess){
        return Response.json(data, {status: res.status});
    }

    const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt } = data.data;
    const cookieStore = await cookies();

    const base = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    };

    cookieStore.set("accessToken", accessToken, {...base, expires: new Date(accessTokenExpiresAt), });
    cookieStore.set("refreshToken", refreshToken, {...base, expires: new Date(refreshTokenExpiresAt),});
    

    return Response.json({ isSuccess: true, message: data.message });
};