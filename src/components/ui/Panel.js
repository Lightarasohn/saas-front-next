import { Lock } from "lucide-react";

const base = "flex flex-col rounded border border-neutral-200 bg-white";

const Panel = ({ title, isLocked = false, className = "", children }) => {
    return (
        <div className={`${base} ${isLocked ? "opacity-60" : ""} ${className}`}>
            {title ? (
                <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-900">
                    {isLocked ? (
                        <Lock size={16} aria-hidden="true" className="text-neutral-500" />
                    ) : null}
                    {title}
                </div>
            ) : null}
            
            <div className="p-3">
                {isLocked ? (
                    <p className="text-sm text-neutral-500">Bu modül planınıza dahil değil.</p>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default Panel;