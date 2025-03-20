import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-purple-900 text-white py-6 text-center mt-120">
            <div className="container mx-auto flex flex-col items-center gap-2">

                <p className="text-sm">Developed by Matu Wamai</p>
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/Matuwamai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 text-2xl"
                    >
                        <FaGithub />
                    </a>
                    <span className="text-sm">Contact:+254714724209</span>
                </div>
                <p className="text-lg font-semibold">
                    &copy; {new Date().getFullYear()} Gender-Based Violence Support
                </p>
            </div>
        </footer>
    );
};

export default Footer;
