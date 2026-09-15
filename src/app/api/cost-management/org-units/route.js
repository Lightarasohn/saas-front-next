import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
export async function GET() {
    const { status, body } = await fetchServer("/api/OrgUnit");
    return NextResponse.json(body, { status });
}
 
export async function POST(request) {
    const payload = await request.json();
 
    const { status, body } = await fetchServer("/api/OrgUnit", {
        method: "POST",
        body: JSON.stringify(payload),
    });
 
    return NextResponse.json(body, { status });
}

export async function PUT(request) {
    const payload = await request.json();

    const { status, body } = await fetchServer("/api/OrgUnit", {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return NextResponse.json(body, { status });
}