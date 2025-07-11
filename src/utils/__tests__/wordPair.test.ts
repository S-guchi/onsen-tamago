import { WordPairGenerator } from "../wordPair";

describe("WordPairGenerator", () => {
  let generator: WordPairGenerator;

  beforeEach(() => {
    generator = new WordPairGenerator();
  });

  test("should generate a valid word pair", () => {
    const pair = generator.getRandomPair();
    expect(pair).not.toBeNull();
    expect(pair?.word1).toBeDefined();
    expect(pair?.word2).toBeDefined();
    expect(pair?.word1).not.toBe(pair?.word2);
  });

  test("should generate non-duplicate pairs", () => {
    const pairs = new Set<string>();
    
    // 50ペア生成して重複チェック
    for (let i = 0; i < 50; i++) {
      const pair = generator.getRandomPair();
      if (pair) {
        const pairKey = [pair.word1, pair.word2].sort().join("|");
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