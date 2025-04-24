'use client';
import { useEffect } from 'react';
import { create, find, remove, update } from '@/actions/crud';
import { DocsApp } from '@/components/app/docs';
import { Doc } from '@/generated/prisma';
import useDataset from '@/hooks/use-dataset';

const App = () => {

  const dataset = useDataset<Doc>({
    key: 'doc',
    fetchFn: (options) => find('doc', { ...options, searchKeys: ['ref', 'title'] }),
    createFn: (data) => create('doc', data),
    updateFn: (id, updateData) => update('doc', id, updateData),
    removeFn: (id) => remove('doc', id),
  });

  useEffect(() => {
    dataset.refresh()
  }, []);

  return (<DocsApp dataset={dataset} />);

};

export default App;
