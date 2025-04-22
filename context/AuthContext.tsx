import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router'; 

export type UserRole = 'admin' | 'valet' | 'customer' | null;

interface UserProfile {
  role: UserRole;
  displayName: string;
  phoneNumber: string;
  email: string;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
  
      if (authUser) {
        setIsAuthenticated(true);
        try {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role as UserRole);  // Set role
            setProfile({
              role: userData.role as UserRole,
              displayName: userData.name,
              phoneNumber: userData.phoneNumber,
              email: authUser.email || '',
              uid: authUser.uid,
            });
          } else {
            setRole(null);  // No role found
            setProfile(null);  // No profile
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setRole(null);  // Error fetching role
          setProfile(null);
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);  

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (role === 'admin') {
          router.replace('/(admin)/dashboard');
        } else if (role === 'valet') {
          router.replace('/(valet)/home');
        } else {
          console.log('No role assigned');
          router.replace('/login');
        }
      } else {
        console.log('User not authenticated');
        router.replace('/login');
      }
    }
  }, [role, isAuthenticated, loading, router]);
  

  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };  

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};