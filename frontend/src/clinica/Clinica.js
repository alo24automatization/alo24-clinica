import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ClinicaRoutes } from "./ClinicaRoutes";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";

export const Clinica = () => {
  const { login, token, logout, userId, user, clinica } = useAuth();
  const isAuthenticated = !!token;
  const userRouter = ClinicaRoutes(isAuthenticated, user);

  return (
    <AuthContext.Provider  value={{ login, token, logout, userId, user, clinica, isAuthenticated }}>
      <Router>{userRouter}</Router>
    </AuthContext.Provider>
  );
};
