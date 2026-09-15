import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
export async function POST(request) {
    const payload = await request.json();
 
    const { status, body } = await fetchServer("/api/Expense/approve", {
        method: "POST",
        body: JSON.stringify(payload),
    });
 
    return NextResponse.json(body, { status });
}