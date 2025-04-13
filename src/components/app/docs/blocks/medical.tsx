import { Doc } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Define interfaces for the medical data structure
interface Marker {
  name: string;
  value: number;
  unit: string;
  range: string;
}

interface Category {
  category: string;
  markers: Marker[];
}

interface MedicalAnalysis {
  analyze: Category[];
}

interface DocWithMedical extends Doc {
  medical?: MedicalAnalysis;
}

export function MedicalBlock({ data }: { data: DocWithMedical }) {
  const medicalData = data?.medical?.analyze || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      {medicalData.map((category: Category, index: number) => (
        <CategoryCard key={index} category={category} />
      ))}
    </div>
  );
}

type RangeStatus = 'normal' | 'warning' | 'critical' | 'unknown';

const getRange = (rangeStr: string) => {
  // maximum 12%
  // minimum 12%
  // min 20, max 50
  // 4.09-11.00
  // 2.5 - 7.5

  const clean = rangeStr.replace(/ /g, '');

  const getMax = (str: string) => {
    let max = null;
    max = clean.match(/<([0-9.,]+)/)?.[0];
    if (max) return max.replace('<', '');
    max = clean.match(/([0-9.,]+)-([0-9.,]+)/)?.[0];
    if (max) return max.split('-')[1];
    max = clean.match(/maximum([0-9.,]+)/)?.[0];
    if (max) return max.replace('maximum', '');
    max = clean.match(/max([0-9.,]+)/)?.[0];
    if (max) return max.replace('max', '');
    return '';
  };

  const getMin = (str: string) => {
    let min = null;
    min = clean.match(/>([0-9.,]+)/)?.[0];
    if (min) return min.replace('>', '');
    min = clean.match(/([0-9.,]+)-([0-9.,]+)/)?.[0];
    if (min) return min.split('-')[0];
    min = clean.match(/minimum([0-9.,]+)/)?.[0];
    if (min) return min.replace('minimum', '');
    min = clean.match(/min([0-9.,]+)/)?.[0];
    if (min) return min.replace('min', '');
    return '';
  };

  let min = Number.parseFloat(getMin(clean));
  let max = Number.parseFloat(getMax(clean));

  return [min, max];
};

const getRangeStatus = (value: number, range: number[]): RangeStatus => {
  if (!isNaN(range[0]) && !isNaN(range[1])) {
    const [min, max] = range;
    const diff = max - min;
    const warningBuffer = diff * 0.05;
    if (value >= min && value <= max) {
      // Check if value is close to boundaries
      if (value < min + warningBuffer || value > max - warningBuffer) {
        return 'warning'; // Orange - within range but close to boundaries
      }
      return 'normal'; // Green - comfortably within range
    }
    return 'critical'; // Red - outside range

    // Handle ranges like ">30" or ">30,5"
  } else if (!isNaN(range[0]) && isNaN(range[1])) {
    const [min] = range;
    const warningBuffer = min * 0.05;

    if (value > min) {
      if (value < min + warningBuffer) return 'warning';
      return 'normal';
    }
    return 'critical';
  } else if (isNaN(range[0]) && !isNaN(range[1])) {
    const [, max] = range;
    const warningBuffer = max * 0.05;

    if (value < max) {
      if (value > max - warningBuffer) return 'warning';
      return 'normal';
    }
    return 'critical';
  } else {
    return 'unknown';
  }
};

const calculateProgress = (value: number, range: number[]): number | null => {
  const [min, max] = range;
  const diff = max - min;
  // Clamp value between min and max for the progress bar
  const clampedValue = Math.max(min, Math.min(max, value));
  return ((clampedValue - min) / diff) * 100;
};

const getColor = (status: RangeStatus) => {
  if (status === 'warning') return 'amber-500';
  if (status === 'critical') return 'red-500';
  if (status === 'normal') return 'green-500';
  return 'blue-500';
};

const getIcon = (status: RangeStatus, color: string) => {
  if (status === 'normal')
    return <CheckCircle className={`h-5 w-5 text-${color}`} />;
  if (status === 'warning')
    return <AlertCircle className={`h-5 w-5 text-${color}`} />;
  if (status === 'critical')
    return <AlertCircle className={`h-5 w-5 text-${color}`} />;
};

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card>
      <CardHeader className="bg-muted border-b p-2">
        <CardTitle className="text-base">{category.category}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {category.markers.map((marker: Marker, idx: number) => {
            const range = getRange(marker.range);
            const status = getRangeStatus(marker.value, range);
            const color = getColor(status);
            const icon = getIcon(status, color);
            const fullRange =
              !isNaN(range[0]) && !isNaN(range[1]) ? range : null;
            const progressValue = calculateProgress(marker.value, range);

            return (
              <div key={idx} className="p-2 hover:bg-muted transition-colors">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2 ">
                    {icon}
                    <h3 className="font-medium text-xs">{marker.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold text-${color}`}>
                      {marker.value != 0 ? marker.value : ''}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {marker.unit}
                    </span>
                    {!!marker.range &&
                      marker.range.length > 1 &&
                      !fullRange && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {marker.range.length < 10 && marker.range}
                          {marker.range.length > 10 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Info className="h-4 w-4 cursor-pointer" />
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 text-xs">
                                <p>{marker.range}</p>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      )}
                  </div>
                </div>

                {!!fullRange && (
                  <div className="relative pt-2 my-2">
                    <Progress
                      value={progressValue}
                      className="h-1 bg-muted-foreground/10"
                      indicatorClassName={`bg-${color}`}
                    />
                    <div
                      className="flex justify-between text-xs text-muted-foreground/50 absolute left-0 right-0"
                      style={{ top: '1px' }}
                    >
                      <span className="bg-card px-1 rounded">{range[0]}</span>
                      <span className="bg-card px-1 rounded">{range[1]}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
