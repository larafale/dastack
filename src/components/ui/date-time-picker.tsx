// 'use client';
// import React, { forwardRef, useCallback } from 'react';
// import { type Options, useTimescape } from 'timescape/react';

// import { Input } from '@/components/ui/input';
// import { cn } from '@/lib/utils';
// import { CalendarIcon } from 'lucide-react';
// import { buttonVariants } from './button';

// const timePickerInputBase =
//   'p-1 inline tabular-nums h-fit border-none outline-none select-none content-box caret-transparent rounded-sm min-w-8 text-center focus:bg-secondary focus-visible:ring-0 focus-visible:outline-none';
// const timePickerSeparatorBase = 'text-xs text-gray-400';

// type DateFormat = 'days' | 'months' | 'years';
// type TimeFormat = 'hours' | 'minutes' | 'seconds' | 'am/pm';

// type DateTimeArray<T extends DateFormat | TimeFormat> = T[];
// type DateTimeFormatDefaults = [
//   DateTimeArray<DateFormat>,
//   DateTimeArray<TimeFormat>,
// ];

// const DEFAULTS = [
//   ['days', 'months', 'years'],
//   // ['months', 'days', 'years'],
//   ['hours', 'minutes'], //, 'am/pm'],
// ] as DateTimeFormatDefaults;

// type TimescapeReturn = ReturnType<typeof useTimescape>;
// type InputPlaceholders = Record<DateFormat | TimeFormat, string>;
// const INPUT_PLACEHOLDERS: InputPlaceholders = {
//   days: 'DD',
//   months: 'MM',
//   years: 'YYYY',
//   hours: 'HH',
//   minutes: 'MM',
//   seconds: 'SS',
//   'am/pm': 'AM/PM',
// };

// const DatetimeGrid = forwardRef<
//   HTMLDivElement,
//   {
//     format: DateTimeFormatDefaults;
//     className?: string;
//     timescape: Pick<TimescapeReturn, 'getRootProps' | 'getInputProps'>;
//     placeholders: InputPlaceholders;
//   }
// >(
//   (
//     {
//       format,
//       className,
//       timescape,
//       placeholders,
//     }: {
//       format: DateTimeFormatDefaults;
//       className?: string;
//       timescape: Pick<TimescapeReturn, 'getRootProps' | 'getInputProps'>;
//       placeholders: InputPlaceholders;
//     },
//     ref
//   ) => {
//     return (
//       <div
//         className={cn(
//           buttonVariants({ variant: 'outline' }),
//           'hover:text-accent-foreground focus:ring-ring selection:text-foreground selection:bg-transparent hover:bg-transparent',
//           'border-input shadow-input text-muted-foreground  flex h-9 cursor-pointer items-center  justify-between gap-1 rounded-md border p-2  pe-3',
//           className
//         )}
//         tabIndex={0}
//         {...timescape.getRootProps()}
//         onClick={() => {
//           ref.current?.focus();
//         }}
//         ref={ref}
//       >
//         <div className="flex w-auto items-center">
//           {!!format?.length
//             ? format.map((group, i) => (
//                 <React.Fragment key={i === 0 ? 'dates' : 'times'}>
//                   {!!group?.length
//                     ? group.map((unit, j) => (
//                         <React.Fragment key={unit}>
//                           <Input
//                             className={cn(
//                               timePickerInputBase,
//                               'min-w-8 text-xs shadow-none',
//                               {
//                                 'min-w-12': unit === 'years',
//                                 'bg-foreground/15': unit === 'am/pm',
//                               }
//                             )}
//                             {...timescape.getInputProps(unit)}
//                             tabIndex={1}
//                             placeholder={placeholders[unit]}
//                           />
//                           {i === 0 && j < group.length - 1 ? (
//                             // date separator
//                             <span className={timePickerSeparatorBase}>/</span>
//                           ) : (
//                             j == 0 && (
//                               // time separator
//                               <span className={timePickerSeparatorBase}>:</span>
//                             )
//                           )}
//                         </React.Fragment>
//                       ))
//                     : null}
//                   {format[1]?.length && !i ? (
//                     // date-time separator - only if both date and time are present
//                     <span
//                       className={cn(
//                         timePickerSeparatorBase,
//                         'text-xl opacity-30'
//                       )}
//                     >
//                       |
//                     </span>
//                   ) : null}
//                 </React.Fragment>
//               ))
//             : null}
//         </div>
//         <CalendarIcon className="size-4" />
//       </div>
//     );
//   }
// );

// DatetimeGrid.displayName = 'DatetimeGrid';

// interface DateTimeInput {
//   value?: Date;
//   format: DateTimeFormatDefaults;
//   placeholders?: InputPlaceholders;
//   onChange?: Options['onChangeDate'];
//   dtOptions?: Options;
//   className?: string;
// }

// const DEFAULT_TS_OPTIONS = {
//   // date: new Date(),
//   // date: null,
//   hour12: false,
// };
// export const DatetimePicker = forwardRef<HTMLDivElement, DateTimeInput>(
//   (
//     {
//       value,
//       format = DEFAULTS,
//       placeholders,
//       dtOptions = DEFAULT_TS_OPTIONS,
//       onChange,
//       className,
//     },
//     ref
//   ) => {
//     const handleDateChange = useCallback(
//       (nextDate: Date | undefined) => {
//         onChange?.(nextDate);
//       },
//       [onChange]
//     );
//     const timescape = useTimescape({
//       ...dtOptions,
//       ...(value && { date: value }),
//       onChangeDate: handleDateChange,
//     });
//     return (
//       <DatetimeGrid
//         format={format}
//         className={className}
//         timescape={timescape}
//         placeholders={placeholders ?? INPUT_PLACEHOLDERS}
//         ref={ref}
//       />
//     );
//   }
// );

// DatetimePicker.displayName = 'DatetimePicker';
