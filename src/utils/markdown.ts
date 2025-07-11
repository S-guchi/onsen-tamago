interface Response {
  theme: string;
  word: string;
  userInput: string;
  timestamp: number;
}

export function buildMarkdown(responses: Response[]): string {
  const date = new Date();
  const dateString = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let markdown = `# 温泉卵ブレスト結果\n\n`;
  markdown += `**実施日時:** ${dateString}\n`;
  markdown += `**セッション時間:** 5分\n`;
  markdown += `**回答数:** ${responses.length}件\n\n`;
  
  if (responses.length === 0) {
    markdown += `回答がありませんでした。\n`;
    return markdown;
  }

  markdown += `## アイデア一覧\n\n`;
  markdown += `| No. | テーマ × 単語 | アイデア |\n`;
  markdown += `|-----|-------------|----------|\n`;

  responses.forEach((response, index) => {
    const themePair = `${response.theme} × ${response.word}`;
    const idea = response.userInput.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
    markdown += `| ${index + 1} | ${themePair} | ${idea} |\n`;
  });

  markdown += `\n## 統計\n\n`;
  markdown += `- 表示されたテーマ×単語ペア数: ${responses.length}\n`;
  markdown += `- 平均回答時間: 約${Math.round(300 / responses.length)}秒/回答\n`;
  
  // 最も多く使われたテーマ・単語を分析
  const themeCount = new Map<string, number>();
  const wordCount = new Map<string, number>();
  responses.forEach(response => {
    themeCount.set(response.theme, (themeCount.get(response.theme) || 0) + 1);
    wordCount.set(response.word, (wordCount.get(response.word) || 0) + 1);
  });
  
  if (themeCount.size > 0) {
    const sortedThemes = Array.from(themeCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    markdown += `- よく出現したテーマ: ${sortedThemes.map(([theme, count]) => `${theme}(${count}回)`).join(', ')}\n`;
  }
  
  if (wordCount.size > 0) {
    const sortedWords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    markdown += `- よく出現した単語: ${sortedWords.map(([word, count]) => `${word}(${count}回)`).join(', ')}\n`;
  }

  markdown += `\n---\n\n`;
  markdown += `*温泉卵ブレストで生成*\n`;

  return markdown;
}