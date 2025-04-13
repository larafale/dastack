import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  // Base styles
  'file:text-foreground placeholder:text-placeholder  flex w-full transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'field-style field-shadow',
      },
      uiSize: {
        default: 'h-9 px-2', // Default size
        sm: 'h-7 p-2 text-xs [&_svg]:size-3',
        lg: 'h-14 px-3 text-lg [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      uiSize: 'default',
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  //@ts-ignore
  ({ className, variant, uiSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, uiSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
