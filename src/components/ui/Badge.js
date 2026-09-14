const base = "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium";

const variants = {
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    error:   "bg-error-bg text-error",
    neutral: "bg-neutral-100 text-neutral-600",
    accent:  "bg-accent-100 text-accent-700",
    primary: "bg-primary-600 text-primary-50",
};

const Badge = ({ variant = "neutral", className = "", children }) => {
    if (!children) return null;

    return (
        <span className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;