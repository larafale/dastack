import { TableCell } from '@/components/ui/table';
import { formatLocale } from '@/lib/date';
import { cn } from '@/lib/utils';

type CellProps = React.ComponentPropsWithRef<typeof TableCell> & {
  type?: 'ref' | 'datetime';
  value?: string | number | Date;
  typeProps?: Record<string, any>;
};


export default function Cell({ type, className, value, typeProps, ...props }: CellProps) {
  if (type === 'ref') {
    props.children = [value]
    props.className = cn('font-mono text-xs', className)
  }
  if (type === 'datetime') {
    // props.children = [formatLocale(value as Date, typeProps?.format || 'PP - HH:mm')]
    props.children = [<div className='font-mono text-xs'>
      {formatLocale(value as Date, typeProps?.format || 'PP HH:mm')}
    </div>]
  }

  return <TableCell {...props} />;
}
