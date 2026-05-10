import { useEffect } from 'react';
import { create } from 'zustand';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { getUserProfile } from '@/firebase/users';
import { listChildrenForParent, listChildrenForSlp } from '@/firebase/children';
import type { ChildProfile, UserProfile } from '@/domain/types';

interface AuthState {
  initialized: boolean;
  user: User | null;
  profile: UserProfile | null;
  children: ChildProfile[];
  activeChildId: string | null;
  setActiveChildId: (id: string | null) => void;
  refreshChildren: () => Promise<void>;
  _hydrate: (user: User | null) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  initialized: false,
  user: null,
  profile: null,
  children: [],
  activeChildId: null,
  setActiveChildId: (id) => set({ activeChildId: id }),

  refreshChildren: async () => {
    const { user, profile } = get();
    if (!user || !profile) return;
    const list =
      profile.role === 'slp'
        ? await listChildrenForSlp(user.uid)
        : await listChildrenForParent(user.uid);
    set({
      children: list,
      activeChildId: get().activeChildId ?? list[0]?.id ?? null,
    });
  },

  _hydrate: async (user) => {
    if (!user) {
      set({
        initialized: true,
        user: null,
        profile: null,
        children: [],
        activeChildId: null,
      });
      return;
    }
    const profile = await getUserProfile(user.uid);
    let children: ChildProfile[] = [];
    if (profile) {
      children =
        profile.role === 'slp'
          ? await listChildrenForSlp(user.uid)
          : await listChildrenForParent(user.uid);
    }
    set({
      initialized: true,
      user,
      profile,
      children,
      activeChildId: children[0]?.id ?? null,
    });
  },
}));

let unsubscribe: (() => void) | null = null;

export function useAuthListener(): void {
  const hydrate = useAuth((s) => s._hydrate);
  useEffect(() => {
    if (unsubscribe) return;
    unsubscribe = onAuthStateChanged(auth, (user) => {
      void hydrate(user);
    });
    return () => {
      unsubscribe?.();
      unsubscribe = null;
    };
  }, [hydrate]);
}
