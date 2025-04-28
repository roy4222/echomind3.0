"use client";

import Image from "next/image";
import BreathingCircle from './components/BreathingCircle';
import AudioPlayer from './components/AudioPlayer';
import BackButton from "../typing/components/BackButton";

export default function Home() {
  return (
    <div
      className={`min-h-screen min-w-screen flex flex-col items-center justify-start`}
    >
      <div className="flex justify-start w-full pl-4 mt-4">
        <BackButton text="返回遊戲介紹" />
      </div>

      <h1 className="text-5xl font-bold mb-20 mt-10 text-center">呼吸遊戲</h1>
      <div className="flex justify-center items-center flex-col gap-4 ">
        <BreathingCircle />
        <AudioPlayer />
      </div>
    </div>
  );
}
