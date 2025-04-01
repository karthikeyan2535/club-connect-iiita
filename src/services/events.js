
// Events data mock service

// Mock events data
export const events = [
  {
    id: 1,
    title: 'Photography Exhibition',
    description: 'Annual exhibition showcasing the best photographs taken by members of the Photography Club throughout the academic year.',
    date: '2023-11-15',
    time: '3:00 PM - 7:00 PM',
    location: 'Student Activity Center, IIITA',
    club: { id: 1, name: 'Photography Club' },
    image: 'https://images.unsplash.com/photo-1552334823-ca7f70376378?q=80&w=2070&auto=format&fit=crop',
    registrations: [1],
    organizers: [2]
  },
  {
    id: 2,
    title: 'Hackathon 2023',
    description: 'A 24-hour coding competition where participants will build innovative solutions to real-world problems.',
    date: '2023-10-22',
    time: '9:00 AM - 9:00 AM (Next day)',
    location: 'Computer Center, IIITA',
    club: { id: 2, name: 'Coding Club' },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
    registrations: [],
    organizers: [2]
  },
  {
    id: 3,
    title: 'Photography Workshop',
    description: 'Learn the fundamentals of photography from professional photographers.',
    date: '2023-09-10',
    time: '2:00 PM - 5:00 PM',
    location: 'Lecture Hall 3, IIITA',
    club: { id: 1, name: 'Photography Club' },
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1974&auto=format&fit=crop',
    registrations: [1],
    organizers: [2]
  },
  {
    id: 4,
    title: 'Dance Competition',
    description: 'Annual dance competition featuring various dance forms from classical to contemporary.',
    date: '2023-11-25',
    time: '5:00 PM - 8:00 PM',
    location: 'Auditorium, IIITA',
    club: { id: 3, name: 'Dance Club' },
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1969&auto=format&fit=crop',
    registrations: [1],
    organizers: []
  },
  {
    id: 5,
    title: 'Coding Contest',
    description: 'Weekly competitive programming contest to solve algorithmic problems.',
    date: '2023-10-05',
    time: '6:00 PM - 8:00 PM',
    location: 'Online (Contest Link will be shared)',
    club: { id: 2, name: 'Coding Club' },
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop',
    registrations: [],
    organizers: [2]
  },
  {
    id: 6,
    title: 'Inter-College Sports Tournament',
    description: 'Annual sports tournament featuring various sports like cricket, football, badminton, and more.',
    date: '2023-12-10',
    time: '9:00 AM - 6:00 PM',
    location: 'Sports Complex, IIITA',
    club: { id: 4, name: 'Sports Club' },
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop',
    registrations: [],
    organizers: []
  }
];

export const getEvents = () => {
  return Promise.resolve(events);
};

export const getEventById = (id) => {
  const event = events.find(event => event.id === parseInt(id));
  return Promise.resolve(event || null);
};

export const getEventsByClub = (clubId) => {
  const clubEvents = events.filter(event => event.club.id === parseInt(clubId));
  return Promise.resolve(clubEvents);
};

export const getEventsByStudent = (studentId) => {
  const studentEvents = events.filter(event => event.registrations.includes(parseInt(studentId)));
  return Promise.resolve(studentEvents);
};

export const getEventsByOrganizer = (organizerId) => {
  const organizerEvents = events.filter(event => event.organizers.includes(parseInt(organizerId)));
  return Promise.resolve(organizerEvents);
};

export const registerForEvent = (eventId, studentId) => {
  const event = events.find(event => event.id === parseInt(eventId));
  
  if (!event) {
    return Promise.reject(new Error('Event not found'));
  }
  
  if (event.registrations.includes(parseInt(studentId))) {
    return Promise.reject(new Error('Already registered for this event'));
  }
  
  event.registrations.push(parseInt(studentId));
  
  return Promise.resolve({ success: true, message: 'Successfully registered for the event' });
};

export const unregisterFromEvent = (eventId, studentId) => {
  const event = events.find(event => event.id === parseInt(eventId));
  
  if (!event) {
    return Promise.reject(new Error('Event not found'));
  }
  
  const registrationIndex = event.registrations.indexOf(parseInt(studentId));
  
  if (registrationIndex === -1) {
    return Promise.reject(new Error('Not registered for this event'));
  }
  
  event.registrations.splice(registrationIndex, 1);
  
  return Promise.resolve({ success: true, message: 'Successfully unregistered from the event' });
};

export const createEvent = (eventData) => {
  const newId = Math.max(...events.map(event => event.id)) + 1;
  const newEvent = {
    id: newId,
    ...eventData,
    registrations: [],
    organizers: [parseInt(eventData.organizerId)]
  };
  
  events.push(newEvent);
  
  return Promise.resolve({ success: true, message: 'Event created successfully', event: newEvent });
};

export const updateEvent = (eventId, eventData) => {
  const eventIndex = events.findIndex(event => event.id === parseInt(eventId));
  
  if (eventIndex === -1) {
    return Promise.reject(new Error('Event not found'));
  }
  
  events[eventIndex] = { ...events[eventIndex], ...eventData };
  
  return Promise.resolve({ success: true, message: 'Event updated successfully', event: events[eventIndex] });
};
