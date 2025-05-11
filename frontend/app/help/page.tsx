"use client";

import { JSX, useState } from "react";
import CustomButton from "./components/button";
import OuterCard from "./components/OuteCard";

export default function Home() {
  const [selected, setSelected] = useState<string>("EchoMind");

  const descriptions: Record<string, JSX.Element> = {
    EchoMind: (
      <div className="space-y-6">
        <OuterCard
          title="歡迎使用 EchoMind"
          description={`EchoMind 是一個智能聊天機器人，可以與你進行自然對話。\n我們致力於提供最好的聊天體驗。`}
          imageUrl="/help_images/login.jpg"
        />
        <OuterCard
          title="開始使用"
          description={`1. 點擊登入按鈕進入系統\n2. 選擇你想要的功能\n3. 開始與 EchoMind 對話`}
          imageUrl="/help_images/style.jpg"
        />
        <OuterCard
          title="開始使用"
          description={`1. 點擊登入按鈕進入系統\n2. 選擇你想要的功能\n3. 開始與 EchoMind 對話`}
          imageUrl="/help_images/ask.jpg"
        />
        <OuterCard
          title="開始使用"
          description={`1. 點擊登入按鈕進入系統\n2. 選擇你想要的功能\n3. 開始與 EchoMind 對話`}
          imageUrl="/help_images/function.jpg"
        />
      </div>
    ),
    聊天歷史: (
      <div className="space-y-6">
        <OuterCard
          title="聊天歷史功能"
          description={`• 查看過去的對話記錄\n• 搜尋特定主題的對話\n• 匯出聊天記錄`}
          imageUrl="/help_images/login.jpg"
        />
        <OuterCard
          title="使用技巧"
          description={`• 使用關鍵字搜尋\n• 按日期篩選\n• 標記重要對話`}
          imageUrl="/help_images/login.jpg"
        />
      </div>
    ),
    匿名留言板: (
      <div className="space-y-6">
        <OuterCard
          title="匿名留言板"
          description={`• 自由發表意見\n• 保護個人隱私\n• 與他人互動交流`}
        />
        <OuterCard
          title="使用規則"
          description={`• 尊重他人\n• 遵守社群規範\n• 保持友善交流`}
        />
      </div>
    ),
    小遊戲: (
      <div className="space-y-6">
        <OuterCard
          title="趣味小遊戲"
          description={`• 益智問答\n• 文字遊戲\n• 互動挑戰`}
        />
        <OuterCard
          title="遊戲規則"
          description={`• 完成任務獲得獎勵\n• 與好友競賽\n• 解鎖特殊成就`}
        />
      </div>
    ),
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center mb-8 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          使用說明
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.keys(descriptions).map((option) => (
            <CustomButton
              key={option}
              text={option}
              onClick={() => setSelected(option)}
              isActive={selected === option}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="animate-fade-in">
            {descriptions[selected]}
          </div>
        </div>
      </div>
    </div>
  );
}
