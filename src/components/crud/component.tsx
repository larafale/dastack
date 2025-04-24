'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormSchema } from '@/types/form';
import { TableSchema } from '@/types/table';

import { Table, TableFilters, RowRender } from '@/components/table';
import DynamicForm from '@/components/form/dynamic-form';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Dataset } from '@/hooks/use-dataset';
import { TablePager } from './pager';
import Actions from './actions';
import CrudHotkeys from './hotkeys';


interface CrudProps<T extends Record<string, any>> {
    dataset: Dataset<T>;
    tableSchema: TableSchema;
    formCreateSchema: FormSchema;
    formUpdateSchema: FormSchema;
    rowRender: RowRender<T>;
}

const Crud = <T extends Record<string, any>>({
    dataset,
    tableSchema,
    formCreateSchema,
    formUpdateSchema,
    rowRender,
}: CrudProps<T>) => {
    const t = useTranslations('Crud');
    const [isCreating, setIsCreating] = useState(false);
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
    const crudRef = useRef<HTMLDivElement>(null);


    const handleCreate = async (newData: T): Promise<any> => {
        if (!newData) return;

        //@ts-ignore
        const { err, data } = await dataset.createFn(newData);

        if (err) return toast.error(err.message);
        dataset.refresh();
        dataset.clearItem();
        setIsCreating(false);
        toast.success(t('success.create'));
    };

    const handleEdit = async (updateData: T): Promise<any> => {
        const id = dataset.selectedItem?.id;
        if (!id) return;

        //@ts-ignore
        const { err, data } = await dataset.updateFn(id, updateData);

        if (err) return toast.error(err.message);

        // Update the item in the local state without triggering a full refresh
        dataset.setItems(dataset.items.map(item => item.id === id ? data : item));

        // Wait for state updates to complete before clearing
        setTimeout(() => {
            dataset.selectItem(null);
            toast.success(t('success.update'));
        }, 0);
    };

    const handleRemove = async (): Promise<any> => {
        const id = dataset.selectedItem?.id;
        if (!id) return;

        //@ts-ignore
        const { err } = await dataset.removeFn(id);

        if (err) return toast.error(err.message);
        dataset.refresh();
        dataset.clearItem();
        toast.success(t('success.remove'));
    };

    const actionButtons = [];

    if (dataset.createFn)
        actionButtons.push(
            <Button
                variant={'outline'}
                size={'icon'}
                key="create"
                onClick={() => {
                    setIsCreating(true);
                    dataset.selectItem({} as T);
                }}
            >
                <PlusIcon />
            </Button>
        );

    return (
        <div ref={crudRef}>
            <TableFilters dataset={dataset} actionButtons={actionButtons} />

            <Table
                dataset={dataset}
                schema={tableSchema}
                rowRender={rowRender}
            />

            <Modal
                className='w-[100vw] sm:max-w-[500px]'
                mode={isCreating ? 'dialog' : 'sheet'}
                open={!!dataset.selectedItem}
                onClose={() => {
                    dataset.clearItem();
                    setTimeout(() => setIsCreating(false), 300);
                }}
            >
                {!isCreating && <Actions
                    dataset={dataset}
                    onRemove={dataset.removeFn && handleRemove}
                />}

                <DynamicForm
                    key={`${dataset.selectedItem?.id || 'create'}-${Date.now()}`}
                    //@ts-ignore
                    onSubmit={isCreating ? handleCreate : handleEdit}
                    schema={isCreating ? formCreateSchema : formUpdateSchema}
                    saveLabel={isCreating ? t('actions.create') : t('actions.update')}
                    dirtyOnly={isCreating ? false : true}
                    initialData={dataset.selectedItem || {}}
                />
            </Modal>

            <CrudHotkeys<T>
                crudRef={crudRef}
                dataset={dataset}
                isCreating={isCreating}
                setActiveRowIndex={setActiveRowIndex}
            />
        </div>
    );
};

export default Crud;