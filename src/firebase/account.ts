import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth, db } from './config';

interface ExportBundle {
  exportedAt: string;
  policyVersion: string | undefined;
  user: Record<string, unknown> | null;
  children: Record<string, unknown>[];
  sessionLogs: Record<string, unknown>[];
}

export async function exportUserData(): Promise<ExportBundle> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const uid = user.uid;

  const [userDocSnap, childrenSnap, logsSnap] = await Promise.all([
    getDocs(query(collection(db, 'users'), where('__name__', '==', uid))),
    getDocs(query(collection(db, 'children'), where('parentUid', '==', uid))),
    getDocs(query(collection(db, 'sessionLogs'), where('userId', '==', uid))),
  ]);

  const userData = userDocSnap.docs[0]?.data() ?? null;

  return {
    exportedAt: new Date().toISOString(),
    policyVersion:
      typeof (userData as { consent?: { policyVersion?: string } } | null)?.consent
        ?.policyVersion === 'string'
        ? (userData as { consent: { policyVersion: string } }).consent.policyVersion
        : undefined,
    user: userData ? { uid, ...userData } : null,
    children: childrenSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    sessionLogs: logsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  };
}

export async function deleteAccount(password: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Not signed in');
  const uid = user.uid;

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);

  const [childrenSnap, logsSnap] = await Promise.all([
    getDocs(query(collection(db, 'children'), where('parentUid', '==', uid))),
    getDocs(query(collection(db, 'sessionLogs'), where('userId', '==', uid))),
  ]);

  const batch = writeBatch(db);
  logsSnap.docs.forEach((d) => batch.delete(d.ref));
  childrenSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, 'users', uid));
  await batch.commit();

  await deleteUser(user);
}
