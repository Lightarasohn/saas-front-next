"use client";

import { GripVertical, X } from "lucide-react";
import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";

export default function WidgetShell({ title, icon, onClose, children }) {
    return (
        <Panel
            title={title}
            icon={icon}
            className="h-full"
            action={
                <div className="flex items-center gap-1">
                    <span
                        className="widget-drag-handle cursor-grab select-none rounded-sm p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 active:cursor-grabbing"
                        title="Sürükle"
                        aria-hidden="true"
                    >
                        <GripVertical size={14} />
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={onClose}
                        aria-label="Widget'ı gizle"
                    >
                        <X size={14} aria-hidden="true" />
                    </Button>
                </div>
            }
        >
            <div className="overflow-auto">{children}</div>
        </Panel>
    );
}