import { NextResponse } from "next/server";

const API = process.env.API_URL;

const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isAuthPage) {
    // Girişli kullanıcı login/register görmesin
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Korumalı sayfalar
  if (accessToken) return NextResponse.next();

  if (!refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "";

  let res;
  try {
    res = await fetch(`${API}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": ip,
        "User-Agent": request.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch (err) {
    // Backend'e ulaşılamadı (kapalı, network hatası, timeout vs.)
    // Bu, refresh token'ın GEÇERSİZ olduğu anlamına gelmez — sadece backend'e
    // şu an ulaşılamıyor. Kullanıcıyı çıkışa zorlamıyoruz, mevcut (muhtemelen
    // hâlâ geçerli) accessToken cookie'siyle sayfaya devam etmesine izin veriyoruz.
    console.error("Refresh isteği başarısız (network):", err);
    return NextResponse.next();
  }

  if (!res.ok) return clearAndRedirect(request);

  const body = await res.json();
  if (!body.isSuccess) return clearAndRedirect(request);

  const tokens = body.data;
  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });

  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  response.cookies.set("accessToken", tokens.accessToken, {
    ...base,
    expires: new Date(tokens.accessTokenExpiresAt),
  });
  response.cookies.set("refreshToken", tokens.refreshToken, {
    ...base,
    expires: new Date(tokens.refreshTokenExpiresAt),
  });

  request.cookies.set("accessToken", tokens.accessToken);

  return response;
}

function clearAndRedirect(request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
