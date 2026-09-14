import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";

export async function GET() {
    const data = await fetchServer("/api/OrgUnit");
    return NextResponse.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const data = await fetchServer("/api/OrgUnit", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return NextResponse.json(data);
}