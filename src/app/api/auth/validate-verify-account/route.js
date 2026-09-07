const API = process.env.API_URL;

export async function GET(request) {
    const token = request.nextUrl.searchParams.get("token");

    const res = await fetch(`${API}/api/auth/validate-verify-account?rawToken=${token}`,{
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store"
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
};