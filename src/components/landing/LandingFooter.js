import Link from "next/link";

export default function LandingFooter() {
    return (
        <footer className="border-t border-neutral-200 bg-neutral-100">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-neutral-500 md:flex-row">
                <span>© {new Date().getFullYear()} SaaS. Tüm hakları saklıdır.</span>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hover:text-neutral-900">Giriş Yap</Link>
                    <Link href="/register" className="hover:text-neutral-900">Kayıt Ol</Link>
                </div>
            </div>
        </footer>
    );
}