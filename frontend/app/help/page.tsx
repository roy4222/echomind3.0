"use client";

import { JSX, useState } from "react";
import CustomButton from "./components/button";
import OuterCard from "./components/OuteCard";


export default function Home() {
  const [selected, setSelected] = useState<string>("EchoMind");

  const descriptions: Record<string, JSX.Element> = {
    EchoMind: (
      <div className="space-y-4">
        <OuterCard
          title="一"
          description={`EchoMind 是個聊天機器人，可以與你進行聊天。\n請點選上方按鈕切換。`}
          imageUrl="https://via.placeholder.com/300"
        />
        <OuterCard
          title="二"
          description={`這是第一個選項的說明。\n請點選上方按鈕切換。`}
        />
      </div>
    ),
    聊天歷史: (
      <OuterCard
        title="選項二"
        description={`這是第二個選項的說明。\n這是一段額外說明。`}
      />
    ),
    匿名留言板: (
      <OuterCard
        title="選項三"
        description={`這是第二個選項的說明。\n這是一段額外說明。`}
      />
    ),
    小遊戲: (
      <OuterCard
        title="選項四"
        description={`這是第三個選項的說明。\n感謝使用！`}
      />
    ),
  };

  return (
    <div className="h-screen w-full dark:bg-gray-900">
      <div className="pb-6 pt-6 bg-gradient-to-r from-zinc-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent flex justify-evenly">
        使用說明
      </div>
      <div className="flex justify-evenly">
        {Object.keys(descriptions).map((option) => (
          <CustomButton
            key={option}
            text={option}
            onClick={() => setSelected(option)}
            isActive={selected === option}
          />
        ))}
      </div>
      <br />
      <div className="grid w-full grid-flow-dense grid-cols-30 grid-rows-30 gap-2 bg-gray-950/5 p-2 dark:bg-white/10">
        <div className="col-span-30 row-span-10">{descriptions[selected]}</div>
      </div>
    </div>
  );  
}
