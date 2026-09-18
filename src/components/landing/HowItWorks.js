const STEPS = [
    { no: "1", title: "Kayıt Ol", description: "Şirketinizi birkaç dakikada oluşturun, ücretsiz planla hemen başlayın." },
    { no: "2", title: "Planınızı Seçin", description: "İhtiyacınıza göre modülleri açın, istediğiniz zaman değiştirin." },
    { no: "3", title: "Ekibinizi Davet Edin", description: "Organizasyon şemanızı kurun, rolleri atayın, çalışmaya başlayın." },
];

export default function HowItWorks() {
    return (
        <section id="nasil-calisir" className="border-y border-neutral-200 bg-neutral-100">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <h2 className="text-center text-lg font-semibold text-neutral-900 md:text-2xl">
                    Üç adımda kurulum
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {STEPS.map((step) => (
                        <div key={step.no} className="flex flex-col gap-1.5 rounded border border-neutral-200 bg-white p-4">
                            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary-600 text-xs font-semibold text-white">
                                {step.no}
                            </span>
                            <h3 className="text-sm font-medium text-neutral-900">{step.title}</h3>
                            <p className="text-sm text-neutral-500">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}