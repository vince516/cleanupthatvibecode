import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile } from './users';
import { createChild } from './children';
import { useAuth } from '@/state/auth';
import type { Role } from '@/domain/types';

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(args: {
  email: string;
  password: string;
  role: Role;
  displayName?: string;
  childName?: string;
}): Promise<void> {
  const cred = await createUserWithEmailAndPassword(auth, args.email, args.password);
  if (args.displayName) {
    await updateProfile(cred.user, { displayName: args.displayName });
  }
  await createUserProfile({
    uid: cred.user.uid,
    email: args.email,
    role: args.role,
    displayName: args.displayName,
  });
  if (args.role === 'parent' && args.childName) {
    await createChild({
      parentUid: cred.user.uid,
      name: args.childName,
      primaryLanguage: 'filipino',
    });
  }
  await useAuth.getState()._hydrate(cred.user);
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}
