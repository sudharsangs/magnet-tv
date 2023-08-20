export const FAQItem = ({ title, content }:any) => {

  return (
    <div className="mb-4 rounded-lg overflow-hidden w-full">
      <div
        className="flex items-center justify-between w-full text-2xl text-white bg-gray-800 p-4"
      >
        <span>{title}</span>
      </div>
        <div className="bg-gray-800 p-4 text-gray-300 text-xl">
          {content}
        </div>
    </div>
  );
};