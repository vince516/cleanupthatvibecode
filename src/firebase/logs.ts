import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { SessionLog } from '@/domain/types';

const LOGS = 'sessionLogs';

export async function saveSessionLog(
  log: Omit<SessionLog, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, LOGS), {
    ...log,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listLogsForChild(childId: string): Promise<SessionLog[]> {
  const q = query(
    collection(db, LOGS),
    where('childId', '==', childId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const createdAt = data.createdAt as Timestamp | undefined;
    return {
      id: d.id,
      ...data,
      createdAt: createdAt ? createdAt.toMillis() : Date.now(),
    } as SessionLog;
  });
}
