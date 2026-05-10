import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { colors, radius, space } from '@/theme/colors';
import type { Category } from '@/domain/types';

const accentFor = (d: Category['discipline']): string => {
  switch (d) {
    case 'speech':
      return colors.speech;
    case 'occupational':
      return colors.occupational;
    case 'sensory':
      return colors.sensory;
    case 'social':
      return colors.social;
    case 'daily-living':
      return colors.dailyLiving;
  }
};

export function CategoryCard({ category }: { category: Category }) {
  const accent = accentFor(category.discipline);
  return (
    <Link href={{ pathname: '/category/[categoryId]', params: { categoryId: category.id } }} asChild>
      <Pressable style={[styles.card, { borderColor: accent + '55' }]}>
        <View style={[styles.accent, { backgroundColor: accent }]} />
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.subtitle}>{category.subtitle}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    borderWidth: 1,
    justifyContent: 'flex-end',
    gap: space(1),
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomRightRadius: radius.lg,
    opacity: 0.85,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: 13 },
});
