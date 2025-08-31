import Link from 'next/link';
import settings from '@/content/settings.json';
export default function Nav(){
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <div className="font-semibold">{settings.brand.name}</div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/calculator">Calculator</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/admin" className="ml-4 px-3 py-1 border rounded">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
