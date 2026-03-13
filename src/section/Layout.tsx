import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";

const Layout: React.FC = () => {

  return (
      <div>
        <Header />
        { <Sidebar />} {/* Always show header */}
        <main>
          <Outlet /> {/* Page content goes here */}
        </main>
      </div>
  );
};

export default Layout;