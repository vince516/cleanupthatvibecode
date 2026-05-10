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

Create a Firebase project, enable **Authentication** (Email/Phone for parents, Email for SLPs) and **Firestore**. Suggested collections:

- `users/{uid}` — role: `parent` | `slp` | `admin`
- `children/{childId}` — `parentUid`, `slpUid`, `dob`, current `courseId`
- `sessionLogs/{logId}` — written by `DailyLogForm`; structure in `src/domain/types.ts`
- `targetSets/{childId}/{blockId}` — 4-week target blocks with mastery tracking

Minimal Firestore rules to start with:

```
match /sessionLogs/{logId} {
  allow read, write: if request.auth != null
    && request.auth.uid == request.resource.data.userId;
}
```

## What's in the MVP

- Home → category grid (Communication, Occupational, Sensory, Social, Daily Living)
- Category → course list (3 SLP courses + 1 OT course seeded from the Mylo PDF)
- Course → learning goal, pedagogy principle, prompt hierarchy, exercise list
- Session screen with the 4-phase timer; the video phase reveals the player; the log phase reveals the daily log form
- Firestore write for daily logs

## What's next (not in this MVP)

- Auth flow (sign-in screen, `parent` vs `slp` role)
- SLP intake (PLS-5 + Preference Inventory) and the course-entry decision tree
- Mastery rules engine (≥80% spontaneous × 3 sessions → advance)
- Monthly SLP review dashboard
- Offline log queue (AsyncStorage → Firestore on reconnect)
- Transcoding / signed URL pipeline (Firebase Function in front of the CDN)
- Filipino i18n strings table (currently inlined in seed)

## Project layout

```
app/                       Expo Router screens
  _layout.tsx              Root stack
  index.tsx                Home (category grid)
  category/[categoryId].tsx
  course/[courseId].tsx
  session/[exerciseId].tsx Modal with SessionTimer + VideoPlayer + DailyLogForm
src/
  components/              Pedagogy + UI primitives
  domain/                  Types + local seed (categories, courses, exercises)
  firebase/                config + logs.ts (Firestore writes)
  theme/                   Colors and spacing
```
