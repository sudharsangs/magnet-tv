export const Step = ({ emoji, title, description }:any) => {
  return (
   <div className="flex items-start space-x-4 bg-gray-600 rounded-lg p-4 transition transform hover:scale-105 w-full">
      <div className="sm:w-12 sm:h-12  flex items-center justify-center sm:bg-blue-500 rounded-full text-white text-2xl font-semibold">
        {emoji}
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
};