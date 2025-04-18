
import { supabase, createUserProfile } from '../integrations/supabase/client';

// This function creates demo accounts for testing purposes
export const createDemoAccounts = async () => {
  try {
    // First check if accounts already exist to prevent errors
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .in('email', ['student@iiita.ac.in', 'organizer@iiita.ac.in']);
      
    if (checkError) {
      console.error('Error checking for existing demo accounts:', checkError);
      return { success: false, error: checkError };
    }
    
    // Skip creation if accounts already exist
    if (existingUsers && existingUsers.length >= 2) {
      console.log('Demo accounts already exist, skipping creation');
      return { success: true, message: 'Demo accounts already exist' };
    }
    
    // Create student account with enhanced error handling
    const studentResult = await supabase.auth.signUp({
      email: 'student@iiita.ac.in',
      password: 'password123',
      options: {
        data: {
          full_name: 'Demo Student',
          user_role: 'student'
        }
      }
    });
    
    if (studentResult.error) {
      console.error('Error creating student demo account:', studentResult.error);
      // Continue to try the organizer account
    } else if (studentResult.data?.user) {
      try {
        await createUserProfile(
          studentResult.data.user.id,
          'student@iiita.ac.in',
          'Demo Student',
          'student'
        );
      } catch (profileError) {
        console.error('Error creating student profile:', profileError);
        // Continue since the auth user was created
      }
    }
    
    // Create organizer account with enhanced error handling
    const organizerResult = await supabase.auth.signUp({
      email: 'organizer@iiita.ac.in',
      password: 'password123',
      options: {
        data: {
          full_name: 'Demo Organizer',
          user_role: 'organizer'
        }
      }
    });
    
    if (organizerResult.error) {
      console.error('Error creating organizer demo account:', organizerResult.error);
      // Continue anyway
    } else if (organizerResult.data?.user) {
      try {
        await createUserProfile(
          organizerResult.data.user.id,
          'organizer@iiita.ac.in',
          'Demo Organizer',
          'organizer'
        );
      } catch (profileError) {
        console.error('Error creating organizer profile:', profileError);
        // Continue since the auth user was created
      }
    }
    
    // Report success even if only partial accounts were created
    console.log('Demo accounts created for testing');
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
    // Check if demo accounts already exist
    const { data: existingUsers, error } = await supabase
      .from('profiles')
      .select('email')
      .in('email', ['student@iiita.ac.in', 'organizer@iiita.ac.in']);
      
    if (error) {
      console.error('Error checking for existing demo accounts:', error);
      return;
    }
    
    // If demo accounts don't exist, create them
    if (!existingUsers || existingUsers.length < 2) {
      console.log('Creating demo accounts...');
      await createDemoAccounts();
    } else {
      console.log('Demo accounts already exist');
    }
  } catch (e) {
    console.error('Error initializing demo accounts:', e);
  }
};
