import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, Role } from '@/domain/types';

const USERS = 'users';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  const created = data.createdAt as Timestamp | undefined;
  return {
    uid,
    email: data.email,
    displayName: data.displayName,
    role: data.role,
    createdAt: created ? created.toMillis() : Date.now(),
  };
}

export async function createUserProfile(args: {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
}): Promise<void> {
  await setDoc(doc(db, USERS, args.uid), {
    email: args.email,
    role: args.role,
    displayName: args.displayName ?? null,
    createdAt: serverTimestamp(),
  });
}
