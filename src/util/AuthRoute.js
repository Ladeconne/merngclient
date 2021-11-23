import { Outlet, Navigate } from 'react-router-dom';
import React, { useContext } from "react";

import { AuthContext } from "../context/auth";

function AuthRoute()  {
  const user = useContext(AuthContext);
  return user.user ? <Navigate to="/"/> : <Outlet />
}

export default AuthRoute;
