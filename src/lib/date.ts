import { fr } from 'date-fns/locale';
import { format } from 'date-fns';


// default to en
export type Locale = 'en' | 'fr';

const LOCALES: Record<Locale, any> = { en: null, fr };


export const formatLocale = (
  date: Date | string,
  displayFormat = 'PP - HH:mm',
  locale?: Locale,
  debug?: boolean
) => {
  try {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (debug) console.log(displayFormat, locale);
    return date && format(date, displayFormat, { locale: LOCALES[locale as Locale] });
  } catch (e) {
    return '??';
  }
};

export const formatFromTimestamp = (timestamp: string): string => {
  const now = new Date();
  let date = now;
  if (timestamp) date = new Date(timestamp);
  const months = date.getMonth();
  const days = date.getDate();
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1;
  const DD = days < 10 ? `0${days}` : days;
  const YYYY = date.getFullYear();
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`;
};

// Format time display. ex: 1:00
export const formatTimeDisplay = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
