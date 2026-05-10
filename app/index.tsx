import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories } from '@/domain/seed';
import { CategoryCard } from '@/components/CategoryCard';
import { useAuth } from '@/state/auth';
import { colors, radius, space } from '@/theme/colors';

export default function Home() {
  const profile = useAuth((s) => s.profile);
  const children = useAuth((s) => s.children);
  const activeChildId = useAuth((s) => s.activeChildId);
  const activeChild = children.find((c) => c.id === activeChildId);

  const pairs: typeof categories[] = [];
  for (let i = 0; i < categories.length; i += 2) {
    pairs.push(categories.slice(i, i + 2));
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>Mylo</Text>
            <Text style={styles.tagline}>
              {profile?.role === 'slp'
                ? 'Therapist view — caseload follow-through'
                : 'Speech buddy & home follow-through'}
            </Text>
          </View>
          <Link href="/you" asChild>
            <Pressable style={styles.youBtn}>
              <Text style={styles.youBtnText}>
                {(profile?.displayName ?? profile?.email ?? '?').slice(0, 1).toUpperCase()}
              </Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            {activeChild
              ? `Today's session for ${activeChild.name}`
              : profile?.role === 'slp'
              ? 'No active child'
              : "Today's session"}
          </Text>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  tagline: { color: colors.textMuted, fontSize: 14 },
  youBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youBtnText: { color: colors.text, fontWeight: '800' },
  heroCard: {
    backgroundColor: colors.primaryDeep,
    borderRadius: radius.lg,
    padding: space(5),
    gap: space(2),
    marginTop: space(2),
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
