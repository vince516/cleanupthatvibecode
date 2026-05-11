import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Consent, Role, UserProfile } from '@/domain/types';

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
    consent: data.consent ?? {
      policyVersion: 'pre-1.0',
      acceptedAt: created ? created.toMillis() : Date.now(),
      privacyPolicy: false,
      parentalConsent: false,
      marketingEmail: false,
      analytics: false,
    },
    createdAt: created ? created.toMillis() : Date.now(),
  };
}

export async function createUserProfile(args: {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
  consent: Consent;
}): Promise<void> {
  await setDoc(doc(db, USERS, args.uid), {
    email: args.email,
    role: args.role,
    displayName: args.displayName ?? null,
    consent: args.consent,
    createdAt: serverTimestamp(),
  });
}

export async function updateConsent(
  uid: string,
  patch: Partial<Pick<Consent, 'marketingEmail' | 'analytics'>>,
): Promise<void> {
  const updates: Record<string, boolean> = {};
  if (patch.marketingEmail !== undefined) {
    updates['consent.marketingEmail'] = patch.marketingEmail;
  }
  if (patch.analytics !== undefined) {
    updates['consent.analytics'] = patch.analytics;
  }
  if (Object.keys(updates).length === 0) return;
  await updateDoc(doc(db, USERS, uid), updates);
}
