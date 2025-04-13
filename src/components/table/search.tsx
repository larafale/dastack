'use client';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';


interface SearchFormProps {
  defaultValue: string;
  isPending: boolean;
  onSearch: (value: string) => void;
  className?: string;
}

export function SearchInput({
  defaultValue,
  isPending,
  onSearch,
  className,
}: SearchFormProps) {
  const [value, setValue] = useState(defaultValue);
  const t = useTranslations('Crud.main');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };
  return (
    <form onSubmit={handleSubmit} className={cn("group relative ", className)}>
      <Input
        id="table-search"
        name="search"
        type="text"
        placeholder={t('search')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pr-15"
        autoFocus
        autoComplete="off"
      />
      {value && (
        <div
          onClick={handleClear}
          className="absolute top-[10px] right-[40px] cursor-pointer opacity-0 group-hover:opacity-50"
        >
          <X className="size-4" />
        </div>
      )}
      <Button
        variant="ghost"
        type="submit"
        disabled={isPending}
        className="absolute inset-y-0 right-0 "
        style={{ marginTop: 4, height: 28, marginRight: 4, borderRadius: '.1rem' }}
      >
        <Search />
      </Button>
    </form>
  );
}
