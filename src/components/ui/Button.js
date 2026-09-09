const base = "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const variants = {
    primary:   "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100",
    accent:    "bg-accent-500 text-white hover:bg-accent-600",
    ghost:     "text-neutral-700 hover:bg-neutral-100",
    danger:    "bg-error text-white hover:opacity-90",
};

const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
};
export default function Button({ 
    variant = "primary", 
    size = "md", 
    isLoading = false, 
    disabled = false,
    className = "",
    children,
    ...props 
}) {
    return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
        {isLoading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
            ) : null}
            {children}
    </button>);
}