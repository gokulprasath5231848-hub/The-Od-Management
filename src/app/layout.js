import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'CampusOD — College On-Duty Management System',
  description: 'Manage student on-duty requests, approvals, and digital OD certificates for college events with multi-level hierarchy support.',
  keywords: 'on-duty, college, management, approval, OD, certificate, events',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
