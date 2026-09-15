import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
export async function GET(request, { params }) {
    const { id } = await params;
 
    const { status, body } = await fetchServer(`/api/OrgUnit/${id}`);
    return NextResponse.json(body, { status });
}