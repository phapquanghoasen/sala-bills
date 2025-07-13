import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useUser } from '@/contexts/UserContext';

export function useRequireUser() {
  const { user, userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.replace('/sign-in');
    }
  }, [user, userLoading, router]);

  return { user, userLoading };
}
