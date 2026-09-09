const base = "rounded border bg-white";

const variants = {
    default:     "border-neutral-200 shadow-sm",
    interactive: "border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors cursor-pointer",
    highlighted: "border-accent-500 ring-1 ring-accent-500 shadow-sm",
    flat:        "border-neutral-200",
};

const paddings = {
    none: "",
    sm:   "p-4",
    md:   "p-6",
};

const Card = ({
    variant = "default",
    padding = "md",
    className = "",
    children,
    ...props
}) => {
    return (
        <div className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;