import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { colors, radius, space } from '@/theme/colors';
import type { Exercise, TargetAttempt, AttemptResult, SessionLog } from '@/domain/types';
import { saveSessionLog } from '@/firebase/logs';
import { useAuth } from '@/state/auth';

interface Props {
  exercise: Exercise;
  onSaved?: (logId: string) => void;
}

const RESULTS: { key: AttemptResult; label: string; tone: string }[] = [
  { key: 'yes', label: 'Yes', tone: colors.success },
  { key: 'approximation', label: 'Approx.', tone: colors.warn },
  { key: 'no', label: 'No', tone: colors.danger },
];

export function DailyLogForm({ exercise, onSaved }: Props) {
  const user = useAuth((s) => s.user);
  const activeChildId = useAuth((s) => s.activeChildId);
  const profile = useAuth((s) => s.profile);
  const [language, setLanguage] = useState<'filipino' | 'english'>('filipino');
  const [attempts, setAttempts] = useState<Record<string, TargetAttempt>>(() =>
    Object.fromEntries(
      exercise.targetWords.map((w) => [
        w.english,
        { word: w.english, result: 'no', prompted: true },
      ]),
    ),
  );
  const [highlight, setHighlight] = useState('');
  const [saving, setSaving] = useState(false);

  const setResult = (word: string, result: AttemptResult) => {
    setAttempts((a) => ({ ...a, [word]: { ...a[word], result } }));
  };
  const togglePrompted = (word: string) => {
    setAttempts((a) => ({ ...a, [word]: { ...a[word], prompted: !a[word].prompted } }));
  };

  const save = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Sign in to save logs.');
      return;
    }
    if (!activeChildId) {
      Alert.alert(
        'No child selected',
        profile?.role === 'slp'
          ? 'Pick a child from your caseload first.'
          : 'Add a child profile in You → Children before saving a log.',
      );
      return;
    }
    setSaving(true);
    try {
      const log: Omit<SessionLog, 'id' | 'createdAt'> = {
        userId: user.uid,
        childId: activeChildId,
        exerciseId: exercise.id,
        courseId: exercise.courseId,
        date: new Date().toISOString(),
        language,
        attempts: Object.values(attempts),
        highlight,
      };
      const id = await saveSessionLog(log);
      onSaved?.(id);
      Alert.alert('Saved', 'Today\'s log is recorded.');
    } catch (err) {
      Alert.alert('Could not save', String((err as Error).message ?? err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Daily log</Text>
      <Text style={styles.help}>
        Tap each target word as it happened today. Spontaneous = your child said it before you did.
      </Text>

      <View style={styles.langRow}>
        {(['filipino', 'english'] as const).map((l) => (
          <Pressable
            key={l}
            onPress={() => setLanguage(l)}
            style={[styles.langBtn, language === l && styles.langBtnActive]}
          >
            <Text style={styles.langText}>{l === 'filipino' ? 'Filipino' : 'English'}</Text>
          </Pressable>
        ))}
      </View>

      {exercise.targetWords.map((w) => {
        const a = attempts[w.english];
        return (
          <View key={w.english} style={styles.wordRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.word}>{w.english}</Text>
              {w.filipino && <Text style={styles.wordAlt}>{w.filipino}</Text>}
            </View>
            <View style={styles.resultRow}>
              {RESULTS.map((r) => (
                <Pressable
                  key={r.key}
                  onPress={() => setResult(w.english, r.key)}
                  style={[
                    styles.pill,
                    a.result === r.key && { backgroundColor: r.tone, borderColor: r.tone },
                  ]}
                >
                  <Text style={styles.pillText}>{r.label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={() => togglePrompted(w.english)} style={styles.spontBtn}>
              <Text style={styles.spontText}>{a.prompted ? 'Prompted' : 'Spontaneous'}</Text>
            </Pressable>
          </View>
        );
      })}

      <Text style={styles.label}>Highlight — what made you smile?</Text>
      <TextInput
        value={highlight}
        onChangeText={setHighlight}
        placeholder="One sentence is enough."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
      />

      <Pressable
        onPress={save}
        disabled={saving}
        style={[styles.save, saving && { opacity: 0.6 }]}
      >
        <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save log'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space(3), padding: space(4) },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  help: { color: colors.textMuted, fontSize: 13 },
  langRow: { flexDirection: 'row', gap: space(2) },
  langBtn: {
    flex: 1,
    paddingVertical: space(2),
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
  },
  langBtnActive: { backgroundColor: colors.primary },
  langText: { color: colors.text, fontWeight: '600' },
  wordRow: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    gap: space(2),
  },
  word: { color: colors.text, fontSize: 16, fontWeight: '700' },
  wordAlt: { color: colors.textMuted, fontSize: 13 },
  resultRow: { flexDirection: 'row', gap: space(2) },
  pill: {
    flex: 1,
    paddingVertical: space(2),
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pillText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  spontBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: space(3),
    paddingVertical: space(1),
    borderRadius: radius.sm,
    backgroundColor: colors.bgElevated,
  },
  spontText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  label: { color: colors.text, fontWeight: '600', marginTop: space(2) },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  save: {
    marginTop: space(2),
    paddingVertical: space(3),
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  saveText: { color: colors.text, fontWeight: '800', fontSize: 16 },
});
