import { Pager } from "@/components/pager";

import { Info } from "lucide-react";
import { Dataset } from "@/hooks/use-dataset";
import { useTranslations } from "next-intl";

export const TablePager = ({
    dataset
}: {
    dataset: Dataset<any>;
}) => {

    if (dataset.pager.total === 0 || dataset.isLoading) return null;

    const t = useTranslations('Crud');
    const { pager } = dataset

    return (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-center justify-between p-4 border-t">
            <span className="text-muted-foreground flex items-center gap-2 text-xs sm:text-base">
                <Info className="w-4 h-4" />
                {t('main.nbResults', { count: pager.total })}
            </span>
            <Pager
                currentPage={pager.page}
                totalPages={pager.pages}
                onPageChange={dataset.setPage}
            />
        </div>
    )
}