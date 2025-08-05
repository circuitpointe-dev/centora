import React, { useState } from "react";
import LoginLeftColumn from "./LoginLeftColumn";
import LoginForm from "./LoginForm";
import NewRegistrationForm from "./NewRegistrationForm";

const AuthPage = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Only show on login */}
      {!showRegistration && <LoginLeftColumn />}
      
      {/* Right Column - Login or Registration Form */}
      <div className={`flex items-center justify-center ${showRegistration ? 'w-full' : 'w-full lg:w-1/2'} bg-white`}>
        {showRegistration ? (
          <NewRegistrationForm 
            onShowLogin={() => setShowRegistration(false)}
            onBackToHome={() => setShowRegistration(false)}
          />
        ) : (
          <LoginForm onShowRegistration={() => setShowRegistration(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;