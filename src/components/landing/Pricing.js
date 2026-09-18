import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LinkButton from "@/components/ui/LinkButton";

function formatPlanName(name) {
    if (!name) return "—";
    return name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function formatPrice(price) {
    if (price === undefined || price === null) return "—";
    if (price === 0) return "Ücretsiz";
    return (
        new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
            minimumFractionDigits: 0,
        }).format(price) + " / ay"
    );
}

export default function Pricing({ plans }) {
    // En pahalı ücretli planı "Popüler" işaretliyoruz — backend'de bunu
    // belirten ayrı bir alan yok, gerçek bir sinyal eklerseniz burayı değiştirin.
    const paidPlans = plans.filter((p) => p.price > 0);
    const highlightedId =
        paidPlans.length > 0
            ? paidPlans.reduce((a, b) => (a.price > b.price ? a : b)).id
            : null;

    return (
        <section id="planlar" className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col gap-1.5 text-center">
                <h2 className="text-lg font-semibold text-neutral-900 md:text-2xl">
                    Basit, şeffaf fiyatlandırma
                </h2>
                <p className="text-sm text-neutral-500">
                    İstediğiniz zaman yükseltin, düşürün ya da iptal edin.
                </p>
            </div>

            {plans.length === 0 ? (
                <p className="mt-6 text-center text-sm text-neutral-500">
                    Planlar şu anda yüklenemedi, lütfen daha sonra tekrar deneyin.
                </p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {plans.map((plan) => {
                        const isHighlighted = plan.id === highlightedId;
                        return (
                            <Card
                                key={plan.id}
                                padding="sm"
                                variant={isHighlighted ? "highlighted" : "default"}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-neutral-900">
                                        {formatPlanName(plan.name)}
                                    </h3>
                                    {isHighlighted && <Badge variant="accent">Popüler</Badge>}
                                </div>

                                <p className="text-lg font-medium text-neutral-900">
                                    {formatPrice(plan.price)}
                                </p>

                                <p className="text-xs text-neutral-500">{plan.description ?? "—"}</p>

                                <ul className="flex flex-1 flex-col gap-1.5">
                                    {plan.modules && plan.modules.length > 0 ? (
                                        plan.modules.map((mod, idx) => (
                                            <li key={idx} className="flex items-center gap-1.5 text-xs text-neutral-700">
                                                <Check size={14} className="text-success" aria-hidden="true" />
                                                {mod.moduleName ?? "—"}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs text-neutral-500">Modül içermez</li>
                                    )}
                                </ul>

                                <LinkButton
                                    href="/register"
                                    variant={isHighlighted ? "primary" : "secondary"}
                                    size="sm"
                                    className="w-full"
                                >
                                    Kayıt Ol
                                </LinkButton>
                            </Card>
                        );
                    })}
                </div>
            )}
        </section>
    );
}