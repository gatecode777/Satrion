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
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap" />
        
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        
        {/* Bootstrap CSS */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />
      </head>
      <body>
        <ShopProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          <ToastContainer position="top-right" autoClose={1500} hideProgressBar={true} theme="dark" />
        </ShopProvider>

        {/* Load Client Scripts */}
        <Script src="https://code.jquery.com/jquery-3.7.1.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
