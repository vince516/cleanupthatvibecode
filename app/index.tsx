import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories } from '@/domain/seed';
import { CategoryCard } from '@/components/CategoryCard';
import { colors, space } from '@/theme/colors';

export default function Home() {
  const pairs: typeof categories[] = [];
  for (let i = 0; i < categories.length; i += 2) {
    pairs.push(categories.slice(i, i + 2));
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.brand}>Mylo</Text>
        <Text style={styles.tagline}>Speech Buddy & home follow-through</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Today's session</Text>
          <Text style={styles.heroSubtitle}>
            20 minutes. Warm-up → video → real-life practice → log.
          </Text>
        </View>

        <Text style={styles.section}>Explore by category</Text>
        {pairs.map((pair, idx) => (
          <View key={idx} style={styles.row}>
            {pair.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
            {pair.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  brand: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  tagline: { color: colors.textMuted, fontSize: 14, marginBottom: space(2) },
  heroCard: {
    backgroundColor: colors.primaryDeep,
    borderRadius: 20,
    padding: space(5),
    gap: space(2),
    marginBottom: space(3),
  },
  heroTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  heroSubtitle: { color: '#D8E3FF', fontSize: 14 },
  section: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: space(2),
    marginBottom: space(1),
  },
  row: { flexDirection: 'row', gap: space(3) },
});
