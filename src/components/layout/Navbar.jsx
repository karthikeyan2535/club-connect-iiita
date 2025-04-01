import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const Navbar = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
      duration: 3000,
    });
    
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  // The main navbar content has been moved to MainLayout
  // This component now only handles mobile menu navigation

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-foreground/10 focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-primary z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white">
              Home
            </Link>
            <Link to="/clubs" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white">
              Clubs
            </Link>
            <Link to="/events" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white">
              Events
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white">
              About
            </Link>
            {userRole && (
              <Link 
                to={`/${userRole === 'organizer' ? 'organizer' : 'student'}/dashboard`}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              >
                Dashboard
              </Link>
            )}
            {userRole ? (
              <>
                <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-primary hover:bg-gray-100 m-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
