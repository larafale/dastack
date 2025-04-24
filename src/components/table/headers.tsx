import { ChevronsUpDown } from 'lucide-react';
import { TableSchema } from '@/types/table';
import { Dataset } from '@/hooks/use-dataset';

import { Button } from '@/components/ui/button';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableHeadersProps {
    schema: TableSchema;
    dataset: Dataset;
}

const TableHeaders = ({
    schema,
    dataset
}: TableHeadersProps) => {
    return (
        <TableHeader>
            <TableRow className="hover:bg-muted bg-muted border-b-0">
                {schema.map((header, index) => {
                    const radius = index === 0 ? 'rounded-none' : '';
                    const radius2 = ""//index === table.schema.length - 1 ? 'rounded-none' : '';
                    const radiusClass = `${radius} ${radius2}`;

                    const isSortable = header.sortable;

                    return (
                        <TableHead
                            key={header.key}
                            className={`py-2 ${radiusClass}`}
                            //@ts-ignore
                            width={header.width || 'auto'}
                        >
                            <Button
                                variant="ghost"
                                className={cn(isSortable ? 'cursor-pointer' : 'cursor-default')}
                                onClick={() => isSortable ? dataset.handleSort(header.key) : null}
                            >
                                {header.label || header.key}{' '}
                                {isSortable && <ChevronsUpDown className="size-4" />}
                            </Button>
                        </TableHead>
                    );
                })}
            </TableRow>
        </TableHeader>
    );
};

export default TableHeaders;
