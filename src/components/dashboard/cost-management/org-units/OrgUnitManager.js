"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Alert from "@/components/ui/Alert";
import OrgUnitTree from "./OrgUnitTree";
import CreateOrgUnitModal from "./CreateOrgUnitModal";
import AssignRoleModal from "./AssignRoleModal";
 
export default function OrgUnitManager({ initialOrgUnits, users }) {
    const router = useRouter();
 
    const [selected, setSelected] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [notice, setNotice] = useState(null); // { variant, message }
 
    const canManage = users.length > 0; // kullanıcı listesi geldiyse Admin/SuperAdmin
    console.log("canManage:", canManage);
    const handleDone = (message) => {
        setNotice({ variant: "success", message });
        setIsCreateOpen(false);
        setIsAssignOpen(false);
        router.refresh(); // sunucu bileşenini yeniden çalıştır, liste tazelensin
    };
 
    return (
        <div className="flex flex-col gap-3">
            {notice ? <Alert variant={notice.variant}>{notice.message}</Alert> : null}
 
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Panel
                        title="Organizasyon Birimleri"
                        action={
                            canManage ? (
                                <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                                    <Plus size={13} aria-hidden="true" />
                                    Yeni Birim
                                </Button>
                            ) : null
                        }
                    >
                        <OrgUnitTree
                            orgUnits={initialOrgUnits}
                            selectedId={selected?.publicId}
                            onSelect={setSelected}
                        />
                    </Panel>
                </div>
 
                <div className="flex flex-col gap-3">
                    <Panel title="Seçili Birim">
                        {selected ? (
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-xs text-neutral-500">Ad</p>
                                    <p className="text-sm font-medium text-neutral-900">
                                        {selected.name}
                                    </p>
                                </div>
 
                                <div>
                                    <p className="text-xs text-neutral-500">Hiyerarşi seviyesi</p>
                                    <p className="text-sm text-neutral-900">{selected.level}</p>
                                </div>
 
                                <div>
                                    <p className="text-xs text-neutral-500">Durum</p>
                                    <span
                                        className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${
                                            selected.isActive
                                                ? "bg-success-bg text-success"
                                                : "bg-neutral-100 text-neutral-600"
                                        }`}
                                    >
                                        {selected.isActive ? "Aktif" : "Pasif"}
                                    </span>
                                </div>
 
                                {canManage ? (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => setIsAssignOpen(true)}
                                    >
                                        <UserPlus size={13} aria-hidden="true" />
                                        Kullanıcı Ata
                                    </Button>
                                ) : null}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">
                                Detay için listeden bir birim seçin.
                            </p>
                        )}
                    </Panel>
 
                    <Panel title="Bilgi">
                        <p className="text-xs leading-relaxed text-neutral-500">
                            Birimler ağaç yapısındadır. Bir birime atanan yönetici, o birimin
                            ve altındaki tüm birimlerin bütçe ve masraflarını görebilir.
                        </p>
                    </Panel>
                </div>
            </div>
 
            <CreateOrgUnitModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                orgUnits={initialOrgUnits}
                defaultParent={selected}
                onSuccess={handleDone}
            />
 
            <AssignRoleModal
                isOpen={isAssignOpen}
                onClose={() => setIsAssignOpen(false)}
                orgUnit={selected}
                users={users}
                onSuccess={handleDone}
            />
        </div>
    );
}