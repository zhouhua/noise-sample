'use client';

import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Chrome } from '@uiw/react-color';
import { useLanguage } from '@/i18n/context';
import { t as translate } from '@/i18n';

interface Settings {
  frequency: number;
  numOctaves: number;
  surfaceScale: number;
  elevation: number;
  backgroundColor: string;
  azimuth: number;
}

export default function PaperTextureGenerator() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<Settings>({
    frequency: 0.04,
    numOctaves: 5,
    surfaceScale: 2,
    elevation: 60,
    backgroundColor: '#ffffff',
    azimuth: 45
  });

  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{translate('paper.title', language)}</h1>
        <p className="text-sm text-muted-foreground">{translate('paper.description', language)}</p>
      </div>

      <div className="flex gap-8 items-start">
        <div className="w-[280px] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('paper.frequency', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.frequency.toFixed(3)}
              </span>
            </div>
            <Slider
              min={0.01}
              max={0.2}
              step={0.001}
              value={[settings.frequency]}
              onValueChange={([frequency]) => {
                setSettings(prev => ({ ...prev, frequency }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('paper.octaves', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.numOctaves}
              </span>
            </div>
            <Slider
              min={1}
              max={8}
              step={1}
              value={[settings.numOctaves]}
              onValueChange={([numOctaves]) => {
                setSettings(prev => ({ ...prev, numOctaves }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('paper.surfaceScale', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.surfaceScale}
              </span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={[settings.surfaceScale]}
              onValueChange={([surfaceScale]) => {
                setSettings(prev => ({ ...prev, surfaceScale }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('paper.elevation', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.elevation}°
              </span>
            </div>
            <Slider
              min={0}
              max={90}
              step={1}
              value={[settings.elevation]}
              onValueChange={([elevation]) => {
                setSettings(prev => ({ ...prev, elevation }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('paper.azimuth', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.azimuth}°
              </span>
            </div>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[settings.azimuth]}
              onValueChange={([azimuth]) => {
                setSettings(prev => ({ ...prev, azimuth }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('paper.backgroundColor', language)}</span>
            </div>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center gap-2"
                onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
              >
                <span>{settings.backgroundColor}</span>
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: settings.backgroundColor }}
                />
              </Button>
              {showBackgroundColorPicker && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setShowBackgroundColorPicker(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 z-[51]">
                    <Chrome
                      color={settings.backgroundColor}
                      onChange={(color) => {
                        setSettings(prev => ({
                          ...prev,
                          backgroundColor: color.hex
                        }));
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-[400px] h-[400px]">
          <svg
            width="400"
            height="400"
            className="border border-border rounded-lg"
          >
            <defs>
              <filter
                id="paper"
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={settings.frequency}
                  numOctaves={settings.numOctaves}
                  seed={1}
                  stitchTiles="noStitch"
                  result="noise"
                />
                <feDiffuseLighting
                  in="noise"
                  lightingColor="#ffffff"
                  surfaceScale={settings.surfaceScale}
                  result="lighting"
                >
                  <feDistantLight
                    azimuth={settings.azimuth}
                    elevation={settings.elevation}
                  />
                </feDiffuseLighting>
                <feBlend
                  mode="multiply"
                  in="SourceGraphic"
                  in2="lighting"
                />
              </filter>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={settings.backgroundColor}
              filter="url(#paper)"
            />
          </svg>
        </div>
      </div>
    </main>
  );
} 