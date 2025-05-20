import React, { ReactNode } from "react";
import Navbar from "../Navbar";



type Props = {
  children: ReactNode;
};

const NavbarLayout = ({ children }: Props) => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <main className="flex-1 overflow-hidden bg-blue-100">
        {children}
    </main>
  </div>
);

export default NavbarLayout;