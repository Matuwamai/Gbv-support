import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-purple-900 text-white py-6 text-center">
    <div className="container mx-auto flex flex-col items-center gap-2 px-4">
      <p className="text-sm">
        In danger? Call the free 24/7 GBV hotline{" "}
        <a href="tel:1195" className="font-bold underline">
          1195
        </a>{" "}
        or police{" "}
        <a href="tel:999" className="font-bold underline">
          999
        </a>
        , or visit the <Link to="/emergency" className="font-bold underline">Emergency</Link> page.
      </p>
      <p className="text-lg font-semibold">
        &copy; {new Date().getFullYear()} Gender-Based Violence Support
      </p>
    </div>
  </footer>
);

export default Footer;
