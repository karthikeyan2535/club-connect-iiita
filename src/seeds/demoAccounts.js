
import { supabase } from '../integrations/supabase/client';

// This function creates demo accounts for testing purposes
export const createDemoAccounts = async () => {
  try {
    // First check if accounts already exist to prevent errors
    const { data: existingUsers, error: checkError } = await supabase.auth
      .admin
      .listUsers();
      
    if (checkError) {
      console.error('Error checking for existing demo accounts:', checkError);
      return { success: false, error: checkError };
    }
    
    const emails = ['student@iiita.ac.in', 'organizer@iiita.ac.in'];
    const existingEmails = existingUsers?.users?.filter(user => 
      emails.includes(user.email)
    ).map(user => user.email) || [];
    
    // Skip creation if accounts already exist
    if (existingEmails.length >= 2) {
      console.log('Demo accounts already exist, skipping creation');
      return { success: true, message: 'Demo accounts already exist' };
    }
    
    // Create student account if needed
    if (!existingEmails.includes('student@iiita.ac.in')) {
      const studentResult = await supabase.auth.signUp({
        email: 'student@iiita.ac.in',
        password: 'password123',
        options: {
          data: {
            full_name: 'Demo Student',
            user_role: 'student'
          },
          emailRedirectTo: window.location.origin + '/verify-email'
        }
      });
      
      if (studentResult.error) {
        console.error('Error creating student demo account:', studentResult.error);
      } else {
        console.log('Student demo account created successfully');
      }
    }
    
    // Create organizer account if needed
    if (!existingEmails.includes('organizer@iiita.ac.in')) {
      const organizerResult = await supabase.auth.signUp({
        email: 'organizer@iiita.ac.in',
        password: 'password123',
        options: {
          data: {
            full_name: 'Demo Organizer',
            user_role: 'organizer'
          },
          emailRedirectTo: window.location.origin + '/verify-email'
        }
      });
      
      if (organizerResult.error) {
        console.error('Error creating organizer demo account:', organizerResult.error);
      } else {
        console.log('Organizer demo account created successfully');
      }
    }
    
    // Report success
    console.log('Demo accounts created or verified for testing');
    return { success: true };
  } catch (error) {
    console.error('Error creating demo accounts:', error);
    return { success: false, error };
  }
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

// Function to create demo accounts on app initialization with better error handling
export const initializeDemoAccounts = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Already logged in, no need to initialize demo accounts
      console.log('User already logged in, skipping demo accounts initialization');
      return;
    }
    
    console.log('Creating demo accounts...');
    await createDemoAccounts();
  } catch (e) {
    console.error('Error initializing demo accounts:', e);
  }
};
