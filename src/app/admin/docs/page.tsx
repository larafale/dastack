import { Crud } from './crud';
import { PageBody, PageHeader } from '@/components/page-components';
import { useTranslations } from 'next-intl';

const Home = () => {
  const t = useTranslations('Crud');
  return (
    <>
      <PageHeader
        title={t('docs.title')}
        desc={t('docs.description')}
        backHref={t('main.backHref')}
        backLabel={t('main.backLabel')}
      />

      <PageBody>
        <Crud />
      </PageBody>
    </>
  );
};

export default Home;
