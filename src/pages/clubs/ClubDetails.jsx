
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import MainLayout from '../../components/layout/MainLayout';
import EventCard from '../../components/events/EventCard';
import { getClubById, joinClub, leaveClub } from '../../services/clubs';
import { getEventsByClub } from '../../services/events';
import { Users, Calendar, Clock, ArrowLeft } from 'lucide-react';

const ClubDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const userRole = localStorage.getItem('userRole') || null;
  
  const isMember = user && club?.members.includes(user.id);
  const isOrganizer = user && userRole === 'organizer' && club?.organizers.includes(user.id);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch club details and events
        const clubData = await getClubById(id);
        
        if (!clubData) {
          toast({
            title: "Error",
            description: "Club not found",
            variant: "destructive",
          });
          return;
        }
        
        setClub(clubData);
        
        // Fetch events for this club
        const clubEvents = await getEventsByClub(id);
        setEvents(clubEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load club details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);
  
  const handleJoinClub = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to join clubs",
        variant: "destructive",
      });
      return;
    }
    
    setIsJoining(true);
    
    try {
      await joinClub(id, user.id);
      
      // Update local state
      setClub(prevClub => ({
        ...prevClub,
        members: [...prevClub.members, user.id],
        memberCount: prevClub.memberCount + 1
      }));
      
      toast({
        title: "Success",
        description: `You have joined ${club.name}`,
      });
    } catch (error) {
      console.error('Error joining club:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join club",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleLeaveClub = async () => {
    if (!user) {
      return;
    }
    
    setIsLeaving(true);
    
    try {
      await leaveClub(id, user.id);
      
      // Update local state
      setClub(prevClub => ({
        ...prevClub,
        members: prevClub.members.filter(memberId => memberId !== user.id),
        memberCount: prevClub.memberCount - 1
      }));
      
      toast({
        title: "Success",
        description: `You have left ${club.name}`,
      });
    } catch (error) {
      console.error('Error leaving club:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to leave club",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading club details...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!club) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Club not found</h2>
          <p className="mb-6">The requested club does not exist or has been removed.</p>
          <Link to="/clubs" className="flex items-center justify-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clubs
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Club Header */}
      <section 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${club.image || 'https://via.placeholder.com/1200x400?text=Club+Cover'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 py-6 relative text-white">
          <Link to="/clubs" className="flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Clubs
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{club.name}</h1>
              <div className="flex items-center mt-2">
                <span className="bg-accent text-white px-3 py-1 text-sm font-medium rounded-full">
                  {club.category}
                </span>
                <div className="flex items-center ml-4">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{club.memberCount} Members</span>
                </div>
              </div>
            </div>
            
            {userRole === 'student' && !isOrganizer && (
              <div>
                {isMember ? (
                  <button
                    onClick={handleLeaveClub}
                    disabled={isLeaving}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md transition-colors"
                  >
                    {isLeaving ? 'Leaving...' : 'Leave Club'}
                  </button>
                ) : (
                  <button
                    onClick={handleJoinClub}
                    disabled={isJoining}
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors"
                  >
                    {isJoining ? 'Joining...' : 'Join Club'}
                  </button>
                )}
              </div>
            )}
            
            {isOrganizer && (
              <Link
                to={`/organizer/clubs/${club.id}/manage`}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Manage Club
              </Link>
            )}
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-700">{club.description}</p>
            </div>
            
            {/* Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              
              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming events for this club.</p>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Club Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Club Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Upcoming Events</p>
                    <p className="text-gray-600">{events.length} events</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Membership</p>
                    <p className="text-gray-600">{club.memberCount} members</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Regular Activities</p>
                    <p className="text-gray-600">Every Monday and Thursday</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Join Club CTA (for non-members) */}
            {userRole === 'student' && !isMember && !isOrganizer && (
              <div className="bg-primary text-primary-foreground rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">Join {club.name}</h3>
                <p className="mb-4 opacity-90">
                  Become a member today and participate in exciting activities and events.
                </p>
                <button
                  onClick={handleJoinClub}
                  disabled={isJoining}
                  className="w-full bg-white text-primary font-medium py-2 rounded-md hover:bg-white/90 transition-colors"
                >
                  {isJoining ? 'Joining...' : 'Join Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClubDetails;
