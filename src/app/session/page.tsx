"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCountdown } from "@/hooks/useCountdown";
import { themeWordPairGenerator } from "@/utils/wordPair";

interface Response {
  theme: string;
  word: string;
  userInput: string;
  timestamp: number;
}

function SessionPageContent() {
  const [userInput, setUserInput] = useState("");
  const [currentPair, setCurrentPair] = useState<{theme: string, word: string}>({theme: "読み込み中", word: "..."});
  const [pairCount, setPairCount] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [sessionMinutes, setSessionMinutes] = useState(5);
  const [sessionSeconds, setSessionSeconds] = useState(300);
  const { isFinished, start, formatTime } = useCountdown(sessionSeconds);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 次のテーマ×単語ペアを生成
  const generateNextPair = () => {
    const pair = themeWordPairGenerator.getRandomPair();
    if (pair) {
      setCurrentPair({theme: pair.theme, word: pair.word});
      setPairCount(themeWordPairGenerator.getUsedPairsCount());
    }
  };

  // 初回ロード時に時間パラメータを取得してセッション設定
  useEffect(() => {
    const minutesParam = searchParams.get('minutes');
    const minutes = minutesParam ? parseInt(minutesParam) : 5;
    const seconds = minutes * 60;
    
    setSessionMinutes(minutes);
    setSessionSeconds(seconds);
    generateNextPair();
  }, [searchParams]);

  // セッション開始時に自動でタイマーを開始
  useEffect(() => {
    if (sessionSeconds > 0) {
      start();
    }
  }, [start, sessionSeconds]);

  // タイマー完了時にresultページに遷移
  useEffect(() => {
    if (isFinished) {
      // セッション結果をsessionStorageに保存
      const sessionData = {
        responses,
        sessionMinutes
      };
      sessionStorage.setItem('brainstormResults', JSON.stringify(sessionData));
      router.push("/result");
    }
  }, [isFinished, router, responses, sessionMinutes]);


  // レスポンス配列の変更をコンソールで確認
  useEffect(() => {
    console.log("現在のresponses:", responses);
  }, [responses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      // レスポンスを保存
      const newResponse: Response = {
        theme: currentPair.theme,
        word: currentPair.word,
        userInput: userInput.trim(),
        timestamp: Date.now()
      };
      setResponses(prev => [...prev, newResponse]);
      
      console.log("入力:", userInput, "テーマ:", currentPair.theme, "単語:", currentPair.word);
      setUserInput("");
      // 手動で送信した場合は即座に次のペアを表示
      generateNextPair();
    }
  };

  const handleSkip = () => {
    console.log("スキップ");
    // 手動でスキップした場合は即座に次のペアを表示
    generateNextPair();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* ヘッダー - 残り時間 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="text-2xl font-bold text-orange-900">
              残り時間: {formatTime()}
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 左側: 温泉卵キャラクター */}
          <div className="flex-shrink-0 lg:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <Image
                  src="/onsen-tamago.png"
                  alt="温泉卵"
                  width={150}
                  height={150}
                  className="drop-shadow-md"
                />
              </div>
              
              {/* 吹き出し */}
              <div className="relative bg-orange-100 rounded-lg p-4 mt-4">
                <div className="absolute -top-2 left-6 w-4 h-4 bg-orange-100 transform rotate-45"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-900 mb-2">
                    このテーマと単語で何を思い浮かべる？
                  </div>
                  <div className="text-2xl font-bold text-orange-700">
                    {currentPair.theme} × {currentPair.word}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側: 入力エリア */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                思い浮かんだアイデアを入力してください
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="アイデアを入力... (Shift+Enter で送信、Enter で改行)"
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    送信 (Shift+Enter)
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    スキップ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 進捗インジケーター */}
        <div className="mt-8 text-center text-gray-600">
          <div className="text-sm">
            ペア数: {pairCount} / 150+ 予定 | 回答数: {responses.length}
          </div>
        </div>

        {/* 開発用: 最新の回答を表示 */}
        {responses.length > 0 && (
          <div className="mt-4 bg-white/50 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="text-sm font-bold text-gray-700 mb-2">最新の回答:</h3>
            <div className="text-xs text-gray-600">
              <div>「{responses[responses.length - 1].theme} × {responses[responses.length - 1].word}」</div>
              <div className="mt-1 font-semibold">→ {responses[responses.length - 1].userInput}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="text-lg text-gray-700">読み込み中...</div>
    </div>}>
      <SessionPageContent />
    </Suspense>
  );
}