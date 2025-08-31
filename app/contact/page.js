import settings from '@/content/settings.json';
export const metadata={title:'Contact'};
export default function Contact(){ return (
  <div className='card'>
    <h1 className='text-xl font-semibold'>Contact</h1>
    <p className='small mt-2'>Email: {settings.brand.email}</p>
  </div>
)}