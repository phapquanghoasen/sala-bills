'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setUser({
          id: firebaseUser.uid,
          role: userData.role,
          email: userData.email,
          printerIp: userData.printerIp,
          createdAt: userData.createdAt,
        });
      } else {
        setUser(null);
      }
      setUserLoading(false);
    });
    return () => unsub();
  }, []);

  return <UserContext.Provider value={{ user, userLoading }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
