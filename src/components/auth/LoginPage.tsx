// src/components/auth/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginLeftColumn from "./LoginLeftColumn";
import SupabaseLoginForm from "./SupabaseLoginForm";
import RegistrationModal from "./RegistrationModal";

const LoginPage = () => {
  const location = useLocation();
  const [showRegistration, setShowRegistration] = useState(false);

  // If the user lands on "/register" (rather than "/login"), auto‐open the modal:
  useEffect(() => {
    if (location.pathname === "/register") {
      setShowRegistration(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Column – Graphic */}
      <LoginLeftColumn />

      {/* Right Column – Login Form (always rendered) */}
      <SupabaseLoginForm onShowRegistration={() => setShowRegistration(true)} />

      {/* Registration Modal (conditionally rendered) */}
      {showRegistration && (
        <RegistrationModal onClose={() => setShowRegistration(false)} />
      )}
    </div>
  );
};

export default LoginPage;
