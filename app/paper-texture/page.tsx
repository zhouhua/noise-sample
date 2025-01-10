import PaperTextureGenerator from './paper-texture-generator';
import { ClientTranslation } from '@/components/client-translation';
import { Metadata } from 'next';
import { t } from '@/i18n';

export const metadata: Metadata = {
  title: t('paper.title'),
  description: t('paper.description'),
};

export default function PaperTexturePage() {
  return <PaperTextureGenerator />;
} 