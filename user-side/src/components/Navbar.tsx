import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, X, PlusCircle, ShieldAlert, PhoneCall, User } from "lucide-react";
import { Authcontext } from "../context/authContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const authContext = useContext(Authcontext);
    const currentUser = authContext?.currentUser;
    console.log("Current User:", currentUser);
    


    return (
        <nav className="bg-purple-600  text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <a href="/dashboard" className="text-xl font-bold md:text-2xl">GBV<span className="hidden md:inline"> Support</span></a>
                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Menu Items */}
                <ul className={`md:flex md:items-center gap-6 ${isOpen ? "block" : "hidden"} absolute md:static bg-purple-600 text-white w-full md:w-auto left-0 top-16 p-4 md:p-0 shadow-md md:shadow-none`}>
                    <li className="flex flex-col items-center md:flex-row">
                        <PlusCircle size={20} />
                        <Link to="/newpost" className="ml-1">Post</Link>
                    </li>
                    <li className="flex flex-col items-center md:flex-row">
                        <ShieldAlert size={20} />
                        <Link to="/cases" className="ml-1">Cases</Link>
                    </li>
                    <li className="flex flex-col items-center md:flex-row">
                        <PhoneCall size={20} />
                        <Link to="/emergency" className="ml-1">Emergency</Link>
                    </li>
                </ul>

                {/* Account Dropdown */}
                <div className="relative group">

                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1 hover:text-gray-200">
                        <User size={24} />
                        <span className="text-sm">{currentUser.name}</span>
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
