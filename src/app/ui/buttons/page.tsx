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

const ButtonUI = () => {
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
                            <div className="flex flex-col gap-5">
                                <div className="font-bold p-3 capitalize">{variant}</div>
                                <div className="flex items-center justify-center gap-2 bg-dotted shadow border p-4">
                                    {SIZES.map((size) => (
                                        <Button size={size} variant={variant} key={size} tabIndex={0}>Button</Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col gap-5">
                        <div className="font-bold p-3 capitalize">icon</div>
                        <div className="flex items-center justify-center gap-2 bg-dotted shadow border p-4">
                            {SIZES.map((size) => (
                                <Button tabIndex={0} key={size} size={size} >
                                    <ArrowRight />
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default ButtonUI;
