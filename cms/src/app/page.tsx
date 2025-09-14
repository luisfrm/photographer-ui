import Link from "next/link";
import { BackButton } from "@/components/common/BackButton";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">CMS Dashboard</h1>
        <BackButton />
      </div>
      <p className="text-sm text-muted-foreground">Static dashboard. Use the quick links below.</p>
      <div className="flex gap-3">
        <Link href="/pages" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Pages</Link>
        <Link href="/settings" className="px-4 py-2 rounded-md border">Settings</Link>
        <Link href="/login" className="px-4 py-2 rounded-md border">Login</Link>
      </div>
    </main>
  );
}
