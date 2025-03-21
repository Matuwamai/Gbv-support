import { Outlet } from "react-router-dom"; 
import Navbar from "./Navbar";
import Footer from "./Footer";


const Layout = () => {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1">
        <Navbar />

        <div className="p-5 ">
          <Outlet />
        </div>
      <Footer />

      </div>
    </div>
  );
};


export default Layout;
