export const colors = {
  shell: '#060E18',
  shellSoft: '#0A1725',
  surface: '#0E1B2B',
  surfaceRaised: '#132638',
  surfaceElevated: '#1A3048',
  border: '#1F3650',
  text: '#F3F7FF',
  muted: '#B0BFD4',
  subtle: '#7E8FA9',
  purchase: '#3CE1A1',
  sale: '#FF8A65',
  accent: '#73D9FF',
  watch: '#F6D58B',
  ink: '#091A2A',
  white: '#FFFFFF',
  cardHighlight: 'rgba(255,255,255,0.04)',
  glow: 'rgba(115,217,255,0.12)',
  shadowBase: 'rgba(0,0,0,0.35)',
} as const;

export const spacing = (unit: number) => unit * 8;