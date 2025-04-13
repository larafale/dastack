import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva as cva2 } from 'class-variance-authority';

export const cva = cva2;

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
export const waitFor = (delay: number = 2000) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

export function mergeDeep(...objects: any[]) {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

export function truncateMiddle(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  const halfLength = Math.floor((maxLength - 3) / 2);
  const start = text.slice(0, halfLength);
  const end = text.slice(text.length - halfLength);

  return `${start}...${end}`;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== 'number' || !isFinite(seconds) || seconds < 0) {
    return '--:--';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// let chrono = Chrono.start();
// await someAsyncFunction();
// chrono = Chrono.end(chrono);
// console.log(chrono) => { duration: 1003, date: '2021-01-01T00:00:00.000Z' }

export const Chrono: any = {
  start: () => {
    const startTime = performance.now();
    const startDate = new Date().toISOString();
    return { start: startTime, date: startDate };
  },
  end: (chrono: ReturnType<typeof Chrono.start>) => ({
    duration: Math.round(performance.now() - chrono.start),
    date: chrono.date,
  }),
};

export const ucfirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const capitalize = (str: string = '') => {
  str = str.split(' ');
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = (str[i][0] || '').toUpperCase() + str[i].substr(1);
  }
  return str.join(' ');
};

export const namize = (
  n?: string | null | undefined,
  n2?: string | null | undefined
) => {
  n = `${n || ''} ${n2 || ''}` || '';
  n = n.toLowerCase().trim();
  if (!n) return '';
  n = capitalize(n);
  n = (n || '').replace(/(\sEt\s|\sDe\s|\sDu\s|\sDes\s)/g, (t) =>
    t.toLowerCase()
  ); // first round lowercase
  n = n.replace(/(\sD'|\sL')/g, (t) => t.toLowerCase()); // second round lowercase
  n = n.replace(/(\sd'[a-zé])/g, (t) => " d'" + (t[3] || '').toUpperCase()); // apostrophe case (letter d), ex: Jean d’Ormesson
  n = n.replace(/(\sl'[a-zé])/g, (t) => " L'" + (t[3] || '').toUpperCase()); // apostrophe case (letter l), ex: Victor de L’Espinay
  n = n.replace(/(-[a-z])/g, (v) => (v || '').toUpperCase()); // tiret case, ex: Jean-albert => Jean-Albert
  n = n.replace(/Née/g, 'née'); // Catherine Albertalli Née Larive => Catherine Albertalli née Larive
  return n;
};
