import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Ana Sayfa</p>
      <Link href="/login">Login</Link>
    </div>
  );
}
