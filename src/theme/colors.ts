export const colors = {
  bg: '#0B1220',
  bgElevated: '#111A2E',
  card: '#1A2540',
  border: '#243156',
  text: '#F5F7FB',
  textMuted: '#9AA7C7',
  primary: '#4F8CFF',
  primaryDeep: '#2E5BD9',
  success: '#34D399',
  warn: '#F59E0B',
  danger: '#EF4444',

  speech: '#4F8CFF',
  occupational: '#34D399',
  sensory: '#A78BFA',
  social: '#F59E0B',
  dailyLiving: '#F472B6',
} as const;

export const space = (n: number) => n * 4;
export const radius = { sm: 8, md: 12, lg: 20, xl: 28 } as const;
