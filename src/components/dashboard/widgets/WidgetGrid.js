"use client";

import { useMemo, useState } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { WIDGET_REGISTRY } from "@/lib/dashboard/widgetRegistry";
import { useWidgetLayout } from "@/hooks/useWidgetLayout";
import WidgetShell from "./WidgetShell";

const ReactGridLayout = WidthProvider(GridLayout);

export default function WidgetGrid({ userId, moduleKeys }) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const availableWidgets = useMemo(
        () => WIDGET_REGISTRY.filter((w) => w.moduleKey === null || moduleKeys.includes(w.moduleKey)),
        [moduleKeys]
    );

    const { isHydrated, layout, visibleWidgets, hiddenWidgets, closeWidget, openWidget, updateLayout } =
        useWidgetLayout(userId, availableWidgets);

    if (!isHydrated) {
        return (
            <div className="flex h-40 items-center justify-center rounded border border-neutral-200 bg-white text-sm text-neutral-400">
                Widget düzeni yükleniyor...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end">
                <div className="relative">
                    <Button variant="secondary" size="sm" onClick={() => setPickerOpen((v) => !v)}>
                        <Plus size={14} aria-hidden="true" />
                        Widget Ekle
                    </Button>

                    {pickerOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 z-40 mt-1 w-52 rounded border border-neutral-200 bg-white py-1 shadow-lg"
                        >
                            {hiddenWidgets.length === 0 ? (
                                <p className="px-3 py-2 text-xs text-neutral-500">
                                    Eklenebilecek widget yok
                                </p>
                            ) : (
                                hiddenWidgets.map((w) => (
                                    <button
                                        key={w.key}
                                        role="menuitem"
                                        onClick={() => {
                                            openWidget(w.key);
                                            setPickerOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
                                    >
                                        <w.icon size={14} aria-hidden="true" />
                                        {w.title}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {visibleWidgets.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded border border-neutral-200 bg-white text-sm text-neutral-400">
                    Gösterilecek widget yok. Sağ üstten widget ekleyebilirsiniz.
                </div>
            ) : (
                <ReactGridLayout
                    className="layout"
                    layout={layout}
                    cols={12}
                    rowHeight={80}
                    margin={[12, 12]}
                    draggableHandle=".widget-drag-handle"
                    onLayoutChange={updateLayout}
                >
                    {visibleWidgets.map((widget) => {
                        const WidgetComponent = widget.component;
                        return (
                            <div key={widget.key}>
                                <WidgetShell
                                    title={widget.title}
                                    icon={<widget.icon size={14} className="text-neutral-500" />}
                                    onClose={() => closeWidget(widget.key)}
                                >
                                    <WidgetComponent />
                                </WidgetShell>
                            </div>
                        );
                    })}
                </ReactGridLayout>
            )}
        </div>
    );
}