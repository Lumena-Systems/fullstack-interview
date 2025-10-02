import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Frontend Interview - Product Catalog',
  description: 'E-commerce product management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <Link href="/products" className="flex items-center">
                    <h1 className="text-2xl font-bold text-primary">ProductHub</h1>
                  </Link>

                  <nav className="flex items-center gap-4">
                    <Link
                      href="/products"
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      Products
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </header>

            <main>{children}</main>

            <footer className="bg-white border-t mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-center text-gray-500 text-sm">
                  Frontend Interview Project - Built with Next.js, TypeScript, and Prisma
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}


