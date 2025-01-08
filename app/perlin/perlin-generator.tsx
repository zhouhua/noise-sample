'use client';

import { useEffect, useRef, useState } from 'react';
import PerlinNoise from '@/utils/perlin';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Settings {
  scale: number;
  size: number;
}

export default function PerlinGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings, setSettings] = useState<Settings>({
    scale: 0.02,
    size: 400,
  });

  const generateNoise = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const perlin = new PerlinNoise();
    const imageData = ctx.createImageData(settings.size, settings.size);

    for (let x = 0; x < settings.size; x++) {
      for (let y = 0; y < settings.size; y++) {
        const value = perlin.noise(x * settings.scale, y * settings.scale);
        const index = (y * settings.size + x) * 4;
        const color = Math.floor(value * 255);

        imageData.data[index] = color;     // R
        imageData.data[index + 1] = color; // G
        imageData.data[index + 2] = color; // B
        imageData.data[index + 3] = 255;   // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    generateNoise();
  }, [settings]);

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Perlin 噪音生成器</h1>
        <p className="text-sm text-muted-foreground">调整参数来生成不同的噪音图案</p>
      </div>

      <div className="flex gap-8 items-start">
        <div className="w-[280px] space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">缩放比例</span>
                <span className="text-sm text-muted-foreground">
                  {settings.scale.toFixed(3)}
                </span>
              </div>
              <Slider
                min={0.001}
                max={0.1}
                step={0.001}
                value={[settings.scale]}
                onValueChange={([scale]) => setSettings(prev => ({
                  ...prev,
                  scale
                }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">画布尺寸</span>
                <span className="text-sm text-muted-foreground">
                  {settings.size} x {settings.size}px
                </span>
              </div>
              <Slider
                min={200}
                max={800}
                step={50}
                value={[settings.size]}
                onValueChange={([size]) => setSettings(prev => ({
                  ...prev,
                  size
                }))}
              />
            </div>
          </div>

          <Button
            onClick={generateNoise}
            className="w-full"
          >
            重新生成
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          width={settings.size}
          height={settings.size}
          className="border border-border rounded-lg bg-card"
        />
      </div>
    </main>
  );
} 