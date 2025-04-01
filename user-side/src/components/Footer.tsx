

const Footer = () => {
    return (
        <footer className="bg-purple-900 text-white py-6 text-center mt-120">
            <div className="container mx-auto flex flex-col items-center gap-2">
                <p className="text-lg font-semibold">
                    &copy; {new Date().getFullYear()} Gender-Based Violence Support
                </p>
            </div>
        </footer>
    );
};

export default Footer;
