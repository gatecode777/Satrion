import './globals.css';
import '../styles/templatemo.css';
import 'react-toastify/dist/ReactToastify.css';
import { ShopProvider } from '../context/ShopContext';
import ClientLayoutWrapper from '../components/ClientLayoutWrapper';
import { ToastContainer } from 'react-toastify';
import Script from 'next/script';

export const metadata = {
  title: 'Satrion Shop - eCommerce Website',
  description: 'Satrion Shop - Customize and buy high-performance gaming gear and custom PC systems.',
  icons: {
    icon: '/apple-icon.png',
    apple: '/apple-icon.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        {/* Preconnect to external origins - critical for LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

        {/* Google Fonts — display=swap prevents render-blocking */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />

        {/* Bootstrap CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        />

        {/* Preload LCP hero image */}
        <link
          rel="preload"
          as="image"
          href="/banner_img_01_new.png"
          fetchPriority="high"
        />
      </head>
      <body>
        <ShopProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          <ToastContainer position="top-right" autoClose={1500} hideProgressBar={true} theme="dark" />
        </ShopProvider>

        {/* Load Client Scripts — deferred, non-blocking */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
