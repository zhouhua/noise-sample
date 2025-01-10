import FrostedGlassGenerator from './frosted-glass-generator';
import { Metadata } from 'next';
import { t } from '@/i18n';

export const metadata: Metadata = {
  title: t('frostedGlass.title'),
  description: t('frostedGlass.description'),
};

export default function FrostedGlassPage() {
  return <FrostedGlassGenerator />;
} 