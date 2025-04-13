import { PageHeader, PageLinks, Section } from '@/components/page-components';
import { useTranslations } from 'next-intl';
import { Calendar1, FolderOpen } from 'lucide-react';


const Dashboard = () => {
    const t = useTranslations('Apps');

    const LINKS = [
        {
            href: '/apps/docs',
            icon: FolderOpen,
            title: t('docs.title'),
            description: t('docs.description'),
        },
        {
            href: '/apps/cal',
            icon: Calendar1,
            title: t('cal.title'),
            description: t('cal.description'),
        },
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
