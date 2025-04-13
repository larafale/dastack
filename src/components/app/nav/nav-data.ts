import {
  FolderCode,
  House,
  LayoutGrid,
  Palette,
} from 'lucide-react';

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

export const mainItems: MenuItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: House,
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: FolderCode,
  },
  {
    label: 'Apps',
    href: '/apps',
    icon: LayoutGrid,
  },
  {
    label: 'UI',
    href: '/ui',
    icon: Palette,
  },

];

export const uiItems: MenuItem[] = [
  {
    label: 'Forms',
    href: '/ui/forms',
  },
  {
    label: 'Timer',
    href: '/ui?q=timer',
  },
  {
    label: 'Audio Recorder',
    href: '/ui?q=audio-recorder',
  },
  {
    label: 'Audio Transcriber',
    href: '/ui?q=audio-transcriber',
  },
];

