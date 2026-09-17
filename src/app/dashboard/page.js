import WidgetGrid from "@/components/dashboard/widgets/WidgetGrid";
import { getMe, getModules } from "@/lib/server-api";

export default async function Page() {
    const [user, modules] = await Promise.all([getMe(), getModules()]);

    const moduleKeys = (modules ?? []).filter((m) => m.enabled).map((m) => m.moduleKey);

    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-lg font-semibold text-neutral-900">Dashboard</h1>
            <WidgetGrid userId={user?.id ?? user?.publicId} moduleKeys={moduleKeys} />
        </div>
    );
}