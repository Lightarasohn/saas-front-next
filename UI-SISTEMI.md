# UI Tasarım Sistemi

Bu dosya projedeki görsel tutarlılığın referansıdır. Yeni bir bileşen
yazarken renk veya boşluk seçmeden önce buraya bakılır; burada karşılığı
yoksa önce buraya eklenir, sonra kullanılır.

Renk tanımları `src/app/globals.css` içindeki `@theme` bloğundadır.

---

## Stil yönü

**Modern araçlar, eski stil.** Tailwind ve React kullanıyoruz ama görsel
dil düz/seyrek modern SaaS değil; yoğun, kenarlıklı, chrome'lu masaüstü
uygulaması hissi.

Somut karşılıkları:

| İlke | Uygulaması |
|---|---|
| Kenarlık gösterilir, gölgeyle ima edilmez | Her yüzeyin `border`'ı vardır; `shadow` yalnızca yüzen katmanlarda |
| Yoğunluk yüksektir | Panel iç boşluğu `p-3`, gövde metni `text-sm`, satır aralığı sıkı |
| Köşeler keskindir | `rounded-sm` (2px) yapısal, `rounded` (4px) panel. `rounded-lg` kullanılmaz |
| Chrome vardır | Koyu üst çubuk, koyu sidebar, panel başlıkları, alt durum çubuğu |
| Renk yapısaldır | Yüzeylerde ve şeritlerde kullanılır, sadece vurguda değil |

**Uygulanmadığı yer:** Auth sayfaları (login, register, parola). Onlar tek
kartlık, seyrek, açık zeminli kalır — uygulamanın dışıdır, chrome'a ihtiyaç
duymaz.

---

## Palet

| Ölçek | Rol | Anahtar tonlar |
|---|---|---|
| `primary` | Marka rengi, ana eylemler, aktif durum | 600 (`#3D5A80`) taban, 300 (`#98C1D9`) açık vurgu, 50 (`#E0FBFC`) zemin |
| `accent` | Dikkat çekme, aktif şerit, logo | 500 (`#EE6C4D`) taban |
| `neutral` | Metin, yüzey, kenarlık, chrome | 900 (`#293241`) üst çubuk, 800 (`#343C49`) sidebar, 50 (`#F7F8FA`) içerik zemini |

**Kural:** Birincil eylem her zaman `primary`, asla `accent` değildir.
`accent` sayfada en fazla iki yerde görünür — logo işareti ve aktif öğe
şeridi gibi. `accent` turuncu-kırmızı olduğu için hata rengiyle karışma
riski vardır; buton olarak kullanırken yanında yıkıcı bir eylem
(sil, iptal et) olmamasına dikkat edilir.

---

## Uygulama chrome'u

Bunlar yalnızca dashboard içinde geçerlidir.

| Bölge | Sınıflar |
|---|---|
| Üst çubuk | `h-11 bg-neutral-900 px-4 text-white` |
| Üst çubuk ikincil metin | `text-neutral-300` |
| Sidebar | `w-40 shrink-0 bg-neutral-800 py-2` |
| Sidebar bölüm başlığı | `px-3 py-1 text-xs tracking-wide text-neutral-500` |
| Sidebar öğesi | `border-l-[3px] border-transparent px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white` |
| Sidebar öğesi (aktif) | `border-l-[3px] border-accent-500 bg-primary-600 text-white` |
| Sidebar öğesi (kilitli) | `border-l-[3px] border-transparent px-3 py-1.5 text-sm text-neutral-500 cursor-not-allowed` |
| İçerik alanı | `flex-1 bg-neutral-50 p-3` |
| Durum çubuğu | `border-t border-neutral-200 bg-neutral-100 px-3 py-1 text-xs text-neutral-500` |

**Kural:** Kilitli modüller gizlenmez, soluk ve kilit ikonlu gösterilir.
Kullanıcı neye erişemediğini görmelidir — abonelik yükseltme kararı
buradan doğar.

---

## Yüzey ve zemin

| Amaç | Sınıf |
|---|---|
| Sayfa zemini (auth) | `bg-neutral-50` (body'de tanımlı, tekrar yazma) |
| Panel / kart yüzeyi | `bg-white` |
| Panel başlık şeridi | `bg-neutral-100` |
| Modal arka plan örtüsü | `bg-neutral-950/50` |

## Kenarlık

| Amaç | Sınıf |
|---|---|
| Varsayılan kenarlık | `border border-neutral-200` |
| Vurgulu kenarlık (hover) | `border-neutral-300` |
| Girdi odak kenarlığı | `border-primary-500` |
| Panel başlığı altı | `border-b border-neutral-200` |
| Aktif öğe şeridi | `border-l-[3px] border-accent-500` |

## Metin

| Amaç | Sınıf |
|---|---|
| Ana metin, başlık | `text-neutral-900` |
| İkincil metin, açıklama | `text-neutral-500` |
| Etiket (form label) | `text-neutral-700` |
| Pasif metin | `text-neutral-400` |
| Koyu zemin üstü metin | `text-white` |
| Koyu zemin üstü ikincil metin | `text-neutral-300` |
| Koyu zemin üstü pasif metin | `text-neutral-500` |
| Bağlantı | `text-primary-600 hover:underline` |

## Tipografi ölçeği

| Amaç | Sınıf |
|---|---|
| Sayfa başlığı (auth h1) | `text-2xl font-semibold` |
| Dashboard sayfa başlığı | `text-lg font-semibold` |
| Panel başlığı | `text-sm font-medium` |
| Gövde metni | `text-sm` |
| Yardımcı metin, durum çubuğu | `text-xs` |
| Sayısal vurgu (istatistik) | `text-2xl font-semibold tabular-nums` |

**Not:** Dashboard içinde başlıklar auth sayfalarından bir kademe küçük.
Yoğunluk için.

---

## Butonlar

| Tür | Sınıflar |
|---|---|
| Birincil | `bg-primary-600 text-white hover:bg-primary-700` |
| İkincil | `border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100` |
| Vurgu | `bg-accent-500 text-white hover:bg-accent-600` |
| Sessiz (ghost) | `text-neutral-700 hover:bg-neutral-100` |
| Yıkıcı | `bg-error text-white hover:opacity-90` |
| Pasif (her tür) | `disabled:cursor-not-allowed disabled:opacity-50` |

Ortak: `rounded-sm px-4 py-2 text-sm font-medium transition-colors`

Boyutlar: küçük `px-3 py-1 text-xs`, orta (varsayılan) `px-4 py-2 text-sm`,
büyük `px-5 py-2.5 text-sm`

---

## Form elemanları

| Amaç | Sınıf |
|---|---|
| Girdi | `rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900` |
| Girdi odak | `focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500` |
| Girdi hata durumu | `border-error focus:border-error focus:ring-error` |
| Girdi pasif | `disabled:bg-neutral-100 disabled:text-neutral-400` |
| Etiket | `text-sm font-medium text-neutral-700` |
| Alan altı hata metni | `text-xs text-error` |
| Alan altı yardım metni | `text-xs text-neutral-500` |

Etiket ve girdi arası boşluk `gap-1`, alanlar arası `gap-4`.

---

## Panel (chrome'lu kart)

Dashboard içindeki kartların varsayılan biçimi. Başlık kendi şeridinde
durur, içerikten kenarlıkla ayrılır.

```
Dış:      rounded border border-neutral-200 bg-white
Başlık:   border-b border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium
İçerik:   p-3
```

Kilitli panel: dışa `opacity-60`, başlığa kilit ikonu, içeriğe
"Bu modül planınıza dahil değil." metni.

Auth sayfalarındaki `Card` bileşeni bundan ayrıdır — başlık şeridi yoktur,
`p-6` kullanır.

---

## Bildirim / uyarı kutuları

Ortak: `rounded-sm border px-3 py-2 text-sm`

| Tür | Sınıflar |
|---|---|
| Başarı | `border-success-border bg-success-bg text-success` |
| Uyarı | `border-warning-border bg-warning-bg text-warning` |
| Hata | `border-error-border bg-error-bg text-error` |
| Bilgi | `border-info-border bg-info-bg text-info` |

---

## Rozet

Ortak: `rounded-sm px-2 py-0.5 text-xs font-medium`

| Durum | Sınıflar |
|---|---|
| Aktif / açık | `bg-success-bg text-success` |
| Beklemede | `bg-warning-bg text-warning` |
| Kapalı / hata | `bg-error-bg text-error` |
| Nötr | `bg-neutral-100 text-neutral-600` |
| Vurgulu | `bg-accent-100 text-accent-700` |
| Koyu zemin üstü (plan rozeti) | `bg-primary-600 text-primary-50` |

Rozetler `rounded-full` değil `rounded-sm`. Hap biçimi modern; keskin
köşe seçilen stile uygun.

---

## Boşluk ölçeği

Yalnızca şu değerler kullanılır: `1, 1.5, 2, 3, 4, 6, 8`

| Amaç | Değer |
|---|---|
| Etiket–girdi | `gap-1` |
| İkon–metin | `gap-2` |
| Panel iç boşluğu | `p-3` |
| Panel ızgarası arası | `gap-3` |
| Form alanları arası | `gap-4` |
| Auth kartı iç boşluğu | `p-6` |
| Sayfa kenar boşluğu (dashboard) | `p-3` |

**Not:** Dashboard içinde boşluklar auth sayfalarından belirgin şekilde
dar. Bu bilinçli — yoğunluk stilin parçası.

---

## Köşe yuvarlaklığı

| Amaç | Sınıf |
|---|---|
| Buton, girdi, rozet, sidebar öğesi | `rounded-sm` (2px) |
| Panel, kart, modal | `rounded` (4px) |
| Avatar | `rounded-full` |

`rounded-lg` ve üstü kullanılmaz. Bir ekranda birden fazla yuvarlaklık
değeri görünmemeli.

---

## Gölge

| Amaç | Sınıf |
|---|---|
| Panel, kart | yok — kenarlık yeterli |
| Açılır menü (dropdown) | `shadow-lg` |
| Modal | `shadow-xl` |

Gölge yalnızca **yüzen** katmanlarda kullanılır. Sayfa akışındaki
kutular kenarlıkla ayrılır.

---

## İkonlar

`lucide-react` kullanılır. Boyut `size={16}` satır içi, `size={20}`
başlıkta. Dekoratif ikonlara `aria-hidden`, tek başına butonlara
`aria-label` verilir.

---

## Erişilebilirlik notları

- Odak halkası `globals.css` içinde `:focus-visible` ile global tanımlı.
- Durum yalnızca renkle anlatılmaz. Kilitli modül soluk renk + kilit
  ikonu; hata mesajı kırmızı renk + metin.
- `neutral-400` üstü metin `neutral-50` zeminde kontrast sınırındadır;
  yalnızca pasif bilgi için kullanılır.
- Koyu zeminde `neutral-500` altı metin okunmaz; sidebar'da pasif
  öğeler için sınır budur.

---

## Genişletme kuralı

Yeni bir renk, boşluk veya biçim ihtiyacı doğduğunda:

1. Mevcut ölçeklerde karşılığı var mı, önce buna bakılır.
2. Yoksa `globals.css` içindeki `@theme` bloğuna eklenir.
3. Bu dosyaya amacıyla birlikte yazılır.
4. Bileşende doğrudan hex kodu **kullanılmaz**.

`className` içinde `#3D5A80` gibi bir değer ya da `rounded-xl` gibi
ölçek dışı bir sınıf görünüyorsa, bir yerde bu akış atlanmış demektir.

**`className` ile bileşenin kendi kararlarını ezme.** Konum ve düzen için
kullan (`w-full`, `flex flex-col gap-4`), görünüm için değil. Görünümü
değiştirmen gerekiyorsa bileşene yeni bir varyant ekle.