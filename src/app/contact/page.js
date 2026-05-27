import React from 'react';
import ContactClient from '@/components/ContactClient';

export const metadata = {
  title: 'Contact Us - Satrion Shop',
  description: 'Have a question about our custom PCs, keyboard peripherals, or order deliveries? Contact the Satrion support desk today. We are here to help.',
  openGraph: {
    title: 'Contact Us - Satrion Shop',
    description: 'Have a question about our custom PCs, keyboard peripherals, or order deliveries? Contact the Satrion support desk today.',
    type: 'website',
    url: 'https://satrion.in/contact',
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
