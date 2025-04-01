
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import MainLayout from '../../components/layout/MainLayout';
import { getEventById, registerForEvent, unregisterFromEvent } from '../../services/events';
import { CalendarDays, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const userRole = localStorage.getItem('userRole') || null;
  
  const isRegistered = user && event?.registrations.includes(user.id);
  const isOrganizer = user && userRole === 'organizer' && event?.organizers.includes(user.id);
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        
        if (!eventData) {
          toast({
            title: "Error",
            description: "Event not found",
            variant: "destructive",
          });
          return;
        }
        
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, toast]);
  
  const handleRegisterForEvent = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      return;
    }
    
    setIsRegistering(true);
    
    try {
      await registerForEvent(id, user.id);
      
      // Update local state
      setEvent(prevEvent => ({
        ...prevEvent,
        registrations: [...prevEvent.registrations, user.id]
      }));
      
      toast({
        title: "Success",
        description: `You have registered for ${event.title}`,
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleUnregisterFromEvent = async () => {
    if (!user) return;
    
    setIsUnregistering(true);
    
    try {
      await unregisterFromEvent(id, user.id);
      
      // Update local state
      setEvent(prevEvent => ({
        ...prevEvent,
        registrations: prevEvent.registrations.filter(userId => userId !== user.id)
      }));
      
      toast({
        title: "Success",
        description: `You have unregistered from ${event.title}`,
      });
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to unregister from event",
        variant: "destructive",
      });
    } finally {
      setIsUnregistering(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading event details...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!event) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <p className="mb-6">The requested event does not exist or has been removed.</p>
          <Link to="/events" className="flex items-center justify-center text-accent hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Event Header */}
      <section 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${event.image || 'https://via.placeholder.com/1200x400?text=Event+Cover'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 py-6 relative text-white">
          <Link to="/events" className="flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          {event.club && (
            <Link 
              to={`/clubs/${event.club.id}`}
              className="inline-block bg-primary text-white px-3 py-1 text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              {event.club.name}
            </Link>
          )}
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Event Details (Mobile Only) */}
            <div className="md:hidden bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CalendarDays className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Registrations</p>
                    <p className="text-gray-600">{event.registrations.length} registered</p>
                  </div>
                </li>
              </ul>
              
              {/* Registration Button (Mobile Only) */}
              {userRole === 'student' && !isOrganizer && (
                <div className="mt-6">
                  {isRegistered ? (
                    <button
                      onClick={handleUnregisterFromEvent}
                      disabled={isUnregistering}
                      className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      {isUnregistering ? 'Unregistering...' : 'Unregister'}
                    </button>
                  ) : (
                    <button
                      onClick={handleRegisterForEvent}
                      disabled={isRegistering}
                      className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-accent/90 transition-colors"
                    >
                      {isRegistering ? 'Registering...' : 'Register Now'}
                    </button>
                  )}
                </div>
              )}
              
              {isOrganizer && (
                <div className="mt-6">
                  <Link
                    to={`/organizer/events/${event.id}/manage`}
                    className="block w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Manage Event
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="hidden md:block space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CalendarDays className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="font-medium">Registrations</p>
                    <p className="text-gray-600">{event.registrations.length} registered</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Registration Box */}
            {userRole === 'student' && !isOrganizer && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {isRegistered ? 'You\'re Registered!' : 'Register for this Event'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isRegistered 
                    ? 'You have already registered for this event.'
                    : 'Secure your spot at this event by registering now.'}
                </p>
                
                {isRegistered ? (
                  <button
                    onClick={handleUnregisterFromEvent}
                    disabled={isUnregistering}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    {isUnregistering ? 'Unregistering...' : 'Unregister'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegisterForEvent}
                    disabled={isRegistering}
                    className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-accent/90 transition-colors"
                  >
                    {isRegistering ? 'Registering...' : 'Register Now'}
                  </button>
                )}
              </div>
            )}
            
            {/* Organizer Actions */}
            {isOrganizer && (
              <div className="bg-primary text-primary-foreground rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p className="mb-4 opacity-90">
                  You are an organizer of this event. Access management options.
                </p>
                <Link
                  to={`/organizer/events/${event.id}/manage`}
                  className="block w-full text-center bg-white text-primary font-medium py-2 rounded-md hover:bg-white/90 transition-colors"
                >
                  Manage Event
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetails;
