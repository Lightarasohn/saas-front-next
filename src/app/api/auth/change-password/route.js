const API = process.env.API_URL;

export async function POST(request){
    const body = await request.json();
    const token = request.nextUrl.searchParams.get("token");
    const res = await fetch(`${API}/api/auth/change-password?token=${token}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const data = await res.json();

    return Response.json(data, { status: res.status });
};