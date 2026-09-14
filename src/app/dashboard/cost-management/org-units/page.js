import { headers } from "next/headers";
import { CornerDownRight } from "lucide-react";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import OrgUnitClient from "@/components/dashboard/cost-management/org-units/OrgUnitClient";

export const metadata = {
    title: "Organizasyon Birimleri | CMS",
};

export default async function OrgUnitsPage() {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const cookieHeader = headersList.get("cookie") || "";

    const fetchOptions = {
        cache: "no-store",
        headers: { cookie: cookieHeader }
    };

    const [resUnits, resUsers] = await Promise.all([
        fetch(`${protocol}://${host}/api/cost-management/org-units`, fetchOptions),
        fetch(`${protocol}://${host}/api/users`, fetchOptions).catch(() => null)
    ]);

    const bodyUnits = await resUnits.json();
    const bodyUsers = resUsers ? await resUsers.json() : { isSuccess: false, data: [] };

    const orgUnits = bodyUnits.isSuccess ? bodyUnits.data : [];
    const users = bodyUsers.isSuccess ? bodyUsers.data : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-neutral-900">Organizasyon Birimleri</h1>
                <OrgUnitClient mode="create" />
            </div>

            <Panel title="Tüm Birimler ve Hiyerarşi">
                {orgUnits.length === 0 ? (
                    <p className="text-sm text-neutral-500">Henüz hiç organizasyon birimi bulunmuyor.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 text-xs text-neutral-500">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Birim Adı</th>
                                    <th className="px-3 py-2 font-medium w-24">Durum</th>
                                    <th className="px-3 py-2 font-medium w-48 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {orgUnits.map((unit) => (
                                    <tr key={unit.publicId} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-3 py-2 font-medium text-neutral-900">
                                            <div className="flex items-center gap-2" style={{ paddingLeft: `${unit.level * 24}px` }}>
                                                {unit.level > 0 ? (
                                                    <CornerDownRight size={14} className="text-neutral-400" aria-hidden="true" />
                                                ) : null}
                                                {unit.name}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            {unit.isActive ? (
                                                <Badge variant="success">Aktif</Badge>
                                            ) : (
                                                <Badge variant="error">Pasif</Badge>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <OrgUnitClient mode="actions" unit={unit} users={users} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>
        </div>
    );
}