export const Colors = {
  // Backgrounds
  backgroundPrimary: '#0A0D14',
  backgroundSecondary: '#121722',
  backgroundCard: '#181E2C',
  backgroundElevated: '#202738',

  // Glassmorphism
  glassBackground: 'rgba(26, 31, 46, 0.75)',
  glassBackgroundLight: 'rgba(255, 255, 255, 0.08)',
  glassBackgroundDark: 'rgba(10, 13, 20, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderGlow: 'rgba(255, 45, 85, 0.35)',

  // Brand & Action Accents
  primary: '#FF2D55', // Electric Rose / Brand Pink
  primaryGradientStart: '#FF2D55',
  primaryGradientEnd: '#8B5CF6', // Electric Violet
  secondary: '#8B5CF6',
  accent: '#06B6D4', // Cyber Cyan (Superlike)
  
  // Interactive Action Colors
  like: '#10B981', // Neon Emerald
  likeGlow: 'rgba(16, 185, 129, 0.4)',
  pass: '#EF4444', // Crimson Red
  passGlow: 'rgba(239, 68, 68, 0.4)',
  superlike: '#06B6D4', // Cyber Cyan
  superlikeGlow: 'rgba(6, 182, 212, 0.4)',
  boost: '#A855F7', // Luminous Purple
  boostGlow: 'rgba(168, 85, 247, 0.4)',
  undo: '#F59E0B', // Amber Gold
  undoGlow: 'rgba(245, 158, 11, 0.4)',

  // Presence & Badges
  online: '#10B981',
  offline: '#64748B',
  verifiedBadge: '#38BDF8',
  premiumBadge: '#F59E0B',

  // Typography Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDark: '#0A0D14',

  // UI Utilities
  divider: 'rgba(255, 255, 255, 0.08)',
  inputBackground: 'rgba(32, 39, 56, 0.65)',
  inputBorder: 'rgba(255, 255, 255, 0.14)',
  inputBorderFocus: '#FF2D55',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const Gradients = {
  brand: ['#FF2D55', '#8B5CF6'] as const,
  brandSunset: ['#FF2D55', '#FF7A00'] as const,
  superlike: ['#06B6D4', '#3B82F6'] as const,
  boost: ['#8B5CF6', '#EC4899'] as const,
  cardOverlay: ['transparent', 'rgba(10, 13, 20, 0.2)', 'rgba(10, 13, 20, 0.85)', '#0A0D14'] as const,
  darkGlass: ['rgba(32, 39, 56, 0.85)', 'rgba(20, 24, 35, 0.85)'] as const,
  goldPremium: ['#F59E0B', '#D97706'] as const,
  tabBar: ['rgba(14, 18, 27, 0.95)', 'rgba(10, 13, 20, 0.98)'] as const,
};
