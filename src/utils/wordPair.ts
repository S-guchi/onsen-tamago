import wordsData from "@/data/words.json";

export interface WordPair {
  word1: string;
  word2: string;
}

export class WordPairGenerator {
  private words: string[];
  private usedPairs: Set<string> = new Set();

  constructor() {
    this.words = wordsData as string[];
  }

  private createPairKey(word1: string, word2: string): string {
    // 順序に関係なく同じペアを識別するため、アルファベット順でソート
    return [word1, word2].sort().join("|");
  }

  getRandomPair(): WordPair | null {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const index1 = Math.floor(Math.random() * this.words.length);
      let index2 = Math.floor(Math.random() * this.words.length);
      
      // 同じ単語を避ける
      if (index1 === index2) {
        index2 = (index2 + 1) % this.words.length;
      }

      const word1 = this.words[index1];
      const word2 = this.words[index2];
      const pairKey = this.createPairKey(word1, word2);

      if (!this.usedPairs.has(pairKey)) {
        this.usedPairs.add(pairKey);
        return { word1, word2 };
      }

      attempts++;
    }

    // 最大試行回数に達した場合はnullを返す
    return null;
  }

  getUsedPairsCount(): number {
    return this.usedPairs.size;
  }

  reset(): void {
    this.usedPairs.clear();
  }
}

// シングルトンインスタンス
export const wordPairGenerator = new WordPairGenerator();