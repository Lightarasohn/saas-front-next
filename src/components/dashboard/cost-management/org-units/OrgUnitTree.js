"use client";
 
import { CornerDownRight, Users } from "lucide-react";
 
export default function OrgUnitTree({ orgUnits, selectedId, onSelect }) {
    if (orgUnits.length === 0) {
        return (
            <p className="text-sm text-neutral-500">
                Henüz birim tanımlanmamış. Sağ üstten ilk birimi oluşturabilirsiniz.
            </p>
        );
    }
 
    return (
        <div className="flex flex-col">
            {orgUnits.map((unit) => {
                const isSelected = unit.publicId === selectedId;
 
                return (
                    <button
                        key={unit.publicId}
                        type="button"
                        onClick={() => onSelect(unit)}
                        className={`flex items-center gap-2 border-l-[3px] px-2 py-1.5 text-left text-sm transition-colors ${
                            isSelected
                                ? "border-accent-500 bg-primary-50 text-primary-700"
                                : "border-transparent text-neutral-700 hover:bg-neutral-50"
                        }`}
                        style={{ paddingLeft: `${8 + unit.level * 18}px` }}
                    >
                        {unit.level > 0 ? (
                            <CornerDownRight
                                size={13}
                                className="shrink-0 text-neutral-300"
                                aria-hidden="true"
                            />
                        ) : null}
 
                        <span className={unit.isActive ? "" : "text-neutral-400"}>
                            {unit.name}
                        </span>
 
                        {unit.memberCount > 0 ? (
                            <span
                                className="flex items-center gap-1 text-xs text-neutral-400"
                                title={`${unit.memberCount} üye`}
                            >
                                <Users size={11} aria-hidden="true" />
                                {unit.memberCount}
                            </span>
                        ) : null}
 
                        {!unit.isActive ? (
                            <span className="rounded-sm bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                                Pasif
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}