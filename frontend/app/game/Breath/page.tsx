import Image from "next/image";
import BreathingCircle from './components/BreathingCircle';
import AudioPlayer from './components/AudioPlayer';

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center dark:bg-gray-800 bg-gray-50">
      <BreathingCircle />
      <AudioPlayer />
    </div>
  );
}
