
import { supabase } from '../integrations/supabase/client';

// This function creates demo accounts for testing purposes
export const createDemoAccounts = async () => {
  // Create student account
  await supabase.auth.signUp({
    email: 'student@iiita.ac.in',
    password: 'password123',
    options: {
      data: {
        full_name: 'Demo Student',
        user_role: 'student'
      }
    }
  });
  
  // Create organizer account
  await supabase.auth.signUp({
    email: 'organizer@iiita.ac.in',
    password: 'password123',
    options: {
      data: {
        full_name: 'Demo Organizer',
        user_role: 'organizer'
      }
    }
  });
  
  console.log('Demo accounts created for testing');
};

// Export function to manually create accounts if needed
export const getDemoCredentials = () => {
  return [
    {
      type: 'Student',
      email: 'student@iiita.ac.in',
      password: 'password123'
    },
    {
      type: 'Organizer',
      email: 'organizer@iiita.ac.in',
      password: 'password123'
    }
  ];
};
