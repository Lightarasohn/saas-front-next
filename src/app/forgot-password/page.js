import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm";
import Link from "next/link";

const ForgotPasswordPage = () => {
    return (
        <div className="flex min-h-lvh flex-col items-center justify-center gap-4 p-4">
            <ForgotPasswordForm />
            <p className="text-sm text-neutral-500">
                Parolanı hatırladın mı?{" "}
                <Link href="/login" className="font-medium text-primary-600 hover:underline">
                    Giriş Yap
                </Link>
            </p>
        </div>
    );
};

export default ForgotPasswordPage;