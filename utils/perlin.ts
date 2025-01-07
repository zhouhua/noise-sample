class PerlinNoise {
  private permutation: number[] = [];

  constructor() {
    // 创建一个包含0-255的数组
    const p: number[] = Array.from({ length: 256 }, (_, i) => i);

    // Fisher-Yates 随机打乱算法
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }

    // 复制数组以获得512个值
    this.permutation = [...p, ...p];
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;

    return this.lerp(
      v,
      this.lerp(
        u,
        this.grad(this.permutation[A], x, y),
        this.grad(this.permutation[B], x - 1, y)
      ),
      this.lerp(
        u,
        this.grad(this.permutation[A + 1], x, y - 1),
        this.grad(this.permutation[B + 1], x - 1, y - 1)
      )
    ) * 0.5 + 0.5;
  }
}

export default PerlinNoise; 