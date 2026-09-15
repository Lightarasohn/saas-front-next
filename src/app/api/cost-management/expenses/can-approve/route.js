import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";
 
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const expensePublicId = searchParams.get("expensePublicId");
 
    if (!expensePublicId) {
        return NextResponse.json(
            { isSuccess: false, message: "Masraf kimliği gerekli", data: null },
            { status: 400 },
        );
    }
 
    const { status, body } = await fetchServer(
        `/api/Expense/can-approve?expensePublicId=${encodeURIComponent(expensePublicId)}`,
    );
 
    return NextResponse.json(body, { status });
}