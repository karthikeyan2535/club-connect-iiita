
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
  const { id, title, description, date, time, location, club, image } = event;
  
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={image || 'https://via.placeholder.com/400x200?text=Event'} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {club && (
          <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
            {club.name}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{location}</span>
          </div>
        </div>
        
        <Link 
          to={`/events/${id}`}
          className="block w-full bg-accent text-accent-foreground text-center py-2 px-4 rounded-md hover:bg-accent/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
