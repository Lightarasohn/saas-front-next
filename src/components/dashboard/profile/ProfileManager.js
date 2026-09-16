"use client";

import { useState } from "react";
import { User, Shield } from "lucide-react";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ForgotEmailModal from "./ForgotEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const DataRow = ({ label, value, badge }) => (
    <div className="flex flex-col gap-1 border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
        <span className="text-xs text-neutral-500">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-900">{value || "-"}</span>
            {badge}
        </div>
    </div>
);

export default function ProfileManager({ me }) {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold text-neutral-900">Profilim</h1>

            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                {/* HESAP BİLGİLERİ PANELİ */}
                <Panel
                    title="Hesap Bilgileri"
                    icon={<User size={16} />}
                    action={
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setIsEmailModalOpen(true)}
                        >
                            E-posta Değiştir
                        </Button>
                    }
                >
                    <div className="flex flex-col gap-3">
                        <DataRow label="Ad Soyad" value={me.name} />
                        <DataRow
                            label="E-posta Adresi"
                            value={me.email}
                            badge={
                                me.isVerified ? (
                                    <Badge variant="success">Doğrulandı</Badge>
                                ) : (
                                    <Badge variant="warning">Doğrulanmadı</Badge>
                                )
                            }
                        />
                        <DataRow 
                            label="Rol" 
                            value={<Badge variant="primary">{me.roleName}</Badge>} 
                        />
                        <DataRow label="Şirket" value={me.companyName} />
                    </div>
                </Panel>

                {/* GÜVENLİK PANELİ */}
                <Panel 
                    title="Güvenlik" 
                    icon={<Shield size={16} />}
                    action={
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            Parola Değiştir
                        </Button>
                    }
                >
                    <div className="flex flex-col gap-3">
                        <DataRow
                            label="Parola Değişim Tarihi"
                            value={formatDate(me.passwordChangedAt)}
                        />
                        <DataRow
                            label="Hesap Oluşturulma Tarihi"
                            value={formatDate(me.createDate)}
                        />
                    </div>
                </Panel>
            </div>

            {/* MODALLAR */}
            <ForgotEmailModal 
                isOpen={isEmailModalOpen} 
                onClose={() => setIsEmailModalOpen(false)} 
            />
            
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}