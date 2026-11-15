import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Nordic Pine A-Frame | Smoky Mountains Luxury Sanctuary',
  description:
    'Architectural Nordic A-frame retreat perched at 3,400 ft in the Smoky Mountains, TN. Book direct with zero Airbnb platform fees via host WhatsApp concierge.',
  openGraph: {
    title: 'The Nordic Pine A-Frame | Smoky Mountains Luxury Sanctuary',
    description:
      'Architectural Nordic A-frame retreat perched at 3,400 ft in the Smoky Mountains, TN. Book direct and save 15.5% in platform fees.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Nordic Pine A-Frame | Smoky Mountains Luxury Sanctuary',
    description:
      'Architectural Nordic A-frame retreat perched at 3,400 ft in the Smoky Mountains, TN. Book direct and save 15.5% in platform fees.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body
        suppressHydrationWarning
        className="antialiased selection:bg-[#D4AF7A]/30 selection:text-[#F4F1EA]"
      >
        {children}
      </body>
    </html>
  );
}
