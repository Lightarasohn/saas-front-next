import Link from "next/link";
import LinkButton from "@/components/ui/LinkButton";

export default function LandingNavbar() {
    return (
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-accent-500 text-xs font-semibold text-white">
                        S
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">SaaS</span>
                </Link>

                <nav className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
                    <Link href="#ozellikler" className="hover:text-neutral-900">Özellikler</Link>
                    <Link href="#nasil-calisir" className="hover:text-neutral-900">Nasıl Çalışır</Link>
                    <Link href="#planlar" className="hover:text-neutral-900">Planlar</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <LinkButton href="/login" variant="ghost" size="sm">Giriş Yap</LinkButton>
                    <LinkButton href="/register" variant="primary" size="sm">Kayıt Ol</LinkButton>
                </div>
            </div>
        </header>
    );
}