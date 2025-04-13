'use client';


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function ConfirmDialog({
  open,
  confirmAction,
  closeAction,
  title,
  description,
}: {
  open: boolean;
  confirmAction: () => void;
  closeAction: () => void;
  title?: string;
  description?: string;
}) {

  const t = useTranslations('Crud');
  return (
    <Dialog open={open} onOpenChange={closeAction}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title || 'Confirm'}</DialogTitle>
          <DialogDescription>
            {description || 'Are you sure you want to confirm this action?'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={closeAction}>
            {t('actions.cancel')}
          </Button>
          <Button variant="default" onClick={confirmAction}>
            {t('actions.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
