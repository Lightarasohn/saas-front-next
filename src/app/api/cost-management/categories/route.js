import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";

export async function GET() {
    const data = await fetchServer("/api/ExpenseCategory");
    return NextResponse.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const data = await fetchServer("/api/ExpenseCategory", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return NextResponse.json(data);
}

export async function PUT(request) {
    const body = await request.json();
    const data = await fetchServer("/api/ExpenseCategory", {
        method: "PUT",
        body: JSON.stringify(body),
    });
    return NextResponse.json(data);
}