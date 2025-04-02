import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { PlusCircle,  PhoneCall, User } from "lucide-react";
import { Authcontext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const authContext = useContext(Authcontext);
    const currentUser = authContext?.currentUser;
    const handleLogout = async () => {

        await authContext?.logout();

        navigate("/login");
    };
    return (
        <nav className="bg-purple-600 text-white p-5 shadow-md fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/dashboard" className="text-lg font-bold md:text-xl mx-1">
                    GBV
                </a>
                <ul className="flex items-center gap-4 text-sm md:text-sm">
                    <li className="flex items-center gap-1">
                        <PlusCircle size={18} />
                        <Link to="/newpost">Post</Link>
                    </li>
                    <li className="flex items-center gap-1">
                        <PhoneCall size={18} />
                        <Link to="/emergency">Emergency</Link>
                    </li>
                </ul>

                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center pl-2 hover:text-gray-200">
                        <User size={20} />
                        <span className="md:text-xsm">{currentUser?.name}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-purple-600 font-bold shadow-lg rounded w-32">
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
