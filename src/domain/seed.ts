import type { Category, Course, Exercise, PhaseSpec } from './types';

const CDN = process.env.EXPO_PUBLIC_VIDEO_CDN_BASE ?? 'https://cdn.example.com/mylo';

const standardPhases: PhaseSpec[] = [
  {
    phase: 'warmup',
    label: 'Warm-up',
    durationSec: 3 * 60,
    instructions:
      'No tablet yet. Short, playful routine — tickle game, song, or favorite toy. Get your child happy and engaged before learning starts.',
  },
  {
    phase: 'video',
    label: 'Video modeling',
    durationSec: 10 * 60,
    instructions:
      'Press play. After each modeled word or phrase, pause. Wait 5 full seconds. Respond with warmth to any attempt — never drill.',
  },
  {
    phase: 'practice',
    label: 'Naturalistic practice',
    durationSec: 5 * 60,
    instructions:
      'Tablet off. Use the target words in 2–3 real-play or routine moments. This is where words become truly learned.',
  },
  {
    phase: 'log',
    label: 'Closing + log',
    durationSec: 2 * 60,
    instructions:
      'Celebrate together. Fill in the daily log — one tap per attempt.',
  },
];

export const categories: Category[] = [
  {
    id: 'cat-speech',
    discipline: 'speech',
    title: 'Communication',
    subtitle: 'Speech, AAC, PECS',
    description:
      'SLP-supervised, parent-mediated speech program. 13 courses across 12 weeks, grounded in VB-MAPP, DIR/Floortime, and naturalistic developmental behavioral intervention.',
  },
  {
    id: 'cat-ot',
    discipline: 'occupational',
    title: 'Occupational',
    subtitle: 'Fine motor, ADLs',
    description:
      'OT-guided home follow-through: fine motor, hand strength, self-feeding, dressing.',
  },
  {
    id: 'cat-sensory',
    discipline: 'sensory',
    title: 'Sensory',
    subtitle: 'Regulation & integration',
    description:
      'Sensory diet activities and co-regulation routines for home use.',
  },
  {
    id: 'cat-social',
    discipline: 'social',
    title: 'Social Skills',
    subtitle: 'Interaction & play',
    description: 'Floortime-grounded social engagement and play-based scripts.',
  },
  {
    id: 'cat-daily',
    discipline: 'daily-living',
    title: 'Daily Living',
    subtitle: 'Independence skills',
    description: 'Routine-embedded language and skill-building for daily life.',
  },
];

export const courses: Course[] = [
  {
    id: 'course-slp-1',
    categoryId: 'cat-speech',
    order: 1,
    title: 'Attending & vocal imitation (echoics)',
    weekNumber: 1,
    framework: 'VB-MAPP Level 1',
    learningGoal:
      'Your child will begin to imitate simple sounds and actions after watching a video model.',
    pedagogyPrinciple:
      'DIR/Floortime — Following the child\'s lead. Do not force eyes to the screen. Join their world first.',
    videoDescription:
      'Simple sounds (ah, oh, mmm, buh) and animal sounds paired with hand movements.',
    exerciseIds: ['ex-slp-1-1'],
  },
  {
    id: 'course-slp-2',
    categoryId: 'cat-speech',
    order: 2,
    title: 'Early manding — requesting wants',
    weekNumber: 2,
    framework: 'VB-MAPP Level 1',
    learningGoal:
      'Your child will use a word (or a clear attempt) to ask for something they want.',
    pedagogyPrinciple:
      'DIR/Floortime — Creating circles of communication. Open a circle, wait, close it.',
    videoDescription:
      'A child model requesting preferred items: more, up, go, open, plus 2–3 high-preference items.',
    exerciseIds: ['ex-slp-2-1'],
  },
  {
    id: 'course-slp-3',
    categoryId: 'cat-speech',
    order: 3,
    title: 'Receptive listening — following simple instructions',
    weekNumber: 3,
    framework: 'VB-MAPP Level 1',
    learningGoal:
      'Your child will understand and follow simple instructions like \"come here\" or \"give me ___.\"',
    pedagogyPrinciple:
      'DIR/Floortime — Joining and expanding the child\'s world. Follow first, then introduce.',
    videoDescription:
      'Filipino child model following simple instructions from a friendly adult.',
    exerciseIds: ['ex-slp-3-1'],
  },
  {
    id: 'course-ot-1',
    categoryId: 'cat-ot',
    order: 1,
    title: 'Hand strength & pincer grasp',
    weekNumber: 1,
    learningGoal:
      'Your child will engage in 2–3 fine-motor activities that build pincer grasp.',
    pedagogyPrinciple:
      'Scaffolding — start hand-over-hand, fade to verbal cue, fade to independent.',
    videoDescription:
      'Therapist demonstrates pinch-and-place activities with everyday materials.',
    exerciseIds: ['ex-ot-1-1'],
  },
];

export const exercises: Exercise[] = [
  {
    id: 'ex-slp-1-1',
    courseId: 'course-slp-1',
    order: 1,
    title: 'Sounds, syllables, animal sounds',
    type: 'video-modeling',
    videoUrl: `${CDN}/slp/c1/e1/master.m3u8`,
    durationSec: 20 * 60,
    phases: standardPhases,
    targetWords: [
      { english: 'ah', filipino: 'ah', isPreferenceLinked: false },
      { english: 'oh', filipino: 'oh' },
      { english: 'mmm', filipino: 'mmm' },
      { english: 'ba', filipino: 'ba' },
      { english: 'ma', filipino: 'ma' },
      { english: 'pa', filipino: 'pa' },
      { english: 'meow', filipino: 'ngiyaw', isPreferenceLinked: true },
      { english: 'woof', filipino: 'aw aw', isPreferenceLinked: true },
    ],
    caregiverLanguage: [
      'Pakinggan mo! / Listen! (point to ear)',
      'Ito — AH! / This — AH! (big mouth shape)',
      'Ikaw naman! / Your turn! (wait expectantly)',
      'Magaling! / Great job! (any attempt at all)',
    ],
    commonMistakes: [
      'Holding the child\'s face toward the screen.',
      'Saying the sound 10 times in a row hoping they copy.',
      'Skipping the warm-up.',
    ],
    generalizationActivities: [
      'Bathtime: make splashing sounds; wait for child to copy.',
      'Mealtime: make \"mmm\" when food is delicious; wait.',
      'Before sleep: hum a simple song and pause for them to join.',
    ],
    recyclingNote: 'Foundation course — no recycling required.',
  },
  {
    id: 'ex-slp-2-1',
    courseId: 'course-slp-2',
    order: 1,
    title: 'Asking for what you want',
    type: 'video-modeling',
    videoUrl: `${CDN}/slp/c2/e1/master.m3u8`,
    durationSec: 20 * 60,
    phases: standardPhases,
    targetWords: [
      { english: 'more', filipino: 'pa' },
      { english: 'up', filipino: 'taas' },
      { english: 'go', filipino: 'sige' },
      { english: 'open', filipino: 'buksan' },
      { english: 'juice', filipino: 'katas', isPreferenceLinked: true },
      { english: 'biscuit', filipino: 'biskwit', isPreferenceLinked: true },
      { english: 'ball', filipino: 'bola', isPreferenceLinked: true, isMcdi: true },
    ],
    caregiverLanguage: [
      'Hold item up: Ano to? / What is this? (pause 5 seconds)',
      'After approximation: Juice! Heto — juice! (give immediately)',
      'If no response after 10s: say word once softly, offer partial access, wait.',
    ],
    commonMistakes: [
      'Giving the item before any attempt — removes the reason to communicate.',
      'Say juice, say juice, say juice — over-prompting kills initiative.',
      'Moving on too quickly — trust the 5-second pause.',
    ],
    generalizationActivities: [
      'Snack time: do not give food automatically; wait for any attempt first.',
      'Outings: before any preferred activity, wait for \"go\" or any attempt.',
      'Bedtime: hold the favorite stuffed animal; wait before giving.',
    ],
  },
  {
    id: 'ex-slp-3-1',
    courseId: 'course-slp-3',
    order: 1,
    title: 'Following one-step instructions',
    type: 'video-modeling',
    videoUrl: `${CDN}/slp/c3/e1/master.m3u8`,
    durationSec: 20 * 60,
    phases: standardPhases,
    targetWords: [
      { english: 'come here', filipino: 'halika' },
      { english: 'sit down', filipino: 'upo' },
      { english: 'stand up', filipino: 'tayo' },
      { english: 'give me', filipino: 'ibigay mo' },
      { english: 'clap', filipino: 'palakpak' },
    ],
    caregiverLanguage: [
      'Use a warm singsong voice — not a flat command voice.',
      'Say the instruction ONCE clearly; do not repeat before waiting 5 seconds.',
      'Physical guidance only as a last resort; model on yourself first.',
    ],
    commonMistakes: [
      'Raising your voice when the child does not respond.',
      'Physically guiding the child\'s hand every time — promotes prompt dependency.',
      'Giving instructions during sensory overload or meltdown.',
    ],
    generalizationActivities: [
      'Bathtime: \"Wash your hands / Hugasan ang kamay.\"',
      'Dressing: \"Arms up / Taas ng kamay.\"',
      'Mealtime: \"Sit down / Upo.\"',
    ],
  },
  {
    id: 'ex-ot-1-1',
    courseId: 'course-ot-1',
    order: 1,
    title: 'Pinch and place',
    type: 'video-modeling',
    videoUrl: `${CDN}/ot/c1/e1/master.m3u8`,
    durationSec: 15 * 60,
    phases: standardPhases.map((p) =>
      p.phase === 'video' ? { ...p, durationSec: 7 * 60 } : p,
    ),
    targetWords: [],
    caregiverLanguage: [
      'Start hand-over-hand if needed.',
      'Fade to verbal cue: \"Pinch and drop.\"',
      'Fade to gesture only.',
    ],
    commonMistakes: [
      'Continuing hand-over-hand after the child can do it solo.',
      'Skipping the warm-up stretch.',
    ],
    generalizationActivities: [
      'Snack time: pinch raisins or cereal one at a time.',
      'Tidy up: pinch small toys into a container.',
    ],
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function listCoursesByCategory(categoryId: string): Course[] {
  return courses
    .filter((c) => c.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);
}

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function listExercisesByCourse(courseId: string): Exercise[] {
  return exercises
    .filter((e) => e.courseId === courseId)
    .sort((a, b) => a.order - b.order);
}
