import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/state/auth';
import {
  createInvite,
  formatCode,
  listInvitesForChild,
  revokeInvite,
} from '@/firebase/invites';
import { colors, radius, space } from '@/theme/colors';
import type { Invite } from '@/domain/types';

export default function InviteScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const { user, children } = useAuth();
  const child = children.find((c) => c.id === childId);

  const [invites, setInvites] = useState<Invite[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!childId) return;
    setLoading(true);
    try {
      setInvites(await listInvitesForChild(childId));
    } catch (err) {
      Alert.alert('Could not load invites', String((err as Error).message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [childId]);

  const generate = async () => {
    if (!user || !child) return;
    setBusy(true);
    try {
      const invite = await createInvite({
        parentUid: user.uid,
        childId: child.id,
        childName: child.name,
      });
      setInvites((prev) => [invite, ...prev]);
      await Share.share({
        title: `Mylo SLP invite for ${child.name}`,
        message: `Hi! Please add ${child.name} to your Mylo caseload using this code: ${formatCode(invite.code)} (expires in 7 days).`,
      });
    } catch (err) {
      Alert.alert('Could not create invite', String((err as Error).message));
    } finally {
      setBusy(false);
    }
  };

  const onRevoke = async (code: string) => {
    Alert.alert('Revoke invite?', 'The SLP will no longer be able to redeem this code.', [
      { text: 'Cancel' },
      {
        text: 'Revoke',
        style: 'destructive',
        onPress: async () => {
          try {
            await revokeInvite(code);
            await refresh();
          } catch (err) {
            Alert.alert('Could not revoke', String((err as Error).message));
          }
        },
      },
    ]);
  };

  if (!child) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: colors.textMuted }}>Child not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `Invite SLP — ${child.name}` }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.title}>Invite an SLP</Text>
        <Text style={styles.sub}>
          Generate a one-time code, share it with your SLP. They enter it on their phone and
          gain read access to {child.name}'s session logs.
        </Text>

        <Pressable
          onPress={generate}
          disabled={busy}
          style={[styles.cta, busy && { opacity: 0.6 }]}
        >
          <Text style={styles.ctaText}>{busy ? 'Generating…' : 'Generate new code'}</Text>
        </Pressable>

        <Text style={styles.section}>Codes</Text>
        {loading ? (
          <Text style={styles.muted}>Loading…</Text>
        ) : invites.length === 0 ? (
          <Text style={styles.muted}>No codes yet. Generate one above.</Text>
        ) : (
          invites.map((inv) => (
            <View key={inv.code} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.code}>{formatCode(inv.code)}</Text>
                <StatusBadge status={inv.status} />
              </View>
              <Text style={styles.cardMeta}>
                {inv.status === 'pending'
                  ? `Expires ${new Date(inv.expiresAt).toLocaleDateString()}`
                  : inv.status === 'redeemed'
                  ? `Redeemed ${
                      inv.redeemedAt ? new Date(inv.redeemedAt).toLocaleDateString() : ''
                    }`
                  : inv.status === 'expired'
                  ? 'No longer usable'
                  : 'Revoked'}
              </Text>
              {inv.status === 'pending' && (
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() =>
                      Share.share({
                        title: `Mylo SLP invite for ${child.name}`,
                        message: `Code: ${formatCode(inv.code)}`,
                      })
                    }
                    style={[styles.btn, styles.btnSecondary]}
                  >
                    <Text style={styles.btnText}>Share</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onRevoke(inv.code)}
                    style={[styles.btn, styles.btnDanger]}
                  >
                    <Text style={styles.btnText}>Revoke</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}

function StatusBadge({ status }: { status: Invite['status'] }) {
  const tone =
    status === 'pending'
      ? colors.primary
      : status === 'redeemed'
      ? colors.success
      : status === 'expired'
      ? colors.warn
      : colors.danger;
  return (
    <View style={[styles.badge, { backgroundColor: tone + '22', borderColor: tone }]}>
      <Text style={[styles.badgeText, { color: tone }]}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  section: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: space(2) },
  muted: { color: colors.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space(6) },
  cta: {
    paddingVertical: space(3),
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  ctaText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(2),
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { color: colors.text, fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  cardMeta: { color: colors.textMuted, fontSize: 13 },
  cardActions: { flexDirection: 'row', gap: space(2), marginTop: space(2) },
  btn: { flex: 1, paddingVertical: space(2), borderRadius: radius.md, alignItems: 'center' },
  btnSecondary: { backgroundColor: colors.bgElevated },
  btnDanger: { backgroundColor: colors.danger },
  btnText: { color: colors.text, fontWeight: '700' },
  badge: {
    paddingHorizontal: space(2),
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
