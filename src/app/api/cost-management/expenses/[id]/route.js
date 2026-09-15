import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
export async function GET(request, { params }) {
    const { id } = await params;
 
    const { status, body } = await fetchServer(`/api/Expense/${id}`);
    return NextResponse.json(body, { status });
}