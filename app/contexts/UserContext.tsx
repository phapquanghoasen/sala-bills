'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import { auth, db } from '@/firebase/config';

import { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  userLoading: boolean;
};

const UserContext = createContext<UserContextType>({ user: null, userLoading: true });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    let userDocUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, firebaseUser => {
      // Cleanup previous user document listener
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }

      if (firebaseUser) {
        // Set up realtime listener for user document
        userDocUnsubscribe = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          userDoc => {
            const userData = userDoc.exists() ? userDoc.data() : {};
            setUser({
              id: firebaseUser.uid,
              role: userData.role,
              email: userData.email || firebaseUser.email,
              printerClientIp: userData.printerClientIp,
              printerClientPort: userData.printerClientPort,
              printerKitchenIp: userData.printerKitchenIp,
              printerKitchenPort: userData.printerKitchenPort,
              createdAt: userData.createdAt,
            });
            setUserLoading(false);
          },
          error => {
            console.error('Error listening to user document:', error);
            setUserLoading(false);
          }
        );
      } else {
        setUser(null);
        setUserLoading(false);
      }
    });

    // Cleanup function
    return () => {
      authUnsubscribe();
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
      }
    };
  }, []);

  return <UserContext.Provider value={{ user, userLoading }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
