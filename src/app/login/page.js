import LoginForm from "@/components/loginPage/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex min-h-lvh flex-col items-center justify-center gap-4 bg-gray-50 p-4">
      <LoginForm />
      <p className="text-sm text-gray-600">
        Henüz kayıt olmadıysan:{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
