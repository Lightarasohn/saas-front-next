import { headers } from "next/headers";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import CategoriesClient from "@/components/dashboard/cost-management/categories/CategoriesClient";

export const metadata = {
    title: "Masraf Kategorileri | CMS",
};

export default async function CategoriesPage() {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const cookieHeader = headersList.get("cookie") || "";

    const res = await fetch(`${protocol}://${host}/api/cost-management/categories`, {
        cache: "no-store",
        headers: { cookie: cookieHeader }
    });
    
    const body = await res.json();
    const categories = body.isSuccess ? body.data : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-neutral-900">Masraf Kategorileri</h1>
                <CategoriesClient />
            </div>

            <Panel title="Tüm Kategoriler">
                {categories.length === 0 ? (
                    <p className="text-sm text-neutral-500">Henüz hiç kategori bulunmuyor.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 text-xs text-neutral-500">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Kategori Adı</th>
                                    <th className="px-3 py-2 font-medium w-24">Durum</th>
                                    <th className="px-3 py-2 font-medium w-24 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {categories.map((cat) => (
                                    <tr key={cat.publicId} className="hover:bg-neutral-50">
                                        <td className="px-3 py-2 font-medium text-neutral-900">{cat.name}</td>
                                        <td className="px-3 py-2">
                                            {cat.isActive ? (
                                                <Badge variant="success">Aktif</Badge>
                                            ) : (
                                                <Badge variant="error">Pasif</Badge>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <CategoriesClient mode="edit" category={cat} />
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