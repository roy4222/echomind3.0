import { GameStatusPanelProps } from '@/lib/types/puzzle';
import { formatTime } from '../utils/gameUtils';

export const GameStatusPanel = ({
  time,
  moves,
  isCompleted,
  onRestart
}: GameStatusPanelProps) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-md p-4 mb-4 flex flex-wrap justify-between items-center gap-4 w-full">
      <div className="flex items-center space-x-6">
        <div className="text-center bg-gray-100/80 dark:bg-gray-600/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">時間</div>
          <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{formatTime(time)}</div>
        </div>
        <div className="text-center bg-gray-100/80 dark:bg-gray-600/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">步數</div>
          <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{moves}</div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all transform hover:scale-105 shadow-md font-medium flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        重新開始
      </button>
    </div>
  );
}; 