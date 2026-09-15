import ExpenseManager from "@/components/dashboard/cost-management/expenses/ExpenseManager";
import { fetchServer, getMe } from "@/lib/server-api";
 
export default async function ExpensesPage({ searchParams }) {
    const params = await searchParams;
 
    const query = new URLSearchParams();
    if (params.budgetPublicId) query.set("budgetPublicId", params.budgetPublicId);
    if (params.statusId) query.set("statusId", params.statusId);
    if (params.onlyMine === "true") query.set("onlyMine", "true");
 
    const qs = query.toString();
 
    const [expenseRes, budgetRes, categoryRes, me] = await Promise.all([
        fetchServer(`/api/Expense${qs ? `?${qs}` : ""}`),
        fetchServer("/api/Budget"),
        fetchServer("/api/ExpenseCategory"),
        getMe(),
    ]);
 
    const expenses = expenseRes.body.isSuccess ? expenseRes.body.data : [];
    const budgets = budgetRes.body.isSuccess ? budgetRes.body.data : [];
    const categories = categoryRes.body.isSuccess ? categoryRes.body.data : [];
    console.log("categories:", categories);
 
    // Filtrelenen bütçenin tam kaydı — üstte bağlam paneli için
    const activeBudget =
        budgets.find((b) => b.publicId === params.budgetPublicId) ?? null;
 
    return (
        <ExpenseManager
            expenses={expenses}
            budgets={budgets}
            categories={categories}
            activeBudget={activeBudget}
            me={me}
            filters={{
                budgetPublicId: params.budgetPublicId ?? "",
                statusId: params.statusId ?? "",
                onlyMine: params.onlyMine === "true",
            }}
        />
    );
}