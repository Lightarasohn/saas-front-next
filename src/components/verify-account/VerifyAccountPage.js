"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyAccount = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    (async () => {
      if (!token) {
        setMessage("Geçersiz bağlantı. ");
        setStatus("retry");
        return;
      }
      try {
        const res = await fetch(`/api/auth/validate-verify-account?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store"
        });
        
        const body = await res.json();
        if (body.isSuccess) {
          setStatus("ready");
        } else {
          setMessage(body.message);
          setStatus("retry");
        }
      } catch (err) {
        setMessage("Sunucu Problemi");
        setStatus("retry");
      }
    })();
  }, [token]);

  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setMessage("");
    try {
      const res = await fetch(`/api/auth/verify-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ rawtoken: token })
      });
      const body = await res.json();
      if (body.isSuccess) {
        setStatus("done");
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
    <>
      <div className="flex flex-col gap-4 justify-center items-center bg-white p-4 border border-gray-400 rounded shadow-sm">
        <h1 className="text-black">Parola Sıfırla</h1>
        {status === "checking" ? <p>Bağlantı kontrol ediliyor...</p> : null}
        {status === "ready" ? (
          <button onClick={handleVerifyAccount} className="bg-blue-500 hover:bg-blue-300 border border-black py-2 px-4" disabled={isVerifying} >Hesabı Aktifleştir</button>
        ) : null}
        {status === "retry" ? (
          <p className="text-black">
            {message}:
            <Link href="/login" replace className="hover:text-blue-500">
              Yeniden Dene
            </Link>
          </p>
        ) : null}
        {status === "done" ? (
          <p>
            Hesap Aktifleştirildi.
            <Link href="/login" replace>
              Giriş Yap
            </Link>
          </p>
        ) : null}
      </div>
    </>
  );
};

export default VerifyAccount;
