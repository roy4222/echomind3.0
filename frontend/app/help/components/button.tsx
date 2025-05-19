// components/CustomButton.js
type CustomButtonProps = {
    text: string;
    onClick: () => void;
    isActive?: boolean;
  };
export default function CustomButton({text, onClick, isActive}: CustomButtonProps) {
    return (
      <button onClick={onClick} className={`w-40 h-14 text-xl px-4 py-2 rounded-full  transition transform hover:scale-110 shadow-lg shadow-stone-800/50 ${isActive ? 'bg-zinc-600 text-white border-slate-600' : 'bg-stone-800 text-white hover:bg-blue-200 hover:text-black'}`}>
        {text}
      </button>
    );
  }
  