'use client';

import BasePicker from './base';
import { formatLocale } from '@/lib/date';
import { Clock, FolderOpen, Search, User } from 'lucide-react';
import { namize } from '@/lib/utils';
import { Button } from '../ui/button';
import Modal from '../modal';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { useRouter } from 'next/navigation';
import { getDocs } from '@/actions/docs';
import { getUsers } from '@/actions/users';
import { useTranslations } from 'next-intl';

const DocRender = ({ item = {} }) => {
  return (
    <div className="flex justify-between items-center gap-2 text-xs p-2 w-full">
      <div className=" border-r border-dashed pe-2">
        <div className="font-bold font-mono">{item.ref}</div>
      </div>
      <div className="flex-1 flex justify-between">
        <div className="flex flex-col justify-center flex-1 border-r border-dashed">
          <div>{namize(item?.title)}</div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div className="text-muted-foreground">
          {formatLocale(item.created_at, 'PP')}
        </div>
      </div>
    </div>
  );
};

const UserRender = ({ item = {} }) => {
  return (
    <div className="flex justify-between items-center gap-2 text-xs p-2 w-full">
      <div className=" border-r border-dashed pe-2">
        <div className="font-bold font-mono">{item.ref}</div>
      </div>
      <div className="flex-1 flex justify-between">
        <div className="flex flex-col justify-center flex-1 border-r border-dashed">
          <div>{namize(item?.name)}</div>
          {/* <div className="text-muted-foreground">{item?.phone}</div> */}
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div className="text-muted-foreground">
          {formatLocale(item.created_at, 'PP')}
        </div>
      </div>
    </div>
  );
};

const fetchers = {
  docs: getDocs,
  users: getUsers,
};

const mapper = (data: any) => {
  return data.data;
};

const fetcher = async (search: string, namespace: string) => {
  //@ts-ignore
  const res = await fetchers[namespace]({ search, pageSize: 3 });
  console.log('res', res);
  return res;
};

const config = {
  docs: {
    fetcher,
    mapper,
    icon: <FolderOpen />,
    itemRenderer: DocRender,
  },
  users: {
    fetcher,
    mapper,
    icon: <User />,
    itemRenderer: UserRender,
  },
};

export default function GlobalPicker() {
  const [open, setOpen] = useState(false);
  const { getShortcut } = useShortcuts();
  const router = useRouter();
  const t = useTranslations('Search');

  const onChoose = (item: any, namespace: string) => {
    if (namespace === 'docs')
      router.push(`/apps/docs?docID=${item.id}`);
    else
      router.push(`/admin/${namespace}?search=${item.ref}`);
    setOpen(false);
  };

  useHotkeys(
    getShortcut('search', true) as string,
    () => {
      setOpen((prevOpen) => !prevOpen);
    },
    {
      preventDefault: true,
    }
  );

  return (
    <>
      <Button className='rounded-none w-[50px]' variant="ghost" size="lg" onClick={() => setOpen(!open)}>
        <Search />
      </Button>
      <Modal
        mode="dialog"
        showCloseButton={false}
        open={open}
        onClose={() => setOpen(false)}
        className=" p-0 h-full md:h-auto"
      >
        <BasePicker
          placeholder={t('placeholder')}
          config={config}
          namespaces={Object.keys(config)}
          onChoose={onChoose}
          onClose={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
