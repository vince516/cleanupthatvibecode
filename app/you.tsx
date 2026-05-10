import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/state/auth';
import { signOut } from '@/firebase/auth';
import { createChild } from '@/firebase/children';
import { colors, radius, space } from '@/theme/colors';

export default function YouScreen() {
  const { user, profile, children, activeChildId, setActiveChildId, refreshChildren } = useAuth();
  const [newChild, setNewChild] = useState('');
  const [busy, setBusy] = useState(false);

  if (!user || !profile) return null;

  const addChild = async () => {
    const name = newChild.trim();
    if (!name) return;
    setBusy(true);
    try {
      const id = await createChild({
        parentUid: user.uid,
        name,
        primaryLanguage: 'filipino',
      });
      setNewChild('');
      await refreshChildren();
      setActiveChildId(id);
    } catch (err) {
      Alert.alert('Could not add', String((err as Error).message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{profile.displayName ?? profile.email}</Text>
        <Text style={styles.role}>{profile.role.toUpperCase()}</Text>
      </View>

      {profile.role === 'parent' && (
        <View style={styles.card}>
          <Text style={styles.label}>Children</Text>
          {children.length === 0 ? (
            <Text style={styles.muted}>No child profiles yet.</Text>
          ) : (
            children.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setActiveChildId(c.id)}
                style={[styles.row, activeChildId === c.id && styles.rowActive]}
              >
                <Text style={styles.rowText}>{c.name}</Text>
                {activeChildId === c.id && <Text style={styles.activeTag}>active</Text>}
              </Pressable>
            ))
          )}
          <View style={styles.addRow}>
            <TextInput
              value={newChild}
              onChangeText={setNewChild}
              placeholder="Add a sibling…"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Pressable
              onPress={addChild}
              disabled={busy || !newChild.trim()}
              style={[styles.addBtn, (busy || !newChild.trim()) && { opacity: 0.5 }]}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          </View>
        </View>
      )}

      {profile.role === 'slp' && (
        <View style={styles.card}>
          <Text style={styles.label}>Caseload</Text>
          {children.length === 0 ? (
            <Text style={styles.muted}>
              No children assigned yet. Children appear here once a parent links you to their account.
            </Text>
          ) : (
            children.map((c) => (
              <View key={c.id} style={styles.row}>
                <Text style={styles.rowText}>{c.name}</Text>
              </View>
            ))
          )}
        </View>
      )}

      <Link href="/data" asChild>
        <Pressable style={styles.linkRow}>
          <Text style={styles.linkText}>Privacy & data</Text>
          <Text style={styles.linkChevron}>→</Text>
        </Pressable>
      </Link>

      <Pressable onPress={() => signOut()} style={styles.signOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(2),
  },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: colors.text, fontSize: 18, fontWeight: '700' },
  role: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  muted: { color: colors.textMuted, fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space(2),
    paddingHorizontal: space(3),
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
  },
  rowActive: { borderWidth: 1, borderColor: colors.primary },
  rowText: { color: colors.text, fontWeight: '600' },
  activeTag: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  addRow: { flexDirection: 'row', gap: space(2), marginTop: space(2) },
  input: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    padding: space(3),
    color: colors.text,
  },
  addBtn: {
    paddingHorizontal: space(4),
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  addBtnText: { color: colors.text, fontWeight: '800' },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(4),
  },
  linkText: { color: colors.text, fontWeight: '700' },
  linkChevron: { color: colors.primary, fontSize: 18 },
  signOut: {
    marginTop: space(2),
    padding: space(3),
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
  },
  signOutText: { color: colors.danger, fontWeight: '700' },
});
