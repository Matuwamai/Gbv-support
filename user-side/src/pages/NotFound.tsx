import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
    <h1 className="text-4xl font-bold text-purple-700 mb-2">Page not found</h1>
    <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
    <Link to="/" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700">
      Go to the home page
    </Link>
  </div>
);

export default NotFound;
