const API = process.env.API_URL;

export async function POST(request){
    const body = await request.json();

    const res = await fetch(`${API}/api/auth/forgot-password`, 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: "no-store"
    });
    
    const data = await res.json();
    return Response.json(data, {status: res.status});
};