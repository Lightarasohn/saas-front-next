import Link from "next/link";

const base = "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
    primary:   "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100",
    accent:    "bg-accent-500 text-white hover:bg-accent-600",
    ghost:     "text-neutral-700 hover:bg-neutral-100",
};

const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
};

export default function LinkButton({ href, variant = "primary", size = "md", className = "", children, ...props }) {
    return (
        <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </Link>
    );
}