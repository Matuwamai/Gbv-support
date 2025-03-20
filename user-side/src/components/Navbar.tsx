import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ShieldAlert, PhoneCall, User } from "lucide-react";
import { Authcontext } from "../context/authContext";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const authContext = useContext(Authcontext);
    const currentUser = authContext?.currentUser;

    return (
        <nav className="bg-purple-600 text-white p-3 shadow-md fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <a href="/" className="text-lg font-bold md:text-xl">
                    GBV<span className="hidden md:inline"> Support</span>
                </a>

                {/* Menu Items */}
                <ul className="flex items-center gap-4 text-sm md:text-base">
                    <li className="flex items-center gap-1">
                        <PlusCircle size={18} />
                        <Link to="/newpost">Post</Link>
                    </li>
                    <li className="flex items-center gap-1">
                        <ShieldAlert size={18} />
                        <Link to="/cases">Cases</Link>
                    </li>
                    <li className="flex items-center gap-1">
                        <PhoneCall size={18} />
                        <Link to="/emergency">Emergency</Link>
                    </li>
                </ul>

                {/* Account Dropdown */}
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1 hover:text-gray-200">
                        <User size={20} />
                        <span className="text-sm hidden md:inline">{currentUser.name}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-purple-600 font-bold shadow-lg rounded w-32">
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
