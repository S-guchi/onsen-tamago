"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildMarkdown } from "@/utils/markdown";

interface Response {
  wordPair: [string, string];
  userInput: string;
  timestamp: number;
}

export default function ResultPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // sessionStorageからデータを取得
    const savedResults = sessionStorage.getItem('brainstormResults');
    if (savedResults) {
      try {
        const parsedResponses = JSON.parse(savedResults);
        setResponses(parsedResponses);
        setMarkdown(buildMarkdown(parsedResponses));
      } catch (error) {
        console.error('結果の読み込みに失敗しました:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleBackToHome = () => {
    // sessionStorageをクリア
    sessionStorage.removeItem('brainstormResults');
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="text-lg text-gray-700">結果を読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-4">
            🎉 お疲れ様でした！
          </h1>
          <p className="text-lg text-gray-700">
            5分間のブレインストーミングが完了しました
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">結果サマリー</h2>
            <div className="text-sm text-gray-600">
              {responses.length}件の回答
            </div>
          </div>

          {responses.length > 0 ? (
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="border-l-4 border-orange-300 pl-4">
                  <div className="text-sm text-gray-600 mb-1">
                    {index + 1}. {response.wordPair[0]} × {response.wordPair[1]}
                  </div>
                  <div className="text-gray-800 font-medium">
                    {response.userInput}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              回答がありませんでした
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Markdown出力</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {markdown}
            </pre>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              onClick={() => {/* TODO: コピー機能 */}}
            >
              📋 Markdownをコピー
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              onClick={() => {/* TODO: PNG出力機能 */}}
            >
              📸 PNG出力
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleBackToHome}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}