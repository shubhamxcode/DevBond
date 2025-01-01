import { GiBodySwapping } from "react-icons/gi";

function Nav() {
  return (
    <div className="text-white">
      <nav className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-600 shadow-md">
        <div className="text-5xl text-white bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors">
          <GiBodySwapping />
        </div>
        <ul className="flex gap-8 text-2xl font-medium">
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Home</li>
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Feature</li>
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Work</li>
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Contact</li>
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Help</li>
        </ul>
        
        <button className="text-2xl px-6 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors font-semibold">
          Login
        </button>
      </nav>
    </div>
  );
}

export default Nav;
