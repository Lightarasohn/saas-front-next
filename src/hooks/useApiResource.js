"use client";

import { useCallback, useEffect, useState } from "react";

export function useApiResource(path) {
    const [state, setState] = useState({ loading: true, error: null, data: null });
    const [nonce, setNonce] = useState(0);

    const refresh = useCallback(() => setNonce((n) => n + 1), []);

    useEffect(() => {
        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true }));

        (async () => {
            try {
                const res = await fetch(path, { cache: "no-store" });
                const body = await res.json();
                if (cancelled) return;

                if (!res.ok || !body?.isSuccess) {
                    setState({
                        loading: false,
                        error: body?.message ?? "Veriler yüklenemedi.",
                        data: null,
                    });
                    return;
                }
                setState({ loading: false, error: null, data: body.data ?? null });
            } catch {
                if (!cancelled) {
                    setState({
                        loading: false,
                        error: "Sunucu ile iletişim kurulamadı.",
                        data: null,
                    });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [path, nonce]);

    return { ...state, refresh };
}