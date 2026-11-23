import type { Metadata } from 'next';
import './globals.css';
import '@/styles/shopify-exact.css';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import CheckoutModal from '@/components/CheckoutModal';

export const metadata: Metadata = {
  title: "IN'A SHOT — Functional Snacking & Seed Cycling",
  description:
    '100% clean-label roasted edamame snacks and seed cycling blends. High plant protein, rich in fiber, with bold Indian flavors.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="template-index">
        <AnnouncementBar />
        <Header />
        <main
          id="MainContent"
          className="content-for-layout focus-none"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
        <Footer />

        {/* Global Interactive Modals and Drawers */}
        <CartDrawer />
        <QuickViewModal />
        <CheckoutModal />
      </body>
    </html>
  );
}
