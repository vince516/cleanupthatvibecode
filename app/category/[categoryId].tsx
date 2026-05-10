import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getCategory, listCoursesByCategory } from '@/domain/seed';
import { CourseCard } from '@/components/CourseCard';
import { colors, space } from '@/theme/colors';

export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const category = getCategory(categoryId);
  const courses = listCoursesByCategory(categoryId);

  if (!category) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Category not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: category.title }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.subtitle}>{category.subtitle}</Text>
        <Text style={styles.desc}>{category.description}</Text>

        <Text style={styles.section}>Courses</Text>
        {courses.length === 0 ? (
          <Text style={styles.empty}>Courses coming soon.</Text>
        ) : (
          <View style={{ gap: space(3) }}>
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(4), gap: space(2), paddingBottom: space(8) },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 14 },
  desc: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: space(2) },
  section: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: space(4),
    marginBottom: space(1),
  },
  empty: { color: colors.textMuted, padding: space(4), alignItems: 'center' },
  emptyText: { color: colors.textMuted },
});
