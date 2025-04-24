import { useTranslations } from 'next-intl';
import { SearchX } from 'lucide-react';
import {
    Table as TableMain,
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';
import TableHeaders from './headers';
import { Dataset } from '@/hooks/use-dataset';
import { TablePager } from '../crud/pager';

export interface TableSchema {
    key: string;
    label: string;
    sortable?: boolean;
}

export type RowRender<T extends Record<string, any>> = (
    row: T,
    index: number,
) => React.ReactNode;


interface TableProps<T extends Record<string, any>> {
    dataset: Dataset<T>;
    schema: TableSchema[];
    rowRender: RowRender<T>;
}

export default function Table<T extends Record<string, any>>({
    dataset,
    schema,
    rowRender,
}: TableProps<T>) {

    return (<>
        {dataset.isLoading ? (
            <LoadingRows />
        ) : dataset.items.length === 0 ? (
            <NoResults />
        ) : (<>
            <TableMain>
                <TableHeaders schema={schema} dataset={dataset} />
                <TableBody>
                    {dataset.items.map((row: T, index: number) =>
                        rowRender(row, index)
                    )}
                </TableBody>
            </TableMain>
            <TablePager dataset={dataset} />
        </>
        )}
    </>)
}

const LoadingRows = (props: any) => (
    <div className="section animate-pulse w-full">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-muted mb-7 h-6 rounded opacity-60"></div>
        ))}
    </div>
);

const NoResults = (props: any) => {
    const t = useTranslations('Crud.main');
    return (<div className="section">
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-md border border-dashed text-center animate-in fade-in-50">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <SearchX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t('noResults')}</h3>
        </div>
    </div>
    );
};