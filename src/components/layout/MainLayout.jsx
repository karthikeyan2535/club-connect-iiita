
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary py-3 px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-foreground flex items-center">
          <span className="text-[#1e40af] bg-white px-2 py-1 rounded mr-2">IIITA</span> 
          <span className="text-white">ClubHub</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-white/80">
            Home
          </Link>
          <Link to="/clubs" className="text-white hover:text-white/80">
            Clubs
          </Link>
          <Link to="/events" className="text-white hover:text-white/80">
            Events
          </Link>
          <Link to="/about" className="text-white hover:text-white/80">
            About
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {!userRole ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-white/80">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="bg-white text-primary hover:bg-white/90">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <Button 
              variant="ghost" 
              className="text-white hover:text-white/80"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('userRole');
                window.location.href = '/';
              }}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
