import { TableCell } from '@/components/ui/table';
import { formatLocale } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

type CellProps = React.ComponentPropsWithRef<typeof TableCell> & {
  type?: 'ref' | 'datetime' | 'badge';
  value?: string | number | Date;
  options?: Record<string, any>;
  typeProps?: Record<string, any>;
};


export default function Cell({ type, className, value, options, ...props }: CellProps) {
  if (type === 'ref') {
    props.children = [value]
    props.className = cn('font-mono text-xs', className)
  }
  if (type === 'datetime') {
    // props.children = [formatLocale(value as Date, props?.format || 'PP - HH:mm')]
    props.children = [<div className='font-mono text-xs'>
      {formatLocale(value as Date, props?.format || 'PP HH:mm')}
    </div>]
  }
  if (type === 'badge') {
    // props.children = [value]
    props.children = [value && <Badge variant='outline'
      className={cn('font-mono text-xs gap-2 border-2', `border-${options?.color}-500`, options?.className, className)}>
      {value}
      {options?.icon && <options.icon className='size-3' />}
      {/* <span className={`bg-${props?.color}-500 rounded-full size-3`}></span> */}
    </Badge>]
  }

  return <TableCell {...props} />;
}
