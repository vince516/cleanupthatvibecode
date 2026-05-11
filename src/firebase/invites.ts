import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './config';
import type { Invite, InviteStatus } from '@/domain/types';

const INVITES = 'invites';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LEN = 8;
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function generateCode(): string {
  const buf = new Uint8Array(CODE_LEN);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < CODE_LEN; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(buf, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

export function formatCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export function parseCode(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export async function createInvite(args: {
  parentUid: string;
  childId: string;
  childName: string;
}): Promise<Invite> {
  const code = generateCode();
  const expiresAt = Date.now() + TTL_MS;
  await setDoc(doc(db, INVITES, code), {
    parentUid: args.parentUid,
    childId: args.childId,
    childName: args.childName,
    status: 'pending' satisfies InviteStatus,
    createdAt: serverTimestamp(),
    expiresAt,
  });
  return {
    code,
    parentUid: args.parentUid,
    childId: args.childId,
    childName: args.childName,
    status: 'pending',
    createdAt: Date.now(),
    expiresAt,
  };
}

export async function listInvitesForChild(childId: string): Promise<Invite[]> {
  const q = query(
    collection(db, INVITES),
    where('childId', '==', childId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function revokeInvite(code: string): Promise<void> {
  await updateDoc(doc(db, INVITES, code), { status: 'revoked' satisfies InviteStatus });
}

export async function deleteInvite(code: string): Promise<void> {
  await deleteDoc(doc(db, INVITES, code));
}

export async function redeemInvite(code: string): Promise<{ childId: string; childName: string }> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const ref = doc(db, INVITES, code);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Invite code not found.');
  const invite = fromDoc(snap.id, snap.data());
  if (invite.status !== 'pending') throw new Error(`This code is ${invite.status}.`);
  if (invite.expiresAt < Date.now()) {
    await updateDoc(ref, { status: 'expired' satisfies InviteStatus });
    throw new Error('This code has expired.');
  }
  if (invite.parentUid === user.uid) {
    throw new Error("You can't redeem your own invite.");
  }

  await updateDoc(doc(db, 'children', invite.childId), { slpUid: user.uid });
  await updateDoc(ref, {
    status: 'redeemed' satisfies InviteStatus,
    redeemedBy: user.uid,
    redeemedAt: Date.now(),
  });
  return { childId: invite.childId, childName: invite.childName };
}

function fromDoc(code: string, data: Record<string, unknown>): Invite {
  const created = data.createdAt as Timestamp | undefined;
  return {
    code,
    parentUid: data.parentUid as string,
    childId: data.childId as string,
    childName: data.childName as string,
    status: (data.status as InviteStatus) ?? 'pending',
    createdAt: created ? created.toMillis() : Date.now(),
    expiresAt: (data.expiresAt as number) ?? 0,
    redeemedBy: data.redeemedBy as string | undefined,
    redeemedAt: data.redeemedAt as number | undefined,
  };
}
