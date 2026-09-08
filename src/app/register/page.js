import RegisterForm from "@/components/register/RegisterForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex min-h-lvh flex-col items-center justify-center gap-4 p-4">
      <RegisterForm />
      <p className="text-sm text-neutral-500">
        Zaten kayıt olduysan:{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;