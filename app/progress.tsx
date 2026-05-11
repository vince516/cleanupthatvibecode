import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/state/auth';
import { listLogsForChild } from '@/firebase/logs';
import { getCourse, getExercise } from '@/domain/seed';
import { colors, radius, space } from '@/theme/colors';
import type { SessionLog } from '@/domain/types';

export default function ProgressScreen() {
  const { children, activeChildId } = useAuth();
  const child = children.find((c) => c.id === activeChildId);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeChildId) return;
    setLoading(true);
    listLogsForChild(activeChildId)
      .then((l) => {
        setLogs(l);
        setError(null);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [activeChildId]);

  const summary = useMemo(() => {
    let total = 0;
    let spontaneous = 0;
    let approx = 0;
    for (const log of logs) {
      for (const a of log.attempts) {
        if (a.result === 'no') continue;
        total++;
        if (!a.prompted) spontaneous++;
        if (a.result === 'approximation') approx++;
      }
    }
    return {
      sessions: logs.length,
      attempts: total,
      spontaneous,
      approx,
      spontPct: total === 0 ? 0 : Math.round((spontaneous / total) * 100),
    };
  }, [logs]);

  return (
    <>
      <Stack.Screen options={{ title: 'Recent sessions' }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.title}>{child ? `${child.name}'s progress` : 'Recent sessions'}</Text>
        <Text style={styles.sub}>
          The slow-handover metric — how often your child speaks before being prompted.
        </Text>

        {!activeChildId && (
          <Text style={styles.muted}>No active child. Pick one in You → Children.</Text>
        )}

        {activeChildId && (
          <>
            <View style={styles.statsRow}>
              <Stat label="Sessions" value={summary.sessions} />
              <Stat label="Attempts" value={summary.attempts} />
              <Stat label="Spontaneous" value={`${summary.spontPct}%`} tone={colors.success} />
            </View>

            <Text style={styles.section}>Sessions</Text>
            {loading && <ActivityIndicator color={colors.primary} />}
            {error && <Text style={styles.error}>{error}</Text>}
            {!loading && logs.length === 0 && (
              <Text style={styles.muted}>No sessions yet. Complete one to see it here.</Text>
            )}

            {logs.map((log) => {
              const ex = getExercise(log.exerciseId);
              const course = getCourse(log.courseId);
              const yes = log.attempts.filter((a) => a.result !== 'no').length;
              const spont = log.attempts.filter((a) => a.result !== 'no' && !a.prompted).length;
              return (
                <View key={log.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {ex?.title ?? log.exerciseId}
                    </Text>
                    <Text style={styles.cardDate}>
                      {new Date(log.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.cardMeta}>
                    {course ? `Course ${course.order} · ` : ''}
                    {log.language === 'filipino' ? 'Filipino' : 'English'}
                    {' · '}
                    {spont}/{yes} spontaneous
                  </Text>
                  {log.highlight ? (
                    <Text style={styles.highlight}>“{log.highlight}”</Text>
                  ) : null}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, tone ? { color: tone } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  muted: { color: colors.textMuted },
  error: { color: colors.danger },
  section: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: space(2) },
  statsRow: { flexDirection: 'row', gap: space(3) },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    alignItems: 'center',
  },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(1),
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700', flex: 1 },
  cardDate: { color: colors.textMuted, fontSize: 12 },
  cardMeta: { color: colors.textMuted, fontSize: 13 },
  highlight: { color: colors.text, fontSize: 14, fontStyle: 'italic', marginTop: space(1) },
});
