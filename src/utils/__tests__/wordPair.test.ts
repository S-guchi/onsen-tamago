import { ThemeWordPairGenerator } from "../wordPair";

describe("ThemeWordPairGenerator", () => {
  let generator: ThemeWordPairGenerator;

  beforeEach(() => {
    generator = new ThemeWordPairGenerator();
  });

  test("should generate a valid theme-word pair", () => {
    const pair = generator.getRandomPair();
    expect(pair).not.toBeNull();
    expect(pair?.theme).toBeDefined();
    expect(pair?.word).toBeDefined();
    expect(typeof pair?.theme).toBe('string');
    expect(typeof pair?.word).toBe('string');
  });

  test("should generate non-duplicate pairs", () => {
    const pairs = new Set<string>();
    
    // 50ペア生成して重複チェック
    for (let i = 0; i < 50; i++) {
      const pair = generator.getRandomPair();
      if (pair) {
        const pairKey = `${pair.theme}|${pair.word}`;
        expect(pairs.has(pairKey)).toBe(false);
        pairs.add(pairKey);
      }
    }
    
    expect(pairs.size).toBe(50);
    expect(generator.getUsedPairsCount()).toBe(50);
  });

  test("should reset used pairs", () => {
    // いくつかのペアを生成
    for (let i = 0; i < 10; i++) {
      generator.getRandomPair();
    }
    
    expect(generator.getUsedPairsCount()).toBe(10);
    
    generator.reset();
    expect(generator.getUsedPairsCount()).toBe(0);
  });

  test("should handle exhaustion gracefully", () => {
    // 大量のペアを生成して枯渇状態をテスト
    let pairCount = 0;
    let pair = generator.getRandomPair();
    
    while (pair && pairCount < 1000) {
      pairCount++;
      pair = generator.getRandomPair();
    }
    
    // 少なくともいくつかのペアは生成されるべき
    expect(pairCount).toBeGreaterThan(0);
  });
});