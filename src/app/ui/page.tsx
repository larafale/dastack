import { PageHeader, PageLinks, Section } from '@/components/page-components';
import { useTranslations } from 'next-intl';
import { ClipboardList, Mic, SquareMousePointer } from 'lucide-react';


const Dashboard = () => {
    const t = useTranslations('Ui');

    const LINKS = [
        {
            href: '/ui/forms',
            icon: ClipboardList,
            title: t('forms.title'),
            description: t('forms.description'),
        },
        {
            href: '/ui/buttons',
            icon: SquareMousePointer,
            title: t('buttons.title'),
            description: t('buttons.description'),
        },
        {
            href: '/ui/audio',
            icon: Mic,
            title: t('audio.title'),
            description: t('audio.description'),
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
