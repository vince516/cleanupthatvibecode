import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { ChildProfile } from '@/domain/types';

const CHILDREN = 'children';

export async function listChildrenForParent(parentUid: string): Promise<ChildProfile[]> {
  const q = query(
    collection(db, CHILDREN),
    where('parentUid', '==', parentUid),
    orderBy('createdAt', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function listChildrenForSlp(slpUid: string): Promise<ChildProfile[]> {
  const q = query(
    collection(db, CHILDREN),
    where('slpUid', '==', slpUid),
    orderBy('createdAt', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function createChild(args: {
  parentUid: string;
  name: string;
  primaryLanguage: ChildProfile['primaryLanguage'];
  dob?: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, CHILDREN), {
    parentUid: args.parentUid,
    name: args.name,
    primaryLanguage: args.primaryLanguage,
    dob: args.dob ?? null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function setChildCurrentCourse(childId: string, courseId: string): Promise<void> {
  await updateDoc(doc(db, CHILDREN, childId), { currentCourseId: courseId });
}

function fromDoc(id: string, data: Record<string, unknown>): ChildProfile {
  const created = data.createdAt as Timestamp | undefined;
  return {
    id,
    parentUid: data.parentUid as string,
    slpUid: data.slpUid as string | undefined,
    name: data.name as string,
    dob: data.dob as string | undefined,
    primaryLanguage: (data.primaryLanguage as ChildProfile['primaryLanguage']) ?? 'filipino',
    currentCourseId: data.currentCourseId as string | undefined,
    createdAt: created ? created.toMillis() : Date.now(),
  };
}
