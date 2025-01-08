'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Chrome } from '@uiw/react-color';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from "@/components/ui/copy-button";

interface Settings {
  baseFrequency: number | string;
  numOctaves: number;
  seed: number;
  backgroundColor: string;
  blendMode: string;
  preset: string;
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

const presets = {
  default: {
    baseFrequency: 0.02,
    numOctaves: 4,
    backgroundColor: '#ffffff',
    blendMode: 'multiply',
  },
  clouds: {
    baseFrequency: 0.01,
    numOctaves: 5,
    backgroundColor: '#bfdbfe',
    blendMode: 'soft-light',
  },
  terrain: {
    baseFrequency: 0.008,
    numOctaves: 8,
    backgroundColor: '#e5e7eb',
    blendMode: 'multiply',
  },
  paper: {
    baseFrequency: 0.04,
    numOctaves: 5,
    backgroundColor: '#fffbeb',
    blendMode: 'normal',
  }
};

interface FilterOperation {
  type: keyof SVGElementTagNameMap;
  attrs?: Record<string, string | number>;
  children?: FilterOperation[];
}

interface FilterConfig {
  id: string;
  attrs?: Record<string, string>;
  operations: FilterOperation[];
}

const getFilterConfig = (settings: Settings): FilterConfig => {
  const baseConfig = {
    id: 'noise',
    operations: [
      {
        type: 'feTurbulence',
        attrs: {
          type: 'fractalNoise',
          baseFrequency: settings.baseFrequency,
          numOctaves: settings.numOctaves,
          seed: settings.seed,
          stitchTiles: 'noStitch'
        }
      }
    ]
  };

  const configs: Record<string, FilterConfig> = {
    clouds: {
      ...baseConfig,
      operations: [
        {
          type: 'feTurbulence',
          attrs: {
            type: 'fractalNoise',
            baseFrequency: settings.baseFrequency,
            numOctaves: settings.numOctaves,
            seed: settings.seed,
            stitchTiles: 'stitch',
            result: 'noise'
          }
        },
        {
          type: 'feColorMatrix',
          attrs: {
            in: 'noise',
            type: 'matrix',
            values: `0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1.2 0.2`,
            result: 'cloudOpacity'
          }
        },
        {
          type: 'feBlend',
          attrs: {
            mode: settings.blendMode,
            in2: 'SourceGraphic'
          }
        }
      ]
    },
    terrain: {
      ...baseConfig,
      attrs: {
        x: '-20%',
        y: '-20%',
        width: '140%',
        height: '140%'
      },
      operations: [
        {
          type: 'feTurbulence',
          attrs: {
            type: 'fractalNoise',
            baseFrequency: settings.baseFrequency,
            numOctaves: settings.numOctaves,
            seed: settings.seed,
            stitchTiles: 'stitch',
            result: 'noise'
          }
        },
        {
          type: 'feGaussianBlur',
          attrs: {
            in: 'noise',
            stdDeviation: '0.5',
            result: 'blurredNoise'
          }
        },
        {
          type: 'feColorMatrix',
          attrs: {
            in: 'blurredNoise',
            type: 'matrix',
            values: `0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0 0 0 3 -0.6`,
            result: 'contrast'
          }
        },
        {
          type: 'feDiffuseLighting',
          attrs: {
            in: 'contrast',
            lightingColor: '#ffffff',
            surfaceScale: '20',
            diffuseConstant: '1.5',
            result: 'lighting'
          },
          children: [
            {
              type: 'feDistantLight',
              attrs: {
                azimuth: '135',
                elevation: '25'
              }
            }
          ]
        },
        {
          type: 'feComposite',
          attrs: {
            operator: 'arithmetic',
            k1: '2',
            k2: '0.5',
            k3: '0',
            k4: '0',
            in: 'lighting',
            in2: 'contrast',
            result: 'terrain'
          }
        },
        {
          type: 'feBlend',
          attrs: {
            mode: settings.blendMode,
            in2: 'SourceGraphic'
          }
        }
      ]
    },
    paper: {
      ...baseConfig,
      operations: [
        {
          type: 'feTurbulence',
          attrs: {
            type: 'fractalNoise',
            baseFrequency: settings.baseFrequency,
            numOctaves: settings.numOctaves,
            seed: settings.seed,
            stitchTiles: 'stitch',
            result: 'noise'
          }
        },
        {
          type: 'feDiffuseLighting',
          attrs: {
            in: 'noise',
            lightingColor: '#ffffff',
            surfaceScale: '2',
            result: 'lighting'
          },
          children: [
            {
              type: 'feDistantLight',
              attrs: {
                azimuth: '45',
                elevation: '60',
              }
            },
          ]
        },
        {
          type: 'feBlend',
          attrs: { mode: settings.blendMode, in2: 'SourceGraphic' }
        }
      ]
    }
  };

  return configs[settings.preset] || baseConfig;
};

// 渲染滤镜的函数
const renderFilter = (config: FilterConfig) => {
  const renderOperation = (op: FilterOperation, index: number) => {
    const Element = op.type;
    if (op.children) {
      return (
        <Element key={`op-${index}`} {...op.attrs}>
          {op.children.map((child, i) => {
            const ChildElement = child.type;
            return <ChildElement key={`child-${index}-${i}`} {...child.attrs} />;
          })}
        </Element>
      );
    }
    return <Element key={`op-${index}`} {...op.attrs} />;
  };

  return (
    <filter id={config.id} {...config.attrs}>
      {config.operations.map((op, i) => renderOperation(op, i))}
    </filter>
  );
};

// 生成 SVG 代码的函数
const generateSvgCode = (config: FilterConfig, settings: Settings) => {
  const renderAttrs = (attrs?: Record<string, string | number>) => {
    if (!attrs) return '';
    return Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
  };

  const renderOperation = (op: FilterOperation, indent = 6) => {
    const spaces = ' '.repeat(indent);
    if (op.children) {
      return `${spaces}<${op.type} ${renderAttrs(op.attrs)}>\n` +
        op.children.map(child =>
          `${spaces}  <${child.type} ${renderAttrs(child.attrs)} />`
        ).join('\n') +
        `\n${spaces}</${op.type}>`;
    }
    return `${spaces}<${op.type} ${renderAttrs(op.attrs)} />`;
  };

  const filterContent = [
    `    <filter id="${config.id}"${config.attrs ? ' ' + renderAttrs(config.attrs) : ''}>`,
    config.operations.map(op => renderOperation(op)).join('\n'),
    '    </filter>'
  ].join('\n');

  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
${filterContent}
  </defs>
  <rect
    width="100%"
    height="100%"
    fill="${settings.backgroundColor}"
    filter="url(#${config.id})"
  />
</svg>`;
};

export default function SvgFractalGenerator() {
  const [settings, setSettings] = useState<Settings>({
    baseFrequency: 0.02,
    numOctaves: 4,
    seed: Math.floor(Math.random() * 1000),
    backgroundColor: '#ffffff',
    blendMode: 'normal',
    preset: 'default'
  });

  const [showColorPicker, setShowColorPicker] = useState(false);

  const regenerate = () => {
    setSettings(prev => ({
      ...prev,
      seed: Math.floor(Math.random() * 1000)
    }));
  };

  const handlePresetChange = (preset: string) => {
    const presetConfig = presets[preset as keyof typeof presets];
    setSettings(prev => ({
      ...prev,
      preset,
      baseFrequency: presetConfig.baseFrequency.toString(),
      numOctaves: presetConfig.numOctaves,
      backgroundColor: presetConfig.backgroundColor,
      blendMode: presetConfig.blendMode,
    }));
  };

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">SVG 分形噪点生成器</h1>
        <p className="text-sm text-muted-foreground">使用 SVG feTurbulence 滤镜生成分形噪点</p>
      </div>
      <div className='flex flex-col gap-8 items-center'>
        <div className="flex gap-8 items-start">
          <div className="w-[280px] space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">预设效果</span>
                </div>
                <Select
                  value={settings.preset}
                  onValueChange={handlePresetChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">默认效果</SelectItem>
                    <SelectItem value="clouds">云雾效果</SelectItem>
                    <SelectItem value="terrain">地形起伏</SelectItem>
                    <SelectItem value="paper">纸张纹理</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">基础频率</span>
                  <span className="text-sm text-muted-foreground">
                    {typeof settings.baseFrequency === 'number' ? settings.baseFrequency.toFixed(3) : settings.baseFrequency}
                  </span>
                </div>
                <Slider
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  value={[typeof settings.baseFrequency === 'number' ? settings.baseFrequency : 0.02]}
                  onValueChange={([baseFrequency]) => setSettings(prev => ({
                    ...prev,
                    baseFrequency
                  }))}
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
                  onValueChange={([numOctaves]) => setSettings(prev => ({
                    ...prev,
                    numOctaves
                  }))}
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
                  <span className="text-sm font-medium">混合模式</span>
                </div>
                <Select
                  value={settings.blendMode}
                  onValueChange={(mode) => setSettings(prev => ({
                    ...prev,
                    blendMode: mode
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

            <Button
              onClick={regenerate}
              className="w-full"
            >
              重新生成
            </Button>
          </div>

          <div>
            <svg
              width={400}
              height={400}
              className="border border-border rounded-lg"
            >
              <defs>
                {renderFilter(getFilterConfig(settings))}
              </defs>
              <rect
                width="100%"
                height="100%"
                fill={settings.backgroundColor}
                filter="url(#noise)"
              />
            </svg>
          </div>
        </div>
        <div className="w-[740px] rounded-lg overflow-hidden border border-border relative">
          <CopyButton value={generateSvgCode(getFilterConfig(settings), settings)} />
          <SyntaxHighlighter
            language="xml"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              padding: '1.5rem',
            }}
          >
            {generateSvgCode(getFilterConfig(settings), settings)}
          </SyntaxHighlighter>
        </div>
      </div>
    </main>
  );
} 