import { PageHeader, PageLinks, Section } from '@/components/page-components';
import { useTranslations } from 'next-intl';
import { Files, Users } from 'lucide-react';


const Dashboard = () => {
  const t = useTranslations('Crud');

  const LINKS = [
    {
      href: '/admin/users',
      icon: Users,
      title: t('users.title'),
      description: t('users.description'),
    },
    // {
    //   href: '/admin/docs',
    //   icon: Files,
    //   title: t('docs.title'),
    //   description: t('docs.description'),
    // },
  ];

  return (
    <>
      <PageHeader title={t('main.title')} desc={t('main.description')} />

      <Section>
        <PageLinks links={LINKS} />
      </Section >
    </>
  );
};

export default Dashboard;
