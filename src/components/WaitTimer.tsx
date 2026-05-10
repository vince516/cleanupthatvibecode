import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, space } from '@/theme/colors';

interface Props {
  seconds?: number;
  onDone?: () => void;
  label?: string;
}

export function WaitTimer({ seconds = 5, onDone, label = 'Wait — let your child try' }: Props) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    Haptics.selectionAsync();
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setRunning(false);
          onDone?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, onDone]);

  const start = () => {
    setRemaining(seconds);
    setRunning(true);
  };

  return (
    <Pressable
      onPress={start}
      style={[styles.wrap, running && styles.wrapRunning]}
    >
      <Text style={styles.label}>{running ? `${remaining}s — don't fill the silence` : label}</Text>
      <Text style={styles.hint}>
        {running ? 'Watch your child. Any sound or movement counts.' : 'Tap to start a 5-second wait.'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    padding: space(4),
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: space(1),
  },
  wrapRunning: { borderColor: colors.warn, backgroundColor: '#2a1f0c' },
  label: { color: colors.text, fontWeight: '700', fontSize: 16 },
  hint: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
});
