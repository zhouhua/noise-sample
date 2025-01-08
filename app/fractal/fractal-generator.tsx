'use client';

import { useEffect, useRef, useState } from 'react';
import PerlinNoise from '@/utils/perlin';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Settings {
  scale: number;
  size: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
}

export default function FractalGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings, setSettings] = useState<Settings>({
    scale: 0.02,
    size: 400,
    octaves: 4,
    persistence: 0.5,
    lacunarity: 2,
  });

  const generateFractalNoise = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const perlin = new PerlinNoise();
    const imageData = ctx.createImageData(settings.size, settings.size);

    for (let x = 0; x < settings.size; x++) {
      for (let y = 0; y < settings.size; y++) {
        let amplitude = 1;
        let frequency = 1;
        let noiseValue = 0;
        let amplitudeSum = 0;

        // 叠加多个不同频率的噪声
        for (let i = 0; i < settings.octaves; i++) {
          const sampleX = x * settings.scale * frequency;
          const sampleY = y * settings.scale * frequency;

          noiseValue += perlin.noise(sampleX, sampleY) * amplitude;
          amplitudeSum += amplitude;

          amplitude *= settings.persistence;
          frequency *= settings.lacunarity;
        }

        // 归一化噪声值
        noiseValue = noiseValue / amplitudeSum;
        const color = Math.floor((noiseValue + 1) * 0.5 * 255);

        const index = (y * settings.size + x) * 4;
        imageData.data[index] = color;     // R
        imageData.data[index + 1] = color; // G
        imageData.data[index + 2] = color; // B
        imageData.data[index + 3] = 255;   // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    generateFractalNoise();
  }, [settings]);

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">分形噪点生成器</h1>
        <p className="text-sm text-muted-foreground">调整参数来生成不同的分形噪点图案</p>
      </div>

      <div className="flex gap-8 items-start">
        <div className="w-[280px] space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">基础缩放</span>
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
                <span className="text-sm font-medium">叠加次数</span>
                <span className="text-sm text-muted-foreground">
                  {settings.octaves}
                </span>
              </div>
              <Slider
                min={1}
                max={8}
                step={1}
                value={[settings.octaves]}
                onValueChange={([octaves]) => setSettings(prev => ({
                  ...prev,
                  octaves
                }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">持续度</span>
                <span className="text-sm text-muted-foreground">
                  {settings.persistence.toFixed(2)}
                </span>
              </div>
              <Slider
                min={0.1}
                max={1}
                step={0.05}
                value={[settings.persistence]}
                onValueChange={([persistence]) => setSettings(prev => ({
                  ...prev,
                  persistence
                }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">频率增长</span>
                <span className="text-sm text-muted-foreground">
                  {settings.lacunarity.toFixed(2)}
                </span>
              </div>
              <Slider
                min={1.1}
                max={4}
                step={0.1}
                value={[settings.lacunarity]}
                onValueChange={([lacunarity]) => setSettings(prev => ({
                  ...prev,
                  lacunarity
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
            onClick={generateFractalNoise}
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