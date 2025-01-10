'use client';

import { useLanguage } from '@/i18n/context';
import { t as translate } from '@/i18n';

export function ClientTranslation({ textKey }: { textKey: string }) {
  const { language } = useLanguage();
  return <>{translate(textKey, language)}</>;
} 