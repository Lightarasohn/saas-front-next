"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_PREFIX = "dashboard-widgets:";

function buildDefaultLayout(widgets, yOffset = 0) {
    const cols = 12;
    let cursorX = 0;
    let cursorY = yOffset;

    return widgets.map((widget) => {
        const { w, h, minW, minH } = widget.defaultLayout;
        if (cursorX + w > cols) {
            cursorX = 0;
            cursorY += h;
        }
        const item = { i: widget.key, x: cursorX, y: cursorY, w, h, minW, minH };
        cursorX += w;
        return item;
    });
}

export function useWidgetLayout(userId, availableWidgets) {
    const storageKey = `${STORAGE_PREFIX}${userId ?? "anon"}`;
    const availableKeysString = availableWidgets.map((w) => w.key).join(",");

    const [layout, setLayout] = useState([]);
    const [hidden, setHidden] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // İlk yüklemede localStorage'dan oku, mevcut widget setiyle uzlaştır
    useEffect(() => {
        const availableKeys = availableWidgets.map((w) => w.key);
        let storedLayout = [];
        let storedHidden = [];

        try {
            const raw = window.localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                storedLayout = Array.isArray(parsed.layout) ? parsed.layout : [];
                storedHidden = Array.isArray(parsed.hidden) ? parsed.hidden : [];
            }
        } catch (err) {
            console.error("Widget düzeni okunamadı:", err);
        }

        // Artık mevcut olmayan widget'ları (plan değişmiş, widget kaldırılmış) temizle
        storedLayout = storedLayout.filter((item) => availableKeys.includes(item.i));
        storedHidden = storedHidden.filter((key) => availableKeys.includes(key));

        // Ne layout'ta ne hidden'da olmayan (yeni eklenmiş) widget'ları varsayılan yerleşimle ekle
        const known = new Set([...storedLayout.map((i) => i.i), ...storedHidden]);
        const newlyAvailable = availableWidgets.filter((w) => !known.has(w.key));
        const yOffset = storedLayout.reduce((max, item) => Math.max(max, item.y + item.h), 0);

        setLayout([...storedLayout, ...buildDefaultLayout(newlyAvailable, yOffset)]);
        setHidden(storedHidden);
        setIsHydrated(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey, availableKeysString]);

    // Değişiklikleri localStorage'a yaz
    useEffect(() => {
        if (!isHydrated) return;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ layout, hidden }));
        } catch (err) {
            console.error("Widget düzeni kaydedilemedi:", err);
        }
    }, [layout, hidden, storageKey, isHydrated]);

    const visibleWidgets = useMemo(
        () => availableWidgets.filter((w) => !hidden.includes(w.key)),
        [availableWidgets, hidden]
    );

    const hiddenWidgets = useMemo(
        () => availableWidgets.filter((w) => hidden.includes(w.key)),
        [availableWidgets, hidden]
    );

    const closeWidget = useCallback((key) => {
        setHidden((prev) => (prev.includes(key) ? prev : [...prev, key]));
    }, []);

    const openWidget = useCallback(
        (key) => {
            setHidden((prev) => prev.filter((k) => k !== key));
            setLayout((prev) => {
                if (prev.some((item) => item.i === key)) return prev;
                const widget = availableWidgets.find((w) => w.key === key);
                if (!widget) return prev;
                const yOffset = prev.reduce((max, item) => Math.max(max, item.y + item.h), 0);
                return [...prev, ...buildDefaultLayout([widget], yOffset)];
            });
        },
        [availableWidgets]
    );

    return {
        isHydrated,
        layout: layout.filter((item) => visibleWidgets.some((w) => w.key === item.i)),
        visibleWidgets,
        hiddenWidgets,
        closeWidget,
        openWidget,
        updateLayout: setLayout,
    };
}