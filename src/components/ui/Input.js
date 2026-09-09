import { forwardRef } from "react";

const Input = forwardRef(function Input(
    { label, error, hint, className = "", ...props },
    ref
) {
    const base =
    "rounded-sm border bg-white px-3 py-2 text-sm text-neutral-900 transition-colors " +
    "focus:outline-none focus:ring-1 " +
    "disabled:bg-neutral-100 disabled:text-neutral-400";

    const borderClass = error
        ? "border-error focus:border-error focus:ring-error"
        : "border-neutral-200 focus:border-primary-500 focus:ring-primary-500";

    return (
        <label className="flex flex-col gap-1">
            {label ? (
                <span className="text-sm font-medium text-neutral-700">{label}</span>
            ) : null}

            <input
                ref={ref}
                className={`${base} ${borderClass} ${className}`}
                aria-invalid={error ? "true" : undefined}
                {...props}
            />

            {error ? (
                <span className="text-xs text-error">{error}</span>
            ) : hint ? (
                <span className="text-xs text-neutral-500">{hint}</span>
            ) : null}
        </label>
    );
});

export default Input;