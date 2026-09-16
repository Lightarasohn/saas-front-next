import { fetchServer } from "@/lib/server-api";
import BudgetManager from "@/components/dashboard/cost-management/budgets/BudgetManager";
 
export default async function BudgetsPage({ searchParams }) {
    const params = await searchParams;
 
    const query = new URLSearchParams();
    if (params.year) query.set("year", params.year);
    if (params.month) query.set("month", params.month);
    if (params.orgUnitPublicId) query.set("orgUnitPublicId", params.orgUnitPublicId);
 
    const qs = query.toString();
 
    const [budgetRes, orgUnitRes, usersRes] = await Promise.all([
        fetchServer(`/api/Budget${qs ? `?${qs}` : ""}`),
        fetchServer("/api/OrgUnit"),
        fetchServer("/api/UserManagemet"),
    ]);
 
    const budgets = budgetRes.body.isSuccess ? budgetRes.body.data : [];
    const orgUnits = orgUnitRes.body.isSuccess ? orgUnitRes.body.data : [];
    const canManage = usersRes.body.isSuccess;
 
    return (
        <BudgetManager
            budgets={budgets}
            orgUnits={orgUnits}
            canManage={canManage}
            showInactive={params.showInactive === "true"}
            filters={{
                year: params.year ?? "",
                month: params.month ?? "",
                orgUnitPublicId: params.orgUnitPublicId ?? "",
            }}
        />
    );
}