import { FaGithub } from "react-icons/fa";

export const Header = () => {
  return (
    <header className="text-gray-300 text-right pt-4 pr-4 w-full flex justify-end mb-4">
      <a
        href="https://github.com/sudharsangs/magnet-tv"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline text-md flex items-center justify-end"
      >
        <FaGithub className="mr-1" />
        GitHub
      </a>
    </header>
  );
  }