import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { getCourse, listExercisesByCourse } from '@/domain/seed';
import { PromptHierarchy } from '@/components/PromptHierarchy';
import { colors, radius, space } from '@/theme/colors';

export default function CourseScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const course = getCourse(courseId);
  const exercises = listExercisesByCourse(courseId);

  if (!course) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: colors.textMuted }}>Course not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `Course ${course.order}` }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.title}>{course.title}</Text>
        {course.weekNumber && (
          <Text style={styles.meta}>
            Week {course.weekNumber}
            {course.framework ? ` · ${course.framework}` : ''}
          </Text>
        )}

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Learning goal</Text>
          <Text style={styles.cardBody}>{course.learningGoal}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pedagogy principle</Text>
          <Text style={styles.cardBody}>{course.pedagogyPrinciple}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>What the video shows</Text>
          <Text style={styles.cardBody}>{course.videoDescription}</Text>
        </View>

        <PromptHierarchy />

        <Text style={styles.section}>Exercises</Text>
        {exercises.map((ex) => (
          <Link
            key={ex.id}
            href={{ pathname: '/session/[exerciseId]', params: { exerciseId: ex.id } }}
            asChild
          >
            <Pressable style={styles.exCard}>
              <Text style={styles.exTitle}>{ex.title}</Text>
              <Text style={styles.exMeta}>
                {Math.round(ex.durationSec / 60)} min · {ex.targetWords.length} target words
              </Text>
              <Text style={styles.exCta}>Start session →</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  meta: { color: colors.textMuted, fontSize: 13, marginBottom: space(2) },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    gap: space(1),
  },
  cardLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  cardBody: { color: colors.text, fontSize: 14, lineHeight: 20 },
  section: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: space(2),
  },
  exCard: {
    backgroundColor: colors.primaryDeep,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(1),
  },
  exTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  exMeta: { color: '#D8E3FF', fontSize: 13 },
  exCta: { color: colors.text, fontWeight: '700', marginTop: space(2) },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space(6) },
});
