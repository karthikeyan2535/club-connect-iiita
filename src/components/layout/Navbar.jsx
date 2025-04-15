
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Settings } from 'lucide-react';

const Navbar = ({ userRole, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    setShowProfileMenu(false);
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    }
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Safe access to user properties with fallbacks
  const userName = user && user.name ? user.name : (user?.email ? user.email.split('@')[0] : 'User');
  const userEmail = user && user.email ? user.email : '';
  const safeUserRole = userRole || (user && user.role ? user.role : '');

  return (
    <nav className="bg-primary text-white">
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
              onClick={handleNavLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/clubs" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              onClick={handleNavLinkClick}
            >
              Clubs
            </Link>
            <Link 
              to="/events" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              onClick={handleNavLinkClick}
            >
              Events
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
              onClick={handleNavLinkClick}
            >
              About
            </Link>
            {safeUserRole && (
              <Link 
                to={`/${safeUserRole === 'student' ? 'student' : 'organizer'}/dashboard`}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white"
                onClick={handleNavLinkClick}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <>
                <div className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 text-white">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">{userName}</p>
                      <p className="text-xs text-white/70">{userEmail}</p>
                      {safeUserRole && (
                        <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 inline-block mt-1 capitalize">
                          {safeUserRole}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
                  onClick={handleNavLinkClick}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-primary hover:bg-gray-100 m-2"
                  onClick={handleNavLinkClick}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Desktop menu - Hidden on mobile */}
      <div className="hidden md:block">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            {/* User Profile Dropdown - Only shown when logged in */}
            {user && (
              <div className="relative ml-auto">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center px-3 py-2 rounded-md text-white hover:bg-primary-foreground/10 focus:outline-none"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="mr-1">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="font-medium text-gray-800">{userName}</div>
                      {userEmail && (
                        <div className="text-sm text-gray-500 mt-1">{userEmail}</div>
                      )}
                      {safeUserRole && (
                        <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 inline-block mt-2 capitalize">
                          {safeUserRole}
                        </div>
                      )}
                    </div>
                    <div className="py-1">
                      {safeUserRole && (
                        <Link 
                          to={`/${safeUserRole === 'student' ? 'student' : 'organizer'}/dashboard`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link 
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Nav links - These are already in MainLayout, so we don't need to duplicate */}
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
