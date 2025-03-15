import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from '@/app/client-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TUMO AI/Teens Hackathon Template',
  description: 'TUMO AI/Teens Hackathon Template',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
