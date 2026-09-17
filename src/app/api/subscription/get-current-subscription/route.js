import { fetchServer } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function GET(request){
    const { status, body } = await fetchServer("/api/subscription/current");

    return NextResponse.json(body, { status });
}