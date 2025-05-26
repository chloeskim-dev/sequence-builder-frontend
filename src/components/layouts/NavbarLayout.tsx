import React, { ReactNode } from "react";
import Navbar from "../Navbar";

type Props = {
  children: ReactNode;
};

const NavbarLayout = ({ children }: Props) => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <div className="flex-1 bg-blue-100">{children}</div>
  </div>
);

export default NavbarLayout;
