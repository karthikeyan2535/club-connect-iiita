
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight } from 'lucide-react';

const ClubCard = ({ club }) => {
  const { id, name, description, category, memberCount, upcomingEvents, image } = club;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={image || 'https://via.placeholder.com/400x200?text=Club+Image'} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
          {category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{memberCount} Members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{upcomingEvents} Upcoming</span>
          </div>
        </div>
        
        <Link 
          to={`/clubs/${id}`}
          className="flex items-center justify-center w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          View Club <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ClubCard;
