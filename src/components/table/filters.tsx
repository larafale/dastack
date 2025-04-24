import { SearchInput } from '@/components/search-input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Dataset } from '@/hooks/use-dataset';
import { useCallback } from 'react';


interface FiltersProps {
    dataset: Dataset;
    actionButtons?: React.ReactNode[];
}

const TableFilters = ({
    dataset,
    actionButtons,
}: FiltersProps) => {

    return (
        <div className="section flex justify-between items-center gap-2">
            <div className="flex justify-between gap-2">
                <SearchInput
                    isPending={dataset.isLoading}
                    onSearch={(value) => dataset.handleSearch(value)}
                />
                <DateRangePicker
                    placeholder={false}
                    onChange={dataset.handleDateRange}
                    value={
                        dataset.dateFrom && dataset.dateTo
                            ? {
                                from: new Date(dataset.dateFrom),
                                to: new Date(dataset.dateTo),
                            }
                            : undefined
                    }
                />
            </div>
            <div className="flex justify-between items-center gap-2">
                {actionButtons && (
                    <div className="flex gap-2">
                        {actionButtons.map((button, index) => (
                            <div key={index}>{button}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableFilters;
