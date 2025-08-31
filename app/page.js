import Link from 'next/link';
import settings from '@/content/settings.json';
export const metadata={title:settings.brand.name, description:settings.brand.tagline};
export default function Home(){ return (
  <div className="grid gap-6">
    <div className="card">
      <h1 className="text-2xl font-bold">{settings.brand.name}</h1>
      <p className="small mt-2">{settings.brand.tagline}</p>
      <div className="mt-4"><Link href='/calculator' className='px-4 py-2 bg-sky-600 text-white rounded'>Open Calculator</Link></div>
    </div>
    <div className="card">
      <h2 className="text-lg font-semibold">Why use this tool?</h2>
      <p className="small mt-2">Clear breakdowns, nisab check, admin logs and CSV export — demo friendly and deployable on Vercel.</p>
    </div>
  </div> ); }
