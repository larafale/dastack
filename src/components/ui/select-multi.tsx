'use client';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { ChevronsUpDown, X } from 'lucide-react';
import Select, { components } from 'react-select';

const selectMultiVariants = cva(
  'data-[placeholder]:text-placeholder flex w-full items-center justify-between whitespace-nowrap cursor-pointer transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 ',
  {
    variants: {
      variant: {
        default: 'field-style field-shadow',
      },
      size: {
        default: 'min-h-9  px-2 [&_svg]:size-4',
        sm: 'min-h-7 px-2 text-xs [&_svg]:size-3',
        lg: 'min-h-14 px-3 text-lg [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type OptionType = { [key: string]: any };
type OptionsType = Array<OptionType>;

interface SelectMultiProps {
  // defaultValue: string[];
  // onChange: (value: string[]) => void;
  options: OptionsType;
  placeholder?: string;
  isDisabled?: boolean;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default';
}

const customStyles = {
  // must initialise control even if no css is applied, to reset it for the field-styles
  control: (base: any) => ({
    // lineHeight: '0.9em',
  }),
  container: (base: any) => ({
    ...base,
    pointerEvents: 'inherit',
  }),
  placeholder: (base: any) => ({
    ...base,
    marginRight: 0,
    marginLeft: 0,
    color: 'var(--placeholder)',
  }),
  menu: (base: any) => ({
    ...base,
    fontSize: '80%',
    backgroundColor: 'var(--background)',
  }),
  option: (base: any, { isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) => ({
    ...base,
    backgroundColor: isSelected
      ? 'var(--primary)'
      : isFocused
        ? 'var(--accent)'
        : 'transparent',
    color: isSelected
      ? 'var(--primary-foreground)'
      : 'var(--foreground)',
    cursor: 'pointer',
  }),

  singleValue: (base: any) => ({
    ...base,
    color: 'var(--foreground)',
    fontSize: '90%',
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: 'var(--muted)',
    fontSize: '90%',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    color: 'var(--foreground)',
  }),
  multiValueRemove: (base: any, { isDisabled }: { isDisabled?: boolean }) => ({
    ...base,
    display: isDisabled ? 'none' : 'flex',
    '&:hover': {
      backgroundColor: 'var(--muted)',
      color: 'var(--muted)',
    },
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: 'var(--muted)',
  }),
  dropdownIndicator: (base: any) => ({
    padding: 0,
    paddingLeft: '0.5rem',
  }),
};

const customComponents = {
  DropdownIndicator: (props: any) => (
    <components.DropdownIndicator {...props} className="p-0">
      <ChevronsUpDown />
    </components.DropdownIndicator>
  ),
  ClearIndicator: (props: any) => (
    <components.ClearIndicator {...props}>
      <X className="close-icon" />
    </components.ClearIndicator>
  ),
};

export const SelectMulti = (props: SelectMultiProps) => {
  return (
    <Select
      isMulti={true}
      tabSelectsValue={false}
      // onKeyDown={onKeyDown}
      {...props}
      classNames={{
        placeholder: () => 'text-placeholder',
        control: (state: any) =>
          cn(
            selectMultiVariants({ size: props.size, variant: props.variant }),
            'react-select-clean group',
            props.isDisabled && 'cursor-not-allowed opacity-50'
          ),
      }}
      styles={customStyles}
      components={customComponents}
    />
  );
};
