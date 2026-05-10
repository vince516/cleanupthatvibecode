import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { getExercise, getCourse } from '@/domain/seed';
import { SessionTimer } from '@/components/SessionTimer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { DailyLogForm } from '@/components/DailyLogForm';
import { colors, radius, space } from '@/theme/colors';
import type { SessionPhase } from '@/domain/types';

export default function SessionScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const router = useRouter();
  const exercise = getExercise(exerciseId);
  const course = exercise ? getCourse(exercise.courseId) : undefined;
  const [phase, setPhase] = useState<SessionPhase>('warmup');

  if (!exercise || !course) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: colors.textMuted }}>Exercise not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: exercise.title }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.meta}>
          Course {course.order} · {Math.round(exercise.durationSec / 60)} min
        </Text>

        <SessionTimer
          phases={exercise.phases}
          onPhaseChange={setPhase}
          onComplete={() => setPhase('log')}
        />

        {phase === 'video' && exercise.videoUrl && (
          <View style={{ gap: space(2) }}>
            <Text style={styles.section}>Video model</Text>
            <VideoPlayer source={exercise.videoUrl} />
          </View>
        )}

        {phase === 'practice' && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Naturalistic practice</Text>
            {exercise.generalizationActivities.map((a, i) => (
              <Text key={i} style={styles.bullet}>
                • {a}
              </Text>
            ))}
          </View>
        )}

        {phase === 'warmup' && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Caregiver language to use</Text>
            {exercise.caregiverLanguage.map((c, i) => (
              <Text key={i} style={styles.bullet}>
                • {c}
              </Text>
            ))}
          </View>
        )}

        {phase === 'log' && (
          <View style={styles.logWrap}>
            <DailyLogForm
              exercise={exercise}
              onSaved={() => router.back()}
            />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Common mistakes to avoid</Text>
          {exercise.commonMistakes.map((m, i) => (
            <Text key={i} style={[styles.bullet, { color: colors.warn }]}>
              ✗ {m}
            </Text>
          ))}
        </View>

        <Pressable onPress={() => router.back()} style={styles.exitBtn}>
          <Text style={styles.exitText}>End session</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  meta: { color: colors.textMuted, fontSize: 13 },
  section: { color: colors.text, fontSize: 16, fontWeight: '700' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    gap: space(1),
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: space(1),
  },
  bullet: { color: colors.text, fontSize: 14, lineHeight: 20 },
  logWrap: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  exitBtn: {
    marginTop: space(2),
    paddingVertical: space(3),
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
  },
  exitText: { color: colors.text, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space(6) },
});
