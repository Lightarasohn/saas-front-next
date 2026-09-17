"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, RotateCcw, XCircle } from "lucide-react";
import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Input from "@/components/ui/Input";

export default function SubscriptionManager({
  initialSubscription,
  plans = [],
}) {
  const router = useRouter();
  const [notice, setNotice] = useState(null);
  const [actionState, setActionState] = useState({ type: null, payload: null });
  const [renewMonths, setRenewMonths] = useState(1);

  const hasData =
    initialSubscription !== null && initialSubscription !== undefined;
  const isFree = hasData && initialSubscription.subscriptionPlanId === 1;

  // --- Formatlayıcılar ---
  // Metinleri "cost-management" -> "Cost Management", "free" -> "Free" yapar
  const formatPlanName = (name) => {
    if (!name) return "—";
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "—";
    if (price === 0) return "Ücretsiz";
    return (
      new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
      }).format(price) + " / ay"
    );
  };

  // --- API İstekleri ---
  const executeAction = async () => {
    const { type, payload } = actionState;
    let endpoint = "";
    let requestBody = {};

    if (type === "subscribe") {
      endpoint = "/api/subscription/subscribe";
      requestBody = { planType: payload };
    } else if (type === "renew") {
      endpoint = "/api/subscription/renew";
      requestBody = { monthsToAdd: parseInt(renewMonths, 10) || 1 };
    } else if (type === "cancel") {
      endpoint = "/api/subscription/cancel";
      requestBody = {};
    } else if (type === "auto-renew") {
      endpoint = "/api/subscription/auto-renew";
      requestBody = { enabled: payload };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok || !data?.isSuccess) {
        return {
          ok: false,
          message: data?.message || "İşlem sırasında bir hata oluştu.",
        };
      }

      setNotice({
        variant: "success",
        message: data.message || "İşlem başarıyla tamamlandı.",
      });
      setActionState({ type: null, payload: null });

      router.refresh();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: "Sunucu ile iletişim kurulamadı." };
    }
  };

  const isPlanActive = (planId) =>
    hasData && initialSubscription.subscriptionPlanId === planId;

  // --- Modal Ayarları ---
  const getModalConfig = () => {
    switch (actionState.type) {
      case "cancel":
        return {
          title: "Aboneliği İptal Et",
          message:
            "Aboneliğinizi iptal etmek istediğinize emin misiniz? Mevcut dönem sonuna kadar erişiminiz devam edecek, ardından FREE plana düşürüleceksiniz.",
          confirmLabel: "İptal Et",
          confirmVariant: "danger",
        };
      case "subscribe":
        const targetPlan = plans.find((p) => p.id === actionState.payload);
        return {
          // Modaldaki başlığı da formatlıyoruz
          title: `${formatPlanName(targetPlan?.name)} Planına Geç`,
          message:
            "Bu işlemi onayladığınızda yeni planınız hemen aktif edilecek ve ilk ay faturalandırılacaktır.",
          confirmLabel: "Geçişi Onayla",
          confirmVariant: "primary",
        };
      case "renew":
        return {
          title: "Süreyi Uzat",
          message:
            "Mevcut aboneliğinizin süresini seçtiğiniz ay kadar uzatmak üzeresiniz. Erken yenilemelerde kalan günleriniz kaybolmaz, üzerine eklenir.",
          confirmLabel: "Uzat",
          confirmVariant: "primary",
        };
      case "auto-renew":
        return {
          title: "Otomatik Yenilemeyi Aç",
          message:
            "Otomatik yenilemeyi tekrar açmak istediğinize emin misiniz? Aboneliğiniz dönem sonunda otomatik olarak yenilenecektir.",
          confirmLabel: "Aç",
          confirmVariant: "primary",
        };
      default:
        return {
          title: "",
          message: "",
          confirmLabel: "",
          confirmVariant: "primary",
        };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="flex flex-col gap-3">
      {notice ? <Alert variant={notice.variant}>{notice.message}</Alert> : null}

      <Panel
        title="Mevcut Durum"
        icon={<CreditCard size={14} className="text-neutral-500" />}
        action={
          hasData &&
          !isFree && (
            <div className="flex items-center gap-2">
              {initialSubscription.autoRenew ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setActionState({ type: "cancel", payload: null })
                  }
                >
                  <XCircle size={13} aria-hidden="true" />
                  İptal Et
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setActionState({ type: "auto-renew", payload: true })
                  }
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  Otomatik Yenilemeyi Aç
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActionState({ type: "renew", payload: null })}
              >
                <RotateCcw size={13} aria-hidden="true" />
                Süreyi Uzat
              </Button>
            </div>
          )
        }
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold tabular-nums text-neutral-900">
                {/* Mevcut abonelik adını formatlıyoruz */}
                {formatPlanName(initialSubscription?.subscriptionPlanName)}
              </span>

              {!hasData ? (
                <Badge variant="neutral">Veri Yok</Badge>
              ) : isFree ? (
                <Badge variant="neutral">Ücretsiz Sürüm</Badge>
              ) : initialSubscription.autoRenew ? (
                <Badge variant="success">Aktif (Oto. Yenileme Açık)</Badge>
              ) : (
                <Badge variant="warning">
                  İptal Edildi (Dönem Sonu Bitecek)
                </Badge>
              )}
            </div>

            {hasData && !isFree && (
              <div className="mt-1 flex flex-col gap-1 text-sm text-neutral-600">
                <p>
                  Bitiş Tarihi:{" "}
                  <strong className="text-neutral-900">
                    {formatDate(initialSubscription.expiresAt)}
                  </strong>
                </p>
                {initialSubscription.subscriptionPlanModules?.length > 0 ? (
                  <p>
                    Aktif Modüller:{" "}
                    <span className="text-neutral-900">
                      {initialSubscription.subscriptionPlanModules
                        .map((m) => m.moduleName)
                        .join(", ")}
                    </span>
                  </p>
                ) : (
                  <p>
                    Aktif Modüller: <span className="text-neutral-900">—</span>
                  </p>
                )}
              </div>
            )}
            {hasData && isFree && (
              <p className="text-sm text-neutral-500">
                Sınırlı özelliklerle ücretsiz planı kullanıyorsunuz. Modülleri
                kullanabilmek için bir plana geçiş yapın.
              </p>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="Planlar">
        {plans && plans.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const isActive = isPlanActive(plan.id);
              const isFreePlan = plan.id === 1;

              // Kullanıcı ücretli planda ve bu kart FREE plan kartı ise
              const cannotDowngradeToFree = isFreePlan && hasData && !isFree;

              let buttonLabel = "Geçiş Yap";
              let isButtonDisabled = isActive;

              if (isActive) {
                buttonLabel = "Kullanımda";
              } else if (cannotDowngradeToFree) {
                // İptal edildiyse farklı, henüz iptal edilmediyse farklı metin
                buttonLabel = initialSubscription?.autoRenew
                  ? "İptal Ederek Dönülebilir"
                  : "Dönem Sonu Geçilecek";
                isButtonDisabled = true; // Tıklamayı engelle
              }

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col gap-3 rounded border p-3 transition-colors ${
                    isActive
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {formatPlanName(plan.name)}
                      </h3>
                      {isActive && <Badge variant="primary">Mevcut</Badge>}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {plan.description ?? "—"}
                    </p>
                    <p className="mt-1 text-lg font-medium text-neutral-900">
                      {formatPrice(plan.price)}
                    </p>
                  </div>

                  <ul className="mt-1 flex flex-1 flex-col gap-1.5">
                    {plan.modules && plan.modules.length > 0 ? (
                      plan.modules.map((mod, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-neutral-700"
                        >
                          <Check
                            size={14}
                            className="text-success"
                            aria-hidden="true"
                          />
                          {mod.moduleName ?? "—"}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-neutral-500">
                        Modül içermez
                      </li>
                    )}
                  </ul>

                  <Button
                    variant={isActive ? "secondary" : "primary"}
                    size="sm"
                    className="mt-2 w-full"
                    disabled={isButtonDisabled}
                    onClick={() =>
                      setActionState({ type: "subscribe", payload: plan.id })
                    }
                  >
                    {buttonLabel}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 text-sm text-neutral-500">
            Sistemde kayıtlı abonelik planı bulunamadı. (Veri gelmiyor)
          </div>
        )}
      </Panel>

      <ConfirmModal
        isOpen={actionState.type !== null}
        onClose={() => setActionState({ type: null, payload: null })}
        onConfirm={executeAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        confirmVariant={modalConfig.confirmVariant}
      >
        {actionState.type === "renew" && (
          <div className="mt-4">
            <Input
              type="number"
              min="1"
              max="12"
              label="Uzatılacak Ay Sayısı"
              value={renewMonths}
              onChange={(e) => setRenewMonths(e.target.value)}
            />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
