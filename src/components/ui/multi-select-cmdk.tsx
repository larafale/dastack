import { Command } from 'cmdk';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
}: MultiSelectProps) => {
  const toggleSelection = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  const getSelectedLabels = () => {
    return selected
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="block rounded border p-2 text-left">
          {selected.length > 0 ? getSelectedLabels() : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-3" align="start">
        <Command className="">
          <Command.Input
            placeholder={`Search ${placeholder}...`}
            className="mb-4"
          />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            {options.map((option) => (
              <Command.Item
                key={option.value}
                onSelect={() => toggleSelection(option.value)}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => toggleSelection(option.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>{option.label}</span>
                </div>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
