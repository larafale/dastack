/**
 * Imports the Inter and JetBrains_Mono fonts from the 'next/font/google' module.
 * These fonts are used throughout the application for the sans-serif and monospace font families, respectively.
 */
import { Inter, JetBrains_Mono } from 'next/font/google';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  fallback: ['system-ui', 'arial'],
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['system-ui', 'arial'],
});

export const fonts = [fontSans.variable, fontMono.variable];
