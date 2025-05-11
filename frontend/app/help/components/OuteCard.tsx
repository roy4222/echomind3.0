type OuterCardProps = {
    title: string;
    description: string;
    imageUrl?: string; // 新增 imageUrl 屬性，設為可選（?）
};

export default function OutercardCard({ title, description, imageUrl }: OuterCardProps) {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <div>
        <h2 className="font-semibold text-2xl text-black dark:text-white ">{title}</h2>
        {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt={title} className="w-full h-auto rounded-xl" />
        </div>
      )}
        <p className="text-black dark:text-white">{description}</p>
      </div>
    </div>
  );
}