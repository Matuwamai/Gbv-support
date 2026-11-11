import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, ChevronDown, Home, PhoneCall, User } from "lucide-react";
import { useAuth } from "../context/auth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1 hover:text-gray-200 ${isActive ? "underline underline-offset-4" : ""}`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu after navigating.
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close the menu when clicking outside it or pressing Escape.
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setDropdownOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-purple-600 text-white p-5 shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center gap-2">
        <Link to="/dashboard" className="text-lg font-bold md:text-xl mx-1">
          GBV Support
        </Link>
        <ul className="flex items-center gap-4 text-sm">
          <li>
            <NavLink to="/dashboard" className={navLinkClass} title="Feed">
              <Home size={18} />
              <span className="hidden sm:inline">Feed</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/learn" className={navLinkClass} title="Learn">
              <BookOpen size={18} />
              <span className="hidden sm:inline">Learn</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/emergency" className={navLinkClass} title="Emergency">
              <PhoneCall size={18} />
              <span className="hidden sm:inline">Emergency</span>
            </NavLink>
          </li>
        </ul>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-1 pl-2 hover:text-gray-200"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            <User size={20} />
            <span className="hidden sm:inline max-w-32 truncate">{currentUser?.name}</span>
            <ChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 bg-white text-purple-600 font-bold shadow-lg rounded w-32 overflow-hidden"
            >
              <Link to="/profile" role="menuitem" className="block px-4 py-2 hover:bg-gray-200">
                Profile
              </Link>
              <button
                role="menuitem"
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
