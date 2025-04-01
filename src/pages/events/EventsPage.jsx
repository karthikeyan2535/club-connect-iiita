
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import EventCard from '../../components/events/EventCard';
import { getEvents } from '../../services/events';
import { Search, Filter, CalendarDays } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clubFilter, setClubFilter] = useState('');
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getEvents();
        // Sort by date (closest first)
        allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever searchTerm or clubFilter changes
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (clubFilter) {
      filtered = filtered.filter(event => event.club && event.club.id === parseInt(clubFilter));
    }
    
    setFilteredEvents(filtered);
  }, [searchTerm, clubFilter, events]);
  
  // Get unique clubs from events
  const clubs = [...new Set(events
    .filter(event => event.club)
    .map(event => JSON.stringify({ id: event.club.id, name: event.club.name }))
  )].map(club => JSON.parse(club));
  
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-accent text-accent-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Events</h1>
          <p className="text-lg opacity-90 max-w-xl">
            Discover and register for upcoming events at IIITA. From workshops to competitions, find events that interest you.
          </p>
        </div>
      </section>
      
      {/* Filters and Search */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="">All Clubs</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Timeline */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div>
              {/* Group events by month */}
              {Object.entries(
                filteredEvents.reduce((groups, event) => {
                  const month = new Date(event.date).toLocaleString('en-US', { month: 'long', year: 'numeric' });
                  if (!groups[month]) {
                    groups[month] = [];
                  }
                  groups[month].push(event);
                  return groups;
                }, {})
              ).map(([month, monthEvents]) => (
                <div key={month} className="mb-12">
                  <h2 className="flex items-center text-2xl font-semibold mb-6 pb-2 border-b">
                    <CalendarDays className="h-6 w-6 mr-2 text-accent" />
                    {month}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No events found matching your filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setClubFilter('');
                }}
                className="mt-4 text-accent hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default EventsPage;
