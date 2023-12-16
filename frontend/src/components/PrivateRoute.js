// PrivateRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function PrivateRoute() {
  const token = localStorage.getItem("token");
  let auth = { Tokens: false };
  // Check if token is valid and not expired
  const isTokenValid = () => {
    if (token) {
      // You might need to install and use the jwt-decode library
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      auth = { Tokens: true };
      return decodedToken.exp > currentTime;
    }
    return false;
  };

  return isTokenValid() ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
