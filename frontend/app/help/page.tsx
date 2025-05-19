"use client";

import { JSX, useState } from "react";
import CustomButton from "./components/button";
import OuterCard from "./components/OuteCard";
import Accordion from "./components/Accordion";

export default function Home() {
  const [selected, setSelected] = useState<string>("EchoMind");

  const descriptions: Record<string, JSX.Element> = {
    EchoMind: (
      <div className="space-y-6">
        <OuterCard
          title="登入"
          description={`在畫面的右上角可以看到登入鍵。\n歡迎進行登入讓找到過去的對話，達到最好的使用體驗。`}
          imageUrl="/help_GIF/login.gif"
        />
        <OuterCard
          title="主題切換"
          description={`可以根據你的使用習慣切換深色模式的主題與淺色模式的主題。`}
          imageUrl="/help_GIF/style.gif"
        />
        <OuterCard
          title="如何問問題"
          description={`可以在此發問想要的問題。\n並在下方分別有附圖片與使用我們專屬資料庫回答的按鈕。`}
          imageUrl="/help_GIF/ask.gif"
        />
      </div>
    ),
    聊天歷史: (
      <div className="space-y-6">
        <OuterCard
          title="聊天歷史"
          description={`• 查看過去的對話記錄\n• 選擇想看的對話\n`}
          imageUrl="/help_GIF/history.gif"
        />
        <OuterCard
          title="新對話"
          description={`• 點擊右上角開啟新對話\n• 可以開始問問題`}
          imageUrl="/help_GIF/new_talk.gif"
        />
      </div>
    ),
    匿名留言板: (
      <div className="space-y-6">
        <OuterCard
          title="如何使用匿名留言板?"
          description={`1. 點選左上角選單按鈕\n2. 點擊匿名留言板\n3. 輸入想說的話或問題\n4. 按下發布留言即可`}
          imageUrl="/help_GIF/comment.gif"
        />
      </div>
    ),
    小遊戲: (
      <div className="space-y-6">
        <OuterCard
          title="如何進到遊戲區?"
          description={`1. 點選左上角選單按鈕\n2. 點擊第四個小遊戲\n3. 選擇想玩的遊戲`}
          imageUrl="/help_GIF/opengame.gif"
        />
      </div>
    ),
    常見問題: (
      <div className="space-y-6">
        <Accordion
          title="如何重置密碼？"
          content="點擊登入頁面的「忘記密碼」連結，按照指示操作即可重置密碼。"
        />
        <Accordion
          title="留言板會是匿名的嗎？"
          content="是的，留言板會是匿名的，不會顯示你的名字。"
        />
        <Accordion
          title="為甚麼登入後看不到聊天歷史？"
          content="請重新登入或是關閉瀏覽器重新開啟。"
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
          <div className="animate-fade-in">{descriptions[selected]}</div>
        </div>
      </div>
    </div>
  );
}
