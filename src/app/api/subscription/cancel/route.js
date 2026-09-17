import { fetchServer } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function POST() {
    const { status, body } = await fetchServer("/api/subscription/cancel", {
        method: "POST",
    });

    return NextResponse.json(body, { status });
}