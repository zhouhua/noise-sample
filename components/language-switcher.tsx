'use client';

import { useLanguage } from '@/i18n/context';
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { SiGithub } from '@icons-pack/react-simple-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = {
  'zh-CN': '中文',
  'en-US': 'English'
} as const;

type LanguageCode = keyof typeof LANGUAGES;

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3"
          >
            <Globe className="h-4 w-4" />
            <span>{LANGUAGES[language]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <DropdownMenuItem
              key={code}
              className="flex items-center justify-between"
              onClick={() => setLanguage(code as LanguageCode)}
            >
              <span>{name}</span>
              {language === code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="w-9 px-0"
        asChild
      >
        <a
          href="https://github.com/zhouhua/noise-sample"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGithub className="h-4 w-4" />
          <span className="sr-only">GitHub</span>
        </a>
      </Button>
    </div>
  );
} 