import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
const ALLOWED_TYPES = ["user", "approver", "manager"];
 
export async function POST(request) {
    const { type, ...payload } = await request.json();
 
    if (!ALLOWED_TYPES.includes(type)) {
        return NextResponse.json(
            { isSuccess: false, message: "Geçersiz rol türü", data: null },
            { status: 400 },
        );
    }
 
    const { status, body } = await fetchServer(`/api/OrgUnit/assign/${type}`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
 
    return NextResponse.json(body, { status });
}