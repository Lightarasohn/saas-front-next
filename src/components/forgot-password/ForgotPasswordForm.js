"use client";

import { useState } from "react";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true)
        try{
            const res = await fetch("/api/auth/forgot-password",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            
            const body = await res.json();
            setMessage(body.message);
        }catch (err){
            console.log(err);
            setMessage("Sunucu hatası oluştu!");
        }finally{
            setIsSubmitting(false);
        }
    };

    return(
        <>
            <div className="flex flex-col gap-4 justify-center items-center bg-white p-4 border border-gray-400 rounded shadow-sm">
                <h1>Parola Sıfırla</h1>
                <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
                    <label className="flex flex-col justify-around">
                        <p className="text-sm">Parolasını sıfırlamak istediğin hesabının e-postasını gir</p>
                        <input className="border rounded border-gray-300 shadow-sm " type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                    </label>
                    <button className="rounded bg-blue-600 px-4 py-2 font-medium text-white
                                        hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={isSubmitting} type="submit">{isSubmitting ? "Göneriliyor..." : "Sıfırlama E-postası Gönder"}</button>
                    <span className="text-center">{message ? message : null}</span>
                </form>
            </div>
        </>
    );
};

export default ForgotPasswordForm;