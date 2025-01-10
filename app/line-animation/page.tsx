import LineAnimationGenerator from './line-animation-generator';
import { Metadata } from 'next';
import { t } from '@/i18n';

export const metadata: Metadata = {
  title: t('lineAnimation.title'),
  description: t('lineAnimation.description'),
};

export default function LineAnimationPage() {
  return <LineAnimationGenerator />;
} 