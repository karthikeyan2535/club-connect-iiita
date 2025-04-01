
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ClubCard from '../../components/clubs/ClubCard';
import { getClubs } from '../../services/clubs';
import { Search, Filter } from 'lucide-react';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const allClubs = await getClubs();
        setClubs(allClubs);
        setFilteredClubs(allClubs);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClubs();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever searchTerm or categoryFilter changes
    let filtered = clubs;
    
    if (searchTerm) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(club => club.category === categoryFilter);
    }
    
    setFilteredClubs(filtered);
  }, [searchTerm, categoryFilter, clubs]);
  
  // Get unique categories from clubs
  const categories = [...new Set(clubs.map(club => club.category))];
  
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Clubs</h1>
          <p className="text-lg opacity-90 max-w-xl">
            Discover and join clubs that match your interests at IIITA. Explore a variety of cultural, technical, and sports clubs.
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
                placeholder="Search clubs by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Clubs Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading clubs...</p>
            </div>
          ) : filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No clubs found matching your filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                }}
                className="mt-4 text-primary hover:text-secondary"
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

export default ClubsPage;
