import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";

export async function GET() {
    // Şirketteki tüm kullanıcıları getirir (Sadece Admin/SuperAdmin erişebilir)
    const data = await fetchServer("/api/UserManagemet");
    return NextResponse.json(data);
}