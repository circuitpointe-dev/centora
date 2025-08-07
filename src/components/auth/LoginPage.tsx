// src/components/auth/LoginPage.tsx
import React from "react";
import LoginLeftColumn from "./LoginLeftColumn";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Column – Graphic */}
      <LoginLeftColumn />

      {/* Right Column – Login Form */}
      <LoginForm onShowRegistration={() => {}} />
    </div>
  );
};

export default LoginPage;