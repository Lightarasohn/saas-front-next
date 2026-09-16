import ForgotEmailForm from "@/components/forgot-Email/ForgotEmailForm";
import Link from "next/link";

const ForgotEmailPage = () => {
    return (
        <div className="flex min-h-lvh flex-col items-center justify-center gap-4 p-4">
            <ForgotEmailForm />
            <p className="text-sm text-neutral-500">
                E-postanı hatırladın mı?{" "}
                <Link href="/login" className="font-medium text-primary-600 hover:underline">
                    Giriş Yap
                </Link>
            </p>
        </div>
    );
};

export default ForgotEmailPage;