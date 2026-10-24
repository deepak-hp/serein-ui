import { useFonts } from 'expo-font';
import AnekLatinLight from '@serein-ui/fonts/native/AnekLatin-Light.ttf';
import AnekLatinRegular from '@serein-ui/fonts/native/AnekLatin-Regular.ttf';
import AnekLatinMedium from '@serein-ui/fonts/native/AnekLatin-Medium.ttf';
import AnekLatinSemiBold from '@serein-ui/fonts/native/AnekLatin-SemiBold.ttf';
import ChivoMonoRegular from '@serein-ui/fonts/native/ChivoMono-Regular.ttf';

/** Font files keyed by the family name each one registers. Native platforms need one family per weight. */
export const fontFiles = {
  'AnekLatin-Light': AnekLatinLight,
  'AnekLatin-Regular': AnekLatinRegular,
  'AnekLatin-Medium': AnekLatinMedium,
  'AnekLatin-SemiBold': AnekLatinSemiBold,
  'ChivoMono-Regular': ChivoMonoRegular,
};

export type FontFamilyName = keyof typeof fontFiles;

/** Loads Anek Latin and Chivo Mono from @serein-ui/fonts. Render Serein components once the first value is true. */
export function useSereinFonts(): [loaded: boolean, error: Error | null] {
  return useFonts(fontFiles);
}
