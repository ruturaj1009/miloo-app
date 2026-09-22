/**
 * Centralized Miloo Dating App Color Palette & Design Tokens
 * Conforms directly to the dating-app-ui specification in app-ui/SKILL.md.
 * 
 * To re-theme the entire application, simply adjust the tokens in this single file.
 */

export const Colors = {
  // 1. Core Brand Colors (SKILL.md: Coral/Rose #FF4458 -> Electric Indigo #7C3AED)
  brandPrimary: '#FF4458',
  brandPrimaryHover: '#FF5864',
  brandSecondary: '#7C3AED',
  brandSecondaryLight: '#6366F1',
  primary: '#FF4458',
  primaryGradientStart: '#FF4458',
  primaryGradientEnd: '#7C3AED',
  secondary: '#7C3AED',
  accent: '#00C9FF', // Vivid Cyan

  // 2. Action & Interaction Colors
  like: '#10B981', // Neon Emerald
  likeGlow: 'rgba(16, 185, 129, 0.4)',
  likeBackground: 'rgba(16, 185, 129, 0.15)',
  
  pass: '#FF4458', // Vibrant Coral / Rose
  passGlow: 'rgba(255, 68, 88, 0.4)',
  passBackground: 'rgba(255, 68, 88, 0.15)',

  superlike: '#00C9FF', // Vivid Cyan
  superlikeGlow: 'rgba(0, 201, 255, 0.4)',
  superlikeBackground: 'rgba(0, 201, 255, 0.2)',

  boost: '#A855F7', // Luminous Purple
  boostGlow: 'rgba(168, 85, 247, 0.4)',
  boostBackground: 'rgba(168, 85, 247, 0.15)',

  undo: '#F59E0B', // Amber Gold
  undoGlow: 'rgba(245, 158, 11, 0.4)',
  undoBackground: 'rgba(245, 158, 11, 0.15)',

  // 3. Backgrounds & Dark Moody Canvases (SKILL.md: #0F1115, #161922)
  backgroundPrimary: '#0F1115',
  backgroundSecondary: '#161922',
  backgroundCard: '#1B202D',
  backgroundElevated: '#242A3C',
  backgroundBackdrop: 'rgba(0, 0, 0, 0.82)',

  // 4. Glassmorphism & Translucent Surfaces
  neutralCard: 'rgba(255, 255, 255, 0.08)',
  neutralCardBorder: 'rgba(255, 255, 255, 0.12)',
  glassBackground: 'rgba(22, 25, 34, 0.75)',
  glassBackgroundLight: 'rgba(255, 255, 255, 0.08)',
  glassBackgroundDark: 'rgba(15, 17, 21, 0.88)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderSubtle: 'rgba(255, 255, 255, 0.06)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.18)',
  glassBorderGlow: 'rgba(255, 68, 88, 0.35)',

  // 5. Typography Colors (SKILL.md: #FFFFFF, #9CA3AF, #6B7280)
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textDark: '#0F1115',
  textLink: '#00C9FF',

  // 6. Presence & Badges
  online: '#10B981',
  offline: '#6B7280',
  verifiedBadge: '#38BDF8',
  premiumBadge: '#F59E0B',

  // 7. Form & UI Utilities
  divider: 'rgba(255, 255, 255, 0.08)',
  inputBackground: 'rgba(22, 25, 34, 0.85)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
  inputBorderFocus: '#FF4458',
  promptBoxBackground: 'rgba(255, 255, 255, 0.04)',
  promptBoxBorder: 'rgba(255, 255, 255, 0.1)',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const Gradients = {
  brand: ['#FF4458', '#7C3AED'] as const,
  brandSunset: ['#FF4458', '#FF7A00'] as const,
  brandHorizontal: ['#FF4458', '#6366F1'] as const,
  superlike: ['#00C9FF', '#0072FF'] as const,
  matchEmerald: ['#10B981', '#00E676'] as const,
  boost: ['#7C3AED', '#EC4899'] as const,
  cardOverlay: ['transparent', 'rgba(15, 17, 21, 0.25)', 'rgba(15, 17, 21, 0.85)', '#0F1115'] as const,
  mediaBottomOverlay: ['transparent', 'rgba(0, 0, 0, 0.85)'] as const,
  darkGlass: ['rgba(36, 42, 60, 0.85)', 'rgba(22, 25, 34, 0.85)'] as const,
  goldPremium: ['#F59E0B', '#D97706'] as const,
  tabBar: ['rgba(22, 25, 34, 0.92)', 'rgba(15, 17, 21, 0.98)'] as const,
};
