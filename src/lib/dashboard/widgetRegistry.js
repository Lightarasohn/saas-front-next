import BudgetByUnitWidget from "@/components/dashboard/widgets/examples/BudgetByUnitWidget";
import CostManagementWidget from "@/components/dashboard/widgets/examples/CostManagementWidget";
import ExpenseByCategoryWidget from "@/components/dashboard/widgets/examples/ExpenseByCategoryWidget";
import MyExpensesWidget from "@/components/dashboard/widgets/examples/MyExpensesWidget";
import OrgUnitsWidget from "@/components/dashboard/widgets/examples/OrgUnitsWidget";
import PendingApprovalsWidget from "@/components/dashboard/widgets/examples/PendingApprovalsWidget";
import WelcomeWidget from "@/components/dashboard/widgets/examples/WelcomeWidget";
import { Sparkles, Wallet, ClipboardCheck, PieChart, Receipt, Building2 } from "lucide-react";

export const WIDGET_REGISTRY = [
    {
        key: "welcome",
        moduleKey: null,
        title: "Genel Bakış",
        icon: Sparkles,
        component: WelcomeWidget,
        defaultLayout: { w: 4, h: 2, minW: 3, minH: 2 },
    },
    {
        key: "cost-management-summary",
        moduleKey: "cost-management",
        title: "Masraf Özeti",
        icon: Wallet,
        component: CostManagementWidget,
        defaultLayout: { w: 4, h: 3, minW: 3, minH: 2 },
    },
    {
        key: "cost-management-pending",
        moduleKey: "cost-management",
        title: "Bekleyen Onaylar",
        icon: ClipboardCheck,
        component: PendingApprovalsWidget,
        defaultLayout: { w: 4, h: 4, minW: 3, minH: 3 },
    },
    {
        key: "cost-management-my-expenses",
        moduleKey: "cost-management",
        title: "Masraflarım",
        icon: Receipt,
        component: MyExpensesWidget,
        defaultLayout: { w: 4, h: 4, minW: 3, minH: 3 },
    },
    {
        key: "cost-management-budget-by-unit",
        moduleKey: "cost-management",
        title: "Birim Bazlı Bütçe",
        icon: Wallet,
        component: BudgetByUnitWidget,
        defaultLayout: { w: 4, h: 4, minW: 3, minH: 3 },
    },
    {
        key: "cost-management-by-category",
        moduleKey: "cost-management",
        title: "Kategori Dağılımı",
        icon: PieChart,
        component: ExpenseByCategoryWidget,
        defaultLayout: { w: 4, h: 4, minW: 3, minH: 3 },
    },
    {
        key: "org-units",
        moduleKey: "cost-management",
        title: "Organizasyon Birimleri",
        icon: Building2,
        component: OrgUnitsWidget,
        defaultLayout: { w: 4, h: 4, minW: 3, minH: 3 },
    },
];