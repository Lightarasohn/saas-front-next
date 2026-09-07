import { NextResponse } from "next/server";

const API = process.env.API_URL;

export async function middleware(request) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (accessToken) return NextResponse.next();

    if (!refreshToken) {
        const url = new URL("/login", request.url);
        url.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    const res = await fetch(`${API}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
    });

    if (!res.ok) {
        const url = new URL("/login", request.url);
        const response = NextResponse.redirect(url);
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }

    const body = await res.json();
    if (!body.isSuccess) {
        const url = new URL("/login", request.url);
        const response = NextResponse.redirect(url);
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }

    const tokens = body.data;
    const response = NextResponse.next({
        request: {
            headers: new Headers(request.headers),
        },
    });

    const base = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    };

    response.cookies.set("accessToken", tokens.accessToken, {
        ...base,
        expires: new Date(tokens.accessTokenExpiresAt),
    });
    response.cookies.set("refreshToken", tokens.refreshToken, {
        ...base,
        expires: new Date(tokens.refreshTokenExpiresAt),
    });

    return response;
};

export const config = {
    matcher: ["/dashboard/:path*"],
};