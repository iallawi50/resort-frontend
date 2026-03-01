import './globals.css';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'نزهة | Nzha — منصة حجز المنتجعات والشاليهات في السعودية',
  description: 'احجز منتجعك وشاليهك المثالي في المملكة العربية السعودية. نزهة — المنصة المتكاملة لحجز العقارات السياحية وإدارة الفعاليات.',
  keywords: 'شاليهات، منتجعات، حجز، السعودية، فعاليات، نزهة',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* FontAwesome Free 6 */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <NextTopLoader color="#1a7a5e" showSpinner={false} height={3} />
        {children}
      </body>
    </html>
  );
}
