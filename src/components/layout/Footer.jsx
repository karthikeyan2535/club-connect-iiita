
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-xl font-semibold mb-4">IIITA Club Connect</h3>
            <p className="text-sm opacity-90 max-w-xs">
              Connecting students with clubs and activities at Indian Institute of Information Technology, Allahabad.
            </p>
          </div>
          
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/clubs" className="hover:text-accent">Clubs</Link></li>
              <li><Link to="/events" className="hover:text-accent">Events</Link></li>
              <li><Link to="/login" className="hover:text-accent">Login</Link></li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>IIIT Allahabad</li>
              <li>Jhalwa, Prayagraj</li>
              <li>Uttar Pradesh - 211015</li>
              <li>Email: support@iiita.ac.in</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} IIITA Club Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
