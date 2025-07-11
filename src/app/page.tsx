"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/session");
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
          5分間ノンストップで強制連想法！<br/>
          温泉卵がアイデア出しをサポートします
        </p>

        <button
          onClick={handleStart}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start
        </button>
      </main>
    </div>
  );
}