import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Shell from '@/components/layout/Shell';

export const metadata = {
  title: 'DashboardSale — Biznes texnologiyalari va kassa uskunalari',
  description:
    'Savdo tizimlari, biznes botlari, davomat nazorati va AI yechimlari — uskunalar bilan birgalikda, yagona hamkor orqali.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#0f1320] font-sans antialiased selection:bg-[#0b5cff] selection:text-white">
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
