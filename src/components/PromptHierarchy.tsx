import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space } from '@/theme/colors';

const STEPS = [
  { level: 1, label: 'Model the word', detail: 'Say it once with warmth, then wait 5s.' },
  { level: 2, label: 'Soft re-model', detail: 'Quieter, slower. Wait again.' },
  { level: 3, label: 'Partial-access prompt', detail: 'Show the item; wait for any attempt.' },
  { level: 4, label: 'Physical (last resort)', detail: 'Only if 10+ seconds with no response.' },
];

export function PromptHierarchy() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Prompt hierarchy — slow handover</Text>
      <Text style={styles.subtitle}>
        Move down only when the previous level fails. Move back up the next session.
      </Text>
      {STEPS.map((s) => (
        <View key={s.level} style={styles.row}>
          <View style={styles.lvl}>
            <Text style={styles.lvlNum}>{s.level}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{s.label}</Text>
            <Text style={styles.detail}>{s.detail}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(2),
  },
  title: { color: colors.text, fontWeight: '700', fontSize: 16 },
  subtitle: { color: colors.textMuted, fontSize: 13, marginBottom: space(1) },
  row: { flexDirection: 'row', gap: space(3), alignItems: 'flex-start' },
  lvl: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lvlNum: { color: colors.text, fontWeight: '700' },
  label: { color: colors.text, fontWeight: '600' },
  detail: { color: colors.textMuted, fontSize: 13 },
});
