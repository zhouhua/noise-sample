import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface DemoItem {
  title: string;
  description: string;
  href: string;
}

const demos: DemoItem[] = [
  {
    title: "Perlin 噪音",
    description: "使用 Perlin 噪音算法生成随机的灰度图案",
    href: "/perlin"
  },
  {
    title: "分形噪点",
    description: "基于 Perlin 噪音叠加生成更丰富的分形纹理",
    href: "/fractal"
  },
  {
    title: "SVG 分形噪点",
    description: "使用 SVG feTurbulence 滤镜生成分形噪点效果",
    href: "/svg-fractal"
  },
  {
    title: "SVG 湍流噪点",
    description: "使用 SVG feTurbulence 滤镜生成湍流噪点效果",
    href: "/svg-turbulence"
  },
  {
    title: "SVG 噪点",
    description: "使用 SVG feTurbulence 滤镜生成基础噪点效果",
    href: "/noise"
  },
  {
    title: "SVG 毛玻璃",
    description: "使用 SVG feTurbulence 滤镜生成毛玻璃效果",
    href: "/frosted-glass"
  },
  {
    title: "SVG 动态噪点",
    description: "使用 SVG feTurbulence 滤镜生成动态噪点效果",
    href: "/animated-noise"
  }
  // 在这里可以添加更多的演示项目
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-8">
      <div className="max-w-4xl w-full px-8">
        <h1 className="text-4xl font-bold mb-8">演示项目集</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {demos.map((demo) => (
            <Link key={demo.href} href={demo.href}>
              <Card className="h-full hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle>{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
