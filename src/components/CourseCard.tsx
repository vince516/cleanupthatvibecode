import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { colors, radius, space } from '@/theme/colors';
import type { Course } from '@/domain/types';

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={{ pathname: '/course/[courseId]', params: { courseId: course.id } }} asChild>
      <Pressable style={styles.card}>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{course.order}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{course.title}</Text>
            {course.weekNumber && (
              <Text style={styles.meta}>
                Week {course.weekNumber}
                {course.framework ? ` · ${course.framework}` : ''}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.goal}>{course.learningGoal}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(2),
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', gap: space(3), alignItems: 'center' },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.text, fontWeight: '800' },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 12 },
  goal: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
});
