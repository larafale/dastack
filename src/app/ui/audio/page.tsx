'use client';

import { PageHeader, Section } from '@/components/page-components';
import { useTranslations } from 'next-intl';
import Widget from '@/components/audio-stream/examples/widget';
import Button from '@/components/audio-stream/examples/button';

const AudioUI = () => {
    const t = useTranslations('Ui');

    return (
        <>
            <PageHeader
                title={t('audio.title')}
                desc={t('audio.description')}
                backHref={t('main.backHref')}
                backLabel={t('main.backLabel')} />

            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Widget />
                    <Button />
                </div>
            </Section>
        </>
    );
};

export default AudioUI;
