"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { buildMarkdown } from "@/utils/markdown";
import html2canvas from "html2canvas";

interface Response {
  theme: string;
  word: string;
  userInput: string;
  timestamp: number;
}

export default function ResultPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [sessionMinutes, setSessionMinutes] = useState(5);
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // sessionStorageからデータを取得
    const savedResults = sessionStorage.getItem('brainstormResults');
    if (savedResults) {
      try {
        const sessionData = JSON.parse(savedResults);
        // 新しい形式（オブジェクト）と古い形式（配列）の両方に対応
        if (Array.isArray(sessionData)) {
          // 古い形式の場合
          setResponses(sessionData);
          setSessionMinutes(5); // デフォルト値
          setMarkdown(buildMarkdown(sessionData, 5));
        } else {
          // 新しい形式の場合
          setResponses(sessionData.responses);
          setSessionMinutes(sessionData.sessionMinutes);
          setMarkdown(buildMarkdown(sessionData.responses, sessionData.sessionMinutes));
        }
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

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2秒後にリセット
    } catch (error) {
      console.error('コピーに失敗しました:', error);
      // フォールバック: テキストエリアを使用
      const textArea = document.createElement('textarea');
      textArea.value = markdown;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        console.error('フォールバックコピーも失敗しました:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCapturePNG = async () => {
    if (!captureRef.current) return;
    
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      // canvasをBlob形式に変換
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `温泉卵ブレスト結果_${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('PNG出力に失敗しました:', error);
    } finally {
      setIsCapturing(false);
    }
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
      <div className="max-w-4xl mx-auto" ref={captureRef}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-4">
            🎉 お疲れ様でした！
          </h1>
          <p className="text-lg text-gray-700">
            {sessionMinutes}分間のブレインストーミングが完了しました
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
                    {index + 1}. {response.theme} × {response.word}
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
              className={`${copySuccess ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold py-2 px-4 rounded transition-colors duration-200`}
              onClick={handleCopyMarkdown}
            >
              {copySuccess ? '✅ コピー完了！' : '📋 Markdownをコピー'}
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              onClick={handleCapturePNG}
              disabled={isCapturing}
            >
              {isCapturing ? '📸 出力中...' : '📸 PNG出力'}
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