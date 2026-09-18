/**
 * Centralized Design System Theme Colors
 * 
 * Maps directly to @theme CSS variables defined in app/globals.css.
 * Use these constants in non-DOM contexts (such as @react-pdf/renderer or canvas)
 * to maintain strict single-source-of-truth consistency.
 */

export const themeColors = {
  // Brand Accents
  flashOrange: "#FF5722",
  flashOrangeHover: "#E64A19",
  flashOrangeSubtle: "#FFF3EE",
  electricAmber: "#FFA000",
  electricAmberHover: "#FF8F00",

  // Dark / Tech Neutrals
  techSlate: "#181B20",
  techSlateHover: "#0F1114",
  techSlateDark: "#0B0D10",

  // Surfaces & Backgrounds
  cleanWhite: "#FFFFFF",
  mistGray: "#F4F5F7",
  elevatedSurface: "#FAFAFA",
  surfaceHover: "#F4F4F5",
  surfaceSubtle: "#F9FAFB",
  surfaceDisabled: "#E4E4E7",

  // Borders
  borderDefault: "#E4E4E7",
  borderSubtle: "#F0F0F2",
  borderStrong: "#D4D4D8",
  borderDark: "#27272A",

  // Typography / Text
  textPrimary: "#181B20",
  textSecondary: "#52525B",
  textMuted: "#71717A",
  textDisabled: "#A1A1AA",
  caption: "#71717A",

  // Status - Success
  success: "#16A34A",
  successHover: "#15803D",
  successLight: "#F0FDF4",
  successBorder: "#BBF7D0",
  successText: "#15803D",
  successGreen: "#00C853",

  // Status - Error
  error: "#DC2626",
  errorHover: "#B91C1C",
  errorLight: "#FEF2F2",
  errorBorder: "#FECACA",
  errorText: "#991B1B",

  // Status - Warning
  warning: "#D97706",
  warningHover: "#B45309",
  warningLight: "#FFFBEB",
  warningBorder: "#FDE68A",
  warningText: "#92400E",

  // Status - Info
  info: "#2563EB",
  infoHover: "#1D4ED8",
  infoLight: "#EFF6FF",
  infoBorder: "#BFDBFE",
  infoText: "#1E40AF",

  // WhatsApp Brand
  whatsapp: "#25D366",
  whatsappHover: "#20BD5A",
  whatsappDark: "#075E54",
} as const;

export type ThemeColorKey = keyof typeof themeColors;

export default themeColors;
