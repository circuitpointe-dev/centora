import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RegistrationForm from "./RegistrationForm";

const SignupPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100 flex">
      {/* Left Column - Welcome & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-purple-700 text-white flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to Orbit ERP
          </h1>
          <p className="text-xl text-violet-100 mb-8">
            Streamline your NGO operations with our comprehensive management solution.
          </p>
          <div className="space-y-4 text-violet-200">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-violet-300 rounded-full"></div>
              <span>Manage donors & fundraising</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-violet-300 rounded-full"></div>
              <span>Track programs & impact</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-violet-300 rounded-full"></div>
              <span>Handle finances & compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <RegistrationForm onShowLogin={() => setShowLogin(true)} />

      {/* Back to Home - positioned over the form */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button
            variant="outline"
            className="inline-flex items-center text-sm bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
