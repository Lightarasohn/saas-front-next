const API = process.env.API_URL;

export async function GET(request){
    const token = request.nextUrl.searchParams.get("token");
    const res = await fetch(`${API}/api/auth/validate-change-password?token=${token}`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await res.json();

    return Response.json(data, { status: res.status });
}