"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const VerifyAccount = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("rawToken");

  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    (async () => {
      if (!token) {
        setMessage("Geçersiz bağlantı.");
        setStatus("retry");
        return;
      }
      try {
        const res = await fetch(
          `/api/auth/validate-verify-account?rawToken=${token}`,
          { cache: "no-store" },
        );
        const body = await res.json();

        if (body.isSuccess) {
          setStatus("ready");
        } else if (res.status === 409) {
          setStatus("alreadyDone");
        } else {
          setMessage(body.message);
          setStatus("retry");
        }
      } catch {
        setMessage("Sunucu problemi.");
        setStatus("retry");
      }
    })();
  }, [token]);

  const handleVerifyAccount = async () => {
    setIsVerifying(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ rawToken: token }),
      });
      const body = await res.json();

      if (body.isSuccess) {
        setStatus("done");
      } else if (res.status === 409) {
        setStatus("alreadyDone");
      } else {
        setMessage(body.message);
      }
    } catch (err) {
      console.log(err);
      setMessage("Sunucu hatası oluştu!");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Hesabı Aktifleştir</h1>

        {status === "checking" ? (
          <p className="text-sm text-neutral-500">Bağlantı kontrol ediliyor...</p>
        ) : null}

        {status === "ready" ? (
          <>
            <p className="text-sm text-neutral-500">
              Hesabını aktifleştirmek için aşağıdaki butona bas.
            </p>
            <Button onClick={handleVerifyAccount} isLoading={isVerifying} className="w-full">
              {isVerifying ? "Aktifleştiriliyor..." : "Hesabı Aktifleştir"}
            </Button>
            <Alert variant="error">{message}</Alert>
          </>
        ) : null}

        {status === "retry" ? (
          <>
            <Alert variant="error">{message}</Alert>
            <Link href="/login" className="text-sm font-medium text-primary-600 hover:underline">
              Giriş Yap
            </Link>
          </>
        ) : null}

        {status === "done" ? (
          <>
            <Alert variant="success">Hesabın aktifleştirildi.</Alert>
            <Link href="/login" className="text-sm font-medium text-primary-600 hover:underline">
              Giriş Yap
            </Link>
          </>
        ) : null}

        {status === "alreadyDone" ? (
          <>
            <Alert variant="info">Hesabın zaten aktifleştirilmiş.</Alert>
            <Link href="/login" className="text-sm font-medium text-primary-600 hover:underline">
              Giriş Yap
            </Link>
          </>
        ) : null}
      </Card>
    </div>
  );
};

export default VerifyAccount;