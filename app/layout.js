import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Kindleway Zakaat Pro',
  description: 'Professional Zakaat calculator with admin logs and CSV export.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
