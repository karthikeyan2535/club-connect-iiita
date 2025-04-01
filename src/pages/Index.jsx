
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ClubCard from '../components/clubs/ClubCard';
import EventCard from '../components/events/EventCard';
import { getClubs } from '../services/clubs';
import { getEvents } from '../services/events';
import { ChevronRight, ArrowRight } from 'lucide-react';

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
      <section className="bg-[#f4f7ff] min-h-[70vh] flex items-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover and Manage <span className="text-primary">IIITA Clubs</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Connect with the vibrant community of clubs and activities at IIITA. Join clubs, participate in
            events, and make the most of your campus experience.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/register">
              <button className="bg-primary text-white px-8 py-3 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors">
                Get Started <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/clubs">
              <button className="bg-white text-primary border border-primary px-8 py-3 rounded-md hover:bg-gray-50 transition-colors">
                Explore Clubs
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Clubs Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Clubs</h2>
            <Link to="/clubs" className="flex items-center text-primary hover:text-primary/80 transition-colors">
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
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link to="/events" className="flex items-center text-primary hover:text-primary/80 transition-colors">
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
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Create your account now and start connecting with clubs and events at IIITA. Discover new opportunities and enhance your college experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-primary font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
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
