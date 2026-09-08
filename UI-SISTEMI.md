# UI Tasarım Sistemi

Bu dosya projedeki görsel tutarlılığın referansıdır. Yeni bir bileşen
yazarken renk seçmeden önce buraya bakılır; burada karşılığı yoksa
önce buraya eklenir, sonra kullanılır.

Renk tanımları `src/app/globals.css` içindeki `@theme` bloğundadır.

---

## Palet

| Ölçek | Rol | Anahtar tonlar |
|---|---|---|
| `primary` | Marka rengi, ana eylemler | 600 (`#3D5A80`) taban, 300 (`#98C1D9`) açık vurgu, 50 (`#E0FBFC`) zemin |
| `accent` | Dikkat çekme, ikincil vurgu | 500 (`#EE6C4D`) taban |
| `neutral` | Metin, yüzey, kenarlık | 900 (`#293241`) metin, 50 (`#F7F8FA`) zemin |

**Kural:** Birincil eylem her zaman `primary`, asla `accent` değildir.
`accent` sayfada en fazla bir-iki yerde görünür; her yerde kullanılırsa
vurgu olmaktan çıkar. `accent` turuncu-kırmızı olduğu için hata rengiyle
karışma riski vardır — buton olarak kullanırken yanında yıkıcı bir eylem
(sil, iptal et) olmamasına dikkat edilir.

---

## Yüzey ve zemin

| Amaç | Sınıf |
|---|---|
| Sayfa zemini | `bg-neutral-50` (body'de tanımlı, tekrar yazma) |
| Kart / panel / modal yüzeyi | `bg-white` |
| İkincil yüzey (sekme çubuğu, tablo başlığı) | `bg-neutral-100` |
| Koyu yüzey (sidebar, header — tercih edilirse) | `bg-neutral-900` |
| Modal arka plan örtüsü | `bg-neutral-950/50` |

## Kenarlık

| Amaç | Sınıf |
|---|---|
| Varsayılan kenarlık | `border-neutral-200` |
| Vurgulu kenarlık (hover, seçili) | `border-neutral-300` |
| Girdi odak kenarlığı | `border-primary-500` |
| Ayraç çizgisi | `border-neutral-200` |

## Metin

| Amaç | Sınıf |
|---|---|
| Ana metin, başlık | `text-neutral-900` |
| İkincil metin, açıklama | `text-neutral-500` |
| Etiket (form label) | `text-neutral-700` |
| Pasif metin | `text-neutral-400` |
| Koyu zemin üstü metin | `text-white` |
| Koyu zemin üstü ikincil metin | `text-neutral-300` |
| Bağlantı | `text-primary-600 hover:underline` |

## Tipografi ölçeği

| Amaç | Sınıf |
|---|---|
| Sayfa başlığı (h1) | `text-2xl font-semibold` |
| Bölüm başlığı (h2) | `text-lg font-semibold` |
| Kart başlığı (h3) | `text-base font-semibold` |
| Gövde metni | `text-sm` |
| Yardımcı metin, etiket | `text-xs` |
| Sayısal vurgu (istatistik) | `text-3xl font-semibold tabular-nums` |

**Not:** Gövde metni varsayılan olarak `text-sm`. Dashboard arayüzünde
`text-base` fazla iri durur.

---

## Butonlar

| Tür | Sınıflar |
|---|---|
| Birincil | `bg-primary-600 text-white hover:bg-primary-700` |
| İkincil | `border border-neutral-300 text-neutral-700 hover:bg-neutral-100` |
| Vurgu | `bg-accent-500 text-white hover:bg-accent-600` |
| Sessiz (ghost) | `text-neutral-700 hover:bg-neutral-100` |
| Yıkıcı | `bg-error text-white hover:bg-error/90` |
| Pasif (her tür) | `disabled:cursor-not-allowed disabled:opacity-50` |

Ortak: `rounded px-4 py-2 text-sm font-medium transition-colors`

Boyutlar: küçük `px-3 py-1.5 text-xs`, orta (varsayılan) `px-4 py-2 text-sm`,
büyük `px-5 py-2.5 text-sm`

---

## Form elemanları

| Amaç | Sınıf |
|---|---|
| Girdi | `rounded border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900` |
| Girdi odak | `focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500` |
| Girdi hata durumu | `border-error focus:border-error focus:ring-error` |
| Girdi pasif | `disabled:bg-neutral-100 disabled:text-neutral-400` |
| Etiket | `text-sm font-medium text-neutral-700` |
| Alan altı hata metni | `text-xs text-error` |
| Alan altı yardım metni | `text-xs text-neutral-500` |

Etiket ve girdi arası boşluk `gap-1`, alanlar arası `gap-4`.

---

## Bildirim / uyarı kutuları

Ortak: `rounded border px-3 py-2 text-sm`

| Tür | Sınıflar |
|---|---|
| Başarı | `border-success-border bg-success-bg text-success` |
| Uyarı | `border-warning-border bg-warning-bg text-warning` |
| Hata | `border-error-border bg-error-bg text-error` |
| Bilgi | `border-info-border bg-info-bg text-info` |

---

## Durum göstergeleri (rozet)

Ortak: `rounded-full px-2 py-0.5 text-xs font-medium`

| Durum | Sınıflar |
|---|---|
| Aktif / açık | `bg-success-bg text-success` |
| Beklemede | `bg-warning-bg text-warning` |
| Kapalı / hata | `bg-error-bg text-error` |
| Nötr | `bg-neutral-100 text-neutral-600` |
| Vurgulu (yeni, öne çıkan) | `bg-accent-100 text-accent-700` |

---

## Navigasyon

| Amaç | Sınıf |
|---|---|
| Sidebar öğesi (varsayılan) | `text-neutral-700 hover:bg-neutral-100` |
| Sidebar öğesi (aktif) | `bg-primary-50 text-primary-700 font-medium` |
| Sidebar öğesi (erişimi kapalı) | `text-neutral-400 cursor-not-allowed` |
| Sidebar bölüm başlığı | `text-xs font-medium uppercase tracking-wide text-neutral-400` |

**Kural:** Erişimi kapalı servisler gizlenmez, soluk gösterilir. Kullanıcı
neye erişemediğini görmeli — abonelik yükseltme kararı buradan doğar.

---

## Kart

Ortak: `rounded-lg border border-neutral-200 bg-white p-6`

| Varyant | Ek sınıf |
|---|---|
| Gölgeli | `shadow-sm` |
| Tıklanabilir | `hover:border-neutral-300 transition-colors cursor-pointer` |
| Vurgulu (öne çıkan plan vb.) | `border-accent-500 ring-1 ring-accent-500` |

Kart içi başlık ile içerik arası `gap-4`, kart grid'i arası `gap-4`.

---

## Boşluk ölçeği

Yalnızca şu değerler kullanılır: `1, 2, 3, 4, 6, 8, 12, 16`

| Amaç | Değer |
|---|---|
| Etiket–girdi | `gap-1` |
| İkon–metin | `gap-2` |
| Form alanları arası | `gap-4` |
| Kart iç boşluğu | `p-6` |
| Bölümler arası | `gap-8` |
| Sayfa kenar boşluğu | `p-6` (mobil `p-4`) |

---

## Köşe yuvarlaklığı

| Amaç | Sınıf |
|---|---|
| Girdi, buton, küçük kutu | `rounded` |
| Kart, modal, panel | `rounded-lg` |
| Rozet, avatar | `rounded-full` |

Karışık yuvarlaklık kullanılmaz — bir ekranda hem `rounded-md` hem
`rounded-xl` görünmemeli.

---

## Gölge

| Amaç | Sınıf |
|---|---|
| Kart | `shadow-sm` |
| Açılır menü (dropdown) | `shadow-lg` |
| Modal | `shadow-xl` |

Gölge yükseklik bildirir; dekorasyon için kullanılmaz.

---

## Erişilebilirlik notları

- Odak halkası `globals.css` içinde `:focus-visible` ile global tanımlı.
  Bileşende ayrıca `focus:ring` yazıldığında ikisinin çakışmadığından
  emin olunmalı.
- Durum yalnızca renkle anlatılmaz. Erişimi kapalı servis soluk renk +
  kilit ikonu; hata mesajı kırmızı renk + metin.
- `neutral-400` üstü metin `neutral-50` zeminde kontrast sınırındadır;
  yalnızca pasif/ikincil bilgi için kullanılır, gövde metni için değil.

---

## Genişletme kuralı

Yeni bir renk ihtiyacı doğduğunda:

1. Mevcut ölçeklerde karşılığı var mı, önce buna bakılır.
2. Yoksa `globals.css` içindeki `@theme` bloğuna eklenir.
3. Bu dosyaya amacıyla birlikte yazılır.
4. Bileşende doğrudan hex kodu **kullanılmaz**.

`className` içinde `#3D5A80` gibi bir değer görünüyorsa, bir yerde bu
akış atlanmış demektir.
