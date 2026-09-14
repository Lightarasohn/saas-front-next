import { NextResponse } from "next/server";
import { fetchServer } from "@/lib/server-api";

export async function POST(request) {
    const { actionType, ...body } = await request.json();

    let endpoint = "";
    let method = "POST";
    let fetchOptions = {};

    if (actionType === "can-approve") {
        // Backend GET bekliyor ve URL query parametresi alıyor[cite: 1]
        endpoint = `/api/Expense/can-approve?expensePublicId=${body.expensePublicId}`;
        method = "GET";
        fetchOptions = { method };
    } else if (actionType === "approve") {
        endpoint = "/api/Expense/approve";
        fetchOptions = { method, body: JSON.stringify(body) };
    } else if (actionType === "reject") {
        endpoint = "/api/Expense/reject";
        fetchOptions = { method, body: JSON.stringify(body) };
    }

    const data = await fetchServer(endpoint, fetchOptions);
    return NextResponse.json(data);
}