import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    
    // Varsayılan olarak onlyMine parametresi vb. query üzerinden geçirilir
    const data = await fetchServer(`/api/Expense?${qs}`);
    return NextResponse.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const data = await fetchServer("/api/Expense", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return NextResponse.json(data);
}

export async function PUT(request) {
    const body = await request.json();
    const data = await fetchServer("/api/Expense", {
        method: "PUT",
        body: JSON.stringify(body),
    });
    return NextResponse.json(data);
}