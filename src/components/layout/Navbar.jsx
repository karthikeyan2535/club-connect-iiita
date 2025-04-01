
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

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">IIITA Club Connect</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10">
                Home
              </Link>
              <Link to="/clubs" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10">
                Clubs
              </Link>
              <Link to="/events" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10">
                Events
              </Link>
              {userRole && (
                <Link 
                  to={`/${userRole === 'organizer' ? 'organizer' : 'student'}/dashboard`}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10"
                >
                  Dashboard
                </Link>
              )}
              {userRole ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10">
                    <User className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-secondary hover:bg-secondary/90"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-foreground/10 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10">
              Home
            </Link>
            <Link to="/clubs" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10">
              Clubs
            </Link>
            <Link to="/events" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10">
              Events
            </Link>
            {userRole && (
              <Link 
                to={`/${userRole === 'organizer' ? 'organizer' : 'student'}/dashboard`}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10"
              >
                Dashboard
              </Link>
            )}
            {userRole ? (
              <>
                <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-secondary hover:bg-secondary/90"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
