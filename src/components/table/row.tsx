'use client';
import * as React from 'react';

import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface RowProps extends React.ComponentPropsWithRef<typeof TableRow> {
  className?: string;
}

const Row = ({ className, ...props }: RowProps) => (
  <TableRow className={cn(className)} tabIndex={0} {...props} />
);

export default Row;
