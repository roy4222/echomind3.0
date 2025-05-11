type OuterCardProps = {
    title: string;
    description: string;
    imageUrl?: string; // 新增 imageUrl 屬性，設為可選（?）
};

export default function OutercardCard({ title, description, imageUrl }: OuterCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-800">
      <div>
        <h2 className="font-semibold text-xl text-white">{title}</h2>
        {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt={title} className="w-full h-auto rounded-lg" />
        </div>
      )}
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}