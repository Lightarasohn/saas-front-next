"use client";
 
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
 
export default function CategoryCombobox({ categories, value, onChange, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
 
    useEffect(() => {
        if (!isOpen) return;
 
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
 
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
 
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
 
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);
 
    const query = (value ?? "").trim().toLowerCase();
 
    const active = categories.filter((c) => c.isActive);
 
    const filtered = query
        ? active.filter((c) => c.name.toLowerCase().includes(query))
        : active;
 
    const exactMatch = active.find((c) => c.name.toLowerCase() === query);
    const isNew = query.length > 0 && !exactMatch;
 
    return (
        <div className="relative" ref={containerRef}>
            <input
                type="text"
                value={value ?? ""}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Seçin veya yeni kategori adı yazın"
                autoComplete="off"
                role="combobox"
                aria-expanded={isOpen}
                aria-autocomplete="list"
                className={`w-full rounded-sm border bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus:outline-none focus:ring-1 ${
                    error
                        ? "border-error focus:border-error focus:ring-error"
                        : "border-neutral-200 focus:border-primary-500 focus:ring-primary-500"
                }`}
            />
 
            {isOpen && (filtered.length > 0 || isNew) ? (
                <ul
                    role="listbox"
                    className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border border-neutral-200 bg-white py-1 shadow-lg"
                >
                    {filtered.map((category) => {
                        const isSelected = category.name.toLowerCase() === query;
 
                        return (
                            <li key={category.publicId} role="option" aria-selected={isSelected}>
                                <button
                                    type="button"
                                    // Input odaktan çıkmadan tıklama işlensin
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        onChange(category.name);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${
                                        isSelected
                                            ? "bg-primary-50 font-medium text-primary-700"
                                            : "text-neutral-700 hover:bg-neutral-100"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            </li>
                        );
                    })}
 
                    {isNew ? (
                        <li className="border-t border-neutral-200">
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setIsOpen(false)}
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-accent-700 transition-colors hover:bg-accent-50"
                            >
                                <Plus size={13} aria-hidden="true" />
                                <span className="truncate">
                                    &quot;{value.trim()}&quot; olarak oluştur
                                </span>
                            </button>
                        </li>
                    ) : null}
                </ul>
            ) : null}
 
            {isNew ? (
                <p className="mt-1 text-xs text-accent-700">
                    Bu yeni bir kategori — masraf kaydedilince oluşturulacak.
                </p>
            ) : error ? (
                <p className="mt-1 text-xs text-error">{error}</p>
            ) : (
                <p className="mt-1 text-xs text-neutral-500">
                    Listede yoksa yazdığınız ad yeni kategori olarak eklenir.
                </p>
            )}
        </div>
    );
}