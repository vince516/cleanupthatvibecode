import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, space } from '@/theme/colors';

export function Splash() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>Mylo</Text>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space(3),
  },
  brand: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
});
