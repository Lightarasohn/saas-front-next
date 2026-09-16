"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Alert from "./Alert";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Onayla",
    confirmVariant = "danger",
    children,
}) {
    const [isBusy, setIsBusy] = useState(false);
    const [error, setError] = useState(null);

    // Modal her açıldığında önceki denemenin hatası kalmasın
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setIsBusy(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsBusy(true);
        setError(null);

        const result = await onConfirm();

        if (result && !result.ok) {
            setError(result.message ?? "İşlem tamamlanamadı");
            setIsBusy(false);
            return;
        }

        setIsBusy(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} closeOnOverlayClick={false}>
            {message ? <p className="text-sm text-neutral-700">{message}</p> : null}

            {children}

            <Alert variant="error">{error}</Alert>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={onClose}
                    disabled={isBusy}
                >
                    Vazgeç
                </Button>
                <Button
                    type="button"
                    variant={confirmVariant}
                    className="flex-1"
                    onClick={handleConfirm}
                    isLoading={isBusy}
                >
                    {isBusy ? "İşleniyor..." : confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}