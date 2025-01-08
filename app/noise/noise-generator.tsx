'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Chrome } from '@uiw/react-color';
import { CopyButton } from "@/components/ui/copy-button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Settings {
  frequency: number;
  opacity: number;
  backgroundColor: string;
  numOctaves: number;
  blendMode: string;
}

const BLEND_MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'soft-light',
] as const;

const generateSvgCode = (settings: Settings) => {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="noise">
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="${settings.frequency}" 
        numOctaves="${settings.numOctaves}" 
        stitchTiles="stitch"
      />
      <feComponentTransfer>
        <feFuncA type="linear" slope="${settings.opacity}"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect
    width="100%"
    height="100%"
    fill="${settings.backgroundColor}"
  />
  <rect
    width="100%"
    height="100%"
    filter="url(#noise)"
    style="mix-blend-mode: ${settings.blendMode}"
  />
</svg>`;
};

export default function NoiseGenerator() {
  const [settings, setSettings] = useState<Settings>({
    frequency: 0.65,
    opacity: 0.5,
    backgroundColor: '#ffffff',
    numOctaves: 1,
    blendMode: 'normal'
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">SVG 噪点生成器</h1>
        <p className="text-sm text-muted-foreground">使用 SVG feTurbulence 滤镜生成噪点效果</p>
      </div>

      <div className='flex flex-col gap-8 items-center'>
        <div className="flex gap-8 items-start">
          <div className="w-[280px] space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">噪点频率</span>
                  <span className="text-sm text-muted-foreground">
                    {settings.frequency.toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={0.01}
                  max={1}
                  step={0.001}
                  value={[settings.frequency]}
                  onValueChange={([frequency]) => {
                    setSettings(prev => ({ ...prev, frequency }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">噪点透明度</span>
                  <span className="text-sm text-muted-foreground">
                    {settings.opacity.toFixed(2)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.opacity]}
                  onValueChange={([opacity]) => {
                    setSettings(prev => ({ ...prev, opacity }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">背景颜色</span>
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center gap-2"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <span>{settings.backgroundColor}</span>
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: settings.backgroundColor }}
                    />
                  </Button>
                  {showColorPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-50"
                        onClick={() => setShowColorPicker(false)}
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

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">叠加次数</span>
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
                  <span className="text-sm font-medium">混合模式</span>
                </div>
                <Select
                  value={settings.blendMode}
                  onValueChange={(blendMode) => setSettings(prev => ({
                    ...prev,
                    blendMode
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLEND_MODES.map(mode => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <svg
            width={400}
            height={400}
            className="border border-border rounded-lg"
          >
            <defs>
              <filter id="noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={settings.frequency}
                  numOctaves={settings.numOctaves}
                  stitchTiles="stitch"
                />
                <feComponentTransfer>
                  <feFuncA type="linear" slope={settings.opacity} />
                </feComponentTransfer>
              </filter>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={settings.backgroundColor}
            />
            <rect
              width="100%"
              height="100%"
              filter="url(#noise)"
              // @ts-ignore
              style={{ mixBlendMode: settings.blendMode }}
            />
          </svg>
        </div>

        <div className="w-[740px] rounded-lg overflow-hidden border border-border relative">
          <CopyButton value={generateSvgCode(settings)} />
          <SyntaxHighlighter
            language="xml"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              padding: '1.5rem',
            }}
          >
            {generateSvgCode(settings)}
          </SyntaxHighlighter>
        </div>
      </div>
    </main>
  );
} 