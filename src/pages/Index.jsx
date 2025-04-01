
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ClubCard from '../components/clubs/ClubCard';
import EventCard from '../components/events/EventCard';
import { getClubs } from '../services/clubs';
import { getEvents } from '../services/events';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured clubs and upcoming events
        const allClubs = await getClubs();
        const allEvents = await getEvents();
        
        // Get random 3 clubs as featured
        const featuredClubs = allClubs
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        // Get next 3 upcoming events
        const upcomingEvents = allEvents
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        
        setClubs(featuredClubs);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Connect with IIITA Clubs
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-lg">
                Discover, join, and participate in various clubs and events at Indian Institute of Information Technology, Allahabad.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/clubs" 
                  className="bg-white text-primary font-medium px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Explore Clubs
                </Link>
                <Link 
                  to="/events" 
                  className="bg-accent text-white font-medium px-6 py-3 rounded-md hover:bg-accent/90 transition-colors"
                >
                  Upcoming Events
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                alt="IIITA Students" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Clubs Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Clubs</h2>
            <Link to="/clubs" className="flex items-center text-primary hover:text-secondary transition-colors">
              View All <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading clubs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Upcoming Events Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link to="/events" className="flex items-center text-primary hover:text-secondary transition-colors">
              View All <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading events...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Join Now CTA */}
      <section className="py-16 px-4 bg-accent text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Create your account now and start connecting with clubs and events at IIITA. Discover new opportunities and enhance your college experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-accent font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white font-medium px-8 py-3 rounded-md hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
