import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
 
    const { status, body } = await fetchServer(`/api/Expense${qs ? `?${qs}` : ""}`);
    return NextResponse.json(body, { status });
}
 
export async function POST(request) {
    const payload = await request.json();
 
    const { status, body } = await fetchServer("/api/Expense", {
        method: "POST",
        body: JSON.stringify(payload),
    });
 
    return NextResponse.json(body, { status });
}
 
export async function PUT(request) {
    const payload = await request.json();
 
    const { status, body } = await fetchServer("/api/Expense", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
 
    return NextResponse.json(body, { status });
}