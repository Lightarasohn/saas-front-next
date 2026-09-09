import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/sidebar/DashboardSidebar";
import { getMe, getModules } from "@/lib/server-api";

//TODO: DASHBOARDHEADER VE DASHBOARDSIDEBAR YAP 
export default async function DashboardLayout({ children }) {
    const [user, modules] = await Promise.all([getMe(), getModules()]);

    return (
        <div className="flex min-h-lvh flex-col">
            <DashboardHeader user={user} />

            <div className="flex flex-1">
                <DashboardSidebar modules={modules} />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}