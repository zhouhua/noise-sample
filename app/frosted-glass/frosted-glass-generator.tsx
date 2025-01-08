'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function FrostedGlassGenerator() {
  const [imageUrl, setImageUrl] = useState<string>('/demo.jpg');
  const [isEnabled, setIsEnabled] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({ width: 640, height: 640 });

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

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">SVG 毛玻璃效果</h1>
        <p className="text-sm text-muted-foreground">使用 SVG feTurbulence 滤镜生成毛玻璃效果</p>
      </div>

      <div className="w-full max-w-[600] flex-col items-center space-y-8 px-4 ">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-accent/50' : 'border-border hover:border-primary/50'}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>拖放图片到这里...</p>
          ) : (
            <p>点击或拖放图片到这里上传</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="frosted-glass"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
          <Label htmlFor="frosted-glass">启用毛玻璃效果</Label>
        </div>

        <div
          className="relative w-full"
          style={{ maxWidth: `${imageDimensions.width}px` }}
        >
          <svg
            width={imageDimensions.width}
            height={imageDimensions.height}
            className='overflow-visible'
            viewBox={`0 0 100 ${imageDimensions.height / imageDimensions.width * 100}`}
          >
            <defs>
              <filter id="noise" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence baseFrequency="0.01 0.4" result="NOISE" numOctaves="2"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="20" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
              </filter>
            </defs>
            <image
              xlinkHref={imageUrl}
              x="0"
              y="0"
              width="100%"
              height="100%"
              filter={isEnabled ? "url(#noise)" : undefined}
            />
          </svg>
        </div>
      </div>
    </main>
  );
} 