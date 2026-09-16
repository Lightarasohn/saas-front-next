import { fetchServer } from "@/lib/server-api";
import OrgUnitManager from "@/components/dashboard/cost-management/org-units/OrgUnitManager";
 
export default async function OrgUnitsPage({ searchParams }) {
    const params = await searchParams;
    const showInactive = params.showInactive === "true";
 
    const [orgUnitRes, usersRes] = await Promise.all([
        fetchServer("/api/OrgUnit"),
        fetchServer("/api/UserManagemet"),
    ]);
 
    const orgUnits = orgUnitRes.body.isSuccess ? orgUnitRes.body.data : [];
    const users = usersRes.body.isSuccess ? usersRes.body.data : [];
 
    return (
        <OrgUnitManager
            initialOrgUnits={orgUnits}
            users={users}
            showInactive={showInactive}
        />
    );
}