'use client';

import { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Settings {
  frequency: number;
  numOctaves: number;
  type: 'fractalNoise' | 'turbulence';
  speed: number;
}

const NOISE_TYPES = [
  { value: 'fractalNoise', label: '分形噪点' },
  { value: 'turbulence', label: '湍流噪点' },
] as const;

const DEFAULT_SETTINGS = {
  fractalNoise: {
    frequency: 0.02,
    numOctaves: 4,
  },
  turbulence: {
    frequency: 0.02,
    numOctaves: 4,
  }
};

const generateSvgCode = (settings: Settings) => {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="noise">
      <feTurbulence 
        type="${settings.type}" 
        baseFrequency="${settings.frequency}"
        numOctaves="${settings.numOctaves}" 
        seed="0"
      />
    </filter>
  </defs>
  <rect
    width="100%"
    height="100%"
    fill="#ffffff"
    filter="url(#noise)"
  />
</svg>`;
};

export default function AnimatedNoiseGenerator() {
  const [settings, setSettings] = useState<Settings>({
    frequency: DEFAULT_SETTINGS.fractalNoise.frequency,
    numOctaves: DEFAULT_SETTINGS.fractalNoise.numOctaves,
    type: 'fractalNoise',
    speed: 30
  });

  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let lastTime = 0;
    let currentSeed = 0;

    const animate = (timestamp: number) => {
      if (lastTime === 0) {
        lastTime = timestamp;
      }

      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      currentSeed = (currentSeed + (deltaTime * settings.speed) / 1000) % 100;

      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute('seed', currentSeed.toString());
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [settings.speed]);

  const handleTypeChange = (type: 'fractalNoise' | 'turbulence') => {
    const defaultSettings = DEFAULT_SETTINGS[type];
    setSettings(prev => ({
      ...prev,
      ...defaultSettings,
      type
    }));
  };

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">SVG 动态噪点</h1>
        <p className="text-sm text-muted-foreground">使用 SVG feTurbulence 滤镜生成动态噪点效果</p>
      </div>

      <div className='flex flex-col gap-8 items-center'>
        <div className="flex gap-8 items-start">
          <div className="w-[280px] space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">噪点类型</span>
                </div>
                <Select
                  value={settings.type}
                  onValueChange={(value: 'fractalNoise' | 'turbulence') => handleTypeChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOISE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">基础频率</span>
                  <span className="text-sm text-muted-foreground">
                    {settings.frequency.toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={0.001}
                  max={0.05}
                  step={0.001}
                  value={[settings.frequency]}
                  onValueChange={([frequency]) => {
                    setSettings(prev => ({ ...prev, frequency }));
                  }}
                />
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
                  <span className="text-sm font-medium">动画速度</span>
                  <span className="text-sm text-muted-foreground">
                    {settings.speed}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[settings.speed]}
                  onValueChange={([speed]) => {
                    setSettings(prev => ({ ...prev, speed }));
                  }}
                />
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
                  ref={turbulenceRef}
                  type={settings.type}
                  baseFrequency={settings.frequency}
                  numOctaves={settings.numOctaves}
                  seed="0"
                />
              </filter>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#ffffff"
              filter="url(#noise)"
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