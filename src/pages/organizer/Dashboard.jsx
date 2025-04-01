
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import MainLayout from '../../components/layout/MainLayout';
import ClubCard from '../../components/clubs/ClubCard';
import EventCard from '../../components/events/EventCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { getClubsByOrganizer } from '../../services/clubs';
import { getEventsByOrganizer } from '../../services/events';
import { Calendar, Users, DollarSign, PlusCircle } from 'lucide-react';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const userRole = localStorage.getItem('userRole');
  
  // Calculate total members and budget
  const totalMembers = myClubs.reduce((sum, club) => sum + club.memberCount, 0);
  const totalBudget = myClubs.reduce((sum, club) => sum + club.budget.allocated, 0);
  
  useEffect(() => {
    // Check if user is logged in and is an organizer
    if (!user || userRole !== 'organizer') {
      toast({
        title: "Access denied",
        description: "You need to login as a club organizer to access this page",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch clubs and events for the organizer
        const clubs = await getClubsByOrganizer(user.id);
        const events = await getEventsByOrganizer(user.id);
        
        // Sort events by date
        const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setMyClubs(clubs);
        setMyEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, userRole, navigate, toast]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Dashboard Header */}
      <section className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Organizer Dashboard</h1>
          <p className="opacity-90">Welcome back, {user.name}!</p>
        </div>
      </section>
      
      {/* Dashboard Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard
              title="My Clubs"
              value={myClubs.length}
              description="Clubs you manage"
              icon={<Users className="h-6 w-6" />}
            />
            
            <DashboardCard
              title="Total Members"
              value={totalMembers}
              description="Across all clubs"
              icon={<Users className="h-6 w-6" />}
              className="bg-secondary/10"
              iconClassName="bg-secondary/20 text-secondary"
            />
            
            <DashboardCard
              title="Events"
              value={myEvents.length}
              description="Events you organize"
              icon={<Calendar className="h-6 w-6" />}
              className="bg-accent/10"
              iconClassName="bg-accent/20 text-accent"
            />
            
            <DashboardCard
              title="Total Budget"
              value={`₹${totalBudget}`}
              description="Combined club budgets"
              icon={<DollarSign className="h-6 w-6" />}
              className="bg-green-50"
              iconClassName="bg-green-100 text-green-600"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              to="/organizer/events/create"
              className="flex items-center justify-center bg-accent text-white py-3 px-4 rounded-md hover:bg-accent/90 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New Event
            </Link>
            
            <Link
              to="/organizer/clubs/manage"
              className="flex items-center justify-center bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Manage Club Members
            </Link>
          </div>
          
          {/* My Clubs */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Clubs</h2>
            </div>
            
            {myClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.map(club => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No clubs assigned yet</h3>
                <p className="text-gray-600 mb-6">Contact the SAC administration to get club organizer permissions</p>
              </div>
            )}
          </div>
          
          {/* My Events */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Events</h2>
              <Link to="/organizer/events/create" className="text-primary hover:text-secondary transition-colors">
                Create new event
              </Link>
            </div>
            
            {myEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No events created yet</h3>
                <p className="text-gray-600 mb-6">Create an event for your club</p>
                <Link 
                  to="/organizer/events/create" 
                  className="inline-block bg-accent text-white py-2 px-6 rounded-md hover:bg-accent/90 transition-colors"
                >
                  Create Event
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default OrganizerDashboard;
