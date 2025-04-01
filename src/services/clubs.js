
// Club data mock service

// Mock club data
export const clubs = [
  {
    id: 1,
    name: 'Photography Club',
    description: 'Capturing moments and memories around the campus. Learn photography skills and techniques from expert photographers.',
    category: 'Cultural',
    memberCount: 56,
    upcomingEvents: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop',
    organizers: [2],
    members: [1],
    events: [1, 3],
    budget: {
      allocated: 15000,
      spent: 7500,
      items: [
        { id: 1, name: 'Camera Equipment', cost: 5000, status: 'approved' },
        { id: 2, name: 'Exhibition Supplies', cost: 2500, status: 'approved' },
        { id: 3, name: 'Workshop Materials', cost: 3500, status: 'pending' }
      ]
    }
  },
  {
    id: 2,
    name: 'Coding Club',
    description: 'Enhance your programming skills and participate in hackathons and coding competitions with like-minded peers.',
    category: 'Technical',
    memberCount: 87,
    upcomingEvents: 3,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    organizers: [2],
    members: [],
    events: [2, 5],
    budget: {
      allocated: 20000,
      spent: 12000,
      items: [
        { id: 1, name: 'Workshop Refreshments', cost: 5000, status: 'approved' },
        { id: 2, name: 'Hackathon Prizes', cost: 7000, status: 'approved' },
        { id: 3, name: 'Server Hosting', cost: 8000, status: 'pending' }
      ]
    }
  },
  {
    id: 3,
    name: 'Dance Club',
    description: 'Express yourself through various dance forms and perform at college events and competitions.',
    category: 'Cultural',
    memberCount: 42,
    upcomingEvents: 1,
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=1970&auto=format&fit=crop',
    organizers: [],
    members: [1],
    events: [4],
    budget: {
      allocated: 12000,
      spent: 6000,
      items: [
        { id: 1, name: 'Costumes', cost: 4000, status: 'approved' },
        { id: 2, name: 'Props', cost: 2000, status: 'approved' },
        { id: 3, name: 'Audio Equipment', cost: 6000, status: 'pending' }
      ]
    }
  },
  {
    id: 4,
    name: 'Sports Club',
    description: 'Stay fit and participate in various sports activities and competitions organized throughout the year.',
    category: 'Sports',
    memberCount: 78,
    upcomingEvents: 2,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop',
    organizers: [],
    members: [],
    events: [6],
    budget: {
      allocated: 25000,
      spent: 18000,
      items: [
        { id: 1, name: 'Equipment', cost: 10000, status: 'approved' },
        { id: 2, name: 'Tournament Organization', cost: 8000, status: 'approved' },
        { id: 3, name: 'Training Kits', cost: 7000, status: 'pending' }
      ]
    }
  },
  {
    id: 5,
    name: 'Music Club',
    description: 'Develop your musical talent and perform at various college events. All musical enthusiasts are welcome.',
    category: 'Cultural',
    memberCount: 35,
    upcomingEvents: 1,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    organizers: [],
    members: [],
    events: [],
    budget: {
      allocated: 18000,
      spent: 9000,
      items: [
        { id: 1, name: 'Instruments', cost: 7000, status: 'approved' },
        { id: 2, name: 'Sound Equipment', cost: 2000, status: 'approved' },
        { id: 3, name: 'Workshop Fees', cost: 9000, status: 'pending' }
      ]
    }
  },
  {
    id: 6,
    name: 'Debating Society',
    description: 'Sharpen your communication and critical thinking skills through regular debates and discussions.',
    category: 'Academic',
    memberCount: 29,
    upcomingEvents: 1,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
    organizers: [],
    members: [],
    events: [],
    budget: {
      allocated: 10000,
      spent: 4500,
      items: [
        { id: 1, name: 'Competition Registration', cost: 2500, status: 'approved' },
        { id: 2, name: 'Workshop Materials', cost: 2000, status: 'approved' },
        { id: 3, name: 'Debate Tournament', cost: 5500, status: 'pending' }
      ]
    }
  }
];

export const getClubs = () => {
  return Promise.resolve(clubs);
};

export const getClubById = (id) => {
  const club = clubs.find(club => club.id === parseInt(id));
  return Promise.resolve(club || null);
};

export const getClubsByStudent = (studentId) => {
  const studentClubs = clubs.filter(club => club.members.includes(parseInt(studentId)));
  return Promise.resolve(studentClubs);
};

export const getClubsByOrganizer = (organizerId) => {
  const organizerClubs = clubs.filter(club => club.organizers.includes(parseInt(organizerId)));
  return Promise.resolve(organizerClubs);
};

export const joinClub = (clubId, studentId) => {
  const club = clubs.find(club => club.id === parseInt(clubId));
  
  if (!club) {
    return Promise.reject(new Error('Club not found'));
  }
  
  if (club.members.includes(parseInt(studentId))) {
    return Promise.reject(new Error('Already a member of this club'));
  }
  
  club.members.push(parseInt(studentId));
  club.memberCount += 1;
  
  return Promise.resolve({ success: true, message: 'Successfully joined the club' });
};

export const leaveClub = (clubId, studentId) => {
  const club = clubs.find(club => club.id === parseInt(clubId));
  
  if (!club) {
    return Promise.reject(new Error('Club not found'));
  }
  
  const memberIndex = club.members.indexOf(parseInt(studentId));
  
  if (memberIndex === -1) {
    return Promise.reject(new Error('Not a member of this club'));
  }
  
  club.members.splice(memberIndex, 1);
  club.memberCount -= 1;
  
  return Promise.resolve({ success: true, message: 'Successfully left the club' });
};

export const updateClubBudget = (clubId, budgetItem) => {
  const club = clubs.find(club => club.id === parseInt(clubId));
  
  if (!club) {
    return Promise.reject(new Error('Club not found'));
  }
  
  if (budgetItem.id) {
    // Update existing budget item
    const itemIndex = club.budget.items.findIndex(item => item.id === budgetItem.id);
    
    if (itemIndex !== -1) {
      club.budget.items[itemIndex] = { ...club.budget.items[itemIndex], ...budgetItem };
    } else {
      return Promise.reject(new Error('Budget item not found'));
    }
  } else {
    // Add new budget item
    const newId = Math.max(...club.budget.items.map(item => item.id)) + 1;
    club.budget.items.push({ ...budgetItem, id: newId, status: 'pending' });
  }
  
  return Promise.resolve({ 
    success: true, 
    message: budgetItem.id ? 'Budget item updated' : 'Budget item added',
    budget: club.budget 
  });
};

export const approveBudgetItem = (clubId, itemId) => {
  const club = clubs.find(club => club.id === parseInt(clubId));
  
  if (!club) {
    return Promise.reject(new Error('Club not found'));
  }
  
  const itemIndex = club.budget.items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return Promise.reject(new Error('Budget item not found'));
  }
  
  club.budget.items[itemIndex].status = 'approved';
  club.budget.spent += club.budget.items[itemIndex].cost;
  
  return Promise.resolve({ 
    success: true, 
    message: 'Budget item approved',
    budget: club.budget 
  });
};
