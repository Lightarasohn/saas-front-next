"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ChangePasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
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
        const res = await fetch(`/api/auth/validate-change-password?token=${token}`, {
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsChanging(true);
    setMessage("");
    try {
      const res = await fetch(`/api/auth/change-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ newPassword })
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
      setIsChanging(false);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center bg-white p-4 border border-gray-400 rounded shadow-sm">
        <h1 className="text-black">Parola Sıfırla</h1>
        {status === "checking" ? <p>Bağlantı kontrol ediliyor...</p> : null}
        {status === "ready" ? (
          <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
            <label className="flex flex-col justify-around">
              <p className="text-sm">
                Yeni Parola
              </p>
              <input
                className="border rounded border-gray-300 shadow-sm"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <button
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white
                                        hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isChanging}
              type="submit"
            >
              {isChanging ? "Yenileniyor..." : "Yenile"}
            </button>
            <span className="text-center">{message ? message : null}</span>
          </form>
        ) : null}
        {status === "retry" ? (
          <p className="text-black">
            {message}:
            <Link href="/forgot-password" replace className="hover:text-blue-500">
              Yeniden Dene
            </Link>
          </p>
        ) : null}
        {status === "done" ? (
          <p>
            Parola Yenilendi.
            <Link href="/login" replace>
              Giriş Yap
            </Link>
          </p>
        ) : null}
      </div>
    </>
  );
};

export default ChangePasswordForm;
