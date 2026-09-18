import { ArrowRight, ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import LinkButton from "@/components/ui/LinkButton";

export default function Hero() {
    return (
        <section className="border-b border-neutral-200 bg-primary-50">
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-8">
                <Badge variant="primary">Çoklu Şirket (Multi-Tenant) SaaS</Badge>

                <h1 className="max-w-2xl text-4xl font-semibold text-neutral-900 md:text-5xl">
                    Şirketinizin akışını tek panelden yönetin
                </h1>

                <p className="max-w-xl text-sm text-neutral-600 md:text-base">
                    Masraf ve bütçe onayından organizasyon şemasına, rol tabanlı
                    yetkilendirmeden abonelik yönetimine kadar tüm operasyonel
                    süreçlerinizi tek bir yerden kontrol edin.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                    <LinkButton href="/register" variant="primary" size="lg">
                        Ücretsiz Başla
                        <ArrowRight size={16} aria-hidden="true" />
                    </LinkButton>
                    <LinkButton href="#planlar" variant="secondary" size="lg">
                        Planları İncele
                    </LinkButton>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-neutral-500">
                    <ShieldCheck size={14} aria-hidden="true" className="text-primary-600" />
                    Rol tabanlı yetkilendirme · SuperAdmin, Manager, Approver, User
                </div>
            </div>
        </section>
    );
}