import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// BackButton 組件：返回按鈕
function BackButton({ text }: { text: string }) {
  const router = useRouter();
  
  const navigate = () => {
    router.back();
  };

  return (
    <motion.button
      onClick={navigate}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm"
    >
      <ArrowLeft className="mr-2" size={20} />
      {text}
    </motion.button>
  );
}

export default BackButton; 