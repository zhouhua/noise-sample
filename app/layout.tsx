import { cn } from '@/lib/utils';
import './globals.css';
import { Inter } from 'next/font/google';
import SharedFooter from './components/shared-footer';
import { Toaster } from 'sonner';
import { LanguageSwitcher } from '@/components/language-switcher';
import { LanguageProvider } from '@/i18n/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '图像噪点生成技术演示',
  description: '图像噪点生成技术演示',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={cn(inter.className, 'min-h-screen flex flex-col')}>
        <LanguageProvider>
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            {children}
          </div>
          <SharedFooter />
          <Toaster position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  );
}
