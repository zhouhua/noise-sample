import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';

const locales = {
  'en-US': enUS,
  'zh-CN': zhCN,
} as const;

export type LocaleCode = keyof typeof locales;
export type LocaleMessages = typeof zhCN;

let currentLocale: LocaleCode = 'zh-CN';

export function setLocale(locale: LocaleCode) {
  currentLocale = locale;
}

export function getLocale(): LocaleCode {
  if (typeof window === 'undefined') return currentLocale;

  const savedLocale = localStorage.getItem('language') as LocaleCode;
  if (savedLocale && locales[savedLocale]) {
    return savedLocale;
  }

  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) {
    return 'zh-CN';
  } else if (browserLang.startsWith('en')) {
    return 'en-US';
  }

  return 'zh-CN';
}

export function t(key: string, locale?: LocaleCode): string {
  const keys = key.split('.');
  let result: any = locales[locale || currentLocale];

  for (const k of keys) {
    if (result[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    result = result[k];
  }

  return result;
} 