import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, radius, space } from '@/theme/colors';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  required?: boolean;
}

export function Checkbox({ checked, onChange, label, hint, required }: Props) {
  return (
    <Pressable onPress={() => onChange(!checked)} style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={{ color: colors.danger }}> *</Text>}
        </Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space(3), alignItems: 'flex-start', paddingVertical: space(1) },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxChecked: { borderColor: colors.primary, backgroundColor: colors.primary },
  tick: { color: colors.text, fontWeight: '900', fontSize: 14, lineHeight: 18 },
  label: { color: colors.text, fontSize: 14, lineHeight: 20 },
  hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 2 },
});
