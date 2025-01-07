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
  }
  // 在这里可以添加更多的演示项目
];

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-4xl mx-auto">
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
