import wordsData from "../../data/words.json";
import themesData from "../../data/themes.json";

export interface ThemeWordPair {
  theme: string;
  word: string;
}

export class ThemeWordPairGenerator {
  private words: string[];
  private themes: string[];
  private usedPairs: Set<string> = new Set();

  constructor() {
    this.words = wordsData as string[];
    this.themes = themesData as string[];
  }

  private createPairKey(theme: string, word: string): string {
    return `${theme}|${word}`;
  }

  getRandomPair(): ThemeWordPair | null {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const themeIndex = Math.floor(Math.random() * this.themes.length);
      const wordIndex = Math.floor(Math.random() * this.words.length);
      
      const theme = this.themes[themeIndex];
      const word = this.words[wordIndex];
      const pairKey = this.createPairKey(theme, word);

      if (!this.usedPairs.has(pairKey)) {
        this.usedPairs.add(pairKey);
        return { theme, word };
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
export const themeWordPairGenerator = new ThemeWordPairGenerator();