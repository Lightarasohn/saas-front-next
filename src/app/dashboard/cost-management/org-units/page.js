import OrgUnitManager from "@/components/dashboard/cost-management/org-units/OrgUnitManager";
import { fetchServer } from "@/lib/server-api";
 
export default async function OrgUnitsPage() {
    const [orgUnitRes, usersRes] = await Promise.all([
        fetchServer("/api/OrgUnit"),
        fetchServer("/api/UserManagemet"),
    ]);
 
    const orgUnits = orgUnitRes.body.isSuccess ? orgUnitRes.body.data : [];
    // Normal kullanıcı bu listeyi çekemez (403) — boş dizi ile devam ederiz,
    // atama kartı zaten yalnızca yetkili roller için gösterilecek.
    const users = usersRes.body.isSuccess ? usersRes.body.data : [];
    console.log("users:", users)
 
    return <OrgUnitManager initialOrgUnits={orgUnits} users={users} />;
}