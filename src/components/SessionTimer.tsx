import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, space } from '@/theme/colors';
import type { PhaseSpec, SessionPhase } from '@/domain/types';

interface Props {
  phases: PhaseSpec[];
  onPhaseChange?: (phase: SessionPhase) => void;
  onComplete?: () => void;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function SessionTimer({ phases, onPhaseChange, onComplete }: Props) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(phases[0]?.durationSec ?? 0);
  const [running, setRunning] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = phases[phaseIdx];

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (remaining > 0) return;
    if (!running) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (phaseIdx < phases.length - 1) {
      const next = phaseIdx + 1;
      setPhaseIdx(next);
      setRemaining(phases[next].durationSec);
      onPhaseChange?.(phases[next].phase);
    } else {
      setRunning(false);
      onComplete?.();
    }
  }, [remaining, running, phaseIdx, phases, onComplete, onPhaseChange]);

  const progress =
    phase ? 1 - remaining / Math.max(1, phase.durationSec) : 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.phaseLabel}>{phase?.label}</Text>
        <Text style={styles.time}>{fmt(remaining)}</Text>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.instructions}>{phase?.instructions}</Text>

      <View style={styles.phaseDots}>
        {phases.map((p, i) => (
          <View
            key={p.phase}
            style={[
              styles.dot,
              i === phaseIdx && styles.dotActive,
              i < phaseIdx && styles.dotDone,
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.btn, running ? styles.btnSecondary : styles.btnPrimary]}
          onPress={() => setRunning((r) => !r)}
        >
          <Text style={styles.btnText}>{running ? 'Pause' : 'Start'}</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => {
            if (phaseIdx >= phases.length - 1) return;
            const next = phaseIdx + 1;
            setPhaseIdx(next);
            setRemaining(phases[next].durationSec);
            onPhaseChange?.(phases[next].phase);
          }}
        >
          <Text style={styles.btnText}>Skip phase</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(3),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  phaseLabel: { color: colors.text, fontSize: 18, fontWeight: '700' },
  time: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  progressBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  instructions: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  phaseDots: { flexDirection: 'row', gap: space(2) },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.primary },
  dotDone: { backgroundColor: colors.success },
  controls: { flexDirection: 'row', gap: space(2) },
  btn: {
    flex: 1,
    paddingVertical: space(3),
    borderRadius: radius.md,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.bgElevated },
  btnText: { color: colors.text, fontWeight: '700', fontSize: 15 },
});
