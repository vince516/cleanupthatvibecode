import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors, radius, space } from '@/theme/colors';
import { WaitTimer } from './WaitTimer';

interface Props {
  source: string;
  onTargetModelEnd?: () => void;
}

export function VideoPlayer({ source, onTargetModelEnd }: Props) {
  const [isWaiting, setIsWaiting] = useState(false);

  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.staysActiveInBackground = false;
  });

  useEffect(() => {
    const sub = player.addListener('playToEnd', () => {
      setIsWaiting(true);
      onTargetModelEnd?.();
    });
    return () => sub.remove();
  }, [player, onTargetModelEnd]);

  const pauseForWait = () => {
    player.pause();
    setIsWaiting(true);
  };

  const resume = () => {
    setIsWaiting(false);
    player.play();
  };

  return (
    <View style={styles.wrap}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
        allowsPictureInPicture
      />

      <View style={styles.controls}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={pauseForWait}>
          <Text style={styles.btnText}>I heard a target word — pause & wait</Text>
        </Pressable>
      </View>

      {isWaiting && (
        <View style={styles.waitBlock}>
          <WaitTimer seconds={5} onDone={resume} label="Wait 5s — your child's turn" />
          <Pressable onPress={resume} style={styles.skip}>
            <Text style={styles.skipText}>Resume now</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space(3) },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: radius.md,
  },
  controls: { flexDirection: 'row', gap: space(2) },
  btn: {
    flex: 1,
    paddingVertical: space(3),
    borderRadius: radius.md,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnText: { color: colors.text, fontWeight: '700' },
  waitBlock: { gap: space(2) },
  skip: { alignSelf: 'center', padding: space(2) },
  skipText: { color: colors.textMuted, fontSize: 13 },
});
