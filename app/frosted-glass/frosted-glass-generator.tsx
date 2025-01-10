'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from '@/i18n/context';
import { t as translate } from '@/i18n';

interface Settings {
  frequencyX: number;
  frequencyY: number;
  numOctaves: number;
  displayMode: 'clip' | 'normal';  // clip: 截断模式, normal: 正常模式
  intensity: number;  // 0-100 的百分比值
  isEnabled: boolean; // 将开关也加入配置
  scale: number;  // 新增位移比例配置
}

export default function FrostedGlassGenerator() {
  const { language } = useLanguage();
  const [imageUrl, setImageUrl] = useState<string>('/demo.jpg');
  const [imageDimensions, setImageDimensions] = useState({ width: 640, height: 640 });
  const [settings, setSettings] = useState<Settings>({
    frequencyX: 0.1,
    frequencyY: 0.4,
    numOctaves: 8,
    displayMode: 'normal',
    intensity: 0,  // 默认值改为 50%
    isEnabled: true,
    scale: 20,    // 默认值
  });

  // 获取图片尺寸
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let width = Math.min(640, img.width);
      let height = width / aspectRatio;
      setImageDimensions({ width, height });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  });

  const viewBoxDimensions = useMemo(() => {
    const { width, height } = imageDimensions;
    const w = 100 + (width - 100) * settings.intensity / 100;
    return { width: w, height: height * w / width };
  }, [imageDimensions, settings.intensity]);

  const imageStyles = useMemo(() => {
    const { width, height } = viewBoxDimensions;
    if (settings.displayMode === 'clip') {
      return {
        x: -settings.scale / 2,
        y: -settings.scale / 2,
        width: width + settings.scale,
        height: height + settings.scale
      };
    }

    return {
      x: 0,
      y: 0,
      width: width,
      height: height
    };
  }, [settings.displayMode, viewBoxDimensions, settings.scale]);

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{translate('frostedGlass.title', language)}</h1>
        <p className="text-sm text-muted-foreground">{translate('frostedGlass.description', language)}</p>
      </div>

      <div className="w-full max-w-[640px] flex flex-col items-center space-y-8 px-4">
        <div
          {...getRootProps()}
          className={cn(
            "w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? 'border-primary bg-accent/50' : 'border-border hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>{translate('frostedGlass.dropHint', language)}</p>
          ) : (
            <p>{translate('frostedGlass.uploadHint', language)}</p>
          )}
        </div>

        <div className="w-[280px] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('frostedGlass.switch', language)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="frosted-glass"
                checked={settings.isEnabled}
                onCheckedChange={(isEnabled) => setSettings(prev => ({ ...prev, isEnabled }))}
              />
              <Label htmlFor="frosted-glass">{translate('frostedGlass.enableEffect', language)}</Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('frostedGlass.intensity', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.intensity}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[settings.intensity]}
              onValueChange={([intensity]) => {
                setSettings(prev => ({ ...prev, intensity }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('frostedGlass.frequencyX', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.frequencyX.toFixed(3)}
              </span>
            </div>
            <Slider
              min={0.01}
              max={1}
              step={0.01}
              value={[settings.frequencyX]}
              onValueChange={([frequencyX]) => {
                setSettings(prev => ({ ...prev, frequencyX }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('frostedGlass.frequencyY', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.frequencyY.toFixed(3)}
              </span>
            </div>
            <Slider
              min={0.01}
              max={1}
              step={0.01}
              value={[settings.frequencyY]}
              onValueChange={([frequencyY]) => {
                setSettings(prev => ({ ...prev, frequencyY }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('frostedGlass.octaves', language)}</span>
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
              <span className="text-sm font-medium">{translate('frostedGlass.scale', language)}</span>
              <span className="text-sm text-muted-foreground">
                {settings.scale}
              </span>
            </div>
            <Slider
              min={0}
              max={50}
              step={1}
              value={[settings.scale]}
              onValueChange={([scale]) => {
                setSettings(prev => ({ ...prev, scale }));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{translate('frostedGlass.displayMode', language)}</span>
            </div>
            <RadioGroup
              value={settings.displayMode}
              onValueChange={(value: 'clip' | 'normal') => {
                setSettings(prev => ({ ...prev, displayMode: value }));
              }}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clip" id="clip" />
                <Label htmlFor="clip">{translate('frostedGlass.clipMode', language)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">{translate('frostedGlass.normalMode', language)}</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div
          className="relative !mt-28"
          style={{ width: `${imageDimensions.width}px` }}
        >
          <svg
            width={imageDimensions.width}
            height={imageDimensions.height}
            className={cn(
              "overflow-visible",
              settings.displayMode === 'clip' ? 'overflow-hidden' : 'overflow-visible shadow-lg'
            )}
            viewBox={`0 0 ${viewBoxDimensions.width} ${viewBoxDimensions.height}`}
          >
            <defs>
              <filter
                id="noise"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feTurbulence
                  baseFrequency={`${settings.frequencyX} ${settings.frequencyY}`}
                  result="NOISE"
                  numOctaves={settings.numOctaves}
                  seed={Math.random()}
                  type="fractalNoise"
                  stitchTiles="noStitch"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="NOISE"
                  scale={settings.scale}
                  // xChannelSelector="G"
                  yChannelSelector="B"
                />
              </filter>
            </defs>
            <image
              filter={settings.isEnabled ? "url(#noise)" : undefined}
              href={imageUrl}
              {...imageStyles}
            />
          </svg>
        </div>
      </div>
    </main>
  );
} 