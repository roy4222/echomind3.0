"use client";

import { useState } from "react";

type AccordionProps = {
  title: string;
  content: React.ReactNode;
};

export default function Accordion({ title, content }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="border-gray-200 rounded-lg overflow-hidden">
        <button
          className="w-full px-4 py-3 flex items-center justify-between bg-white text-black dark:bg-gray-900 hover:bg-gray-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium text-black dark:text-white">
            {title}
          </span>
          <span
            className={`w-5 h-5 border-r-2 border-b-2 border-gray-500 transform transition-transform duration-200 ${
              isOpen ? "rotate-[-135deg]" : "rotate-45"
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800">{content}</div>
        </div>
      </div>
    </div>
  );
}
