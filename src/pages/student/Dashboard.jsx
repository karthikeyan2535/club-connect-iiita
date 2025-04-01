
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import MainLayout from '../../components/layout/MainLayout';
import ClubCard from '../../components/clubs/ClubCard';
import EventCard from '../../components/events/EventCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { getClubsByStudent } from '../../services/clubs';
import { getEventsByStudent } from '../../services/events';
import { Calendar, UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('userRole');
  
  useEffect(() => {
    console.log("StudentDashboard loaded", { user, userRole });
    
    // Check if user is logged in and is a student
    if (!user || !user.id || userRole !== 'student') {
      toast({
        title: "Access denied",
        description: "You need to login as a student to access this page",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        console.log("Fetching student data for user ID:", user.id);
        
        // Fetch clubs and events for the student
        const clubs = await getClubsByStudent(user.id);
        const events = await getEventsByStudent(user.id);
        
        console.log("Fetched clubs:", clubs);
        console.log("Fetched events:", events);
        
        // Sort events by date
        const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Get upcoming events (filter by date)
        const upcoming = sortedEvents.filter(event => new Date(event.date) >= new Date());
        
        setMyClubs(clubs);
        setMyEvents(sortedEvents);
        setUpcomingEvents(upcoming);
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
  
  // Render loading skeleton when data is being fetched
  if (loading) {
    return (
      <MainLayout>
        <section className="bg-primary text-primary-foreground py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </section>
        
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
            
            {/* Clubs Skeleton */}
            <div className="mb-12">
              <Skeleton className="h-8 w-1/4 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
            
            {/* Events Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Dashboard Header */}
      <section className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="opacity-90">Welcome back, {user.name || 'Student'}!</p>
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
              description="Clubs you've joined"
              icon={<UserCheck className="h-6 w-6" />}
            />
            
            <DashboardCard
              title="My Events"
              value={myEvents.length}
              description="Total events registered"
              icon={<Calendar className="h-6 w-6" />}
              className="bg-secondary/10"
              iconClassName="bg-secondary/20 text-secondary"
            />
            
            <DashboardCard
              title="Upcoming"
              value={upcomingEvents.length}
              description="Events you'll attend"
              icon={<Clock className="h-6 w-6" />}
              className="bg-accent/10"
              iconClassName="bg-accent/20 text-accent"
            />
            
            <DashboardCard
              title="Notifications"
              value="2"
              description="Unread notifications"
              icon={<AlertTriangle className="h-6 w-6" />}
              className="bg-red-50"
              iconClassName="bg-red-100 text-red-500"
            />
          </div>
          
          {/* My Clubs */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Clubs</h2>
              <Link to="/clubs" className="text-primary hover:text-secondary transition-colors">
                Explore more clubs
              </Link>
            </div>
            
            {myClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.map(club => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">You haven't joined any clubs yet</h3>
                <p className="text-gray-600 mb-6">Explore clubs and join ones that interest you</p>
                <Link 
                  to="/clubs" 
                  className="inline-block bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Browse Clubs
                </Link>
              </div>
            )}
          </div>
          
          {/* Upcoming Events */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Upcoming Events</h2>
              <Link to="/events" className="text-primary hover:text-secondary transition-colors">
                Explore more events
              </Link>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                <p className="text-gray-600 mb-6">Register for events to see them here</p>
                <Link 
                  to="/events" 
                  className="inline-block bg-accent text-white py-2 px-6 rounded-md hover:bg-accent/90 transition-colors"
                >
                  Browse Events
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default StudentDashboard;
