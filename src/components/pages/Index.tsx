// src/components/pages/Index.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import black_logo from "@/assets/images/black_logo.png";
import violet_logo from "@/assets/images/logo_violet.png";
import white_logo from "@/assets/images/white_logo.png";
import {
  ArrowRight,
  Heart,
  BarChart3,
  FileText,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo + "Orbit ERP" text */}
              <Link to="/" className="flex items-center space-x-2">
                {/* Logo image (height = 2rem by default—h-8) */}
                <img
                  src={violet_logo}
                  alt="Orbit ERP Logo"
                  className="h-8 w-auto"
                />
                {/* The "Orbit ERP" text only appears on sm and up */}
                <span className="text-xl font-bold text-gray-900 hidden sm:inline-block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Orbit
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
              {/* "Get Started" now goes to /register */}
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

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src={black_logo}
                  alt="Orbit ERP Logo"
                  className="h-8 w-auto filter invert"
                />
                <span className="text-xl font-bold">Orbit ERP</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering NGOs worldwide with comprehensive management
                solutions to maximize their impact and streamline operations.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Donor Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fundraising Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Proposal Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Opportunity Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Financial Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Impact Reporting
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">support@orbiterp.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <span className="text-sm">
                    123 Innovation Drive
                    <br />
                    Tech Valley, CA 94025
                    <br />
                    United States
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Orbit ERP. All rights reserved.
              </p>

              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
