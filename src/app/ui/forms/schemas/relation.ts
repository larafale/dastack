import { placeholder } from './shared';

import { Field } from '@/components/form/types';

const relationProps = {
    model: 'user',
    searchOptions: { searchKeys: ['name'], sortField: 'name', sortOrder: 'asc' },
    defaultItem: { id: '1', name: 'John Doe' },
    skipInitialFetch: true,
}

const schema: Field[] = [
    {
        name: 'relation',
        type: 'relation',
        props: relationProps,
    },
    {
        name: 'relation__disabled',
        type: 'relation',
        props: relationProps,
        disabled: true,
    },
];

export default schema;
