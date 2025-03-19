import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          歡迎使用 EchoMind
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">
          您的智能助手，隨時為您服務
        </p>
      </div>
    </div>
  );
}