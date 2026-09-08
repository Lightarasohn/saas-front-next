"use client";

import { useEffect } from "react";

const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

const Modal = ({
    isOpen,
    onClose,
    title,
    size = "md",
    closeOnOverlayClick = true,
    children,
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape" && onClose) onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 p-4"
            onClick={closeOnOverlayClick && onClose ? onClose : undefined}
        >
            <div
                role="dialog"
                aria-modal="true"
                className={`flex w-full ${sizes[size]} flex-col gap-4 rounded-lg bg-white p-6 shadow-xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
                {children}
            </div>
        </div>
    );
};

export default Modal;