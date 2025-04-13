import { PageBody, PageHeader } from '@/components/page-components';
import App from './app';
import { useTranslations } from 'next-intl';

const Home = () => {
  const t = useTranslations('Apps');
  return (
    <>
      <PageHeader
        title={t('docs.title')}
        desc={t('docs.description')}
        backHref='/apps'
        backLabel={t('main.backLabel')} />

      <PageBody className='flex-1' >
        <App />
      </PageBody>
    </>
  );
};

export default Home;
