import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium transition-colors  disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:ring-ring active:ring-2 active:ring-offset-2 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        outline: 'border border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground ',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline focus-visible:underline focus-visible:ring-0 active:ring-0 active:ring-offset-0',
      },
      size: {
        default: 'h-9 px-3 py-2 [&_svg]:size-4 ',
        xs: 'h-5 px-1 text-xs [&_svg]:size-2',
        sm: 'h-7 px-2 text-xs [&_svg]:size-3',
        lg: 'h-14 px-5 text-lg [&_svg]:size-5',
        icon: 'h-9 w-9 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        type='button'
        ref={ref}
        tabIndex={-1}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { icon?: React.ReactNode }
>(({ isLoading = false, icon, ...props }, ref) => {
  return (
    <Button {...props} ref={ref} disabled={props.disabled || isLoading}>
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && icon && icon}
      {props.children}
    </Button>
  );
});
LoadingButton.displayName = 'LoadingButton';

export { Button, buttonVariants, LoadingButton };
