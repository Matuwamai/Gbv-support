import React from "react";
import { Outlet } from "react-router-dom"; //
import Navbar from "./Navbar";



const Layout = () => {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-5">
          <Outlet />
        </div>
      
      </div>
    </div>
  );
};


export default Layout;
