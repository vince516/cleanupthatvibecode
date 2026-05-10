# Mylo Speech Buddy — streaming app

A mobile-first Expo app for SLP-supervised, parent-mediated home follow-through. Speech is the first discipline (built from the Mylo Implementation Program v1.0); OT, sensory, social, and daily-living are sibling categories.

The pedagogy — Vygotsky's **ZPD**, **scaffolding**, and **slow handover** — is encoded directly in the runtime, not just in copy:

| Concept | Where it lives in code |
| --- | --- |
| ZPD (entry placement) | Course ordering + per-course `framework` + carrier-phrase gating in `src/domain/seed.ts` |
| Scaffolding (4-phase session) | `src/components/SessionTimer.tsx` runs Warm-up → Video → Practice → Log with auto-advance and haptic transitions |
| Scaffolding (5-second wait) | `src/components/WaitTimer.tsx` — single tap, runs a silent timer so parents don't fill the silence |
| Slow handover (prompt fade) | `src/components/PromptHierarchy.tsx` — explicit 4-step model → soft re-model → partial-access → physical |
| Slow handover (data) | `DailyLogForm` records `prompted` vs spontaneous per target word, written to Firestore for SLP review |

## Tech

- **Expo SDK 52** + **Expo Router** (typed routes)
- **expo-video** for HLS streaming
- **Firebase** Auth + Firestore + Storage (`firebase` JS SDK)
- TypeScript strict, path alias `@/*` → `./src/*`

## Setup

```bash
npm install
cp .env.example .env
# fill in EXPO_PUBLIC_FIREBASE_* values from your Firebase project
# set EXPO_PUBLIC_VIDEO_CDN_BASE to your CDN's HLS root, e.g.
#   https://customer-xxxx.cloudflarestream.com  (Cloudflare Stream)
#   https://stream.mux.com                       (Mux)
#   https://cdn.bunny.net/mylo                   (Bunny.net)

npm run start            # Expo dev server (scan QR with Expo Go on Android/iOS)
npm run android          # boot Android emulator
npm run ios              # boot iOS simulator
npm run typecheck        # strict TS check
```

## Video CDN

`src/domain/seed.ts` builds video URLs as
`${EXPO_PUBLIC_VIDEO_CDN_BASE}/<discipline>/c<course>/e<exercise>/master.m3u8`.
Replace `master.m3u8` with whatever your CDN serves (`.m3u8`, signed URL, MP4, etc.). For private content, swap the static URL for a function that fetches a signed playback URL from Firebase Functions.

`expo-video` plays HLS natively on iOS/Android and via hls.js on web — no extra setup needed for adaptive bitrate.

## Firebase

Create a Firebase project, enable **Authentication → Email/Password**, and **Firestore (production mode)**. Collections used by the app:

- `users/{uid}` — `email`, `displayName`, `role: parent | slp | admin`, `createdAt`
- `children/{childId}` — `parentUid`, optional `slpUid`, `name`, `primaryLanguage`, optional `dob`, optional `currentCourseId`
- `sessionLogs/{logId}` — `userId`, `childId`, `courseId`, `exerciseId`, `language`, `attempts[]`, `highlight`, `createdAt`
- `targetSets/{childId}/{blockId}` — *(not in MVP yet)* 4-week target blocks with mastery tracking

Starter Firestore rules — paste into the Rules tab. Tighten before production.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid;
    }

    match /children/{childId} {
      allow create: if request.auth != null
        && request.resource.data.parentUid == request.auth.uid;
      allow read, update: if request.auth != null
        && (resource.data.parentUid == request.auth.uid
            || resource.data.slpUid == request.auth.uid);
    }

    match /sessionLogs/{logId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null
        && resource.data.userId == request.auth.uid;
      // SLP read of child's logs requires looking up the child doc — add
      // a custom claim or denormalize slpUid onto the log to keep this rule cheap.
    }
  }
}
```

### Auth flow

- Unauthenticated users are redirected to `/(auth)/sign-in` by the route guard in `app/_layout.tsx`.
- Sign-up asks for **role** (parent or SLP). Parents also enter a child first name; that creates the first `children/` doc automatically so logs have a real target.
- The auth store (`src/state/auth.ts`, Zustand) listens to `onAuthStateChanged`, hydrates the `UserProfile` and `children`, and exposes `activeChildId` to any screen.
- The **You** screen (`/you`) shows role, lists children, lets parents add siblings, and signs out.

### React Native auth persistence

`src/firebase/config.ts` calls `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })` on iOS/Android so users stay signed in across app restarts. On web it falls back to the default browser persistence.

## What's in the MVP

- Email/password auth with parent vs SLP role at sign-up
- Auto-creates the first `children/` doc on parent sign-up
- Route guard redirects unauthenticated traffic to `/sign-in`
- Home → role-aware header + active-child indicator → category grid (Communication, Occupational, Sensory, Social, Daily Living)
- Category → course list (3 SLP courses + 1 OT course seeded from the Mylo PDF)
- Course → learning goal, pedagogy principle, prompt hierarchy, exercise list
- Session screen with the 4-phase timer; video phase reveals the player; log phase reveals the daily log form
- Daily log writes to Firestore against the active child + signed-in user
- You screen: role display, child picker, add sibling, sign out

## What's next (not in this MVP)

- Parent ↔ SLP linking flow (invite code or QR) so SLPs see their caseload
- SLP intake (PLS-5 + Preference Inventory) and the course-entry decision tree
- Mastery rules engine (≥80% spontaneous × 3 sessions → advance)
- Monthly SLP review dashboard with log read access
- Offline log queue (AsyncStorage → Firestore on reconnect)
- Transcoding / signed URL pipeline (Firebase Function in front of the CDN)
- Filipino i18n strings table (currently inlined in seed)
- Phone OTP auth (more accessible than email for the target population)

## Project layout

```
app/                       Expo Router screens
  _layout.tsx              Root stack + auth listener + route guard
  index.tsx                Home (role-aware, category grid)
  you.tsx                  Profile, children, sign out
  (auth)/                  Public sign-in / sign-up
  category/[categoryId].tsx
  course/[courseId].tsx
  session/[exerciseId].tsx Modal with SessionTimer + VideoPlayer + DailyLogForm
src/
  components/              Pedagogy + UI primitives (SessionTimer, WaitTimer, etc.)
  domain/                  Types + local seed (categories, courses, exercises)
  firebase/                config, auth, users, children, logs (Firestore wrappers)
  state/                   Zustand auth store (user, profile, children, activeChildId)
  theme/                   Colors and spacing
```
