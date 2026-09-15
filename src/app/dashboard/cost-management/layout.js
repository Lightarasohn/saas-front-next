import CostManagementTabs from "@/components/dashboard/cost-management/CostManagementTabs";

export default function CostManagementLayout({ children }) {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <h1 className="text-lg font-semibold">Masraf Yönetimi</h1>
            </div>

            <CostManagementTabs />

            {children}
        </div>
    );
}