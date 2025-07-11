"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/useCountdown";
import { wordPairGenerator } from "@/utils/wordPair";

export default function SessionPage() {
  const [userInput, setUserInput] = useState("");
  const [currentPair, setCurrentPair] = useState<[string, string]>(["読み込み中", "..."]);
  const [pairCount, setPairCount] = useState(0);
  const { timeLeft, isActive, isFinished, start, formatTime } = useCountdown(300);
  const router = useRouter();

  // 次の単語ペアを生成
  const generateNextPair = () => {
    const pair = wordPairGenerator.getRandomPair();
    if (pair) {
      setCurrentPair([pair.word1, pair.word2]);
      setPairCount(wordPairGenerator.getUsedPairsCount());
    }
  };

  // 初回ロード時に最初のペアを生成
  useEffect(() => {
    generateNextPair();
  }, []);

  // セッション開始時に自動でタイマーを開始
  useEffect(() => {
    start();
  }, [start]);

  // タイマー完了時にresultページに遷移
  useEffect(() => {
    if (isFinished) {
      router.push("/result");
    }
  }, [isFinished, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      console.log("入力:", userInput);
      setUserInput("");
      generateNextPair();
    }
  };

  const handleSkip = () => {
    console.log("スキップ");
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
                    この2つの言葉で何を思い浮かべる？
                  </div>
                  <div className="text-2xl font-bold text-orange-700">
                    {currentPair[0]} × {currentPair[1]}
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
                    placeholder="アイデアを入力..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    送信 (Enter)
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
            ペア数: {pairCount} / 150+ 予定
          </div>
        </div>
      </div>
    </div>
  );
}