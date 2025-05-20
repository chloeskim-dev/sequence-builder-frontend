import React, { ReactNode } from "react";
import Navbar from "./Navbar";


const Layout = ({ children }: { children: ReactNode }) => (
  <div>
    <Navbar />
    <main className="p-4">{children}</main>
  </div>
);

export default Layout;
