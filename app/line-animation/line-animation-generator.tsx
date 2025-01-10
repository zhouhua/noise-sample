'use client';

import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Chrome } from '@uiw/react-color';
import { useLanguage } from '@/i18n/context';
import { t as translate } from '@/i18n';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

interface Settings {
  frequency: number;
  scale: number;
  lineColor: string;
  lineWidth: number;
  animationSpeed: number;
  direction: 'horizontal' | 'vertical';
}

// 添加 ease 函数
const easeInOutSine = (x: number): number => {
  return -(Math.cos(Math.PI * x) - 1) / 2;
};

export default function LineAnimationGenerator() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<Settings>({
    frequency: 0.01,
    scale: 25,
    lineColor: '#000000',
    lineWidth: 4,
    animationSpeed: 1,
    direction: 'horizontal'
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [seed, setSeed] = useState(0);
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [progress, setProgress] = useState(0); // 0 到 1 的进度值
  const [animationDirection, setAnimationDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let pauseTimeout: NodeJS.Timeout;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      // 更新 seed 值
      setSeed(prev => prev + (deltaTime * 0.02 * settings.animationSpeed));

      // 更新动画进度
      setProgress(prev => {
        const step = (deltaTime * 0.0005 * settings.animationSpeed);
        const nextValue = (prev + step) % 2; // 使用 % 2 来创建循环
        return nextValue;
      });

      // 根据进度计算当前频率
      const normalizedProgress = progress < 1
        ? progress  // 0 到 1：频率从 0 增加到最大值
        : 2 - progress;  // 1 到 2：频率从最大值减少到 0

      setCurrentFrequency(settings.frequency * easeInOutSine(normalizedProgress));

      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
      }
    };
  }, [settings.animationSpeed, settings.frequency, progress]);

  const isHorizontal = settings.direction === 'horizontal';

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{translate('lineAnimation.title', language)}</h1>
        <p className="text-sm text-muted-foreground">{translate('lineAnimation.description', language)}</p>
      </div>

      <div className="flex gap-8 items-start">
        <div className="w-[280px] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('lineAnimation.direction', language)}</span>
            </div>
            <RadioGroup
              value={settings.direction}
              onValueChange={(value: 'horizontal' | 'vertical') => {
                setSettings(prev => ({ ...prev, direction: value }));
              }}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="horizontal" id="horizontal" />
                <Label htmlFor="horizontal">{translate('lineAnimation.horizontalLine', language)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vertical" id="vertical" />
                <Label htmlFor="vertical">{translate('lineAnimation.verticalLine', language)}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('lineAnimation.frequency', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.frequency.toFixed(3)}
              </span>
            </div>
            <Slider
              min={0.001}
              max={0.05}
              step={0.001}
              value={[settings.frequency]}
              onValueChange={([frequency]) => setSettings(prev => ({ ...prev, frequency }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('lineAnimation.scale', language)}</span>
              <span className="text-sm text-muted-foreground">{settings.scale}</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[settings.scale]}
              onValueChange={([scale]) => setSettings(prev => ({ ...prev, scale }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('lineAnimation.lineWidth', language)}</span>
              <span className="text-sm text-muted-foreground">{settings.lineWidth}px</span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[settings.lineWidth]}
              onValueChange={([lineWidth]) => setSettings(prev => ({ ...prev, lineWidth }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('lineAnimation.animationSpeed', language)}</span>
              <span className="text-sm text-muted-foreground">{settings.animationSpeed}x</span>
            </div>
            <Slider
              min={0}
              max={5}
              step={0.1}
              value={[settings.animationSpeed]}
              onValueChange={([animationSpeed]) => setSettings(prev => ({ ...prev, animationSpeed }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('lineAnimation.lineColor', language)}</span>
            </div>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center gap-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <span>{settings.lineColor}</span>
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: settings.lineColor }}
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
                      color={settings.lineColor}
                      onChange={(color) => {
                        setSettings(prev => ({
                          ...prev,
                          lineColor: color.hex
                        }));
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-[400px] h-[400px] border border-border rounded-lg flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter
                id={`noise-${seed}`}
                x={isHorizontal ? 0 : -200}
                y={isHorizontal ? -200 : 0}
                width={400}
                height={400}
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={currentFrequency}
                  numOctaves="1"
                  seed={seed}
                  result="turbulence"
                  stitchTiles="noStitch"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="turbulence"
                  scale={settings.scale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>

            <rect
              x={isHorizontal ? "0" : `${200 - settings.lineWidth / 2}`}
              y={isHorizontal ? `${200 - settings.lineWidth / 2}` : "0"}
              width={isHorizontal ? "400" : `${settings.lineWidth}`}
              height={isHorizontal ? `${settings.lineWidth}` : "400"}
              fill={settings.lineColor}
              filter={`url(#noise-${seed})`}
            />
          </svg>
        </div>
      </div>
    </main>
  );
} 