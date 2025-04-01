
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = ({ userRole, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-foreground/10 focus:outline-none"
          aria-expanded={isOpen}
        >
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-primary z-40 pt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/clubs" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              onClick={() => setIsOpen(false)}
            >
              Clubs
            </Link>
            <Link 
              to="/events" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            {userRole && (
              <Link 
                to={`/${userRole === 'student' ? 'student' : 'organizer'}/dashboard`}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {userRole ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
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
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-primary hover:bg-gray-100 m-2"
                  onClick={() => setIsOpen(false)}
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
