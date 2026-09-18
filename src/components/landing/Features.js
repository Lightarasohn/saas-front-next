import { Wallet, Users, Building2, ShieldCheck, LayoutGrid, Globe } from "lucide-react";
import Card from "@/components/ui/Card";

const FEATURES = [
    {
        icon: Wallet,
        title: "Masraf ve Bütçe Yönetimi",
        description: "Birim bazlı bütçeler tanımlayın, masrafları onay akışından geçirin, harcamaları anlık takip edin.",
    },
    {
        icon: Users,
        title: "İnsan Kaynakları",
        description: "Ekip bilgilerini ve İK süreçlerini tek panelden yönetin.",
    },
    {
        icon: Building2,
        title: "Organizasyon Şeması",
        description: "Şirketinizi birimlere ayırın, her birime yönetici ve onaylayıcı atayın.",
    },
    {
        icon: ShieldCheck,
        title: "Rol Tabanlı Yetkilendirme",
        description: "SuperAdmin, Manager, Approver ve User rolleriyle kim neyi yapabilir siz belirleyin.",
    },
    {
        icon: LayoutGrid,
        title: "Özelleştirilebilir Panel",
        description: "Dashboard'unuzu widget'larla kişiselleştirin; istediğinizi açın, kapatın, yeniden düzenleyin.",
    },
    {
        icon: Globe,
        title: "Çoklu Şirket Altyapısı",
        description: "Her şirket kendi verisiyle izole çalışır; tek platformda güvenle ölçeklenin.",
    },
];

export default function Features() {
    return (
        <section id="ozellikler" className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col gap-1.5 text-center">
                <h2 className="text-lg font-semibold text-neutral-900 md:text-2xl">
                    Tek platform, tüm operasyon
                </h2>
                <p className="text-sm text-neutral-500">
                    Planınıza göre açılan modüllerle ihtiyacınız kadarını kullanın.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map((feature) => (
                    <Card key={feature.title} padding="sm" className="flex flex-col gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary-50 text-primary-600">
                            <feature.icon size={16} aria-hidden="true" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-900">{feature.title}</h3>
                        <p className="text-sm text-neutral-500">{feature.description}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}