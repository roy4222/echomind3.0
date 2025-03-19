'use client';

import { useState } from "react";
import Header from "./Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
} 