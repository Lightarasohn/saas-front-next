import Panel from "@/components/ui/Panel";

export default function OrgUnitList({ orgUnits }) {
    return (
        <Panel title="Organizasyon Birimleri">
            {orgUnits.length === 0 ? (
                <p className="text-sm text-neutral-500">Henüz birim tanımlanmamış.</p>
            ) : (
                <div className="flex flex-col">
                    {orgUnits.map((unit) => (
                        <div
                            key={unit.publicId}
                            className="flex items-center justify-between border-b border-neutral-100 py-1.5 last:border-0"
                            style={{ paddingLeft: `${unit.level * 20}px` }}
                        >
                            <span className={`text-sm ${unit.isActive ? "text-neutral-900" : "text-neutral-400"}`}>
                                {unit.name}
                            </span>

                            {!unit.isActive ? (
                                <span className="rounded-sm bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                                    Pasif
                                </span>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </Panel>
    );
}