const base = "rounded border px-3 py-2 text-sm";

const variants = {
    success: "border-success-border bg-success-bg text-success",
    warning: "border-warning-border bg-warning-bg text-warning",
    error:   "border-error-border bg-error-bg text-error",
    info:    "border-info-border bg-info-bg text-info",
};

const Alert = ({ variant = "info", className = "", children }) => {
    if (!children) return null;

    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </div>
    );
};

export default Alert;