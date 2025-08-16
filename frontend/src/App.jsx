import React from "react";
import { useSelector } from "react-redux";
import AuthForm from "./features/auth/AuthForm";
import Dashboard from "./features/dashboard/Dashboard";

function App() {
  const token = useSelector((s) => s.auth.token);
  return (
    <>
      {token ? <Dashboard /> : <AuthForm />}
    </>
  );
}
export default App;
