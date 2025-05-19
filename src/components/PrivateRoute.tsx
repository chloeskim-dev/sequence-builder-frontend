import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, authorized }: { children: ReactElement; authorized: boolean }) => {
  return authorized ? children : <Navigate to="/" />;
};

export default PrivateRoute;
