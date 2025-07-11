interface Response {
  wordPair: [string, string];
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
  markdown += `| No. | 単語ペア | アイデア |\n`;
  markdown += `|-----|----------|----------|\n`;

  responses.forEach((response, index) => {
    const wordPair = `${response.wordPair[0]} × ${response.wordPair[1]}`;
    const idea = response.userInput.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
    markdown += `| ${index + 1} | ${wordPair} | ${idea} |\n`;
  });

  markdown += `\n## 統計\n\n`;
  markdown += `- 表示された単語ペア数: ${responses.length}\n`;
  markdown += `- 平均回答時間: 約${Math.round(300 / responses.length)}秒/回答\n`;
  
  // 最も多く使われた単語を分析
  const wordCount = new Map<string, number>();
  responses.forEach(response => {
    response.wordPair.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
  });
  
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