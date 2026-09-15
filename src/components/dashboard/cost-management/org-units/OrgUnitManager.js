"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import OrgUnitTree from "./OrgUnitTree";
import CreateOrgUnitModal from "./CreateOrgUnitModal";
import AssignRoleModal from "./AssignRoleModal";
import { Plus, UserPlus, Pencil, Power } from "lucide-react";
import UpdateOrgUnitModal from "./UpdateOrgUnitModal";

const ROLE_LABELS = {
  Manager: "Yönetici",
  Approver: "Onaylayıcı",
  User: "Üye",
};

const ROLE_VARIANTS = {
  Manager: "primary",
  Approver: "accent",
  User: "neutral",
};

export default function OrgUnitManager({ initialOrgUnits, users }) {
  const router = useRouter();

  const [selected, setSelected] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const canManage = users.length > 0; // kullanıcı listesi geldiyse Admin/SuperAdmin

  // Seçili birimin üyeleri
  useEffect(() => {
    if (!selected) {
      setMembers([]);
      return;
    }

    // Kullanıcı hızlıca başka birime tıklarsa eski isteğin cevabı
    // yeni listeyi ezmesin
    let cancelled = false;
    setIsLoadingMembers(true);

    (async () => {
      try {
        const res = await fetch(
          `/api/cost-management/org-units/${selected.publicId}/members`,
          { cache: "no-store" },
        );
        const body = await res.json();

        if (!cancelled) {
          setMembers(body.isSuccess ? body.data : []);
        }
      } catch {
        if (!cancelled) setMembers([]);
      } finally {
        if (!cancelled) setIsLoadingMembers(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selected]);

  const handleToggleActive = async () => {
    if (!selected) return;

    setIsToggling(true);
    try {
      const res = await fetch("/api/cost-management/org-units/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgUnitPublicId: selected.publicId }),
      });

      const body = await res.json();

      if (body.isSuccess) {
        setSelected(body.data);
        setNotice({ variant: "success", message: body.message });
        router.refresh();
      } else {
        setNotice({ variant: "error", message: body.message });
      }
    } catch {
      setNotice({ variant: "error", message: "Sunucuya ulaşılamadı" });
    } finally {
      setIsToggling(false);
    }
  };

  const handleDone = (message) => {
    setNotice({ variant: "success", message });
    setIsCreateOpen(false);
    setIsAssignOpen(false);
    setIsUpdateOpen(false);

    // Yeni nesne referansı: useEffect tetiklenip üye listesi tazelensin
    setSelected((prev) => (prev ? { ...prev } : null));

    router.refresh(); // sunucu bileşenini yeniden çalıştır
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
                  <Badge variant={selected.isActive ? "success" : "neutral"}>
                    {selected.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </div>

                {canManage ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsAssignOpen(true)}
                    >
                      <UserPlus size={13} aria-hidden="true" />
                      Kullanıcı Ata
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsUpdateOpen(true)}
                    >
                      <Pencil size={13} aria-hidden="true" />
                      Adı Değiştir
                    </Button>

                    <Button
                      variant={selected.isActive ? "danger" : "primary"}
                      size="sm"
                      className="w-full"
                      isLoading={isToggling}
                      onClick={handleToggleActive}
                    >
                      <Power size={13} aria-hidden="true" />
                      {selected.isActive ? "Pasifleştir" : "Aktifleştir"}
                    </Button>

                    {selected.isActive ? (
                      <p className="text-xs text-neutral-500">
                        Pasifleştirmek alt birimleri de kapatır.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">
                Detay için listeden bir birim seçin.
              </p>
            )}
          </Panel>

          {selected ? (
            <Panel title={`Üyeler (${members.length})`}>
              {isLoadingMembers ? (
                <p className="text-sm text-neutral-500">Yükleniyor...</p>
              ) : members.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Bu birime henüz kullanıcı atanmamış.
                </p>
              ) : (
                <div className="flex flex-col">
                  {members.map((member) => (
                    <div
                      key={member.userPublicId}
                      className="flex items-start justify-between gap-2 border-b border-neutral-100 py-2 first:pt-0 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-neutral-900">
                          {member.userName}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {member.email}
                        </p>
                      </div>

                      <Badge
                        variant={ROLE_VARIANTS[member.roleName] ?? "neutral"}
                      >
                        {ROLE_LABELS[member.roleName] ?? member.roleName}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          ) : null}

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

      <UpdateOrgUnitModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        orgUnit={selected}
        onSuccess={handleDone}
      />
    </div>
  );
}
