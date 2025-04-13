import * as React from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textareaVariants = cva(
  // Base styles
  'flex w-full placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'field-style field-shadow',
      },
      uiSize: {
        default: 'min-h-[90px] px-2 py-1', // Default size
        sm: 'min-h-[70px] p-2 text-xs [&_svg]:size-3',
        lg: 'min-h-[120px] p-3 text-lg [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      uiSize: 'default',
    },
  }
);

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, variant, uiSize, ...props }, ref) => {
  return (
    <textarea
      className={cn(textareaVariants({ variant, uiSize, className }))}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
