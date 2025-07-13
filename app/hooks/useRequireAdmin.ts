import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useUser } from '@/contexts/UserContext';

export function useRequireAdmin() {
  const { user, userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.replace('/sign-in');
      return;
    }
    if (user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, userLoading, router]);

  return { user, userLoading };
}
