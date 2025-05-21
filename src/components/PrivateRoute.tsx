import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";

// All this component does is:
// - if authorized: Display children (components)
// -  else: redirect to '/' PATH (see App.tsx)
const PrivateRoute = ({ children, authorized }: { children: ReactElement; authorized: boolean }) => {
  return authorized ? children : <Navigate to="/" />;
};

export default PrivateRoute;
