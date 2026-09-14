import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";

export async function POST(request) {
    const body = await request.json();
    const data = await fetchServer("/api/Budget/can-update", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return NextResponse.json(data);
}