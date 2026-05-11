export type Role = 'parent' | 'slp' | 'admin';

export interface Consent {
  policyVersion: string;
  acceptedAt: number;
  privacyPolicy: boolean;
  parentalConsent: boolean;
  marketingEmail: boolean;
  analytics: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  consent: Consent;
  createdAt: number;
}

export interface ChildProfile {
  id: string;
  parentUid: string;
  slpUid?: string;
  name: string;
  dob?: string;
  primaryLanguage: 'filipino' | 'english' | 'both';
  currentCourseId?: string;
  createdAt: number;
}

export type InviteStatus = 'pending' | 'redeemed' | 'revoked' | 'expired';

export interface Invite {
  code: string;
  parentUid: string;
  childId: string;
  childName: string;
  status: InviteStatus;
  createdAt: number;
  expiresAt: number;
  redeemedBy?: string;
  redeemedAt?: number;
}

export type Discipline =
  | 'speech'
  | 'occupational'
  | 'sensory'
  | 'social'
  | 'daily-living';

export interface Category {
  id: string;
  discipline: Discipline;
  title: string;
  subtitle: string;
  description: string;
}

export interface Course {
  id: string;
  categoryId: string;
  order: number;
  title: string;
  weekNumber?: number;
  framework?: string;
  learningGoal: string;
  pedagogyPrinciple: string;
  videoDescription: string;
  exerciseIds: string[];
}

export type ExerciseType = 'video-modeling' | 'naturalistic' | 'imitation';

export interface TargetWord {
  english: string;
  filipino?: string;
  isMcdi?: boolean;
  isPreferenceLinked?: boolean;
}

export type SessionPhase = 'warmup' | 'video' | 'practice' | 'log';

export interface PhaseSpec {
  phase: SessionPhase;
  label: string;
  durationSec: number;
  instructions: string;
}

export interface Exercise {
  id: string;
  courseId: string;
  order: number;
  title: string;
  type: ExerciseType;
  videoUrl?: string;
  durationSec: number;
  phases: PhaseSpec[];
  targetWords: TargetWord[];
  caregiverLanguage: string[];
  commonMistakes: string[];
  generalizationActivities: string[];
  recyclingNote?: string;
}

export type AttemptResult = 'yes' | 'approximation' | 'no';

export interface TargetAttempt {
  word: string;
  result: AttemptResult;
  prompted: boolean;
}

export interface SessionLog {
  id: string;
  userId: string;
  childId: string;
  exerciseId: string;
  courseId: string;
  date: string;
  language: 'filipino' | 'english';
  attempts: TargetAttempt[];
  highlight: string;
  createdAt: number;
}
