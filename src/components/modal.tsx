
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  mode?: 'dialog' | 'sheet' | 'drawer';
  className?: string;
  showCloseButton?: boolean;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  mode = 'dialog',
  className,
  showCloseButton = true,
}: ModalProps) {
  // mode = mode === 'drawer' && !isMobile ? 'sheet' : mode;

  return (
    <>
      {mode === 'dialog' && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent showCloseButton={showCloseButton} className={className} aria-describedby={undefined}>
            <DialogHeader className={cn({ hidden: !title })}>
              {title ? (
                <DialogTitle>{title}</DialogTitle>
              ) : (
                <DialogTitle className="sr-only">Dialog</DialogTitle>
              )}
            </DialogHeader>

            {children}
          </DialogContent>
        </Dialog>
      )}
      {mode === 'sheet' && (
        <Sheet open={open} onOpenChange={onClose}>
          <SheetContent aria-describedby={undefined} className={className}>
            <SheetHeader className={cn({ hidden: !title })}>
              {title ? (
                <SheetTitle>{title}</SheetTitle>
              ) : (
                <SheetTitle className="sr-only">Sheet</SheetTitle>
              )}
            </SheetHeader>

            {children}
          </SheetContent>
        </Sheet>
      )}
      {mode === 'drawer' && (
        <Drawer open={open} onOpenChange={onClose}>
          <DrawerContent className="p-4" aria-describedby={undefined}>
            <DrawerHeader className={cn({ hidden: !title })}>
              {title ? (
                <DrawerTitle>{title}</DrawerTitle>
              ) : (
                <DrawerTitle className="sr-only">Drawer</DrawerTitle>
              )}
            </DrawerHeader>

            {children}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
