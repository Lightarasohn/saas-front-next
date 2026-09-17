import { fetchServer } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function POST(request){
    const payload = await request.json();

    const { status, body } = await fetchServer("/api/subscription/subscribe", {
        method: "POST",
        body: JSON.stringify(payload)
        }
    );

    return NextResponse.json(body, { status });
} 