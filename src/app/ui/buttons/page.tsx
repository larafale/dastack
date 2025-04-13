'use client';

import { PageHeader, Section } from '@/components/page-components';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';


const VARIANTS = [
    'default',
    'outline',
    'ghost',
    'link',
    'secondary',
    'destructive',
];

const SIZES = [
    'sm',
    'default',
    'lg',
];

const AudioUI = () => {
    const t = useTranslations('Ui');

    return (
        <>
            <PageHeader
                title={t('buttons.title')}
                desc={t('buttons.description')}
                backHref={t('main.backHref')}
                backLabel={t('main.backLabel')} />

            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {VARIANTS.map((variant) => (
                        <div className="flex flex-col gap-2" key={variant}>
                            <Card className="p-4 flex flex-col gap-5">
                                <Label className="text-sm font-medium border-b  border-dashed text-center pb-2">{variant}</Label>
                                <div className="flex items-center justify-center gap-2">
                                    {SIZES.map((size) => (
                                        <Button size={size} variant={variant} key={size} tabIndex={0}>Button</Button>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))}
                    <Card className="p-4 flex flex-col gap-5">
                        <Label className="text-sm font-medium border-b  border-dashed text-center pb-2">icon</Label>
                        <div className="flex items-center justify-center gap-2">
                            {SIZES.map((size) => (
                                <Button tabIndex={0} key={size} size={size} >
                                    <ArrowRight />
                                </Button>
                            ))}
                        </div>
                    </Card>
                </div>
            </Section>
        </>
    );
};

export default AudioUI;
