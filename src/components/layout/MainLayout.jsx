
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
      <div className="bg-primary text-primary-foreground py-2 px-4 flex justify-end">
        {!userRole ? (
          <>
            <Link to="/login" className="mr-4">
              <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground/90 flex items-center gap-1">
                <LogIn size={16} />
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary flex items-center gap-1">
                <UserPlus size={16} />
                Register
              </Button>
            </Link>
          </>
        ) : (
          <Button 
            variant="ghost" 
            className="text-primary-foreground hover:text-primary-foreground/90"
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
      <Navbar userRole={userRole} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
