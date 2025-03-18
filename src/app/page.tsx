import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 hover:text-blue-600 transition-colors">歡迎來到我的 Next.js 網站！</h1>
    </main>
  );
}