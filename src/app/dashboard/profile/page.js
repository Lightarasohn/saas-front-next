import ProfileManager from "@/components/dashboard/profile/ProfileManager";
import { getMe } from "@/lib/server-api";

export default async function ProfilePage() {
    // lib/server-api içindeki getMe() fonksiyonunu doğrudan kullanıyoruz
    const me = await getMe();

    if (!me) {
        return (
            <div className="p-3 text-sm text-error">
                Profil bilgileri yüklenemedi. Lütfen tekrar giriş yapmayı deneyin.
            </div>
        );
    }

    return <ProfileManager me={me} />;
}