export default {
  common: {
    title: '演示项目集',
    language: '语言',
    demos: {
      perlin: {
        title: 'Perlin 噪音',
        description: '使用 Perlin 噪音算法生成随机的灰度图案'
      },
      fractal: {
        title: '分形噪点',
        description: '基于 Perlin 噪音叠加生成更丰富的分形纹理'
      },
      svgFractal: {
        title: 'SVG 分形噪点',
        description: '使用 SVG feTurbulence 滤镜生成分形噪点效果'
      },
      svgTurbulence: {
        title: 'SVG 湍流噪点',
        description: '使用 SVG feTurbulence 滤镜生成湍流噪点效果'
      },
      noise: {
        title: 'SVG 噪点',
        description: '使用 SVG feTurbulence 滤镜生成基础噪点效果'
      },
      frostedGlass: {
        title: 'SVG 毛玻璃',
        description: '使用 SVG feTurbulence 滤镜生成毛玻璃效果'
      },
      paperTexture: {
        title: 'SVG 纸张纹理',
        description: '使用 SVG feTurbulence 和 feDiffuseLighting 滤镜生成纸张纹理效果'
      },
      lineAnimation: {
        title: 'SVG 线条动画',
        description: '使用 SVG 滤镜制作线条跳动动画效果'
      }
    }
  },
  paper: {
    title: 'SVG 纸张纹理效果',
    description: '使用 SVG feTurbulence 和 feDiffuseLighting 滤镜生成纸张纹理效果',
    frequency: '纹理频率',
    octaves: '叠加次数',
    surfaceScale: '纹理深度',
    elevation: '光源高度',
    azimuth: '光源角度',
    backgroundColor: '背景颜色',
  },
  frostedGlass: {
    title: 'SVG 毛玻璃效果',
    description: '使用 SVG feTurbulence 滤镜生成毛玻璃效果',
    switch: '效果开关',
    enableEffect: '启用毛玻璃效果',
    intensity: '密度',
    frequencyX: 'X轴频率',
    frequencyY: 'Y轴频率',
    octaves: '叠加次数',
    displayMode: '显示模式',
    clipMode: '截断模式',
    normalMode: '正常模式',
    dropHint: '拖放图片到这里...',
    uploadHint: '点击或拖放图片到这里上传',
    scale: '偏移系数',
  },
  svgTurbulence: {
    title: 'SVG 湍流噪点效果',
    description: '使用 SVG feTurbulence 滤镜生成湍流噪点效果',
    preset: '预设效果',
    defaultEffect: '默认效果',
    fireEffect: '火焰效果',
    frequencyX: 'X轴基础频率',
    frequencyY: 'Y轴基础频率',
    octaves: '叠加次数',
    backgroundColor: '背景颜色',
    blendMode: '混合模式',
    regenerate: '重新生成'
  },
  svgFractal: {
    title: 'SVG 分形噪点效果',
    description: '使用 SVG feTurbulence 滤镜生成分形噪点效果',
    preset: '预设效果',
    defaultEffect: '默认效果',
    cloudsEffect: '云雾效果',
    terrainEffect: '地形起伏',
    paperEffect: '纸张纹理',
    frequency: '基础频率',
    octaves: '叠加次数',
    backgroundColor: '背景颜色',
    blendMode: '混合模式',
    regenerate: '重新生成'
  },
  lineAnimation: {
    title: 'SVG 线条动画效果',
    description: '使用 SVG feTurbulence 和 feDisplacementMap 滤镜制作线条跳动动画',
    horizontalLine: '水平线条',
    verticalLine: '垂直线条',
    frequency: '噪声频率',
    scale: '位移幅度',
    lineColor: '线条颜色',
    lineWidth: '线条宽度',
    animationSpeed: '动画速度',
    direction: '线条方向'
  },
  // ... 其他页面的翻译
} as const; 