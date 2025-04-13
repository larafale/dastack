import { PageBody, PageHeader } from '@/components/page-components';
import Calendar from '@/components/app/cal';
import { useTranslations } from 'next-intl';

const Home = () => {
  const t = useTranslations('Apps');
  return (
    <>
      <PageHeader
        title={t('cal.title')}
        desc={t('cal.description')}
        backHref='/apps'
        backLabel={t('main.backLabel')} />

      <PageBody >
        <Calendar />
      </PageBody>
    </>
  );
};

export default Home;
