export default {
  common: {
    title: 'Demo Projects',
    language: 'Language',
    demos: {
      perlin: {
        title: 'Perlin Noise',
        description: 'Generate grayscale patterns using Perlin Noise algorithm'
      },
      fractal: {
        title: 'Fractal Noise',
        description: 'Generate rich fractal textures based on Perlin Noise'
      },
      svgFractal: {
        title: 'SVG Fractal',
        description: 'Generate fractal noise effect using SVG feTurbulence filter'
      },
      svgTurbulence: {
        title: 'SVG Turbulence',
        description: 'Generate turbulence noise effect using SVG feTurbulence filter'
      },
      noise: {
        title: 'SVG Noise',
        description: 'Generate basic noise effect using SVG feTurbulence filter'
      },
      frostedGlass: {
        title: 'SVG Frosted Glass',
        description: 'Generate frosted glass effect using SVG feTurbulence filter'
      },
      paperTexture: {
        title: 'SVG Paper Texture',
        description: 'Generate paper texture effect using SVG feTurbulence and feDiffuseLighting filters'
      },
      lineAnimation: {
        title: 'SVG Line Animation',
        description: 'Create line animation effect using SVG filters'
      }
    }
  },
  paper: {
    title: 'SVG Paper Texture Effect',
    description: 'Generate paper texture effect using SVG feTurbulence and feDiffuseLighting filters',
    frequency: 'Texture Frequency',
    octaves: 'Octaves',
    surfaceScale: 'Surface Scale',
    elevation: 'Light Elevation',
    azimuth: 'Light Azimuth',
    backgroundColor: 'Background Color',
  },
  frostedGlass: {
    title: 'SVG Frosted Glass Effect',
    description: 'Generate frosted glass effect using SVG feTurbulence filter',
    switch: 'Effect Switch',
    enableEffect: 'Enable Frosted Glass Effect',
    intensity: 'Intensity',
    frequencyX: 'X-axis Frequency',
    frequencyY: 'Y-axis Frequency',
    octaves: 'Octaves',
    displayMode: 'Display Mode',
    clipMode: 'Clip Mode',
    normalMode: 'Normal Mode',
    dropHint: 'Drop image here...',
    uploadHint: 'Click or drop image here to upload'
  },
  svgTurbulence: {
    title: 'SVG Turbulence Noise Effect',
    description: 'Generate turbulence noise effect using SVG feTurbulence filter',
    preset: 'Preset Effects',
    defaultEffect: 'Default Effect',
    fireEffect: 'Fire Effect',
    frequencyX: 'X-axis Base Frequency',
    frequencyY: 'Y-axis Base Frequency',
    octaves: 'Octaves',
    backgroundColor: 'Background Color',
    blendMode: 'Blend Mode',
    regenerate: 'Regenerate'
  },
  svgFractal: {
    title: 'SVG Fractal Noise Effect',
    description: 'Generate fractal noise effect using SVG feTurbulence filter',
    preset: 'Preset Effects',
    defaultEffect: 'Default Effect',
    cloudsEffect: 'Clouds Effect',
    terrainEffect: 'Terrain Effect',
    paperEffect: 'Paper Texture',
    frequency: 'Base Frequency',
    octaves: 'Octaves',
    backgroundColor: 'Background Color',
    blendMode: 'Blend Mode',
    regenerate: 'Regenerate'
  },
  lineAnimation: {
    title: 'SVG Line Animation Effect',
    description: 'Create line animation using SVG feTurbulence and feDisplacementMap filters',
    horizontalLine: 'Horizontal Line',
    verticalLine: 'Vertical Line',
    frequency: 'Noise Frequency',
    scale: 'Displacement Scale',
    lineColor: 'Line Color',
    lineWidth: 'Line Width',
    animationSpeed: 'Animation Speed',
    direction: 'Line Direction'
  },
  // ... 其他页面的翻译
} as const; 