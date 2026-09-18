import { ArrowRight } from "lucide-react";
import LinkButton from "@/components/ui/LinkButton";

export default function FinalCta() {
    return (
        <section className="bg-primary-600">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
                <h2 className="text-lg font-semibold text-white md:text-2xl">
                    Şirketinizi bugün kurmaya başlayın
                </h2>
                <p className="max-w-md text-sm text-primary-50">
                    Kredi kartı gerekmez. Ücretsiz planla hemen deneyin.
                </p>
                <LinkButton href="/register" variant="secondary" size="lg">
                    Ücretsiz Hesap Oluştur
                    <ArrowRight size={16} aria-hidden="true" />
                </LinkButton>
            </div>
        </section>
    );
}