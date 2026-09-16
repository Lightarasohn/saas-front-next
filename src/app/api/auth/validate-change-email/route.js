import { fetchServer } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function GET(request){
    const token = request.nextUrl.searchParams.get("token");

    const { status, body } = await fetchServer(`/api/auth/validate-change-email?token=${token}`);

    return NextResponse.json(body, { status });
}