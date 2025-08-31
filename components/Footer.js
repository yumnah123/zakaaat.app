import settings from '@/content/settings.json';
export default function Footer(){
  return (
    <footer className="mt-12 text-sm text-gray-600">
      <div className="container py-6 border-t">
        <div className="flex justify-between">
          <div>{settings.brand.tagline}</div>
          <div>Contact: {settings.brand.email}</div>
        </div>
      </div>
    </footer>
  );
}
