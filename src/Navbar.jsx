import { useState } from "react";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">Logo</h2>
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        className={`${
          open ? "flex" : "hidden"
        } flex-col md:flex md:flex-row md:items-center absolute md:static top-16 right-4 bg-gray-700 md:bg-transparent rounded-lg md:rounded-none`}
      >
        <a href="#" className="px-4 py-2 hover:bg-gray-600 rounded">
          Home
        </a>
        <a href="#" className="px-4 py-2 hover:bg-gray-600 rounded">
          About
        </a>
        <a href="#" className="px-4 py-2 hover:bg-gray-600 rounded">
          Contact
        </a>
      </div>
    </nav>
  );
}
