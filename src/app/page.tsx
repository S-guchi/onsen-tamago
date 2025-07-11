"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStart = (minutes: number) => {
    // 選択した時間をクエリパラメータで渡す
    router.push(`/session?minutes=${minutes}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-orange-900">温泉卵ブレスト</h1>
        
        <div className="relative">
          <Image
            src="/onsen-tamago.png"
            alt="温泉卵"
            width={300}
            height={300}
            priority
            className="drop-shadow-lg"
          />
        </div>

        <p className="text-lg text-gray-700 text-center max-w-md">
          強制連想法でアイデア出し！<br/>
          温泉卵がアイデア出しをサポートします
        </p>

        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-bold text-orange-900 mb-2">時間を選択してください</h2>
          
          <div className="flex gap-4">
            <button
              onClick={() => handleStart(1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              1分モード
            </button>
            
            <button
              onClick={() => handleStart(3)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              3分モード
            </button>
            
            <button
              onClick={() => handleStart(5)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              5分モード
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}