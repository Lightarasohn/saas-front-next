import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
 
    const { status, body } = await fetchServer(`/api/Budget${qs ? `?${qs}` : ""}`);
    return NextResponse.json(body, { status });
}
 
export async function POST(request) {
    const payload = await request.json();
 
    const { status, body } = await fetchServer("/api/Budget", {
        method: "POST",
        body: JSON.stringify(payload),
    });
 
    return NextResponse.json(body, { status });
}
 
export async function PUT(request) {
    const payload = await request.json();
 
    const { status, body } = await fetchServer("/api/Budget", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
 
    return NextResponse.json(body, { status });
}