'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Chrome } from '@uiw/react-color';
import { CopyButton } from "@/components/ui/copy-button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Settings {
  baseFrequencyX: number;
  baseFrequencyY: number;
  baseFrequency: number | string;
  numOctaves: number;
  seed: number;
  preset: string;
  backgroundColor: string;
  blendMode: string;
}

interface FilterConfig {
  id: string;
  attrs?: Record<string, string>;
  operations: Array<{
    type: string;
    attrs?: Record<string, string | number>;
    children?: Array<{
      type: string;
      attrs: Record<string, string | number>;
    }>;
  }>;
}

const presets = {
  default: {
    baseFrequencyX: 0.02,
    baseFrequencyY: 0.02,
    baseFrequency: 0.02,
    numOctaves: 4,
    backgroundColor: '#ffffff',
    blendMode: 'multiply',
  },
  fire: {
    baseFrequencyX: 0.009,
    baseFrequencyY: 0.001,
    baseFrequency: '0.009 0.001',
    numOctaves: 5,
    backgroundColor: '#ff4444',
    blendMode: 'screen',
  },
  smoke: {
    baseFrequencyX: 0.008,
    baseFrequencyY: 0.04,
    baseFrequency: '0.008 0.04',
    numOctaves: 5,
    backgroundColor: '#1f2937',
    blendMode: 'screen',
  },
  water: {
    baseFrequencyX: 0.015,
    baseFrequencyY: 0.015,
    baseFrequency: '0.015 0.015',
    numOctaves: 5,
    backgroundColor: '#0ea5e9',
    blendMode: 'multiply',
  },
  electricity: {
    baseFrequency: '0.05 0.005',
    numOctaves: 1,
    backgroundColor: '#6b21a8',
    blendMode: 'screen',
  },
  lightning: {
    baseFrequency: '0.005 0.2',
    numOctaves: 2,
    backgroundColor: '#1e3a8a',
    blendMode: 'screen',
  }
};

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

// 滤镜配置
const getFilterConfig = (settings: Settings): FilterConfig => {
  const baseConfig = {
    id: 'turbulence',
    operations: [
      {
        type: 'feTurbulence',
        attrs: {
          type: 'turbulence',
          baseFrequency: settings.baseFrequency,
          numOctaves: settings.numOctaves,
          seed: settings.seed,
          stitchTiles: 'stitch'
        }
      }
    ]
  };

  const configs: Record<string, FilterConfig> = {
    fire: {
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
            type: 'matrix',
            values: '4 0 0 0 -1 0 2 0 0 -0.5 0 0 0.5 0 -0.5 0 0 0 1 0',
            result: 'colorized'
          }
        },
        {
          type: 'feGaussianBlur',
          attrs: { stdDeviation: '3', result: 'blurred' }
        },
        {
          type: 'feDisplacementMap',
          attrs: {
            in: 'blurred',
            in2: 'noise',
            scale: '15',
            xChannelSelector: 'R',
            yChannelSelector: 'G',
            result: 'displaced'
          }
        },
        {
          type: 'feComposite',
          attrs: {
            operator: 'arithmetic',
            k1: '0.5',
            k2: '0.5',
            k3: '0',
            k4: '0',
            in: 'displaced',
            in2: 'blurred',
            result: 'composed'
          }
        },
        {
          type: 'feBlend',
          attrs: {
            mode: 'screen',
            in: 'composed',
            in2: 'SourceGraphic'
          }
        }
      ]
    },
    smoke: {
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
            type: 'matrix',
            values: '1.3 0 0 0 -0.15 0 1.3 0 0 -0.15 0 0 1.3 0 -0.15 0 0 0 0.7 -0.1',
            result: 'colored'
          }
        },
        {
          type: 'feGaussianBlur',
          attrs: {
            stdDeviation: '12',
            result: 'blurred'
          }
        },
        {
          type: 'feDisplacementMap',
          attrs: {
            in: 'blurred',
            in2: 'noise',
            scale: '40',
            xChannelSelector: 'R',
            yChannelSelector: 'G',
            result: 'displaced'
          }
        },
        {
          type: 'feComposite',
          attrs: {
            operator: 'arithmetic',
            k1: '1.2',
            k2: '0.3',
            k3: '-0.2',
            k4: '0',
            in: 'displaced',
            in2: 'noise',
            result: 'composed'
          }
        },
        {
          type: 'feGaussianBlur',
          attrs: {
            stdDeviation: '4',
            result: 'finalBlur'
          }
        },
        {
          type: 'feBlend',
          attrs: {
            mode: 'screen',
            in: 'finalBlur',
            in2: 'SourceGraphic'
          }
        }
      ]
    },
    water: {
      ...baseConfig,
      operations: [
        {
          type: 'feTurbulence',
          attrs: {
            type: 'turbulence',
            baseFrequency: settings.baseFrequency,
            numOctaves: settings.numOctaves,
            seed: settings.seed,
            stitchTiles: 'stitch',
            result: 'noise'
          }
        },
        {
          type: 'feDisplacementMap',
          attrs: {
            in: 'SourceGraphic',
            in2: 'noise',
            scale: '80',
            xChannelSelector: 'R',
            yChannelSelector: 'G',
            result: 'displaced'
          }
        },
        {
          type: 'feGaussianBlur',
          attrs: {
            stdDeviation: '1.5',
            result: 'blurred'
          }
        },
        {
          type: 'feDiffuseLighting',
          attrs: {
            in: 'blurred',
            surfaceScale: '10',
            diffuseConstant: '1.2',
            lightingColor: '#ffffff',
            result: 'diffuse'
          },
          children: [{
            type: 'feDistantLight',
            attrs: {
              azimuth: '45',
              elevation: '35'
            }
          }]
        },
        {
          type: 'feComposite',
          attrs: {
            operator: 'arithmetic',
            k1: '1',
            k2: '0.5',
            k3: '0.5',
            k4: '0',
            in: 'diffuse',
            in2: 'displaced',
            result: 'composed'
          }
        },
        {
          type: 'feColorMatrix',
          attrs: {
            type: 'matrix',
            values: '1 0 0 0 0 0 1 0 0 0 0 0 2 0 0 0 0 0 0.7 0',
            result: 'colored'
          }
        },
        {
          type: 'feBlend',
          attrs: {
            mode: 'multiply',
            in: 'colored',
            in2: 'SourceGraphic'
          }
        }
      ]
    },
    electricity: {
      ...baseConfig,
      operations: [
        {
          type: 'feTurbulence',
          attrs: {
            type: 'turbulence',
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
            type: 'matrix',
            values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 15 -6'
          }
        },
        {
          type: 'feGaussianBlur',
          attrs: { stdDeviation: '0.5', result: 'blurred' }
        },
        {
          type: 'feBlend',
          attrs: { mode: 'screen', in2: 'SourceGraphic' }
        }
      ]
    },
    lightning: {
      ...baseConfig,
      operations: [
        {
          type: 'feTurbulence',
          attrs: {
            type: 'turbulence',
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
            type: 'matrix',
            values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10'
          }
        },
        {
          type: 'feGaussianBlur',
          attrs: { stdDeviation: '0.3' }
        },
        {
          type: 'feBlend',
          attrs: { mode: 'screen', in2: 'SourceGraphic' }
        }
      ]
    }
  };

  return configs[settings.preset] || baseConfig;
};

const generateSvgCode = (config: FilterConfig, settings: Settings) => {
  const renderAttrs = (attrs?: Record<string, string | number>) => {
    if (!attrs) return '';
    return Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
  };

  const renderOperation = (op: FilterConfig['operations'][0], indent = 6) => {
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

// 渲染滤镜的函数
const renderFilter = (config: FilterConfig) => {
  const renderOperation = (op: FilterConfig['operations'][0], index: number) => {
    if (op.children) {
      return (
        <op.type key={`op-${index}`} {...op.attrs}>
          {op.children.map((child, i) => (
            <child.type key={`child-${index}-${i}`} {...child.attrs} />
          ))}
        </op.type>
      );
    }
    return <op.type key={`op-${index}`} {...op.attrs} />;
  };

  return (
    <filter id={config.id} {...config.attrs}>
      {config.operations.map((op, i) => renderOperation(op, i))}
    </filter>
  );
};

export default function SvgTurbulenceGenerator() {
  const [settings, setSettings] = useState<Settings>({
    baseFrequencyX: 0.02,
    baseFrequencyY: 0.02,
    baseFrequency: 0.02,
    numOctaves: 4,
    seed: Math.floor(Math.random() * 1000),
    preset: 'default',
    backgroundColor: '#ffffff',
    blendMode: 'multiply'
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
      baseFrequencyX: presetConfig.baseFrequencyX ||
        (typeof presetConfig.baseFrequency === 'string' ?
          parseFloat(presetConfig.baseFrequency.split(' ')[0]) :
          presetConfig.baseFrequency),
      baseFrequencyY: presetConfig.baseFrequencyY ||
        (typeof presetConfig.baseFrequency === 'string' ?
          parseFloat(presetConfig.baseFrequency.split(' ')[1]) :
          presetConfig.baseFrequency),
      baseFrequency: presetConfig.baseFrequency,
      numOctaves: presetConfig.numOctaves,
      backgroundColor: presetConfig.backgroundColor,
      blendMode: presetConfig.blendMode,
    }));
  };

  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">SVG 湍流噪点生成器</h1>
        <p className="text-sm text-muted-foreground">使用 SVG feTurbulence 滤镜生成湍流噪点</p>
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
                    <SelectItem value="fire">火焰效果</SelectItem>
                    {/* <SelectItem value="smoke">烟雾效果</SelectItem>
                    <SelectItem value="water">水波效果</SelectItem>
                    <SelectItem value="electricity">电流效果</SelectItem>
                    <SelectItem value="lightning">闪电效果</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">X 轴基础频率</span>
                  <span className="text-sm text-muted-foreground">
                    {settings.baseFrequencyX.toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={0.001}
                  max={1}
                  step={0.001}
                  value={[settings.baseFrequencyX]}
                  onValueChange={([baseFrequencyX]) => {
                    setSettings(prev => ({
                      ...prev,
                      baseFrequencyX,
                      baseFrequency: `${baseFrequencyX} ${prev.baseFrequencyY}`
                    }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Y 轴基础频率</span>
                  <span className="text-sm text-muted-foreground">
                    {settings.baseFrequencyY.toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={0.001}
                  max={1}
                  step={0.001}
                  value={[settings.baseFrequencyY]}
                  onValueChange={([baseFrequencyY]) => {
                    setSettings(prev => ({
                      ...prev,
                      baseFrequencyY,
                      baseFrequency: `${prev.baseFrequencyX} ${baseFrequencyY}`
                    }));
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
              filter="url(#turbulence)"
            />
          </svg>
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