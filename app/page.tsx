import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { t } from '@/i18n';
import { ClientTranslation } from '@/components/client-translation';

interface DemoItem {
  titleKey: string;
  descriptionKey: string;
  href: string;
}

const demos: DemoItem[] = [
  {
    titleKey: 'common.demos.perlin.title',
    descriptionKey: 'common.demos.perlin.description',
    href: "/perlin"
  },
  {
    titleKey: 'common.demos.fractal.title',
    descriptionKey: 'common.demos.fractal.description',
    href: "/fractal"
  },
  {
    titleKey: 'common.demos.svgFractal.title',
    descriptionKey: 'common.demos.svgFractal.description',
    href: "/svg-fractal"
  },
  {
    titleKey: 'common.demos.svgTurbulence.title',
    descriptionKey: 'common.demos.svgTurbulence.description',
    href: "/svg-turbulence"
  },
  {
    titleKey: 'common.demos.noise.title',
    descriptionKey: 'common.demos.noise.description',
    href: "/noise"
  },
  {
    titleKey: 'common.demos.frostedGlass.title',
    descriptionKey: 'common.demos.frostedGlass.description',
    href: "/frosted-glass"
  },
  {
    titleKey: 'common.demos.paperTexture.title',
    descriptionKey: 'common.demos.paperTexture.description',
    href: "/paper-texture"
  },
  {
    titleKey: 'common.demos.lineAnimation.title',
    descriptionKey: 'common.demos.lineAnimation.description',
    href: "/line-animation"
  },
  // 在这里可以添加更多的演示项目
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-8">
      <div className="max-w-4xl w-full px-8">
        <h1 className="text-4xl font-bold mb-8">
          <ClientTranslation textKey="common.title" />
        </h1>
        <div className="grid gap-4 md:grid-cols-2">
          {demos.map((demo) => (
            <Link key={demo.href} href={demo.href}>
              <Card className="h-full hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle>
                    <ClientTranslation textKey={demo.titleKey} />
                  </CardTitle>
                  <CardDescription>
                    <ClientTranslation textKey={demo.descriptionKey} />
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
