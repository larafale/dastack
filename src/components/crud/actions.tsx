import { Info, MoreVertical, Trash, X } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

import { formatLocale } from '@/lib/date';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useState } from 'react';
import { Dataset } from '@/hooks/use-dataset';
import { useTranslations } from 'next-intl';

interface ActionsProps<T extends Record<string, any>> {
  dataset: Dataset<T>;
  onRemove?: any;
}

const Actions = <T extends Record<string, any>>({
  dataset,
  onRemove,
}: ActionsProps<T>) => {
  const [open, setOpen] = useState(false);
  const showMenu = !!onRemove;
  const t = useTranslations('Crud');
  function handleRemove() {
    console.log('remove confirmed!');
    onRemove && onRemove();
    setOpen(false);
  }

  return (
    <div className="flex justify-between space-x-2 border-b pb-3 mb-3">
      <ConfirmDialog
        title={t('removeConfirm.title')}
        description={t('removeConfirm.description')}
        open={open}
        confirmAction={handleRemove}
        closeAction={() => setOpen(false)}
      />
      <div className="flex items-center space-x-2">
        <Button
          size={'icon'}
          variant="ghost"
          onClick={() => dataset.clearItem()}
        >
          <X />
        </Button>
      </div>
      <div className="flex  items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={'icon'} variant="ghost" tabIndex={-1}>
                <Info />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <div className="flex justify-between">
                <span className='me-4'>Créé:</span>
                <span>{formatLocale(dataset.selectedItem?.created_at, 'P - HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className='me-4'>Modifié:</span>
                <span>{formatLocale(dataset.selectedItem?.updated_at, 'P - HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className='me-4'>Ref:</span>
                <span>{dataset.selectedItem?.ref}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {showMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} variant={'ghost'} tabIndex={-1}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <span>{t('actions.remove')}</span>
                <Trash />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Actions;
