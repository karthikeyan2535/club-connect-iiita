
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

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
      <Navbar userRole={userRole} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
