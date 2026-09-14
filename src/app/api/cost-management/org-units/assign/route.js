import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";

export async function POST(request) {
    // type: "user" | "approver" | "manager" olarak gelecek
    const { type, ...body } = await request.json(); 
    
    const data = await fetchServer(`/api/OrgUnit/assign/${type}`, {
        method: "POST",
        body: JSON.stringify(body),
    });
    
    return NextResponse.json(data);
}