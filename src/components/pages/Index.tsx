// src/components/pages/Index.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import black_logo from "@/assets/images/black_logo.png"; // Assuming you have a logo image
import { ArrowRight, Heart, BarChart3, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo + “Orbit ERP” text */}
              <Link to="/" className="flex items-center space-x-2">
                {/* Logo image (height = 2rem by default—h-8) */}
                <img
                  src={black_logo}
                  alt="Orbit ERP Logo"
                  className="h-8 w-auto"
                />
                {/* The “Orbit ERP” text only appears on sm and up */}
                <span className="text-xl font-bold text-gray-900 hidden sm:inline-block">
                  Orbit ERP
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-violet-600"
                >
                  Sign In
                </Button>
              </Link>
              {/* “Get Started” now goes to /register */}
              <Link to="/register">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Empower Your
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent block">
              NGO Operations
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            Streamline your non‐profit operations with our comprehensive ERP
            solution. Manage donors, track projects, handle finances, and
            measure impact all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-4 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white px-8 py-4 text-lg transition-all duration-200"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section (unchanged) */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete NGO Management Solution
            </h2>
            <p className="text-lg text-gray-600">
              Everything your organization needs to maximize impact and
              efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Donor Management
              </h3>
              <p className="text-gray-600">
                Build lasting relationships with donors through comprehensive
                tracking, automated communications, and donation analytics.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Impact Tracking
              </h3>
              <p className="text-gray-600">
                Monitor and measure your organization's impact with detailed
                reporting, KPI dashboards, and outcome tracking.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Financial Management
              </h3>
              <p className="text-gray-600">
                Streamline budgeting, expense tracking, grant management, and
                financial reporting with transparency and accountability.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section (unchanged) */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your NGO?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of organizations already maximizing their impact
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
